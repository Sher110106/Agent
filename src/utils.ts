import { ColumnSchema, ColumnStats, DataAnalysis, DuckDBAnalysis } from './types';
import { SYSTEM_PROMPTS } from './prompts';

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
    
    const sortedCounts = Object.entries(valueCounts).sort(([,a], [,b]) => (b as number) - (a as number));
    if (sortedCounts.length > 0) {
      stats.mode = sortedCounts[0][0];
      stats.distribution = sortedCounts.slice(0, 10).map(([value, count]) => ({ value, count: count as number }));
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
      
      const sortedCounts = Object.entries(valueCounts).sort(([,a], [,b]) => (b as number) - (a as number));
      const entropy = calculateEntropy(Object.values(valueCounts));
      
      stats.columnDetails[col.name] = {
        ...stats.columnDetails[col.name],
        topValues: sortedCounts.slice(0, 5),
        entropy: entropy,
        concentrationRatio: sortedCounts.length > 0 ? (sortedCounts[0][1] as number) / nonEmptyValues.length : 0,
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
  
  console.log('🎨 Generating intelligent automatic charts...', { numericCols: numericCols.length, categoricalCols: categoricalCols.length, dateCols: dateCols.length });
  
  try {
    // Smart Chart Selection based on data characteristics
    const chartRecommendations = generateSmartChartRecommendations(schema, sampleRows, analysis);
    
    for (const recommendation of chartRecommendations) {
      const chart = await generateOptimalChart(recommendation, schema, sampleRows, analysis);
      if (chart) {
        charts.push(chart);
      }
    }
    
    console.log(`✅ Generated ${charts.length} intelligent automatic charts`);
    
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

function generateSmartChartRecommendations(schema: ColumnSchema[], sampleRows: any[], analysis: any): any[] {
  const recommendations = [];
  const numericCols = schema.filter(col => col.type === 'number');
  const categoricalCols = schema.filter(col => col.type === 'string');
  const dateCols = schema.filter(col => col.type === 'date');
  
  // Priority 1: Time Series for temporal data with clear trends
  if (dateCols.length > 0 && numericCols.length > 0) {
    const timeCol = dateCols[0];
    const valueCol = findMostVariableNumericColumn(numericCols, sampleRows);
    if (valueCol && hasTemporalTrend(timeCol, valueCol, sampleRows)) {
      recommendations.push({
        type: 'timeseries',
        priority: 1,
        title: `📈 ${valueCol.name} Trends Over Time`,
        description: `Temporal analysis showing how ${valueCol.name} changes over ${timeCol.name}`,
        columns: [timeCol, valueCol],
        reason: 'Strong temporal patterns detected'
      });
    }
  }
  
  // Priority 2: Performance Comparison for business metrics
  if (categoricalCols.length > 0 && numericCols.length > 0) {
    const categoryCol = findMostBalancedCategoricalColumn(categoricalCols, sampleRows);
    const metricCol = findBusinessMetricColumn(numericCols, sampleRows);
    if (categoryCol && metricCol && hasSignificantVariation(categoryCol, metricCol, sampleRows)) {
      recommendations.push({
        type: 'comparison',
        priority: 2,
        title: `📊 ${metricCol.name} Performance by ${categoryCol.name}`,
        description: `Compare ${metricCol.name} across different ${categoryCol.name} segments`,
        columns: [categoryCol, metricCol],
        reason: 'Significant performance variations detected'
      });
    }
  }
  
  // Priority 3: Distribution Analysis for key metrics
  if (numericCols.length > 0) {
    const keyMetric = findKeyMetricColumn(numericCols, sampleRows);
    if (keyMetric && hasInterestingDistribution(keyMetric, sampleRows)) {
      recommendations.push({
        type: 'distribution',
        priority: 3,
        title: `📋 ${keyMetric.name} Distribution Analysis`,
        description: `Statistical distribution showing the spread and frequency of ${keyMetric.name} values`,
        columns: [keyMetric],
        reason: 'Interesting distribution patterns detected'
      });
    }
  }
  
  // Priority 4: Correlation Analysis (only if meaningful relationships exist)
  if (numericCols.length >= 2) {
    const correlationPairs = findStrongCorrelations(numericCols, sampleRows);
    if (correlationPairs.length > 0) {
      const topPair = correlationPairs[0];
      recommendations.push({
        type: 'correlation',
        priority: 4,
        title: `🔗 ${topPair.col1.name} vs ${topPair.col2.name} Relationship`,
        description: `Scatter plot showing correlation between ${topPair.col1.name} and ${topPair.col2.name}`,
        columns: [topPair.col1, topPair.col2],
        reason: `Strong correlation detected (${topPair.correlation.toFixed(2)})`
      });
    }
  }
  
  // Priority 5: Category Composition (only if meaningful segments)
  if (categoricalCols.length > 0) {
    const meaningfulCategory = findMeaningfulCategoryColumn(categoricalCols, sampleRows);
    if (meaningfulCategory && hasBalancedDistribution(meaningfulCategory, sampleRows)) {
      recommendations.push({
        type: 'composition',
        priority: 5,
        title: `🥧 ${meaningfulCategory.name} Composition`,
        description: `Breakdown showing the proportion of each ${meaningfulCategory.name} category`,
        columns: [meaningfulCategory],
        reason: 'Balanced category distribution suitable for comparison'
      });
    }
  }
  
  return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 4); // Top 4 recommendations
}

// Helper functions for intelligent chart selection
function findMostVariableNumericColumn(numericCols: ColumnSchema[], sampleRows: any[]): ColumnSchema | null {
  if (numericCols.length === 0) return null;
  
  return numericCols.reduce((prev, curr) => {
    const prevVariation = curr.stats?.stdDev || 0;
    const currVariation = prev.stats?.stdDev || 0;
    return prevVariation > currVariation ? curr : prev;
  });
}

function findBusinessMetricColumn(numericCols: ColumnSchema[], sampleRows: any[]): ColumnSchema | null {
  // Look for business-relevant column names
  const businessKeywords = ['revenue', 'sales', 'profit', 'cost', 'price', 'amount', 'value', 'total', 'count'];
  const businessCol = numericCols.find(col => 
    businessKeywords.some(keyword => col.name.toLowerCase().includes(keyword))
  );
  
  return businessCol || findMostVariableNumericColumn(numericCols, sampleRows);
}

function findMostBalancedCategoricalColumn(categoricalCols: ColumnSchema[], sampleRows: any[]): ColumnSchema | null {
  if (categoricalCols.length === 0) return null;
  
  return categoricalCols.reduce((prev, curr) => {
    const prevBalance = calculateCategoryBalance(prev, sampleRows);
    const currBalance = calculateCategoryBalance(curr, sampleRows);
    return currBalance > prevBalance ? curr : prev;
  });
}

function calculateCategoryBalance(col: ColumnSchema, sampleRows: any[]): number {
  const values = sampleRows.map(row => row[col.name]).filter(v => v != null);
  const uniqueValues = [...new Set(values)];
  
  if (uniqueValues.length < 2 || uniqueValues.length > 8) return 0; // Too few or too many categories
  
  const counts = uniqueValues.map(val => values.filter(v => v === val).length);
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
  const variance = counts.reduce((acc, count) => acc + Math.pow(count - mean, 2), 0) / counts.length;
  
  // Return balance score (lower variance = more balanced)
  return mean > 0 ? 1 / (1 + variance / mean) : 0;
}

function hasTemporalTrend(dateCol: ColumnSchema, numericCol: ColumnSchema, sampleRows: any[]): boolean {
  const sortedData = sampleRows
    .filter(row => row[dateCol.name] && row[numericCol.name])
    .sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime());
  
  if (sortedData.length < 3) return false;
  
  // Check for trend using simple slope analysis
  const values = sortedData.map(row => Number(row[numericCol.name]));
  const n = values.length;
  const slope = (n * values.reduce((acc, val, i) => acc + i * val, 0) - 
                 (n * (n - 1) / 2) * values.reduce((a, b) => a + b, 0)) / 
                (n * (n * (n - 1) * (2 * n - 1) / 6) - Math.pow(n * (n - 1) / 2, 2));
  
  return Math.abs(slope) > 0.1; // Significant trend
}

function hasSignificantVariation(categoryCol: ColumnSchema, numericCol: ColumnSchema, sampleRows: any[]): boolean {
  const groups = sampleRows.reduce((acc, row) => {
    const category = row[categoryCol.name];
    const value = Number(row[numericCol.name]);
    if (category && !isNaN(value)) {
      if (!acc[category]) acc[category] = [];
      acc[category].push(value);
    }
    return acc;
  }, {} as Record<string, number[]>);
  
  const groupMeans = Object.values(groups).map((values: number[]) => 
    values.reduce((a: number, b: number) => a + b, 0) / values.length
  );
  
  if (groupMeans.length < 2) return false;
  
  const overallMean = groupMeans.reduce((a, b) => a + b, 0) / groupMeans.length;
  const variance = groupMeans.reduce((acc, mean) => acc + Math.pow(mean - overallMean, 2), 0) / groupMeans.length;
  
  return variance > Math.pow(overallMean * 0.1, 2); // At least 10% variation
}

function hasInterestingDistribution(numericCol: ColumnSchema, sampleRows: any[]): boolean {
  const values = sampleRows.map(row => Number(row[numericCol.name])).filter(v => !isNaN(v));
  if (values.length < 5) return false;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const skewness = Math.abs(numericCol.stats?.stdDev || 0) > mean * 0.1;
  
  return skewness || variance > Math.pow(mean * 0.2, 2);
}

function findStrongCorrelations(numericCols: ColumnSchema[], sampleRows: any[]): any[] {
  const correlations = [];
  
  for (let i = 0; i < numericCols.length; i++) {
    for (let j = i + 1; j < numericCols.length; j++) {
      const col1 = numericCols[i];
      const col2 = numericCols[j];
      
      const values1 = sampleRows.map(row => Number(row[col1.name])).filter(v => !isNaN(v));
      const values2 = sampleRows.map(row => Number(row[col2.name])).filter(v => !isNaN(v));
      
      const correlation = calculateCorrelation(values1, values2);
      
      if (Math.abs(correlation) > 0.5) { // Strong correlation threshold
        correlations.push({ col1, col2, correlation });
      }
    }
  }
  
  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
}

function findKeyMetricColumn(numericCols: ColumnSchema[], sampleRows: any[]): ColumnSchema | null {
  // Priority: business metrics > high variance > first numeric
  return findBusinessMetricColumn(numericCols, sampleRows) || 
         findMostVariableNumericColumn(numericCols, sampleRows);
}

function findMeaningfulCategoryColumn(categoricalCols: ColumnSchema[], sampleRows: any[]): ColumnSchema | null {
  return categoricalCols.find(col => {
    const values = sampleRows.map(row => row[col.name]).filter(v => v != null);
    const uniqueValues = [...new Set(values)];
    return uniqueValues.length >= 2 && uniqueValues.length <= 8;
  }) || null;
}

function hasBalancedDistribution(categoryCol: ColumnSchema, sampleRows: any[]): boolean {
  return calculateCategoryBalance(categoryCol, sampleRows) > 0.5;
}

async function generateOptimalChart(recommendation: any, schema: ColumnSchema[], sampleRows: any[], analysis: any): Promise<any | null> {
  try {
    switch (recommendation.type) {
      case 'timeseries':
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedTimeSeriesChart(recommendation.columns[0], recommendation.columns[1], sampleRows),
          priority: recommendation.priority
        };
      
      case 'comparison':
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedComparisonChart(recommendation.columns[0], recommendation.columns[1], sampleRows),
          priority: recommendation.priority
        };
      
      case 'distribution':
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedDistributionChart(recommendation.columns[0], sampleRows),
          priority: recommendation.priority
        };
      
      case 'correlation':
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedCorrelationChart(recommendation.columns[0], recommendation.columns[1], sampleRows),
          priority: recommendation.priority
        };
      
      case 'composition':
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedCompositionChart(recommendation.columns[0], sampleRows),
          priority: recommendation.priority
        };
      
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to generate ${recommendation.type} chart:`, error);
    return null;
  }
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

// Advanced chart generation functions
function generateAdvancedTimeSeriesChart(dateCol: ColumnSchema, numericCol: ColumnSchema, sampleRows: any[]): any {
  const sortedData = sampleRows
    .filter(row => row[dateCol.name] && row[numericCol.name] != null)
    .sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime());
  
  const dates = sortedData.map(row => row[dateCol.name]);
  const values = sortedData.map(row => Number(row[numericCol.name]));
  
  // Calculate trend line
  const trendLine = calculateTrendLine(dates, values);
  
  return {
    data: [
      {
        x: dates,
        y: values,
        type: 'scatter',
        mode: 'lines+markers',
        line: { 
          color: '#667eea', 
          width: 3,
          shape: 'spline' 
        },
        marker: { 
          color: '#764ba2', 
          size: 8,
          symbol: 'circle'
        },
        name: numericCol.name,
        hovertemplate: `<b>${dateCol.name}</b>: %{x}<br><b>${numericCol.name}</b>: %{y:,.0f}<extra></extra>`
      },
      {
        x: dates,
        y: trendLine,
        type: 'scatter',
        mode: 'lines',
        line: { 
          color: '#ff7b7b', 
          width: 2,
          dash: 'dot'
        },
        name: 'Trend',
        hovertemplate: `<b>Trend</b>: %{y:,.0f}<extra></extra>`
      }
    ],
    layout: {
      title: {
        text: `${numericCol.name} Trends Over Time`,
        font: { size: 18, color: '#2d3748', weight: 600 }
      },
      xaxis: { 
        title: { text: dateCol.name, font: { size: 14, color: '#4a5568' } },
        showgrid: true,
        gridcolor: '#e2e8f0'
      },
      yaxis: { 
        title: { text: numericCol.name, font: { size: 14, color: '#4a5568' } },
        showgrid: true,
        gridcolor: '#e2e8f0'
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 60, b: 60, l: 80, r: 40 },
      hovermode: 'x unified',
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.02,
        xanchor: 'right',
        x: 1
      }
    }
  };
}

function generateAdvancedComparisonChart(categoryCol: ColumnSchema, numericCol: ColumnSchema, sampleRows: any[]): any {
  const groupedData = sampleRows.reduce((acc, row) => {
    const category = row[categoryCol.name];
    const value = Number(row[numericCol.name]);
    if (category && !isNaN(value)) {
      if (!acc[category]) acc[category] = [];
      acc[category].push(value);
    }
    return acc;
  }, {} as Record<string, number[]>);
  
  // Calculate statistics for each group
  const chartData = Object.entries(groupedData)
    .map(([category, values]) => ({
      category,
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length,
      values
    }))
    .sort((a, b) => b.mean - a.mean)
    .slice(0, 10); // Top 10 categories
  
  return {
    data: [{
      x: chartData.map(d => d.category),
      y: chartData.map(d => d.mean),
      type: 'bar',
      marker: {
        color: chartData.map((_, i) => `hsl(${220 + i * 25}, 70%, ${60 + (i % 3) * 10}%)`),
        opacity: 0.8,
        line: { color: '#2d3748', width: 1 }
      },
      text: chartData.map(d => `${d.mean.toLocaleString()}`),
      textposition: 'outside',
      hovertemplate: `<b>%{x}</b><br>${numericCol.name}: %{y:,.0f}<br>Sample Count: %{customdata}<extra></extra>`,
      customdata: chartData.map(d => d.count)
    }],
    layout: {
      title: {
        text: `${numericCol.name} Performance by ${categoryCol.name}`,
        font: { size: 18, color: '#2d3748', weight: 600 }
      },
      xaxis: { 
        title: { text: categoryCol.name, font: { size: 14, color: '#4a5568' } },
        tickangle: -45
      },
      yaxis: { 
        title: { text: `Average ${numericCol.name}`, font: { size: 14, color: '#4a5568' } },
        showgrid: true,
        gridcolor: '#e2e8f0'
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 60, b: 100, l: 80, r: 40 },
      showlegend: false
    }
  };
}

function generateAdvancedDistributionChart(numericCol: ColumnSchema, sampleRows: any[]): any {
  const values = sampleRows
    .map(row => Number(row[numericCol.name]))
    .filter(val => !isNaN(val));
  
  if (values.length === 0) return createFallbackChart([], []);
  
  // Calculate statistics
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const median = sorted[Math.floor(sorted.length * 0.5)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  
  return {
    data: [
      {
        x: values,
        type: 'histogram',
        nbinsx: Math.min(30, Math.max(10, Math.floor(Math.sqrt(values.length)))),
        marker: {
          color: '#667eea',
          opacity: 0.7,
          line: { color: '#2d3748', width: 1 }
        },
        name: 'Distribution',
        hovertemplate: `Range: %{x}<br>Count: %{y}<extra></extra>`
      }
    ],
    layout: {
      title: {
        text: `${numericCol.name} Distribution Analysis`,
        font: { size: 18, color: '#2d3748', weight: 600 }
      },
      xaxis: { 
        title: { text: numericCol.name, font: { size: 14, color: '#4a5568' } },
        showgrid: true,
        gridcolor: '#e2e8f0'
      },
      yaxis: { 
        title: { text: 'Frequency', font: { size: 14, color: '#4a5568' } },
        showgrid: true,
        gridcolor: '#e2e8f0'
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 60, b: 60, l: 60, r: 40 },
      shapes: [
        // Mean line
        {
          type: 'line',
          x0: mean,
          y0: 0,
          x1: mean,
          y1: 1,
          yref: 'paper',
          line: { color: '#e53e3e', width: 2, dash: 'dash' }
        },
        // Median line
        {
          type: 'line',
          x0: median,
          y0: 0,
          x1: median,
          y1: 1,
          yref: 'paper',
          line: { color: '#38a169', width: 2, dash: 'dot' }
        }
      ],
      annotations: [
        {
          x: mean,
          y: 0.9,
          yref: 'paper',
          text: `Mean: ${mean.toFixed(1)}`,
          showarrow: true,
          arrowhead: 2,
          arrowcolor: '#e53e3e',
          font: { color: '#e53e3e', size: 12 }
        },
        {
          x: median,
          y: 0.8,
          yref: 'paper',
          text: `Median: ${median.toFixed(1)}`,
          showarrow: true,
          arrowhead: 2,
          arrowcolor: '#38a169',
          font: { color: '#38a169', size: 12 }
        }
      ]
    }
  };
}

function generateAdvancedCorrelationChart(col1: ColumnSchema, col2: ColumnSchema, sampleRows: any[]): any {
  const data = sampleRows
    .filter(row => row[col1.name] != null && row[col2.name] != null)
    .map(row => ({
      x: Number(row[col1.name]),
      y: Number(row[col2.name])
    }))
    .filter(point => !isNaN(point.x) && !isNaN(point.y));
  
  if (data.length === 0) return createFallbackChart([], []);
  
  // Calculate correlation coefficient
  const correlation = calculateCorrelation(
    data.map(d => d.x),
    data.map(d => d.y)
  );
  
  // Calculate trend line
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  const trendLine = calculateLinearTrendLine(xValues, yValues);
  
  return {
    data: [
      {
        x: data.map(d => d.x),
        y: data.map(d => d.y),
        type: 'scatter',
        mode: 'markers',
        marker: {
          color: '#667eea',
          size: 10,
          opacity: 0.7,
          line: { color: '#2d3748', width: 1 }
        },
        name: 'Data Points',
        hovertemplate: `<b>${col1.name}</b>: %{x:,.1f}<br><b>${col2.name}</b>: %{y:,.1f}<extra></extra>`
      },
      {
        x: [Math.min(...xValues), Math.max(...xValues)],
        y: trendLine,
        type: 'scatter',
        mode: 'lines',
        line: { color: '#e53e3e', width: 3 },
        name: `Trend (r=${correlation.toFixed(3)})`,
        hovertemplate: `<b>Correlation</b>: ${correlation.toFixed(3)}<extra></extra>`
      }
    ],
    layout: {
      title: {
        text: `${col1.name} vs ${col2.name} Relationship`,  
        font: { size: 18, color: '#2d3748', weight: 600 }
      },
      xaxis: { 
        title: { text: col1.name, font: { size: 14, color: '#4a5568' } },
        showgrid: true,
        gridcolor: '#e2e8f0'
      },
      yaxis: { 
        title: { text: col2.name, font: { size: 14, color: '#4a5568' } },
        showgrid: true,
        gridcolor: '#e2e8f0'
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 80, b: 60, l: 80, r: 40 },
      annotations: [{
        x: 0.02,
        y: 0.98,
        xref: 'paper',
        yref: 'paper',
        text: `Correlation: ${correlation.toFixed(3)}<br>Strength: ${getCorrelationStrength(correlation)}`,
        showarrow: false,
        bgcolor: 'rgba(255,255,255,0.8)',
        bordercolor: '#e2e8f0',
        borderwidth: 1,
        font: { size: 12, color: '#2d3748' }
      }]
    }
  };
}

function generateAdvancedCompositionChart(categoryCol: ColumnSchema, sampleRows: any[]): any {
  const counts = sampleRows.reduce((acc, row) => {
    const value = row[categoryCol.name];
    if (value != null) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const sortedCounts = Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8); // Top 8 categories
  
  const total = sortedCounts.reduce((sum, [, count]) => sum + count, 0);
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', 
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
  ];
  
  return {
    data: [{
      labels: sortedCounts.map(([label]) => label),
      values: sortedCounts.map(([,value]) => value),
      type: 'pie',
      marker: {
        colors: colors.slice(0, sortedCounts.length),
        line: { color: '#ffffff', width: 2 }
      },
      textinfo: 'label+percent+value',
      textposition: 'auto',
      textfont: { size: 12, color: '#2d3748' },
      hovertemplate: `<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>`,
      pull: sortedCounts.map((_, i) => i === 0 ? 0.1 : 0) // Highlight largest segment
    }],
    layout: {
      title: {
        text: `${categoryCol.name} Distribution`,
        font: { size: 18, color: '#2d3748', weight: 600 }
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 60, b: 60, l: 60, r: 60 },
      showlegend: true,
      legend: {
        orientation: 'v',
        yanchor: 'middle',
        y: 0.5,
        x: 1.05
      },
      annotations: [{
        text: `Total: ${total}`,
        x: 0.5,
        y: 0.5,
        xref: 'paper',
        yref: 'paper',
        showarrow: false,
        font: { size: 16, color: '#2d3748', weight: 600 }
      }]
    }
  };
}

// Helper functions for advanced charts
function calculateTrendLine(dates: string[], values: number[]): number[] {
  const n = dates.length;
  if (n < 2) return values;
  
  const timeValues = dates.map(date => new Date(date).getTime());
  const meanTime = timeValues.reduce((a, b) => a + b, 0) / n;
  const meanValue = values.reduce((a, b) => a + b, 0) / n;
  
  const numerator = timeValues.reduce((acc, time, i) => acc + (time - meanTime) * (values[i] - meanValue), 0);
  const denominator = timeValues.reduce((acc, time) => acc + Math.pow(time - meanTime, 2), 0);
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanValue - slope * meanTime;
  
  return timeValues.map(time => slope * time + intercept);
}

function calculateLinearTrendLine(xValues: number[], yValues: number[]): number[] {
  const n = xValues.length;
  if (n < 2) return yValues;
  
  const meanX = xValues.reduce((a, b) => a + b, 0) / n;
  const meanY = yValues.reduce((a, b) => a + b, 0) / n;
  
  const numerator = xValues.reduce((acc, x, i) => acc + (x - meanX) * (yValues[i] - meanY), 0);
  const denominator = xValues.reduce((acc, x) => acc + Math.pow(x - meanX, 2), 0);
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;
  
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  
  return [slope * minX + intercept, slope * maxX + intercept];
}

function getCorrelationStrength(correlation: number): string {
  const abs = Math.abs(correlation);
  if (abs >= 0.9) return 'Very Strong';
  if (abs >= 0.7) return 'Strong';
  if (abs >= 0.5) return 'Moderate';
  if (abs >= 0.3) return 'Weak';
  return 'Very Weak';
}

// Enhanced Statistical Analysis (Phase 1 - without DuckDB for now)
export async function analyzeWithDuckDB(
  jsonData: any[],
  env: any
): Promise<DuckDBAnalysis> {
  console.log('📊 Starting enhanced statistical analysis...');
  const start = Date.now();

  try {
    const schema = inferSchema(jsonData);
    const rowCount = jsonData.length;
    const columnCount = schema.length;
    
    // Generate comprehensive summary statistics for each column
    const summary = schema.map(col => {
      const values = jsonData.map(row => row[col.name]).filter(v => v != null);
      const nonNullCount = values.length;
      const nullCount = rowCount - nonNullCount;
      
      let stats: any = {
        column_name: col.name,
        column_type: col.type,
        count: nonNullCount,
        nulls: nullCount,
        unique: [...new Set(values)].length
      };
      
      if (col.type === 'number') {
        const numValues = values.map(v => Number(v)).filter(v => !isNaN(v));
        if (numValues.length > 0) {
          const sorted = [...numValues].sort((a, b) => a - b);
          const mean = numValues.reduce((a, b) => a + b, 0) / numValues.length;
          const variance = numValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numValues.length;
          
          stats.min = Math.min(...numValues);
          stats.max = Math.max(...numValues);
          stats.mean = mean;
          stats.std = Math.sqrt(variance);
          stats.q25 = sorted[Math.floor(sorted.length * 0.25)];
          stats.q50 = sorted[Math.floor(sorted.length * 0.5)];
          stats.q75 = sorted[Math.floor(sorted.length * 0.75)];
        }
      } else if (col.type === 'string') {
        // Get frequency distribution for categorical data
        const frequencies = values.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const topCategories = Object.entries(frequencies)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10);
        
        stats.top_categories = topCategories;
        stats.category_count = Object.keys(frequencies).length;
      }
      
      return stats;
    });
    
    // Calculate correlations between numeric columns
    const numericColumns = schema.filter(col => col.type === 'number');
    const correlations: any = {};
    
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        
        const values1 = jsonData.map(row => Number(row[col1.name])).filter(v => !isNaN(v));
        const values2 = jsonData.map(row => Number(row[col2.name])).filter(v => !isNaN(v));
        
        const correlation = calculateCorrelation(values1, values2);
        if (Math.abs(correlation) > 0.1) { // Only store meaningful correlations
          correlations[`${col1.name}_${col2.name}`] = correlation;
        }
      }
    }
    
    // Identify data patterns and anomalies
    const patterns = {
      strongCorrelations: Object.entries(correlations).filter(([,corr]) => Math.abs(corr as number) > 0.7),
      highVariability: numericColumns
        .map(col => ({
          column: col.name,
          cv: (col.stats?.stdDev || 0) / (col.stats?.mean || 1)
        }))
        .filter(item => item.cv > 0.5)
        .sort((a, b) => b.cv - a.cv)
        .slice(0, 5),
      categoricalDominance: schema
        .filter(col => col.type === 'string')
        .map(col => {
          const values = jsonData.map(row => row[col.name]).filter(v => v != null);
          const frequencies = values.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const maxFreq = Math.max(...Object.values(frequencies));
          return {
            column: col.name,
            dominance: maxFreq / values.length,
            topValue: Object.entries(frequencies).find(([,freq]) => freq === maxFreq)?.[0]
          };
        })
        .filter(item => item.dominance > 0.7)
        .sort((a, b) => b.dominance - a.dominance)
    };
    
    const duration = Date.now() - start;
    console.log(`✅ Enhanced statistical analysis completed in ${duration}ms`);
    console.log(`📊 Processed ${rowCount} rows, ${columnCount} columns`);
    console.log(`🔍 Found ${Object.keys(correlations).length} correlations, ${patterns.highVariability.length} high-variability columns`);
    
    return {
      summary,
      rowCount,
      columnCount,
      dataTypes: schema.reduce((acc, col) => {
        acc[col.name] = col.type;
        return acc;
      }, {} as Record<string, string>),
      correlations,
      patterns,
      processingTime: duration
    };
    
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ Enhanced analysis failed after ${duration}ms:`, error);
    
    return {
      summary: [],
      rowCount: jsonData.length,
      columnCount: 0,
      dataTypes: {},
      error: error.message
    };
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