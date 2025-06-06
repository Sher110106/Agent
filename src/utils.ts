import { ColumnSchema, ColumnStats, DataAnalysis } from './types';

// ===== SYSTEM PROMPTS FOR AI INTERACTIONS =====

const SYSTEM_PROMPTS = {
  DATA_ANALYSIS: `You are a Senior Data Scientist and Business Intelligence Expert with 15+ years of experience in statistical analysis, pattern recognition, and business insights generation.

ROLE & CONTEXT:
- You analyze CSV datasets to provide comprehensive statistical insights and business intelligence
- Your analysis helps users understand their data patterns, quality issues, and business opportunities
- You work with both technical and non-technical stakeholders

INPUT FORMAT:
- Dataset schema with column types and basic statistics
- Sample data rows (typically 8-10 rows)
- Detailed statistical summaries including distributions, correlations, and quality metrics

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON matching the exact schema provided
- Provide actionable business insights, not just technical statistics
- Generate 5+ specific, valuable insights about patterns and trends
- Include data quality assessment with specific improvement recommendations
- Create 3+ tailored visualization suggestions with chart types
- Generate business-relevant suggested questions for further analysis

QUALITY STANDARDS:
- Insights must be specific and actionable, not generic
- Focus on business value and decision-making support
- Identify unusual patterns, outliers, and correlations
- Provide clear reasoning for recommendations
- Use professional business language, avoid jargon

CRITICAL: Always return valid JSON. Never include explanations outside the JSON structure.`,

  REASONING_ANALYSIS: `You are an Expert Data Visualization Strategist and UX Designer specializing in choosing optimal chart types for data storytelling.

ROLE & CONTEXT:
- You analyze user requests and dataset characteristics to recommend the best visualization approach
- Your goal is to maximize data clarity, insight discovery, and visual impact
- You consider both technical data properties and human perception principles

INPUT FORMAT:
- User's natural language request for a visualization
- Complete dataset schema with column types and statistics
- Sample data showing actual values and patterns
- Existing statistical insights and patterns from previous analysis

REASONING PROCESS:
1. Parse user intent - what story are they trying to tell?
2. Assess data suitability - which columns best answer their question?
3. Consider visualization best practices - what chart type reveals patterns most clearly?
4. Evaluate alternatives - what other approaches might work?
5. Predict outcome - what insights will this visualization provide?

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON with the exact structure specified
- Provide detailed reasoning that shows your thought process
- Recommend the single best chart type for the user's goal
- Identify 2-3 primary variables that should be visualized
- List key considerations that influenced your decision
- Suggest 2+ alternative approaches for comparison
- Explain what insights the user should expect to gain

CHART TYPE SELECTION CRITERIA:
- Bar charts: Comparing categories, rankings, discrete values
- Line charts: Time series, trends, continuous progression
- Scatter plots: Correlations, relationships between 2+ variables
- Pie charts: Parts of a whole, percentage distributions (max 8 categories)
- Histograms: Distribution analysis, frequency patterns
- Heatmaps: Correlation matrices, intensity patterns
- Box plots: Distribution comparison, outlier analysis

CRITICAL: Always return valid JSON. Focus on the "why" behind your recommendations.`,

  CHART_GENERATION: `You are a Senior Data Visualization Engineer specializing in Plotly.js chart specifications with expertise in creating professional, interactive visualizations.

ROLE & CONTEXT:
- You create production-ready Plotly.js chart specifications based on analysis and reasoning
- Your charts must be visually appealing, technically accurate, and optimally configured
- You follow modern visualization design principles and accessibility standards

INPUT FORMAT:
- Previous AI reasoning analysis with recommended chart type and variables
- Complete dataset schema with statistical context
- Sample data rows with actual values
- User's original visualization request

IMPLEMENTATION REQUIREMENTS:
- Generate ONLY valid Plotly.js JSON specification
- Use the exact chart type recommended in the reasoning analysis
- Populate x/y arrays with actual data from the sample provided
- Apply professional styling with appropriate colors and fonts
- Include meaningful titles, axis labels, and formatting

TECHNICAL SPECIFICATIONS:
- Colors: Use professional palette starting with #667eea
- Fonts: Size 16 for titles, 12-14 for labels, color #333
- Margins: Standard t:60, b:60, l:60, r:40 unless chart needs more space
- Responsiveness: Charts must work on mobile and desktop
- Accessibility: Include proper titles and labels for screen readers

CHART-SPECIFIC GUIDELINES:
- Bar charts: Sort by value when logical, limit to top 10-15 categories
- Line charts: Sort by x-axis chronologically, smooth lines for trends
- Scatter plots: Include proper axis scaling, consider trend lines
- Pie charts: Limit to 8 segments, combine small segments into "Others"
- Heatmaps: Use diverging color scales, include color bar legends
- Histograms: Choose appropriate bin sizes, show distribution shape clearly

QUALITY STANDARDS:
- Charts must accurately represent the data without distortion
- Visual hierarchy should guide the viewer's attention appropriately
- Interactive features should enhance, not overwhelm the experience
- Performance: Charts should render quickly with sample data sizes

CRITICAL: Return ONLY the Plotly.js JSON specification. No markdown, no explanations, no additional text.`
};

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function inferSchema(data: any[]): ColumnSchema[] {
  if (data.length === 0) return [];
  
  const firstRow = data[0];
  const schema: ColumnSchema[] = [];
  
  for (const [key, value] of Object.entries(firstRow)) {
    let type = 'string';
    
    if (typeof value === 'number' || !isNaN(Number(value))) {
      type = 'number';
    } else if (typeof value === 'boolean' || value === 'true' || value === 'false') {
      type = 'boolean';
    } else if (value && typeof value === 'string' && !isNaN(Date.parse(value))) {
      type = 'date';
    }
    
    const stats = calculateColumnStats(data, key, type);
    schema.push({ name: key, type, stats });
  }
  
  return schema;
}

export function calculateColumnStats(data: any[], columnName: string, type: string): ColumnStats {
  const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined && val !== '');
  const nullCount = data.length - values.length;
  const uniqueValues = [...new Set(values)];
  
  const stats: ColumnStats = {
    count: values.length,
    nullCount,
    uniqueCount: uniqueValues.length
  };
  
  if (type === 'number') {
    const numValues = values.map(v => Number(v)).filter(v => !isNaN(v));
    if (numValues.length > 0) {
      stats.min = Math.min(...numValues);
      stats.max = Math.max(...numValues);
      stats.mean = numValues.reduce((a, b) => a + b, 0) / numValues.length;
      
      const sorted = [...numValues].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      stats.median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
      
      const variance = numValues.reduce((acc, val) => acc + Math.pow(val - stats.mean!, 2), 0) / numValues.length;
      stats.stdDev = Math.sqrt(variance);
    }
  } else {
    const valueCounts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedCounts = Object.entries(valueCounts).sort(([,a], [,b]) => b - a);
    if (sortedCounts.length > 0) {
      stats.mode = sortedCounts[0][0];
      stats.distribution = sortedCounts.slice(0, 10).map(([value, count]) => ({ value, count }));
    }
  }
  
  return stats;
}

export async function analyzeDataWithAI(schema: ColumnSchema[], sampleRows: any[], env: any): Promise<DataAnalysis> {
  const detailedStats = generateDetailedStats(schema, sampleRows);
  
  const analysisPrompt = `${SYSTEM_PROMPTS.DATA_ANALYSIS}

DATASET ANALYSIS REQUEST:

SCHEMA WITH STATISTICS:
${JSON.stringify(schema, null, 2)}

SAMPLE DATA ROWS:
${JSON.stringify(sampleRows.slice(0, 10), null, 2)}

DETAILED STATISTICAL ANALYSIS:
${JSON.stringify(detailedStats, null, 2)}

REQUIRED JSON OUTPUT SCHEMA:
{
  "summary": "Business-focused description of dataset purpose and key characteristics",
  "insights": ["Specific actionable insight 1", "Specific actionable insight 2", "Pattern insight 3", "Quality insight 4", "Business insight 5"],
  "correlations": [{"column1": "col1", "column2": "col2", "correlation": 0.8}],
  "recommendations": ["Specific visualization recommendation 1", "Data improvement recommendation 2", "Analysis approach recommendation 3"],
  "dataQuality": {
    "completeness": 85,
    "consistency": 90,
    "issues": ["Specific issue 1", "Specific issue 2"]
  },
  "patterns": {
    "trends": ["Specific trend pattern 1", "Specific trend pattern 2"],
    "outliers": [{"column": "column_name", "values": [outlier_values]}],
    "seasonality": ["Seasonal pattern description"],
    "distributions": [{"column": "column_name", "type": "distribution_type", "description": "Business interpretation"}]
  },
  "businessInsights": ["Business insight 1", "Opportunity insight 2", "Risk insight 3"],
  "suggestedPrompts": [
    {"prompt": "Specific question based on your data", "category": "Analysis_Type", "description": "What this reveals", "chartType": "optimal_chart_type"},
    {"prompt": "Another specific question", "category": "Analysis_Type", "description": "What this reveals", "chartType": "optimal_chart_type"},
    {"prompt": "Third specific question", "category": "Analysis_Type", "description": "What this reveals", "chartType": "optimal_chart_type"}
  ]
}

ANALYSIS FOCUS AREAS:
- Identify specific business opportunities and risks in the data
- Detect unusual patterns, outliers, and correlations with business implications
- Assess data quality issues that could impact decision-making
- Generate visualization suggestions tailored to the actual data patterns
- Create specific, answerable questions based on the dataset's unique characteristics`;

  try {
    const aiResponse = await env.AI.run('@cf/qwen/qwq-32b', {
      prompt: analysisPrompt,
      max_tokens: 1536
    });
    
    let responseText = aiResponse.response || aiResponse.choices?.[0]?.text || aiResponse;
    if (typeof responseText === 'string') {
      responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Handle QwQ model's thinking process output
      const thinkEndIndex = responseText.lastIndexOf('</think>');
      if (thinkEndIndex !== -1) {
        responseText = responseText.substring(thinkEndIndex + 8).trim();
      }
      
      // Extract JSON object if there's extra text
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
      }
    }
    
    const aiAnalysis = JSON.parse(responseText);
    
    // Generate automatic charts
    const autoCharts = await generateAutoCharts(schema, sampleRows, aiAnalysis, env);
    aiAnalysis.autoCharts = autoCharts;
    
    return aiAnalysis;
  } catch (error) {
    console.error('AI analysis failed:', error);
    return await createFallbackAnalysis(schema, sampleRows);
  }
}

function generateDetailedStats(schema: ColumnSchema[], sampleRows: any[]): any {
  const stats: any = {
    overview: {
      totalRows: sampleRows.length,
      totalColumns: schema.length,
      numericColumns: schema.filter(col => col.type === 'number').length,
      categoricalColumns: schema.filter(col => col.type === 'string').length,
      dateColumns: schema.filter(col => col.type === 'date').length,
      memoryFootprint: JSON.stringify(sampleRows).length
    },
    columnDetails: {},
    dataQuality: {
      overallCompleteness: 0,
      duplicateRows: 0,
      emptyRows: 0
    },
    advancedAnalytics: {
      outlierColumns: [],
      skewedDistributions: [],
      possibleCategoricalEncoding: [],
      timeSeriesColumns: []
    }
  };
  
  let totalCells = 0;
  let emptyCells = 0;
  
  // Analyze each column in detail
  for (const col of schema) {
    const values = sampleRows.map(row => row[col.name]);
    const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const emptyCount = values.length - nonEmptyValues.length;
    
    totalCells += values.length;
    emptyCells += emptyCount;
    
    stats.columnDetails[col.name] = {
      type: col.type,
      sampleSize: nonEmptyValues.length,
      uniqueValues: [...new Set(nonEmptyValues)].length,
      uniquenessRatio: nonEmptyValues.length > 0 ? [...new Set(nonEmptyValues)].length / nonEmptyValues.length : 0,
      missingCount: emptyCount,
      missingPercentage: (emptyCount / values.length) * 100,
      ...col.stats
    };
    
    // Advanced numeric analysis
    if (col.type === 'number') {
      const nums = nonEmptyValues.map(v => Number(v)).filter(v => !isNaN(v));
      if (nums.length > 0) {
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        const variance = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / nums.length;
        const skewness = calculateSkewness(nums, mean, Math.sqrt(variance));
        const kurtosis = calculateKurtosis(nums, mean, Math.sqrt(variance));
        const outliers = detectOutliers(nums);
        
        stats.columnDetails[col.name] = {
          ...stats.columnDetails[col.name],
          range: Math.max(...nums) - Math.min(...nums),
          variance,
          standardDeviation: Math.sqrt(variance),
          skewness,
          kurtosis,
          outlierCount: outliers.length,
          outlierPercentage: (outliers.length / nums.length) * 100,
          quartiles: calculateQuartiles(nums),
          coefficientOfVariation: mean !== 0 ? Math.sqrt(variance) / mean : 0
        };
        
        if (Math.abs(skewness) > 1) {
          stats.advancedAnalytics.skewedDistributions.push({
            column: col.name,
            skewness: skewness.toFixed(3),
            direction: skewness > 0 ? 'right' : 'left'
          });
        }
        
        if (outliers.length > nums.length * 0.05) {
          stats.advancedAnalytics.outlierColumns.push({
            column: col.name,
            outlierCount: outliers.length,
            percentage: ((outliers.length / nums.length) * 100).toFixed(1)
          });
        }
      }
    }
    
    // Advanced categorical analysis
    if (col.type === 'string') {
      const valueCounts = nonEmptyValues.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const sortedCounts = Object.entries(valueCounts).sort(([,a], [,b]) => b - a);
      const entropy = calculateEntropy(Object.values(valueCounts));
      
      stats.columnDetails[col.name] = {
        ...stats.columnDetails[col.name],
        topValues: sortedCounts.slice(0, 5),
        entropy: entropy,
        concentrationRatio: sortedCounts.length > 0 ? sortedCounts[0][1] / nonEmptyValues.length : 0,
        averageLength: nonEmptyValues.reduce((acc, val) => acc + val.toString().length, 0) / nonEmptyValues.length
      };
      
      // Check if might be encoded categorical
      if (nonEmptyValues.every(val => !isNaN(Number(val))) && [...new Set(nonEmptyValues)].length < 20) {
        stats.advancedAnalytics.possibleCategoricalEncoding.push({
          column: col.name,
          uniqueValues: [...new Set(nonEmptyValues)].length,
          suggestion: 'This numeric column might represent categories'
        });
      }
    }
    
    // Date column analysis
    if (col.type === 'date') {
      const dates = nonEmptyValues.map(v => new Date(v)).filter(d => !isNaN(d.getTime()));
      if (dates.length > 0) {
        const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
        const dateRange = sortedDates[sortedDates.length - 1].getTime() - sortedDates[0].getTime();
        const daysDifference = dateRange / (1000 * 60 * 60 * 24);
        
        stats.columnDetails[col.name] = {
          ...stats.columnDetails[col.name],
          earliestDate: sortedDates[0].toISOString().split('T')[0],
          latestDate: sortedDates[sortedDates.length - 1].toISOString().split('T')[0],
          dateRange: `${Math.round(daysDifference)} days`,
          frequency: analyzeDateFrequency(dates)
        };
        
        stats.advancedAnalytics.timeSeriesColumns.push({
          column: col.name,
          range: `${Math.round(daysDifference)} days`,
          frequency: analyzeDateFrequency(dates)
        });
      }
    }
  }
  
  // Overall data quality metrics
  stats.dataQuality.overallCompleteness = ((totalCells - emptyCells) / totalCells) * 100;
  stats.dataQuality.duplicateRows = countDuplicateRows(sampleRows);
  stats.dataQuality.emptyRows = sampleRows.filter(row => 
    Object.values(row).every(val => val === null || val === undefined || val === '')
  ).length;
  
  return stats;
}

function calculateSkewness(numbers: number[], mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  const n = numbers.length;
  const skewSum = numbers.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0);
  return (n / ((n - 1) * (n - 2))) * skewSum;
}

function calculateKurtosis(numbers: number[], mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  const n = numbers.length;
  const kurtSum = numbers.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0);
  return (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * kurtSum - (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3));
}

function detectOutliers(numbers: number[]): number[] {
  const q1 = calculatePercentile(numbers, 25);
  const q3 = calculatePercentile(numbers, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return numbers.filter(num => num < lowerBound || num > upperBound);
}

function calculateQuartiles(numbers: number[]): { q1: number; q2: number; q3: number } {
  return {
    q1: calculatePercentile(numbers, 25),
    q2: calculatePercentile(numbers, 50),
    q3: calculatePercentile(numbers, 75)
  };
}

function calculatePercentile(numbers: number[], percentile: number): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (upper >= sorted.length) return sorted[sorted.length - 1];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function calculateEntropy(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0);
  const probabilities = counts.map(count => count / total);
  return -probabilities.reduce((acc, p) => acc + (p > 0 ? p * Math.log2(p) : 0), 0);
}

function analyzeDateFrequency(dates: Date[]): string {
  if (dates.length < 2) return 'insufficient data';
  
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
  const intervals = [];
  
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = sortedDates[i].getTime() - sortedDates[i - 1].getTime();
    intervals.push(diff / (1000 * 60 * 60 * 24)); // Convert to days
  }
  
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  
  if (avgInterval < 2) return 'daily';
  if (avgInterval < 8) return 'weekly';
  if (avgInterval < 32) return 'monthly';
  if (avgInterval < 95) return 'quarterly';
  return 'yearly';
}

function countDuplicateRows(rows: any[]): number {
  const stringified = rows.map(row => JSON.stringify(row));
  const uniqueRows = new Set(stringified);
  return rows.length - uniqueRows.size;
}

async function generateAutoCharts(schema: ColumnSchema[], sampleRows: any[], analysis: any, env: any): Promise<any[]> {
  const charts = [];
  const numericCols = schema.filter(col => col.type === 'number');
  const categoricalCols = schema.filter(col => col.type === 'string');
  const dateCols = schema.filter(col => col.type === 'date');
  
  console.log('🎨 Generating automatic charts...', { numericCols: numericCols.length, categoricalCols: categoricalCols.length, dateCols: dateCols.length });
  
  try {
    // Chart 1: Numeric Overview (Direct generation)
    if (numericCols.length > 0) {
      const overviewChart = generateNumericOverviewChart(numericCols, sampleRows);
      charts.push({
        title: "📊 Numeric Data Overview",
        description: `Comparison of ${numericCols.length} numeric columns`,
        chartSpec: overviewChart,
        priority: 1
      });
    }
    
    // Chart 2: Category Distribution (Direct generation)
    if (categoricalCols.length > 0) {
      const categoryChart = generateCategoryDistributionChart(categoricalCols[0], sampleRows);
      charts.push({
        title: "🥧 Category Distribution",
        description: `Distribution of ${categoricalCols[0].name}`,
        chartSpec: categoryChart,
        priority: 2
      });
    }
    
    // Chart 3: Correlation Matrix if multiple numeric columns
    if (numericCols.length > 1) {
      const correlationChart = generateCorrelationMatrix(numericCols, sampleRows);
      charts.push({
        title: "🔗 Correlation Analysis",
        description: "Relationships between numeric variables",
        chartSpec: correlationChart,
        priority: 3
      });
    }
    
    // Chart 4: Time series if date column exists
    if (dateCols.length > 0 && numericCols.length > 0) {
      const timeSeriesChart = generateTimeSeriesChart(dateCols[0], numericCols[0], sampleRows);
      charts.push({
        title: "📈 Time Series Analysis",
        description: `${numericCols[0].name} trends over ${dateCols[0].name}`,
        chartSpec: timeSeriesChart,
        priority: 4
      });
    }
    
    // Chart 5: Distribution Analysis for top numeric column
    if (numericCols.length > 0) {
      const distributionChart = generateDistributionChart(numericCols[0], sampleRows);
      charts.push({
        title: "📋 Statistical Distribution",
        description: `Distribution analysis of ${numericCols[0].name}`,
        chartSpec: distributionChart,
        priority: 5
      });
    }
    
    console.log(`✅ Generated ${charts.length} automatic charts`);
    
  } catch (error) {
    console.error('❌ Auto chart generation failed:', error);
    // Add fallback chart
    charts.push({
      title: "📊 Basic Data Summary",
      description: "Basic overview of your dataset",
      chartSpec: createFallbackChart(schema, sampleRows),
      priority: 1
    });
  }
  
  return charts;
}

function generateNumericOverviewChart(numericCols: ColumnSchema[], sampleRows: any[]): any {
  const means = numericCols.map(col => ({
    name: col.name,
    value: col.stats?.mean || 0
  }));
  
  return {
    data: [{
      x: means.map(m => m.name),
      y: means.map(m => m.value),
      type: 'bar',
      marker: {
        color: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
        opacity: 0.8
      },
      name: 'Average Values'
    }],
    layout: {
      title: {
        text: 'Numeric Columns Overview',
        font: { size: 16, color: '#333' }
      },
      xaxis: { title: 'Columns' },
      yaxis: { title: 'Average Values' },
      showlegend: false,
      margin: { t: 50, b: 50, l: 50, r: 20 }
    }
  };
}

function generateCategoryDistributionChart(categoricalCol: ColumnSchema, sampleRows: any[]): any {
  const counts = sampleRows.reduce((acc, row) => {
    const value = row[categoricalCol.name];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedCounts = Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8); // Top 8 categories
  
  return {
    data: [{
      labels: sortedCounts.map(([label]) => label),
      values: sortedCounts.map(([,value]) => value),
      type: 'pie',
      marker: {
        colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7']
      },
      textinfo: 'label+percent',
      textposition: 'outside'
    }],
    layout: {
      title: {
        text: `${categoricalCol.name} Distribution`,
        font: { size: 16, color: '#333' }
      },
      margin: { t: 50, b: 50, l: 50, r: 50 }
    }
  };
}

function generateCorrelationMatrix(numericCols: ColumnSchema[], sampleRows: any[]): any {
  const correlations = calculateCorrelationMatrix(numericCols, sampleRows);
  
  return {
    data: [{
      z: correlations.matrix,
      x: correlations.labels,
      y: correlations.labels,
      type: 'heatmap',
      colorscale: 'RdBu',
      zmid: 0,
      colorbar: {
        title: 'Correlation',
        thickness: 15
      }
    }],
    layout: {
      title: {
        text: 'Correlation Matrix',
        font: { size: 16, color: '#333' }
      },
      xaxis: { title: 'Variables' },
      yaxis: { title: 'Variables' },
      margin: { t: 80, b: 80, l: 80, r: 80 }
    }
  };
}

function generateTimeSeriesChart(dateCol: ColumnSchema, numericCol: ColumnSchema, sampleRows: any[]): any {
  const sortedData = sampleRows
    .filter(row => row[dateCol.name] && row[numericCol.name])
    .sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime());
  
  return {
    data: [{
      x: sortedData.map(row => row[dateCol.name]),
      y: sortedData.map(row => row[numericCol.name]),
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#667eea', width: 3 },
      marker: { color: '#764ba2', size: 6 },
      name: numericCol.name
    }],
    layout: {
      title: {
        text: `${numericCol.name} Over Time`,
        font: { size: 16, color: '#333' }
      },
      xaxis: { title: dateCol.name },
      yaxis: { title: numericCol.name },
      margin: { t: 50, b: 50, l: 60, r: 20 }
    }
  };
}

function generateDistributionChart(numericCol: ColumnSchema, sampleRows: any[]): any {
  const values = sampleRows
    .map(row => row[numericCol.name])
    .filter(val => val != null && !isNaN(Number(val)))
    .map(val => Number(val));
  
  return {
    data: [{
      x: values,
      type: 'histogram',
      marker: {
        color: '#667eea',
        opacity: 0.7,
        line: { color: '#764ba2', width: 1 }
      },
      name: 'Distribution'
    }],
    layout: {
      title: {
        text: `${numericCol.name} Distribution`,
        font: { size: 16, color: '#333' }
      },
      xaxis: { title: numericCol.name },
      yaxis: { title: 'Frequency' },
      margin: { t: 50, b: 50, l: 50, r: 20 }
    }
  };
}

function calculateCorrelationMatrix(numericCols: ColumnSchema[], sampleRows: any[]): { matrix: number[][], labels: string[] } {
  const labels = numericCols.map(col => col.name);
  const matrix: number[][] = [];
  
  for (let i = 0; i < numericCols.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < numericCols.length; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else {
        const corr = calculateCorrelation(
          sampleRows.map(row => Number(row[numericCols[i].name])).filter(v => !isNaN(v)),
          sampleRows.map(row => Number(row[numericCols[j].name])).filter(v => !isNaN(v))
        );
        matrix[i][j] = corr;
      }
    }
  }
  
  return { matrix, labels };
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  
  const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let sumXSquared = 0;
  let sumYSquared = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumXSquared += dx * dx;
    sumYSquared += dy * dy;
  }
  
  const denominator = Math.sqrt(sumXSquared * sumYSquared);
  return denominator === 0 ? 0 : numerator / denominator;
}

async function generateSingleChart(prompt: string, schema: ColumnSchema[], sampleRows: any[], env: any): Promise<any> {
  const chartPrompt = `${SYSTEM_PROMPTS.CHART_GENERATION}

DIRECT CHART GENERATION REQUEST:

USER'S VISUALIZATION REQUEST: "${prompt}"

DATASET SCHEMA & STATISTICS:
${JSON.stringify(schema.map(col => ({name: col.name, type: col.type, stats: col.stats})), null, 2)}

SAMPLE DATA FOR CHART CREATION:
${JSON.stringify(sampleRows.slice(0, 8), null, 2)}

IMPLEMENTATION REQUIREMENTS:
- Analyze the user request to determine optimal chart type and variables
- Use actual sample data values to populate the chart arrays
- Apply professional styling with gradient color palette starting with #667eea
- Create descriptive titles and axis labels that tell the data story
- Ensure chart maximizes insight discovery and visual clarity
- Follow modern visualization best practices for the chosen chart type

CRITICAL: Return ONLY the complete Plotly.js JSON specification. No explanations, no markdown, no additional text.`;

  try {
    const response = await env.AI.run('@cf/qwen/qwq-32b', {
      prompt: chartPrompt,
      max_tokens: 512
    });
    
    let responseText = response.response || response.choices?.[0]?.text || response;
    if (typeof responseText === 'string') {
      responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Handle QwQ model's thinking process output
      const thinkEndIndex = responseText.lastIndexOf('</think>');
      if (thinkEndIndex !== -1) {
        responseText = responseText.substring(thinkEndIndex + 8).trim();
      }
      
      // Extract JSON object if there's extra text
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
      }
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Single chart generation failed:', error);
    return createFallbackChart(schema, sampleRows);
  }
}

async function createFallbackAnalysis(schema: ColumnSchema[], sampleRows: any[]): Promise<DataAnalysis> {
  const numericColumns = schema.filter(col => col.type === 'number');
  const categoricalColumns = schema.filter(col => col.type === 'string');
  const dateColumns = schema.filter(col => col.type === 'date');
  
  return {
    summary: `Dataset contains ${schema.length} columns with ${sampleRows.length} sample rows. Includes ${numericColumns.length} numeric, ${categoricalColumns.length} categorical, and ${dateColumns.length} date columns.`,
    insights: [
      `Dataset has ${schema.length} total columns`,
      `${numericColumns.length} numeric columns available for quantitative analysis`,
      `${categoricalColumns.length} categorical columns for grouping and segmentation`,
      dateColumns.length > 0 ? `${dateColumns.length} date columns for temporal analysis` : 'No date columns detected',
      `Data completeness appears to be ${Math.round((1 - schema.reduce((acc, col) => acc + (col.stats?.nullCount || 0), 0) / (schema.length * sampleRows.length)) * 100)}%`
    ],
    correlations: [],
    recommendations: [
      numericColumns.length > 0 ? `Create bar charts with ${numericColumns[0].name}` : 'Create count charts for categorical data',
      categoricalColumns.length > 0 ? `Group data by ${categoricalColumns[0].name}` : 'Analyze numeric distributions',
      dateColumns.length > 0 ? 'Consider time series analysis with date columns' : 'Add date columns for temporal analysis'
    ],
    dataQuality: {
      completeness: Math.round((1 - schema.reduce((acc, col) => acc + (col.stats?.nullCount || 0), 0) / (schema.length * sampleRows.length)) * 100),
      consistency: 85,
      issues: schema.filter(col => (col.stats?.nullCount || 0) > 0).map(col => `${col.name} has missing values`)
    },
    patterns: {
      trends: numericColumns.length > 1 ? [`Potential trends between ${numericColumns[0].name} and ${numericColumns[1].name}`] : [],
      outliers: [],
      seasonality: dateColumns.length > 0 ? ['Potential seasonal patterns in time-based data'] : [],
      distributions: numericColumns.map(col => ({
        column: col.name,
        type: 'unknown',
        description: `${col.name} distribution needs analysis`
      }))
    },
    businessInsights: [
      'Upload complete dataset for deeper business insights',
      'Consider data validation and cleaning procedures',
      'Identify key performance indicators in your data'
    ],
    suggestedPrompts: [
      {
        prompt: numericColumns.length > 0 ? `Show me a bar chart of ${numericColumns[0].name}` : 'Show me the data distribution',
        category: 'Overview',
        description: 'Basic data overview',
        chartType: 'bar'
      },
      {
        prompt: categoricalColumns.length > 0 ? `Display a pie chart of ${categoricalColumns[0].name} distribution` : 'Show me category counts',
        category: 'Distribution',
        description: 'Category distribution analysis',
        chartType: 'pie'
      },
      {
        prompt: numericColumns.length > 1 ? `Compare ${numericColumns[0].name} vs ${numericColumns[1].name}` : 'Show me correlations',
        category: 'Comparison',
        description: 'Compare different metrics',
        chartType: 'scatter'
      }
    ],
    autoCharts: await generateAutoCharts(schema, sampleRows, null, null)
  };
}

export function createFallbackChart(schema: ColumnSchema[], sampleRows: any[]): any {
  if (schema.length === 0 || sampleRows.length === 0) {
    return {
      data: [{
        x: ['No Data'],
        y: [0],
        type: 'bar'
      }],
      layout: {
        title: 'No Data Available',
        xaxis: { title: 'Categories' },
        yaxis: { title: 'Values' }
      }
    };
  }

  // Find first numeric column for y-axis
  const numericColumn = schema.find(col => col.type === 'number');
  // Find first string column for x-axis  
  const stringColumn = schema.find(col => col.type === 'string');
  
  if (!numericColumn) {
    // If no numeric data, create a simple count chart
    const categories = [...new Set(sampleRows.map(row => row[schema[0].name]))];
    const counts = categories.map(cat => 
      sampleRows.filter(row => row[schema[0].name] === cat).length
    );
    
    return {
      data: [{
        x: categories,
        y: counts,
        type: 'bar'
      }],
      layout: {
        title: `Count by ${schema[0].name}`,
        xaxis: { title: schema[0].name },
        yaxis: { title: 'Count' }
      }
    };
  }
  
  const xColumn = stringColumn || schema[0];
  const yColumn = numericColumn;
  
  return {
    data: [{
      x: sampleRows.map(row => row[xColumn.name]),
      y: sampleRows.map(row => row[yColumn.name]),
      type: 'bar'
    }],
    layout: {
      title: `${yColumn.name} by ${xColumn.name}`,
      xaxis: { title: xColumn.name },
      yaxis: { title: yColumn.name }
    }
  };
}