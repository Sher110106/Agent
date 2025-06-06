export interface Env {
  AI: any;
  KV: KVNamespace;
}

export interface ColumnSchema {
  name: string;
  type: string;
  stats?: ColumnStats;
}

export interface ColumnStats {
  count: number;
  nullCount: number;
  uniqueCount: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  median?: number;
  mode?: string | number;
  stdDev?: number;
  distribution?: Array<{value: any, count: number}>;
}

export interface UploadResponse {
  datasetId: string;
  schema: ColumnSchema[];
  sampleRows: any[];
  analysis?: DataAnalysis;
}

export interface DataAnalysis {
  summary: string;
  insights: string[];
  correlations: Array<{column1: string, column2: string, correlation: number}>;
  recommendations: string[];
  dataQuality: {
    completeness: number;
    consistency: number;
    issues: string[];
  };
  patterns: {
    trends: string[];
    outliers: Array<{column: string, values: any[]}>;
    seasonality: string[];
    distributions: Array<{column: string, type: string, description: string}>;
  };
  businessInsights: string[];
  suggestedPrompts: Array<{
    prompt: string;
    category: string;
    description: string;
    chartType: string;
  }>;
  autoCharts: Array<{
    title: string;
    description: string;
    chartSpec: any;
    priority: number;
  }>;
}

export interface QueryRequest {
  datasetId: string;
  prompt: string;
}

export interface QueryResponse {
  chartSpec: any;
  reasoning?: {
    reasoning: string;
    recommendedChartType: string;
    primaryVariables: string[];
    considerations: string[];
    dataInsights: string;
    alternativeApproaches: string[];
    expectedOutcome: string;
  };
  code?: string;
  logs: string[];
}