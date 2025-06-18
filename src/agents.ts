import { ColumnSchema, NvidiaClient, CodeGenerationResult, ExecutionResult, ReasoningResult } from './types';
import { calculateCorrelation } from './utils';

// NVIDIA API Configuration
const NVIDIA_MODEL = "nvidia/llama-3.1-nemotron-ultra-253b-v1";

// Initialize NVIDIA client
export function createNvidiaClient(apiKey: string): NvidiaClient {
  // Note: In Cloudflare Workers, we'll use fetch directly
  return {
    chat: {
      completions: {
        create: async (params) => {
          const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: params.model,
              messages: params.messages,
              temperature: params.temperature || 0.2,
              max_tokens: params.max_tokens || 1024,
              stream: params.stream || false
            })
          });
          
          if (!response.ok) {
            throw new Error(`NVIDIA API error: ${response.status} ${response.statusText}`);
          }
          
          return await response.json();
        }
      }
    }
  };
}

// === QueryUnderstandingTool ===
export async function QueryUnderstandingTool(query: string, client: NvidiaClient): Promise<boolean> {
  try {
    const messages = [
      {
        role: "system",
        content: "detailed thinking off. You are an assistant that determines if a query is requesting a data visualization. Respond with only 'true' if the query is asking for a plot, chart, graph, or any visual representation of data. Otherwise, respond with 'false'."
      },
      {
        role: "user",
        content: query
      }
    ];
    
    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages,
      temperature: 0.1,
      max_tokens: 5
    });
    
    const intent_response = response.choices[0].message.content.strip().toLowerCase();
    return intent_response === "true";
  } catch (error) {
    console.error("QueryUnderstandingTool error:", error);
    // Default to true for visualization requests to maintain functionality
    return true;
  }
}

// === CodeGeneration TOOLS ===

// PlotCodeGeneratorTool - generates prompt for pandas+matplotlib
function PlotCodeGeneratorTool(cols: string[], query: string): string {
  return `Given DataFrame \`df\` with columns: ${cols.join(', ')}
Write Python code using pandas **and matplotlib** (as plt) to answer:
"${query}"

Rules
-----
1. Use pandas for data manipulation and matplotlib.pyplot (as plt) for plotting.
2. Assign the final result (DataFrame, Series, scalar *or* matplotlib Figure) to a variable named \`result\`.
3. Create only ONE relevant plot. Set \`figsize=(6,4)\`, add title/labels.
4. Return your answer inside a single markdown fence that starts with \`\`\`python and ends with \`\`\`.`;
}

// CodeWritingTool - generates prompt for pandas-only operations
function CodeWritingTool(cols: string[], query: string): string {
  return `Given DataFrame \`df\` with columns: ${cols.join(', ')}
Write Python code (pandas **only**, no plotting) to answer:
"${query}"

Rules
-----
1. Use pandas operations on \`df\` only.
2. Assign the final result to \`result\`.
3. Wrap the snippet in a single \`\`\`python code fence (no extra prose).`;
}

// === CodeGenerationAgent ===
export async function CodeGenerationAgent(
  query: string, 
  schema: ColumnSchema[], 
  client: NvidiaClient
): Promise<CodeGenerationResult> {
  try {
    const shouldPlot = await QueryUnderstandingTool(query, client);
    const cols = schema.map(col => col.name);
    const prompt = shouldPlot 
      ? PlotCodeGeneratorTool(cols, query) 
      : CodeWritingTool(cols, query);

    const messages = [
      {
        role: "system",
        content: "detailed thinking off. You are a Python data-analysis expert who writes clean, efficient code. Solve the given problem with optimal pandas operations. Be concise and focused. Your response must contain ONLY a properly-closed ```python code block with no explanations before or after. Ensure your solution is correct, handles edge cases, and follows best practices for data analysis."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 1024
    });

    const fullResponse = response.choices[0].message.content;
    const code = extractFirstCodeBlock(fullResponse);
    
    return {
      code,
      shouldPlot,
      error: code ? undefined : "Failed to extract code from response"
    };
  } catch (error) {
    console.error("CodeGenerationAgent error:", error);
    return {
      code: "",
      shouldPlot: false,
      error: error.message
    };
  }
}

// === ExecutionAgent ===
export function ExecutionAgent(code: string, data: any[], shouldPlot: boolean): ExecutionResult {
  try {
    console.log("Executing code:", code);
    console.log("Data rows:", data.length);
    console.log("Should plot:", shouldPlot);
    
    if (shouldPlot && code.includes("plt.")) {
      // Convert Python matplotlib code to Plotly.js spec
      const plotlySpec = convertMatplotlibToPlotly(code, data);
      
      if (plotlySpec) {
        return {
          result: {
            type: "plot",
            chartSpec: plotlySpec,
            description: "Interactive visualization generated from Python code",
            code: code,
            dataPoints: data.length
          }
        };
      } else {
        // If conversion fails, generate a fallback chart based on code analysis
        const fallbackChart = generateIntelligentFallbackChart(code, data);
        return {
          result: {
            type: "plot", 
            chartSpec: fallbackChart,
            description: "Generated visualization based on code analysis",
            code: code,
            dataPoints: data.length
          }
        };
      }
    } else {
      // Execute pandas data operations
      const dataResult = executeDataOperations(code, data);
      return {
        result: {
          type: "data",
          value: dataResult,
          description: "Data analysis result",
          code: code,
          dataPoints: data.length
        }
      };
    }
  } catch (error) {
    return {
      result: null,
      error: `Error executing code: ${error.message}`
    };
  }
}

// Convert Python matplotlib code to Plotly.js specification
function convertMatplotlibToPlotly(code: string, data: any[]): any | null {
  try {
    // Analyze the Python code to understand the visualization intent
    const codeAnalysis = analyzePythonCode(code);
    
    if (codeAnalysis.chartType === 'bar') {
      return generateBarChartFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === 'line' || codeAnalysis.chartType === 'plot') {
      return generateLineChartFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === 'scatter') {
      return generateScatterChartFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === 'hist' || codeAnalysis.chartType === 'histogram') {
      return generateHistogramFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === 'pie') {
      return generatePieChartFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === 'dual_axis') {
      return generateDualAxisChartFromCode(codeAnalysis, data);
    }
    
    return null;
  } catch (error) {
    console.error("Error converting matplotlib to Plotly:", error);
    return null;
  }
}

// Analyze Python code to extract visualization intent
function analyzePythonCode(code: string): any {
  const analysis: any = {
    chartType: 'unknown',
    columns: [],
    operations: [],
    title: '',
    xlabel: '',
    ylabel: '',
    groupBy: null,
    aggregation: null
  };
  
  // Enhanced pattern matching with flexible regex patterns
  const chartPatterns = {
    bar: [
      /\.plot\s*\(\s*kind\s*=\s*['"]bar['"]\s*\)/i,
      /\.plot\.bar\s*\(/i,
      /plt\.bar\s*\(/i,
      /\.value_counts\(\).*\.plot\s*\(/i,
      /sns\.barplot\s*\(/i,
      /\.bar\s*\(/i
    ],
    line: [
      /\.plot\s*\(\s*kind\s*=\s*['"]line['"]\s*\)/i,
      /\.plot\s*\(\s*\)/i,
      /plt\.plot\s*\(/i,
      /mode\s*=\s*['"]lines['"]/i,
      /sns\.lineplot\s*\(/i
    ],
    scatter: [
      /plt\.scatter\s*\(/i,
      /kind\s*=\s*['"]scatter['"]/i,
      /mode\s*=\s*['"]markers['"]/i,
      /sns\.scatterplot\s*\(/i
    ],
    hist: [
      /plt\.hist\s*\(/i,
      /kind\s*=\s*['"]hist['"]/i,
      /\.hist\s*\(/i,
      /sns\.histplot\s*\(/i
    ],
    pie: [
      /plt\.pie\s*\(/i,
      /kind\s*=\s*['"]pie['"]/i
    ],
    dual_axis: [
      /ax2/i,
      /twinx\(\)/i,
      /secondary_y/i
    ]
  };

  // Find the best matching chart type
  let bestMatch = { type: 'unknown', confidence: 0 };
  
  for (const [chartType, patterns] of Object.entries(chartPatterns)) {
    const matches = patterns.filter(pattern => pattern.test(code)).length;
    const confidence = matches / patterns.length;
    
    if (confidence > bestMatch.confidence) {
      bestMatch = { type: chartType, confidence };
    }
  }
  
  analysis.chartType = bestMatch.type;
  
  // Extract title with multiple patterns
  const titleMatches = [
    code.match(/title=['"]([^'"]+)['"]/),
    code.match(/plt\.title\(['"]([^'"]+)['"]\)/),
    code.match(/\.set_title\(['"]([^'"]+)['"]\)/)
  ];
  const titleMatch = titleMatches.find(match => match !== null);
  if (titleMatch) analysis.title = titleMatch[1];
  
  // Extract labels with multiple patterns
  const xlabelMatches = [
    code.match(/xlabel=['"]([^'"]+)['"]/),
    code.match(/plt\.xlabel\(['"]([^'"]+)['"]\)/),
    code.match(/\.set_xlabel\(['"]([^'"]+)['"]\)/)
  ];
  const xlabelMatch = xlabelMatches.find(match => match !== null);
  if (xlabelMatch) analysis.xlabel = xlabelMatch[1];
  
  const ylabelMatches = [
    code.match(/ylabel=['"]([^'"]+)['"]/),
    code.match(/plt\.ylabel\(['"]([^'"]+)['"]\)/),
    code.match(/\.set_ylabel\(['"]([^'"]+)['"]\)/)
  ];
  const ylabelMatch = ylabelMatches.find(match => match !== null);
  if (ylabelMatch) analysis.ylabel = ylabelMatch[1];
  
  // Enhanced column extraction with multiple patterns
  const columnPatterns = [
    // Standard bracket notation: df['column']
    /df\[['"]([^'"]+)['"]\]/g,
    // Dot notation: df.column
    /df\.([a-zA-Z_][a-zA-Z0-9_]*)/g,
    // Method chaining: df['col'].method()
    /df\[['"]([^'"]+)['"]\]\.[a-zA-Z_]/g,
    // Function parameters: plt.bar(x=df['col1'], y=df['col2'])
    /[xy]=df\[['"]([^'"]+)['"]\]/g
  ];
  
  const extractedColumns = new Set<string>();
  
  // Apply each pattern to extract column names
  for (const pattern of columnPatterns) {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      if (match[1]) {
        extractedColumns.add(match[1]);
      }
    }
  }
  
  analysis.columns = Array.from(extractedColumns);
  
  // Extract groupby operations
  const groupByMatch = code.match(/\.groupby\(['"]([^'"]+)['"]\)/);
  if (groupByMatch) analysis.groupBy = groupByMatch[1];
  
  // Extract aggregations
  if (code.includes('.mean()')) analysis.aggregation = 'mean';
  else if (code.includes('.sum()')) analysis.aggregation = 'sum';
  else if (code.includes('.count()')) analysis.aggregation = 'count';
  else if (code.includes('.value_counts()')) analysis.aggregation = 'value_counts';
  else if (code.includes('.median()')) analysis.aggregation = 'median';
  else if (code.includes('.std()')) analysis.aggregation = 'std';
  
  console.log("📊 Code analysis result:", analysis);
  
  return analysis;
}

// Generate bar chart from code analysis
function generateBarChartFromCode(analysis: any, data: any[]): any {
  try {
    let chartData;
    
    if (analysis.groupBy && analysis.aggregation && analysis.columns.length >= 1) {
      // Grouped aggregation
      const groups = data.reduce((acc, row) => {
        const key = row[analysis.groupBy];
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
      }, {});
      
      const xValues = Object.keys(groups);
      const yValues = xValues.map(key => {
        const groupData = groups[key];
        const values = groupData.map(row => Number(row[analysis.columns[0]])).filter(v => !isNaN(v));
        if (analysis.aggregation === 'mean') return values.reduce((a,b) => a+b, 0) / values.length;
        if (analysis.aggregation === 'sum') return values.reduce((a,b) => a+b, 0);
        return values.length;
      });
      
      chartData = [{
        x: xValues,
        y: yValues,
        type: 'bar',
        marker: { 
          color: '#667eea',
          line: { color: '#2d3748', width: 1 }
        },
        text: yValues.map(v => v.toLocaleString()),
        textposition: 'outside'
      }];
    } else if (analysis.columns.length >= 2) {
      // Simple x,y bar chart
      chartData = [{
        x: data.map(row => row[analysis.columns[0]]),
        y: data.map(row => Number(row[analysis.columns[1]])),
        type: 'bar',
        marker: { 
          color: '#667eea',
          line: { color: '#2d3748', width: 1 }
        }
      }];
    } else if (analysis.columns.length === 1 && analysis.aggregation === 'value_counts') {
      // Value counts bar chart for single column
      const counts = data.reduce((acc: Record<string, number>, row: any) => {
        const value = row[analysis.columns[0]];
        if (value != null) {
          acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
      }, {});
      
      const sortedEntries = Object.entries(counts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 20); // Limit to top 20 for readability
      
      chartData = [{
        x: sortedEntries.map(([value]) => value),
        y: sortedEntries.map(([,count]) => count as number),
        type: 'bar',
        marker: { 
          color: '#667eea',
          line: { color: '#2d3748', width: 1 }
        },
        text: sortedEntries.map(([,count]) => (count as number).toLocaleString()),
        textposition: 'outside'
      }];
    } else {
      return null;
    }
    
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || 'Bar Chart', font: { size: 16, color: '#2d3748' } },
        xaxis: { title: analysis.xlabel || analysis.groupBy || analysis.columns[0] },
        yaxis: { title: analysis.ylabel || analysis.columns[1] || 'Values' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  } catch (error) {
    console.error("Error generating bar chart:", error);
    return null;
  }
}

// Generate line chart from code analysis with adaptive strategies
function generateLineChartFromCode(analysis: any, data: any[]): any {
  // Strategy pattern: try multiple approaches
  const strategies = [
    () => tryStandardLineChart(analysis, data),
    () => tryTimeSeriesLineChart(analysis, data),
    () => tryIndexedLineChart(analysis, data),
    () => trySmartLineChart(analysis, data)
  ];
  
  for (const strategy of strategies) {
    try {
      const result = strategy();
      if (result && result.data && result.data.length > 0) {
        console.log('Line chart strategy succeeded');
        return result;
      }
    } catch (error) {
      console.warn('Line chart strategy failed:', error);
    }
  }
  
  console.error("All line chart strategies failed");
  return null;
}

// Strategy 1: Standard two-column line chart
function tryStandardLineChart(analysis: any, data: any[]): any | null {
  if (analysis.columns.length < 2) return null;
  
  const chartData = [{
    x: data.map(row => row[analysis.columns[0]]),
    y: data.map(row => Number(row[analysis.columns[1]])),
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#667eea', width: 3 },
    marker: { color: '#764ba2', size: 6 }
  }];
  
  return {
    data: chartData,
    layout: {
      title: { text: analysis.title || 'Line Chart', font: { size: 16, color: '#2d3748' } },
      xaxis: { title: analysis.xlabel || analysis.columns[0] },
      yaxis: { title: analysis.ylabel || analysis.columns[1] },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 60, b: 60, l: 60, r: 40 }
    }
  };
}

// Strategy 2: Time series line chart (detect date columns)
function tryTimeSeriesLineChart(analysis: any, data: any[]): any | null {
  if (analysis.columns.length < 1) return null;
  
  // Try to find a date column and numeric column
  const firstCol = analysis.columns[0];
  const numericCols = analysis.columns.filter(col => {
    return data.some(row => !isNaN(Number(row[col])) && row[col] !== null);
  });
  
  if (numericCols.length === 0) return null;
  
  const chartData = [{
    x: data.map((row, index) => row[firstCol] || index),
    y: data.map(row => Number(row[numericCols[0]])),
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#667eea', width: 3 },
    marker: { color: '#764ba2', size: 6 }
  }];
  
  return {
    data: chartData,
    layout: {
      title: { text: analysis.title || `${numericCols[0]} Over Time`, font: { size: 16, color: '#2d3748' } },
      xaxis: { title: analysis.xlabel || firstCol },
      yaxis: { title: analysis.ylabel || numericCols[0] },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 60, b: 60, l: 60, r: 40 }
    }
  };
}

// Strategy 3: Single column with index
function tryIndexedLineChart(analysis: any, data: any[]): any | null {
  if (analysis.columns.length < 1) return null;
  
  const column = analysis.columns[0];
  const values = data.map(row => Number(row[column])).filter(v => !isNaN(v));
  
  if (values.length === 0) return null;
  
  const chartData = [{
    x: values.map((_, index) => index),
    y: values,
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#667eea', width: 3 },
    marker: { color: '#764ba2', size: 6 }
  }];
  
  return {
    data: chartData,
    layout: {
      title: { text: analysis.title || `${column} Progression`, font: { size: 16, color: '#2d3748' } },
      xaxis: { title: 'Index' },
      yaxis: { title: column },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 60, b: 60, l: 60, r: 40 }
    }
  };
}

// Strategy 4: Smart line chart based on data characteristics
function trySmartLineChart(analysis: any, data: any[]): any | null {
  if (data.length === 0) return null;
  
  const keys = Object.keys(data[0]);
  const numericColumns = keys.filter(key => 
    data.some(row => !isNaN(Number(row[key])) && row[key] !== null)
  );
  
  if (numericColumns.length === 0) return null;
  
  // Use first numeric column
  const yColumn = numericColumns[0];
  const xColumn = keys.find(key => key !== yColumn) || 'index';
  
  const chartData = [{
    x: xColumn === 'index' 
      ? data.map((_, index) => index)
      : data.map(row => row[xColumn]),
    y: data.map(row => Number(row[yColumn])),
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#667eea', width: 3 },
    marker: { color: '#764ba2', size: 6 }
  }];
  
  return {
    data: chartData,
    layout: {
      title: { text: analysis.title || `${yColumn} Trend`, font: { size: 16, color: '#2d3748' } },
      xaxis: { title: xColumn },
      yaxis: { title: yColumn },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 60, b: 60, l: 60, r: 40 }
    }
  };
}

// Generate scatter chart from code analysis
function generateScatterChartFromCode(analysis: any, data: any[]): any {
  try {
    if (analysis.columns.length < 2) return null;
    
    const chartData = [{
      x: data.map(row => Number(row[analysis.columns[0]])),
      y: data.map(row => Number(row[analysis.columns[1]])),
      type: 'scatter',
      mode: 'markers',
      marker: { 
        color: '#667eea', 
        size: 8,
        line: { color: '#2d3748', width: 1 }
      }
    }];
    
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || 'Scatter Plot', font: { size: 16, color: '#2d3748' } },
        xaxis: { title: analysis.xlabel || analysis.columns[0] },
        yaxis: { title: analysis.ylabel || analysis.columns[1] },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  } catch (error) {
    console.error("Error generating scatter chart:", error);
    return null;
  }
}

// Generate histogram from code analysis
function generateHistogramFromCode(analysis: any, data: any[]): any {
  try {
    if (analysis.columns.length < 1) return null;
    
    const values = data.map(row => Number(row[analysis.columns[0]])).filter(v => !isNaN(v));
    
    const chartData = [{
      x: values,
      type: 'histogram',
      nbinsx: Math.min(30, Math.max(10, Math.floor(Math.sqrt(values.length)))),
      marker: {
        color: '#667eea',
        opacity: 0.7,
        line: { color: '#2d3748', width: 1 }
      }
    }];
    
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || 'Distribution', font: { size: 16, color: '#2d3748' } },
        xaxis: { title: analysis.xlabel || analysis.columns[0] },
        yaxis: { title: 'Frequency' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  } catch (error) {
    console.error("Error generating histogram:", error);
    return null;
  }
}

// Generate pie chart from code analysis
function generatePieChartFromCode(analysis: any, data: any[]): any {
  try {
    if (analysis.columns.length < 1) return null;
    
    // Count occurrences
    const counts = data.reduce((acc, row) => {
      const value = row[analysis.columns[0]];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    
    const labels = Object.keys(counts);
    const values = Object.values(counts);
    
    const chartData = [{
      labels: labels,
      values: values,
      type: 'pie',
      marker: {
        colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
        line: { color: '#ffffff', width: 2 }
      },
      textinfo: 'label+percent',
      textposition: 'auto'
    }];
    
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || 'Distribution', font: { size: 16, color: '#2d3748' } },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 60 }
      }
    };
  } catch (error) {
    console.error("Error generating pie chart:", error);
    return null;
  }
}

// Generate dual axis chart from code analysis
function generateDualAxisChartFromCode(analysis: any, data: any[]): any {
  try {
    if (analysis.columns.length < 3) return null;
    
    const chartData = [
      {
        x: data.map(row => row[analysis.columns[0]]),
        y: data.map(row => Number(row[analysis.columns[1]])),
        type: 'scatter',
        mode: 'lines+markers',
        name: analysis.columns[1],
        line: { color: '#667eea', width: 3 },
        yaxis: 'y'
      },
      {
        x: data.map(row => row[analysis.columns[0]]),
        y: data.map(row => Number(row[analysis.columns[2]])),
        type: 'scatter',
        mode: 'lines+markers',
        name: analysis.columns[2],
        line: { color: '#f093fb', width: 3 },
        yaxis: 'y2'
      }
    ];
    
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || 'Dual Axis Chart', font: { size: 16, color: '#2d3748' } },
        xaxis: { title: analysis.xlabel || analysis.columns[0] },
        yaxis: { 
          title: analysis.columns[1],
          side: 'left',
          color: '#667eea'
        },
        yaxis2: {
          title: analysis.columns[2],
          side: 'right',
          overlaying: 'y',
          color: '#f093fb'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 60 }
      }
    };
  } catch (error) {
    console.error("Error generating dual axis chart:", error);
    return null;
  }
}

// Generate intelligent fallback chart when conversion fails
function generateIntelligentFallbackChart(code: string, data: any[]): any {
  // Analyze data structure and create appropriate visualization
  if (data.length === 0) {
    return {
      data: [{ x: ['No Data'], y: [0], type: 'bar' }],
      layout: { title: 'No Data Available' }
    };
  }
  
  const keys = Object.keys(data[0]);
  const numericColumns = keys.filter(key => 
    !isNaN(Number(data[0][key])) && data[0][key] !== null && data[0][key] !== ''
  );
  const stringColumns = keys.filter(key => 
    isNaN(Number(data[0][key])) || data[0][key] === null || data[0][key] === ''
  );
  
  if (numericColumns.length >= 2) {
    // Create scatter plot with first two numeric columns
    return {
      data: [{
        x: data.map(row => Number(row[numericColumns[0]])),
        y: data.map(row => Number(row[numericColumns[1]])),
        type: 'scatter',
        mode: 'markers',
        marker: { color: '#667eea', size: 8 }
      }],
      layout: {
        title: `${numericColumns[1]} vs ${numericColumns[0]}`,
        xaxis: { title: numericColumns[0] },
        yaxis: { title: numericColumns[1] },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  } else if (numericColumns.length >= 1 && stringColumns.length >= 1) {
    // Create bar chart
    return {
      data: [{
        x: data.map(row => row[stringColumns[0]]),
        y: data.map(row => Number(row[numericColumns[0]])),
        type: 'bar',
        marker: { color: '#667eea' }
      }],
      layout: {
        title: `${numericColumns[0]} by ${stringColumns[0]}`,
        xaxis: { title: stringColumns[0] },
        yaxis: { title: numericColumns[0] },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  }
  
  // Default fallback
  return {
    data: [{ x: keys, y: keys.map(() => 1), type: 'bar' }],
    layout: { title: 'Data Overview' }
  };
}

// Execute pandas data operations (simplified simulation)
function executeDataOperations(code: string, data: any[]): any {
  // Simulate common pandas operations
  if (code.includes('.describe()')) {
    const numericColumns = Object.keys(data[0]).filter(key => 
      !isNaN(Number(data[0][key]))
    );
    
    const stats = {};
    numericColumns.forEach(col => {
      const values = data.map(row => Number(row[col])).filter(v => !isNaN(v));
      if (values.length > 0) {
        stats[col] = {
          count: values.length,
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });
    
    return { type: 'statistics', data: stats };
  } else if (code.includes('.head()')) {
    return { type: 'preview', data: data.slice(0, 5) };
  } else if (code.includes('.shape')) {
    return { type: 'shape', data: [data.length, Object.keys(data[0]).length] };
  } else if (code.includes('.info()')) {
    return { 
      type: 'info', 
      data: {
        rows: data.length,
        columns: Object.keys(data[0]).length,
        columns_list: Object.keys(data[0])
      }
    };
  }
  
  return { type: 'result', data: 'Analysis complete' };
}

// === ReasoningCurator TOOL ===
function ReasoningCurator(query: string, result: any): string {
  const isError = result?.error;
  const isPlot = result?.type === "plot";

  if (isError) {
    return `The user asked: "${query}".
There was an error: ${result.error}
Explain what went wrong and suggest alternatives.`;
  } else if (isPlot) {
    return `The user asked: "${query}".
Below is a description of the plot result:
${result.description || "Chart created"}
Explain in 2–3 concise sentences what the chart shows (no code talk).`;
  } else {
    return `The user asked: "${query}".
The result value is: ${result?.value || result?.description || "Analysis complete"}
Explain in 2–3 concise sentences what this tells about the data (no mention of charts).`;
  }
}

// === ReasoningAgent ===
export async function ReasoningAgent(
  query: string, 
  result: any, 
  client: NvidiaClient
): Promise<ReasoningResult> {
  try {
    const prompt = ReasoningCurator(query, result);
    
    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages: [
        {
          role: "system",
          content: "detailed thinking on. You are an insightful data analyst."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1024
    });

    const fullResponse = response.choices[0].message.content;
    
    // Extract thinking and explanation
    const { thinking, explanation } = extractThinkingAndExplanation(fullResponse);
    
    return {
      thinking,
      explanation
    };
  } catch (error) {
    console.error("ReasoningAgent error:", error);
    return {
      thinking: "",
      explanation: "Unable to generate reasoning due to an error.",
      error: error.message
    };
  }
}

// === DataInsightAgent (for upload-time analysis) ===
export async function DataInsightAgent(schema: ColumnSchema[], data: any[], client: NvidiaClient): Promise<string> {
  try {
    const prompt = `Given a dataset with ${data.length} rows and ${schema.length} columns:
Columns: ${schema.map(col => col.name).join(', ')}
Data types: ${schema.map(col => `${col.name}: ${col.type}`).join(', ')}

Provide:
1. A brief description of what this dataset contains
2. 3-4 possible data analysis questions that could be explored
Keep it concise and focused.`;

    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages: [
        {
          role: "system", 
          content: "detailed thinking off. You are a data analyst providing brief, focused insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 512
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("DataInsightAgent error:", error);
    return `Error generating dataset insights: ${error.message}`;
  }
}

// === Helper Functions ===

function extractFirstCodeBlock(text: string): string {
  const start = text.indexOf("```python");
  if (start === -1) {
    return "";
  }
  const codeStart = start + "```python".length;
  const end = text.indexOf("```", codeStart);
  if (end === -1) {
    return "";
  }
  return text.substring(codeStart, end).trim();
}

function extractThinkingAndExplanation(text: string): { thinking: string; explanation: string } {
  // Extract thinking content between <think>...</think> tags
  const thinkStart = text.indexOf("<think>");
  const thinkEnd = text.indexOf("</think>");
  
  let thinking = "";
  let explanation = text;
  
  if (thinkStart !== -1 && thinkEnd !== -1) {
    thinking = text.substring(thinkStart + 7, thinkEnd).trim();
    explanation = text.replace(/<think>.*?<\/think>/s, "").trim();
  }
  
  return { thinking, explanation };
}

// Add String.prototype.strip() polyfill for compatibility
declare global {
  interface String {
    strip(): string;
  }
}

String.prototype.strip = function() {
  return this.trim();
};

// === DashboardGenerationAgent (for enhanced automatic charts) ===
export async function DashboardGenerationAgent(
  schema: ColumnSchema[], 
  data: any[], 
  analysis: any, 
  client: NvidiaClient
): Promise<any[]> {
  try {
    console.log("🎨 DashboardGenerationAgent: Creating intelligent dashboard...");
    
    // Generate dashboard insights using NVIDIA
    const dashboardPrompt = createDashboardPrompt(schema, data, analysis);
    
    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages: [
        {
          role: "system",
          content: "detailed thinking off. You are a data visualization expert who creates optimal dashboard layouts. You MUST respond with ONLY valid JSON that starts with { and ends with }. No explanations, no additional text. Focus on the most valuable and insightful visualizations based on the data characteristics and business context."
        },
        {
          role: "user",
          content: dashboardPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1024
    });
    
    let dashboardRecommendations;
    try {
      const responseText = response.choices[0].message.content;
      
      // Extract JSON from response if it has extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : responseText;
      
      dashboardRecommendations = JSON.parse(jsonText);
    } catch (jsonError) {
      console.error("Failed to parse NVIDIA response as JSON:", jsonError);
      throw new Error("Invalid JSON response from NVIDIA API");
    }
    
    // Generate actual charts based on NVIDIA recommendations
    const charts = [];
    
    if (dashboardRecommendations?.charts && Array.isArray(dashboardRecommendations.charts)) {
      for (const recommendation of dashboardRecommendations.charts.slice(0, 5)) {
        const chart = await generateDashboardChart(recommendation, schema, data, client);
        if (chart) {
          // Ensure consistent format for frontend compatibility
          const formattedChart = {
            title: chart.metadata?.title || recommendation.title,
            description: chart.metadata?.businessInsight || recommendation.business_insight || 'Data visualization',
            chartSpec: {
              data: chart.data,
              layout: chart.layout
            },
            priority: chart.metadata?.priority || recommendation.priority || 1
          };
          charts.push(formattedChart);
        }
      }
    }
    
    console.log(`✅ Generated ${charts.length} intelligent dashboard charts`);
    return charts.length > 0 ? charts : generateEnhancedAutoCharts(schema, data, analysis);
    
  } catch (error) {
    console.error("DashboardGenerationAgent error:", error);
    // Fallback to enhanced automatic generation
    return generateEnhancedAutoCharts(schema, data, analysis);
  }
}

function createDashboardPrompt(schema: ColumnSchema[], data: any[], analysis: any): string {
  const numericCols = schema.filter(col => col.type === 'number').map(col => col.name);
  const categoricalCols = schema.filter(col => col.type === 'string').map(col => col.name);
  const dateCols = schema.filter(col => col.type === 'date').map(col => col.name);
  
  return `Based on this dataset analysis, recommend the 5 most valuable visualizations for a comprehensive dashboard:

DATASET CHARACTERISTICS:
- Rows: ${data.length}
- Numeric columns: ${numericCols.join(', ')}
- Categorical columns: ${categoricalCols.join(', ')}
- Date columns: ${dateCols.join(', ')}

BUSINESS INSIGHTS:
${JSON.stringify(analysis?.businessInsights || analysis?.insights || [], null, 2)}

CORRELATIONS FOUND:
${JSON.stringify(analysis?.correlations || [], null, 2)}

PATTERNS DETECTED:
${JSON.stringify(analysis?.patterns || {}, null, 2)}

Respond with exactly this JSON structure:
{
  "charts": [
    {
      "title": "Specific descriptive title",
      "type": "bar|line|scatter|pie|histogram|dual_axis",
      "primary_column": "column_name",
      "secondary_column": "column_name_if_needed",
      "groupby_column": "column_name_if_grouping",
      "aggregation": "mean|sum|count|none",
      "business_insight": "What business value this chart provides",
      "priority": 1-5
    }
  ]
}

Focus on:
1. Key performance indicators and metrics
2. Trends and patterns over time (if date columns exist)
3. Distributions and outliers
4. Relationships and correlations
5. Category performance comparisons

Prioritize charts that provide actionable business insights.`;
}

async function generateDashboardChart(
  recommendation: any, 
  schema: ColumnSchema[], 
  data: any[], 
  client: NvidiaClient
): Promise<any | null> {
  try {
    // Generate Python code for this specific chart
    const chartCode = generateChartCode(recommendation, schema);
    
    // Convert to Plotly spec using our existing logic
    const plotlySpec = convertMatplotlibToPlotly(chartCode, data);
    
    if (plotlySpec) {
      return {
        ...plotlySpec,
        metadata: {
          title: recommendation.title,
          type: recommendation.type,
          businessInsight: recommendation.business_insight,
          priority: recommendation.priority
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error generating dashboard chart:", error);
    return null;
  }
}

function generateChartCode(recommendation: any, schema: ColumnSchema[]): string {
  const { type, primary_column, secondary_column, groupby_column, aggregation } = recommendation;
  
  let code = "import pandas as pd\nimport matplotlib.pyplot as plt\n\n";
  
  switch (type) {
    case 'bar':
      if (groupby_column && aggregation && aggregation !== 'none') {
        code += `result = df.groupby('${groupby_column}')['${primary_column}'].${aggregation}()\n`;
        code += `plt.bar(result.index, result.values)\n`;
        code += `plt.title('${recommendation.title}')\n`;
        code += `plt.xlabel('${groupby_column}')\n`;
        code += `plt.ylabel('${primary_column} (${aggregation})')\n`;
      } else if (primary_column && secondary_column) {
        code += `plt.bar(df['${primary_column}'], df['${secondary_column}'])\n`;
        code += `plt.title('${recommendation.title}')\n`;
        code += `plt.xlabel('${primary_column}')\n`;
        code += `plt.ylabel('${secondary_column}')\n`;
      }
      break;
      
    case 'line':
      if (primary_column && secondary_column) {
        code += `plt.plot(df['${primary_column}'], df['${secondary_column}'])\n`;
        code += `plt.title('${recommendation.title}')\n`;
        code += `plt.xlabel('${primary_column}')\n`;
        code += `plt.ylabel('${secondary_column}')\n`;
      }
      break;
      
    case 'scatter':
      if (primary_column && secondary_column) {
        code += `plt.scatter(df['${primary_column}'], df['${secondary_column}'])\n`;
        code += `plt.title('${recommendation.title}')\n`;
        code += `plt.xlabel('${primary_column}')\n`;
        code += `plt.ylabel('${secondary_column}')\n`;
      }
      break;
      
    case 'histogram':
      code += `plt.hist(df['${primary_column}'])\n`;
      code += `plt.title('${recommendation.title}')\n`;
      code += `plt.xlabel('${primary_column}')\n`;
      code += `plt.ylabel('Frequency')\n`;
      break;
      
    case 'pie':
      code += `counts = df['${primary_column}'].value_counts()\n`;
      code += `plt.pie(counts.values, labels=counts.index)\n`;
      code += `plt.title('${recommendation.title}')\n`;
      break;
      
    case 'dual_axis':
      if (primary_column && secondary_column) {
        code += `fig, ax1 = plt.subplots()\n`;
        code += `ax1.plot(df.index, df['${primary_column}'], 'b-')\n`;
        code += `ax1.set_ylabel('${primary_column}', color='b')\n`;
        code += `ax2 = ax1.twinx()\n`;
        code += `ax2.plot(df.index, df['${secondary_column}'], 'r-')\n`;
        code += `ax2.set_ylabel('${secondary_column}', color='r')\n`;
        code += `plt.title('${recommendation.title}')\n`;
      }
      break;
  }
  
  code += "result = plt.gcf()";
  return code;
}

// Enhanced automatic chart generation as fallback
function generateEnhancedAutoCharts(schema: ColumnSchema[], data: any[], analysis: any): any[] {
  const charts = [];
  const numericCols = schema.filter(col => col.type === 'number');
  const categoricalCols = schema.filter(col => col.type === 'string');
  const dateCols = schema.filter(col => col.type === 'date');
  
  console.log("🎨 Generating intelligent automatic charts...", { 
    numericCols: numericCols.length, 
    categoricalCols: categoricalCols.length, 
    dateCols: dateCols.length 
  });

  // Adaptive chart generation based on data characteristics
  
  // 1. Time Series Analysis (highest priority if dates exist)
  if (dateCols.length > 0 && numericCols.length > 0 && data.length > 1) {
    try {
      const keyNumericCol = findKeyMetric(numericCols, data) || numericCols[0];
      const chart = generateTimeSeriesChart(dateCols[0], keyNumericCol, data);
      if (chart) charts.push(chart);
    } catch (error) {
      console.warn('Failed to generate time series chart:', error);
    }
  }
  
  // 2. Category Performance Analysis (if categories exist)
  if (categoricalCols.length > 0 && numericCols.length > 0 && data.length > 1) {
    try {
      const balancedCategory = findBalancedCategory(categoricalCols, data);
      const keyMetric = findKeyMetric(numericCols, data);
      
      if (balancedCategory && keyMetric) {
        const chart = generateKPIChart(keyMetric, balancedCategory, data);
        if (chart) charts.push(chart);
      } else if (categoricalCols.length > 0 && numericCols.length > 0) {
        // Fallback to first available combination
        const chart = generateKPIChart(numericCols[0], categoricalCols[0], data);
        if (chart) charts.push(chart);
      }
    } catch (error) {
      console.warn('Failed to generate KPI chart:', error);
    }
  }
  
  // 3. Distribution Analysis for variable data
  if (numericCols.length > 0 && data.length > 5) {
    try {
      const variableCol = findMostVariableColumn(numericCols, data);
      if (variableCol) {
        const chart = generateDistributionChart(variableCol, data);
        if (chart) charts.push(chart);
      }
    } catch (error) {
      console.warn('Failed to generate distribution chart:', error);
    }
  }
  
  // 4. Correlation Analysis (only if multiple numeric columns)
  if (numericCols.length >= 2 && data.length > 5) {
    try {
      const strongCorrelation = findStrongestCorrelation(numericCols, data);
      if (strongCorrelation) {
        const chart = generateCorrelationChart(strongCorrelation.col1, strongCorrelation.col2, data);
        if (chart) charts.push(chart);
      } else {
        // Generate scatter plot for top 2 numeric columns if no strong correlation
        const chart = generateCorrelationChart(numericCols[0], numericCols[1], data);
        if (chart) charts.push(chart);
      }
    } catch (error) {
      console.warn('Failed to generate correlation chart:', error);
    }
  }
  
  // 5. Category Composition (if balanced categories)
  if (categoricalCols.length > 0 && data.length > 2) {
    try {
      const categoryCol = findBalancedCategory(categoricalCols, data);
      if (categoryCol) {
        const chart = generateCategoryChart(categoryCol, data);
        if (chart) charts.push(chart);
      }
    } catch (error) {
      console.warn('Failed to generate category chart:', error);
    }
  }
  
  // 6. Multi-dimensional analysis (if rich dataset)
  if (numericCols.length >= 3 && categoricalCols.length >= 1 && data.length > 5) {
    try {
      // Create a comparison chart with multiple metrics
      const topMetrics = numericCols.slice(0, 2);
      const categoryCol = categoricalCols[0];
      const chart = generateMultiMetricChart(topMetrics, categoryCol, data);
      if (chart) charts.push(chart);
    } catch (error) {
      console.warn('Failed to generate multi-metric chart:', error);
    }
  }

  const validCharts = charts.filter(chart => chart !== null);
  console.log(`✅ Generated ${validCharts.length} intelligent automatic charts`);
  
  return validCharts;
}

// Helper functions for enhanced auto charts
function findKeyMetric(numericCols: ColumnSchema[], data: any[]): ColumnSchema | null {
  // Find column with highest business relevance (revenue, profit, sales, etc.)
  const businessKeywords = ['revenue', 'profit', 'sales', 'income', 'amount', 'value', 'price'];
  
  for (const keyword of businessKeywords) {
    const match = numericCols.find(col => 
      col.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }
  
  // Fallback to column with highest variation
  return findMostVariableColumn(numericCols, data);
}

function findMostVariableColumn(numericCols: ColumnSchema[], data: any[]): ColumnSchema | null {
  let maxVariation = 0;
  let mostVariable = null;
  
  numericCols.forEach(col => {
    const values = data.map(row => Number(row[col.name])).filter(v => !isNaN(v));
    if (values.length > 0) {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
      const cv = Math.sqrt(variance) / mean; // Coefficient of variation
      
      if (cv > maxVariation) {
        maxVariation = cv;
        mostVariable = col;
      }
    }
  });
  
  return mostVariable;
}

function findStrongestCorrelation(numericCols: ColumnSchema[], data: any[]): { col1: ColumnSchema, col2: ColumnSchema, correlation: number } | null {
  let strongest = null;
  let maxCorrelation = 0;
  
  for (let i = 0; i < numericCols.length; i++) {
    for (let j = i + 1; j < numericCols.length; j++) {
      const col1 = numericCols[i];
      const col2 = numericCols[j];
      
      const values1 = data.map(row => Number(row[col1.name])).filter(v => !isNaN(v));
      const values2 = data.map(row => Number(row[col2.name])).filter(v => !isNaN(v));
      
      if (values1.length === values2.length && values1.length > 5) {
        const correlation = Math.abs(calculateCorrelation(values1, values2));
        if (correlation > maxCorrelation && correlation > 0.5) {
          maxCorrelation = correlation;
          strongest = { col1, col2, correlation };
        }
      }
    }
  }
  
  return strongest;
}

function findBalancedCategory(categoricalCols: ColumnSchema[], data: any[]): ColumnSchema | null {
  for (const col of categoricalCols) {
    const counts = data.reduce((acc, row) => {
      const value = row[col.name];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    
    const uniqueCount = Object.keys(counts).length;
    if (uniqueCount >= 3 && uniqueCount <= 10) {
      return col;
    }
  }
  return categoricalCols[0] || null;
}

// Chart generation functions
function generateKPIChart(numericCol: ColumnSchema, categoryCol: ColumnSchema, data: any[]): any | null {
  if (!data || data.length === 0 || !numericCol || !categoryCol) {
    return null;
  }
  const groups = data.reduce((acc, row) => {
    const key = row[categoryCol.name];
    const value = Number(row[numericCol.name]);
    if (key && !isNaN(value)) {
      if (!acc[key]) acc[key] = [];
      acc[key].push(value);
    }
    return acc;
  }, {});
  
  if (Object.keys(groups).length === 0) {
    return null;
  }
  
  const chartData = Object.entries(groups)
    .map(([key, values]: [string, number[]]) => ({
      category: key,
      value: values.reduce((a, b) => a + b, 0) / values.length
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  
  // Return consistent format for auto charts
  return {
    title: `${numericCol.name} Performance by ${categoryCol.name}`,
    description: `Shows performance distribution across different ${categoryCol.name} categories`,
    chartSpec: {
      data: [{
        x: chartData.map(d => d.category),
        y: chartData.map(d => d.value),
        type: 'bar',
        marker: {
          color: '#667eea',
          line: { color: '#2d3748', width: 1 }
        }
      }],
      layout: {
        title: `${numericCol.name} Performance by ${categoryCol.name}`,
        xaxis: { title: categoryCol.name },
        yaxis: { title: `Average ${numericCol.name}` },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 1
  };
}

function generateDistributionChart(numericCol: ColumnSchema, data: any[]): any | null {
  if (!data || data.length === 0 || !numericCol) {
    return null;
  }
  const values = data.map(row => Number(row[numericCol.name])).filter(v => !isNaN(v));
  
  return {
    title: `${numericCol.name} Distribution Analysis`,
    description: `Reveals the distribution pattern and potential outliers in ${numericCol.name}`,
    chartSpec: {
      data: [{
        x: values,
        type: 'histogram',
        nbinsx: Math.min(20, Math.max(8, Math.floor(Math.sqrt(values.length)))),
        marker: {
          color: '#764ba2',
          opacity: 0.7,
          line: { color: '#2d3748', width: 1 }
        }
      }],
      layout: {
        title: `${numericCol.name} Distribution Analysis`,
        xaxis: { title: numericCol.name },
        yaxis: { title: 'Frequency' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 2
  };
}

function generateCorrelationChart(col1: ColumnSchema, col2: ColumnSchema, data: any[]): any | null {
  if (!data || data.length === 0 || !col1 || !col2) {
    return null;
  }
  const points = data
    .map(row => ({
      x: Number(row[col1.name]),
      y: Number(row[col2.name])
    }))
    .filter(point => !isNaN(point.x) && !isNaN(point.y));
  
  return {
    title: `${col1.name} vs ${col2.name} Relationship`,
    description: `Shows the relationship strength between ${col1.name} and ${col2.name}`,
    chartSpec: {
      data: [{
        x: points.map(p => p.x),
        y: points.map(p => p.y),
        type: 'scatter',
        mode: 'markers',
        marker: {
          color: '#f093fb',
          size: 8,
          opacity: 0.7,
          line: { color: '#2d3748', width: 1 }
        }
      }],
      layout: {
        title: `${col1.name} vs ${col2.name} Relationship`,
        xaxis: { title: col1.name },
        yaxis: { title: col2.name },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 3
  };
}

function generateTimeSeriesChart(dateCol: ColumnSchema, numericCol: ColumnSchema, data: any[]): any | null {
  if (!data || data.length === 0 || !dateCol || !numericCol) {
    return null;
  }
  const timeData = data
    .filter(row => row[dateCol.name] && !isNaN(Number(row[numericCol.name])))
    .sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime());
  
  return {
    title: `${numericCol.name} Trends Over Time`,
    description: `Reveals temporal patterns and trends in ${numericCol.name}`,
    chartSpec: {
      data: [{
        x: timeData.map(row => row[dateCol.name]),
        y: timeData.map(row => Number(row[numericCol.name])),
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#4facfe', width: 3 },
        marker: { color: '#00f2fe', size: 6 }
      }],
      layout: {
        title: `${numericCol.name} Trends Over Time`,
        xaxis: { title: dateCol.name },
        yaxis: { title: numericCol.name },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 1
  };
}

function generateCategoryChart(categoryCol: ColumnSchema, data: any[]): any | null {
  if (!data || data.length === 0 || !categoryCol) {
    return null;
  }
  const counts = data.reduce((acc, row) => {
    const value = row[categoryCol.name];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  
  const sortedCounts = Object.entries(counts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 8);
  
  return {
    title: `${categoryCol.name} Distribution`,
    description: `Shows the composition and distribution of ${categoryCol.name} categories`,
    chartSpec: {
      data: [{
        labels: sortedCounts.map(([label]) => label),
        values: sortedCounts.map(([,value]) => value),
        type: 'pie',
        marker: {
          colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
          line: { color: '#ffffff', width: 2 }
        },
        textinfo: 'label+percent',
        textposition: 'auto'
      }],
      layout: {
        title: `${categoryCol.name} Distribution`,
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 60 }
      }
    },
    priority: 4
  };
}

function generateMultiMetricChart(topMetrics: ColumnSchema[], categoryCol: ColumnSchema, data: any[]): any | null {
  if (!data || data.length === 0 || !topMetrics || topMetrics.length < 2 || !categoryCol) {
    return null;
  }
  const groups = data.reduce((acc, row) => {
    const key = row[categoryCol.name];
    if (!acc[key]) acc[key] = [];
    acc[key].push(Number(row[topMetrics[0].name]));
    acc[key].push(Number(row[topMetrics[1].name]));
    return acc;
  }, {});
  
  const chartData = Object.entries(groups)
    .map(([key, values]: [string, number[]]) => ({
      category: key,
      value: values.reduce((a, b) => a + b, 0) / values.length
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  
  return {
    title: `${topMetrics.map(col => col.name).join(' & ')} Performance by ${categoryCol.name}`,
    description: `Multi-metric performance analysis across different ${categoryCol.name} categories`,
    chartSpec: {
      data: [{
        x: chartData.map(d => d.category),
        y: chartData.map(d => d.value),
        type: 'bar',
        marker: {
          color: '#667eea',
          line: { color: '#2d3748', width: 1 }
        }
      }],
      layout: {
        title: `${topMetrics.map(col => col.name).join(' & ')} Performance by ${categoryCol.name}`,
        xaxis: { title: categoryCol.name },
        yaxis: { title: 'Average Performance' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 5
  };
}