export interface Env {
  AI: any;
  KV: KVNamespace;
  R2_BUCKET: R2Bucket;
  NVIDIA_API_KEY?: string;
}

// Authentication interfaces
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthSession {
  sessionId: string;
  username: string;
  createdAt: string;
  expiresAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  sessionId?: string;
  error?: string;
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

// Enhanced Statistical Analysis interface for rich insights
export interface DuckDBAnalysis {
  summary: any[]; // Comprehensive statistical summaries for each column
  rowCount?: number;
  columnCount?: number;
  dataTypes?: Record<string, string>;
  correlations?: Record<string, number>;
  patterns?: {
    strongCorrelations?: any[];
    highVariability?: any[];
    categoricalDominance?: any[];
  };
  processingTime?: number;
  error?: string;
}

export interface UploadResponse {
  datasetId: string;
  schema: ColumnSchema[];
  sampleRows: any[];
  analysis: DataAnalysis;
  duckDbAnalysis: DuckDBAnalysis; // Add this new field
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
    chartSpec?: any;
    code?: string;
    priority: number;
  }>;
  duckDbAnalysis?: DuckDBAnalysis; // Add this optional field
}

export interface QueryRequest {
  datasetId: string;
  prompt: string;
}

export interface QueryResponse {
  chartSpec?: any;
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
  result?: any;
  shouldPlot?: boolean;
  error?: string;
  thinking?: string;
  explanation?: string;
  logs: string[];
}

// NVIDIA Agent interfaces
export interface NvidiaClient {
  chat: {
    completions: {
      create: (params: NvidiaCompletionParams) => Promise<NvidiaCompletionResponse>;
    };
  };
}

export interface NvidiaCompletionParams {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface NvidiaCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Agent result interfaces
export interface CodeGenerationResult {
  code: string;
  shouldPlot: boolean;
  error?: string;
}

export interface ExecutionResult {
  result: any;
  error?: string;
}

export interface ReasoningResult {
  thinking: string;
  explanation: string;
  error?: string;
}