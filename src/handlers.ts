import * as Papa from 'papaparse';
import { Env, UploadResponse, QueryRequest, QueryResponse, ColumnSchema } from './types';
import { generateUUID, inferSchema, createFallbackChart, analyzeDataWithAI, analyzeWithDuckDB } from './utils';
import { SYSTEM_PROMPTS } from './prompts';
import { 
  createNvidiaClient, 
  CodeGenerationAgent, 
  ExecutionAgent, 
  ReasoningAgent, 
  DataInsightAgent,
  DashboardGenerationAgent
} from './agents';

export async function uploadCsvHandler(request: Request, env: Env): Promise<Response> {
  console.log("📥 uploadCsvHandler v2: Phase 1 upgrade with DuckDB and R2 storage");
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error("❌ No file provided in request");
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 1. Get the file content as an ArrayBuffer for efficiency
    console.log("📁 Processing uploaded file:", file.name, "Size:", file.size, "bytes");
    const fileBuffer = await file.arrayBuffer();
    const csvText = new TextDecoder().decode(fileBuffer);
    console.log("📄 CSV text length:", csvText.length, "characters");
    
    // 2. Parse CSV text using PapaParse (as before)
    console.log("🔧 Parsing CSV data...");
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
    
    if (parseResult.errors.length > 0) {
      console.error("❌ CSV parsing errors:", parseResult.errors);
      return new Response(JSON.stringify({ 
        error: 'CSV parsing failed', 
        details: parseResult.errors.slice(0, 5) // Limit error details
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = parseResult.data as any[];
    const schema = inferSchema(data);
    const sampleRows = data.slice(0, 10);
    const datasetId = generateUUID();
    
    console.log(`📊 Parsed data: ${data.length} rows, ${schema.length} columns`);
    console.log(`🔑 Generated dataset ID: ${datasetId}`);
    
    // 3. Convert parsed JSON data to efficient format for R2 storage
    console.log("📦 Preparing data for R2 storage...");
    const jsonBuffer = new TextEncoder().encode(JSON.stringify(data));
    console.log(`📦 JSON buffer created, size: ${jsonBuffer.byteLength} bytes`);
    
    // 4. Upload the JSON data to R2 for scalable storage
    console.log(`☁️ Uploading JSON data to R2 with ID: ${datasetId}`);
    await env.R2_BUCKET.put(datasetId, jsonBuffer, {
      httpMetadata: {
        contentType: 'application/json'
      },
      customMetadata: {
        originalFileName: file.name,
        rowCount: data.length.toString(),
        columnCount: schema.length.toString(),
        uploadTimestamp: new Date().toISOString(),
        compressionRatio: (csvText.length / jsonBuffer.byteLength).toFixed(2)
      }
    });
    console.log("✅ Data successfully stored in R2");
    
    // 5. Perform enhanced statistical analysis on the full dataset
    console.log("📊 Starting enhanced statistical analysis on full dataset...");
    const duckDbAnalysis = await analyzeWithDuckDB(data, env);
    console.log("✅ Enhanced statistical analysis completed");
    
    // 6. Perform the higher-level AI analysis using NVIDIA agents
    console.log("🔍 Starting NVIDIA AI analysis with enhanced statistical context...");
    let analysis;
    
    if (env.NVIDIA_API_KEY) {
      try {
        console.log(`🔑 Using NVIDIA API for enhanced dataset analysis`);
        const nvidiaClient = createNvidiaClient(env.NVIDIA_API_KEY);
        
        // Enhanced insights
        const insights = await DataInsightAgent(schema, sampleRows, nvidiaClient);
        
        // Base analysis with traditional method
        analysis = await analyzeDataWithAI(schema, sampleRows, env);
        analysis.summary = insights; // Replace summary with NVIDIA insights
        analysis.duckDbAnalysis = duckDbAnalysis;
        
        // NVIDIA-powered intelligent dashboard (use full data for better charts)
        console.log("🎨 Generating NVIDIA-powered intelligent dashboard...");
        const intelligentCharts = await DashboardGenerationAgent(schema, data, analysis, nvidiaClient);
        analysis.autoCharts = intelligentCharts;
        
        console.log("✅ NVIDIA-enhanced AI analysis completed");
      } catch (error) {
        console.error("⚠️ NVIDIA API failed, falling back to Cloudflare AI:", error);
        analysis = await analyzeDataWithAI(schema, sampleRows, env);
        analysis.duckDbAnalysis = duckDbAnalysis;
        
        // Ensure auto charts have the correct structure for error fallback case
        if (analysis.autoCharts && analysis.autoCharts.length > 0) {
          analysis.autoCharts = analysis.autoCharts.map(chart => {
            if (!chart.title && chart.chartSpec) {
              return {
                title: 'Data Visualization',
                description: 'Chart generated from your data',
                chartSpec: chart.chartSpec,
                priority: chart.priority || 1
              };
            }
            return chart;
          });
        }
      }
    } else {
      console.log("⚠️ No NVIDIA API key found, using Cloudflare AI");
      analysis = await analyzeDataWithAI(schema, sampleRows, env);
      analysis.duckDbAnalysis = duckDbAnalysis;
      
      // Ensure auto charts have the correct structure for fallback case
      if (analysis.autoCharts && analysis.autoCharts.length > 0) {
        analysis.autoCharts = analysis.autoCharts.map(chart => {
          if (!chart.title && chart.chartSpec) {
            return {
              title: 'Data Visualization',
              description: 'Chart generated from your data',
              chartSpec: chart.chartSpec,
              priority: chart.priority || 1
            };
          }
          return chart;
        });
      }
    }
    
    // 7. Store metadata in KV (the large data is now in R2)
    console.log("💾 Storing metadata in KV...");
    await Promise.all([
      env.KV.put(`${datasetId}:schema`, JSON.stringify(schema)),
      env.KV.put(`${datasetId}:sample`, JSON.stringify(sampleRows)),
      env.KV.put(`${datasetId}:analysis`, JSON.stringify(analysis)),
      // We no longer store the full CSV in KV - it's efficiently stored in R2 as JSON
    ]);
    console.log(`✅ Metadata stored in KV with dataset ID: ${datasetId}`);
    
    // 8. Return the enhanced response to the frontend
    const response: UploadResponse = {
      datasetId,
      schema,
      sampleRows,
      analysis,
      duckDbAnalysis
    };
    
    console.log(`🎉 Upload process completed successfully for dataset ${datasetId}`);
    console.log(`📈 Enhanced with ${duckDbAnalysis.summary.length} statistical summaries`);
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error("❌ Upload error:", error);
    console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack trace available');
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// This function is replaced by the NVIDIA agent workflow
// Keeping for backwards compatibility but functionality moved to agents.ts

export async function queryHandler(request: Request, env: Env): Promise<Response> {
  console.log("🔍 queryHandler: NVIDIA Agent-based processing");
  
  try {
    const requestData = await request.json() as QueryRequest;
    const { datasetId, prompt } = requestData;
    console.log("Using dataset:", datasetId, "prompt:", prompt);
    
    const [schemaStr, sampleRowsStr, dataStr] = await Promise.all([
      env.KV.get(`${datasetId}:schema`),
      env.KV.get(`${datasetId}:sample`),
      env.R2_BUCKET.get(datasetId)
    ]);
    
    if (!schemaStr || !sampleRowsStr) {
      return new Response(JSON.stringify({ error: 'Dataset not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const schema = JSON.parse(schemaStr);
    const sampleRows = JSON.parse(sampleRowsStr);
    let fullData = sampleRows; // Default to sample if full data not available
    
    if (dataStr) {
      try {
        const dataText = await dataStr.text();
        fullData = JSON.parse(dataText);
        console.log(`📊 Loaded full dataset: ${fullData.length} rows`);
      } catch (error) {
        console.warn("⚠️ Could not load full dataset, using sample data");
      }
    }
    
    // Use NVIDIA agents if API key is available
    if (env.NVIDIA_API_KEY) {
      try {
        console.log("🤖 Starting NVIDIA agent workflow...");
        console.log(`🔑 Using NVIDIA API for enhanced analysis`);
        const nvidiaClient = createNvidiaClient(env.NVIDIA_API_KEY);
        
        // Step 1: Code Generation
        console.log("🔧 CodeGenerationAgent: Generating code...");
        const codeResult = await CodeGenerationAgent(prompt, schema, nvidiaClient);
        
        if (codeResult.error) {
          throw new Error(`Code generation failed: ${codeResult.error}`);
        }
        
        // Step 2: Code Execution 
        console.log("⚡ ExecutionAgent: Executing code...");
        const executionResult = ExecutionAgent(codeResult.code, fullData, codeResult.shouldPlot);
        
        if (executionResult.error) {
          throw new Error(`Code execution failed: ${executionResult.error}`);
        }
        
        // Step 3: Reasoning and Explanation
        console.log("🧠 ReasoningAgent: Generating insights...");
        const reasoningResult = await ReasoningAgent(prompt, executionResult.result, nvidiaClient);
        
        // Extract chart specification from the execution result
        let chartSpec = null;
        if (executionResult.result && executionResult.result.chartSpec) {
          chartSpec = executionResult.result.chartSpec;
          
          // Validate chart spec has required properties
          if (!chartSpec.data || !Array.isArray(chartSpec.data) || chartSpec.data.length === 0) {
            console.error("❌ Invalid chart spec: missing or empty data array");
            chartSpec = null;
          } else {
            console.log("✅ Valid chart spec extracted with", chartSpec.data.length, "data series");
          }
        } else {
          console.warn("⚠️ No chart spec found in execution result:", executionResult.result);
        }
        
        const response: QueryResponse = {
          chartSpec: chartSpec,
          reasoning: {
            reasoning: reasoningResult.explanation,
            recommendedChartType: codeResult.shouldPlot ? 'Generated from AI code' : 'Data analysis',
            primaryVariables: [], // Could extract from code analysis
            considerations: [reasoningResult.thinking],
            dataInsights: reasoningResult.explanation,
            alternativeApproaches: [],
            expectedOutcome: 'Interactive visualization based on your query'
          },
          code: codeResult.code,
          result: executionResult.result,
          shouldPlot: codeResult.shouldPlot,
          thinking: reasoningResult.thinking,
          explanation: reasoningResult.explanation,
          logs: [
            'NVIDIA agents workflow completed successfully',
            'Code generated and executed',
            'Chart specification extracted and validated',
            'Reasoning and insights generated'
          ]
        };
        
        console.log("✅ NVIDIA agent workflow completed successfully");
        
        return new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
        
      } catch (nvidiaError) {
        console.error("❌ NVIDIA agent workflow failed:", nvidiaError);
        console.log("🔄 Falling back to traditional chart generation...");
      }
    }
    
    // Fallback to traditional chart generation
    console.log("📊 Using traditional chart generation as fallback...");
    const fallbackChartSpec = createFallbackChart(schema, sampleRows);
    
    const response: QueryResponse = {
      chartSpec: fallbackChartSpec,
      reasoning: {
        reasoning: "Generated a fallback visualization based on your data structure",
        recommendedChartType: "Fallback chart",
        primaryVariables: schema.map((col: ColumnSchema) => col.name).slice(0, 2),
        considerations: ["Used fallback generation due to AI processing unavailability"],
        dataInsights: "Basic chart generated from dataset structure",
        alternativeApproaches: [],
        expectedOutcome: "Simple visualization of your data"
      },
      logs: ['Used fallback chart generation due to NVIDIA API unavailability']
    };
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error("Query error:", error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      logs: ['Query processing failed']
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}