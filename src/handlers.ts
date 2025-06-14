import * as Papa from 'papaparse';
import { Env, UploadResponse, QueryRequest, QueryResponse } from './types';
import { generateUUID, inferSchema, createFallbackChart, analyzeDataWithAI, analyzeWithDuckDB } from './utils';
import { SYSTEM_PROMPTS } from './prompts';

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
    
    // 6. Perform the higher-level AI analysis (as before)
    // The AI now gets a much richer context from the enhanced statistical analysis!
    console.log("🔍 Starting AI analysis with enhanced statistical context...");
    const analysis = await analyzeDataWithAI(schema, sampleRows, env);
    analysis.duckDbAnalysis = duckDbAnalysis; // Attach enhanced statistical results
    console.log("✅ AI analysis completed with enhanced context");
    
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
    console.error("❌ Error stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function performAIReasoning(prompt: string, schema: any[], sampleRows: any[], analysis: any, env: any): Promise<any> {
  const reasoningPrompt = `${SYSTEM_PROMPTS.REASONING_ANALYSIS}

VISUALIZATION REASONING REQUEST:

USER'S REQUEST: "${prompt}"

DATASET SCHEMA & CONTEXT:
${JSON.stringify(schema.map(col => ({name: col.name, type: col.type, stats: col.stats})), null, 2)}

SAMPLE DATA FOR REFERENCE:
${JSON.stringify(sampleRows.slice(0, 8), null, 2)}

${analysis ? `EXISTING ANALYSIS INSIGHTS:
Summary: ${analysis.summary}
Key Patterns: ${analysis.insights.slice(0, 3).join(' | ')}
Data Quality: ${analysis.dataQuality.completeness}% complete
${analysis.patterns ? `Detected Patterns: ${analysis.patterns.trends.concat(analysis.patterns.distributions.map(d => `${d.column} distribution`)).join(', ')}` : ''}
${analysis.businessInsights ? `Business Context: ${analysis.businessInsights.slice(0, 2).join(' | ')}` : ''}
` : ''}

REQUIRED JSON OUTPUT FORMAT:
{
  "reasoning": "Step-by-step analysis of user intent, data characteristics, and optimal visualization strategy",
  "recommendedChartType": "single_best_chart_type",
  "primaryVariables": ["most_relevant_column1", "most_relevant_column2"],
  "considerations": ["data_suitability_factor", "visualization_best_practice", "user_intent_factor"],
  "dataInsights": "how the data characteristics inform this visualization choice",
  "alternativeApproaches": ["alternative_chart_type_1", "alternative_chart_type_2"],
  "expectedOutcome": "specific insights the user will gain from this visualization"
}

ANALYSIS FRAMEWORK:
1. Parse user intent - what specific question are they trying to answer?
2. Evaluate data fitness - which columns best support this analysis?
3. Apply visualization principles - what chart type maximizes clarity and insight?
4. Consider data limitations - any quality issues or constraints?
5. Predict value - what actionable insights will this reveal?`;

  try {
    const response = await env.AI.run('@cf/qwen/qwq-32b', {
      prompt: reasoningPrompt,
      max_tokens: 4000
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
    
    const reasoning = JSON.parse(responseText);
    console.log("🧠 AI Reasoning:", reasoning.reasoning);
    return reasoning;
    
  } catch (error) {
    console.error('AI reasoning failed:', error);
    return {
      reasoning: "Analyzing user request for appropriate visualization approach",
      recommendedChartType: "bar",
      primaryVariables: schema.filter(col => col.type === 'number').slice(0, 2).map(col => col.name),
      considerations: ["Data availability", "Chart readability", "User intent"],
      dataInsights: "Basic data overview needed",
      alternativeApproaches: ["histogram", "scatter"],
      expectedOutcome: "Visual representation of the requested data pattern"
    };
  }
}

export async function queryHandler(request: Request, env: Env): Promise<Response> {
  console.log("🔍 queryHandler: request:", request.url);
  
  try {
    const { datasetId, prompt }: QueryRequest = await request.json();
    console.log("Using dataset:", datasetId, "prompt:", prompt);
    
    const [schemaStr, sampleRowsStr, analysisStr] = await Promise.all([
      env.KV.get(`${datasetId}:schema`),
      env.KV.get(`${datasetId}:sample`),
      env.KV.get(`${datasetId}:analysis`)
    ]);
    
    if (!schemaStr || !sampleRowsStr) {
      return new Response(JSON.stringify({ error: 'Dataset not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const schema = JSON.parse(schemaStr);
    const sampleRows = JSON.parse(sampleRowsStr);
    const analysis = analysisStr ? JSON.parse(analysisStr) : null;
    
    // Step 1: AI Reasoning/Thinking Phase
    console.log("🤔 AI is analyzing the request and data context...");
    const reasoningResponse = await performAIReasoning(prompt, schema, sampleRows, analysis, env);
    console.log("✅ AI reasoning completed:", reasoningResponse.reasoning);
    
    // Step 2: Chart Generation with Reasoning Context
    console.log("🎨 Generating chart based on AI reasoning...");
    const structuredPrompt = `${SYSTEM_PROMPTS.CHART_GENERATION}

CHART IMPLEMENTATION REQUEST:

USER'S ORIGINAL REQUEST: "${prompt}"

PREVIOUS AI REASONING ANALYSIS:
Reasoning: ${reasoningResponse.reasoning}
Recommended Chart Type: ${reasoningResponse.recommendedChartType}
Primary Variables: ${reasoningResponse.primaryVariables.join(', ')}
Key Considerations: ${reasoningResponse.considerations.join(', ')}
Expected Outcome: ${reasoningResponse.expectedOutcome}

DATASET SCHEMA WITH STATISTICS:
${JSON.stringify(schema.map(col => ({name: col.name, type: col.type, stats: col.stats})), null, 2)}

SAMPLE DATA FOR IMPLEMENTATION:
${JSON.stringify(sampleRows.slice(0, 10), null, 2)}

${analysis ? `STATISTICAL CONTEXT TO INCORPORATE:
Business Insights: ${analysis.insights.slice(0, 3).join(' | ')}
${analysis.patterns ? `
Key Patterns:
- Trends: ${analysis.patterns.trends.join(', ')}
- Distributions: ${analysis.patterns.distributions.map(d => `${d.column} (${d.type})`).join(', ')}
` : ''}` : ''}

IMPLEMENTATION REQUIREMENTS:
- Chart Type: ${reasoningResponse.recommendedChartType}
- Primary Variables: ${reasoningResponse.primaryVariables.join(' and ')}
- Use actual sample data values to populate x/y arrays
- Apply professional styling with gradient colors starting with #667eea
- Include meaningful titles and axis labels based on the analysis context
- Ensure chart tells the story identified in the reasoning phase

RETURN ONLY PLOTLY.JS JSON SPECIFICATION - NO MARKDOWN, NO EXPLANATIONS:`;

    const aiResponse = await env.AI.run('@cf/qwen/qwq-32b', {
      prompt: structuredPrompt,
      max_tokens: 1024
    });
    
    console.log("LLM response received");
    
    let chartSpec;
    try {
      let responseText = aiResponse.response || aiResponse.choices?.[0]?.text || aiResponse;
      
      // Clean up the response - remove markdown code blocks, thinking tags, and extra text
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
      
      console.debug("Cleaned AI response:", responseText);
      chartSpec = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw AI response:", aiResponse);
      
      // Use fallback chart when AI response parsing fails
      console.log("Using fallback chart generation");
      chartSpec = createFallbackChart(schema, sampleRows);
    }
    
    console.debug("Parsed chart spec:", chartSpec);
    
    const response: QueryResponse = {
      chartSpec,
      reasoning: reasoningResponse,
      logs: ['AI reasoning completed', 'Chart specification generated successfully']
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