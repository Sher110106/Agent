import { Env } from './types';
import { uploadCsvHandler, queryHandler } from './handlers';

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (path === '/upload' && request.method === 'POST') {
      return uploadCsvHandler(request, env);
    }

    if (path === '/query' && request.method === 'POST') {
      return queryHandler(request, env);
    }

    if (path === '/' && request.method === 'GET') {
      return new Response(getIndexHtml(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

function getIndexHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSV AI Agent - Professional Data Analytics Platform</title>
    <script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        :root {
            --primary-50: #f0f9ff;
            --primary-100: #e0f2fe;
            --primary-200: #bae6fd;
            --primary-300: #7dd3fc;
            --primary-400: #38bdf8;
            --primary-500: #0ea5e9;
            --primary-600: #0284c7;
            --primary-700: #0369a1;
            --primary-800: #075985;
            --primary-900: #0c4a6e;
            
            --gray-50: #f8fafc;
            --gray-100: #f1f5f9;
            --gray-200: #e2e8f0;
            --gray-300: #cbd5e1;
            --gray-400: #94a3b8;
            --gray-500: #64748b;
            --gray-600: #475569;
            --gray-700: #334155;
            --gray-800: #1e293b;
            --gray-900: #0f172a;
            
            --success-50: #f0fdf4;
            --success-200: #bbf7d0;
            --success-500: #22c55e;
            --success-600: #16a34a;
            
            --error-50: #fef2f2;
            --error-200: #fecaca;
            --error-500: #ef4444;
            --error-600: #dc2626;
            
            --warning-50: #fffbeb;
            --warning-200: #fed7aa;
            --warning-500: #f59e0b;
            --warning-600: #d97706;
            
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            
            --border-radius-sm: 0.375rem;
            --border-radius-md: 0.5rem;
            --border-radius-lg: 0.75rem;
            --border-radius-xl: 1rem;
        }
        
        body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            background: var(--gray-50);
            color: var(--gray-900);
            line-height: 1.6;
        }
        
        .header {
            background: white;
            border-bottom: 1px solid var(--gray-200);
            padding: 1.5rem 0;
            position: sticky;
            top: 0;
            z-index: 50;
            box-shadow: var(--shadow-sm);
        }
        
        .header-content {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .logo-icon {
            width: 2rem;
            height: 2rem;
            background: var(--primary-500);
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .logo h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gray-900);
        }
        
        .subtitle {
            font-size: 0.875rem;
            color: var(--gray-600);
            margin-top: 0.25rem;
        }
        
        .main-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .grid-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .full-width {
            grid-column: 1 / -1;
        }
        
        .card { 
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-xl);
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
            transition: all 0.2s ease-in-out;
        }
        
        .card:hover {
            box-shadow: var(--shadow-md);
            border-color: var(--gray-300);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }
        
        .card-icon {
            width: 1.25rem;
            height: 1.25rem;
            color: var(--primary-500);
        }
        
        .card-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--gray-900);
        }
        
        .file-upload-area {
            border: 2px dashed var(--gray-300);
            border-radius: var(--border-radius-lg);
            padding: 2rem;
            text-align: center;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            background: var(--gray-50);
        }
        
        .file-upload-area:hover {
            border-color: var(--primary-400);
            background: var(--primary-50);
        }
        
        .file-upload-area.dragover {
            border-color: var(--primary-500);
            background: var(--primary-100);
        }
        
        .file-upload-area.has-file {
            border-color: var(--success-500);
            background: var(--success-50);
        }
        
        .file-selected {
            margin-top: 1rem;
            padding: 0.75rem;
            background: var(--primary-50);
            border: 1px solid var(--primary-200);
            border-radius: var(--border-radius-md);
            color: var(--primary-700);
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .upload-progress {
            margin-top: 1rem;
            padding: 1rem;
            background: var(--primary-50);
            border: 1px solid var(--primary-200);
            border-radius: var(--border-radius-md);
            display: none;
        }
        
        .upload-progress.show {
            display: block;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--gray-200);
            border-radius: 4px;
            overflow: hidden;
            margin-top: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--primary-500);
            border-radius: 4px;
            transition: width 0.3s ease;
            animation: pulse 2s infinite;
        }
        
        .upload-icon {
            width: 3rem;
            height: 3rem;
            color: var(--gray-400);
            margin: 0 auto 1rem;
        }
        
        .upload-text {
            font-weight: 500;
            color: var(--gray-700);
            margin-bottom: 0.5rem;
        }
        
        .upload-subtext {
            font-size: 0.875rem;
            color: var(--gray-500);
        }
        
        .file-input {
            display: none;
        }
        
        .prompt-input {
            width: 100%;
            min-height: 120px;
            padding: 1rem;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius-lg);
            font-family: inherit;
            font-size: 0.875rem;
            resize: vertical;
            transition: all 0.2s ease-in-out;
            background: white;
        }
        
        .prompt-input:focus {
            outline: none;
            border-color: var(--primary-500);
            box-shadow: 0 0 0 3px var(--primary-100);
        }
        
        .prompt-input::placeholder {
            color: var(--gray-400);
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: var(--border-radius-md);
            font-family: inherit;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            text-decoration: none;
        }
        
        .btn-primary {
            background: var(--primary-500);
            color: white;
            box-shadow: var(--shadow-sm);
        }
        
        .btn-primary:hover {
            background: var(--primary-600);
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
        }
        
        .btn-primary:active {
            transform: translateY(0);
        }
        
        .btn-primary:disabled {
            background: var(--gray-300);
            color: var(--gray-500);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .btn-primary:disabled:hover {
            background: var(--gray-300);
            transform: none;
            box-shadow: none;
        }
        
        .btn-secondary {
            background: var(--gray-100);
            color: var(--gray-700);
            border: 1px solid var(--gray-300);
        }
        
        .btn-secondary:hover {
            background: var(--gray-200);
            border-color: var(--gray-400);
        }
        
        .btn-icon {
            width: 1rem;
            height: 1rem;
        }
        
        .status {
            padding: 1rem;
            border-radius: var(--border-radius-md);
            margin: 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .status.success {
            background: var(--success-50);
            color: var(--success-600);
            border: 1px solid var(--success-200);
        }
        
        .status.error {
            background: var(--error-50);
            color: var(--error-600);
            border: 1px solid var(--error-200);
        }
        
        .status.info {
            background: var(--primary-50);
            color: var(--primary-600);
            border: 1px solid var(--primary-200);
        }
        
        .status.warning {
            background: var(--warning-50);
            color: var(--warning-600);
            border: 1px solid var(--warning-200);
        }
        
        .loading-spinner {
            width: 1rem;
            height: 1rem;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .metric-card {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-md);
            padding: 1rem;
            text-align: center;
        }
        
        .metric-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-600);
            margin-bottom: 0.25rem;
        }
        
        .metric-label {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .insights-list {
            list-style: none;
            margin: 1rem 0;
        }
        
        .insights-list li {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-md);
            padding: 1rem;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
            position: relative;
            padding-left: 2.5rem;
        }
        
        .insights-list li::before {
            content: '';
            position: absolute;
            left: 1rem;
            top: 1.25rem;
            width: 0.25rem;
            height: 0.25rem;
            background: var(--primary-500);
            border-radius: 50%;
        }
        
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .chart-container {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-xl);
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
        }
        
        .chart-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 0.5rem;
        }
        
        .chart-description {
            font-size: 0.875rem;
            color: var(--gray-600);
            margin-bottom: 1.5rem;
        }
        
        .suggestions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .suggestion-card {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-lg);
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        
        .suggestion-card:hover {
            border-color: var(--primary-300);
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
        }
        
        .suggestion-title {
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }
        
        .suggestion-description {
            font-size: 0.75rem;
            color: var(--gray-600);
            line-height: 1.4;
            margin-bottom: 0.75rem;
        }
        
        .suggestion-category {
            display: inline-block;
            background: var(--primary-100);
            color: var(--primary-700);
            padding: 0.25rem 0.5rem;
            border-radius: var(--border-radius-sm);
            font-size: 0.625rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .reasoning-section {
            background: var(--primary-50);
            border: 1px solid var(--primary-200);
            border-radius: var(--border-radius-lg);
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .reasoning-title {
            font-weight: 600;
            color: var(--primary-700);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .reasoning-content {
            font-size: 0.875rem;
            color: var(--gray-700);
            line-height: 1.5;
        }
        
        .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .grid-layout {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .main-container {
                padding: 1rem;
            }
            
            .header-content {
                padding: 0 1rem;
            }
            
            .charts-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .suggestions-grid {
                grid-template-columns: 1fr;
            }
            
            .metrics-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        /* Animations */
        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--gray-100);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--gray-400);
            border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--gray-500);
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo">
                <div class="logo-icon">
                    <i data-lucide="bar-chart-3"></i>
                </div>
                <div>
                    <h1>CSV AI Agent</h1>
                    <p class="subtitle">Professional Data Analytics Platform</p>
                </div>
            </div>
        </div>
    </div>

    <div class="main-container">
        <div class="grid-layout">
            <div class="card">
                <div class="card-header">
                    <i data-lucide="upload" class="card-icon"></i>
                    <h2 class="card-title">Upload Dataset</h2>
                </div>
                <div class="file-upload-area" id="uploadArea" onclick="document.getElementById('csvFile').click()">
                    <i data-lucide="file-plus" class="upload-icon"></i>
                    <div class="upload-text">Click to upload or drag and drop</div>
                    <div class="upload-subtext">CSV files only • Max 10MB</div>
                </div>
                <div id="fileSelected" class="file-selected" style="display: none;">
                    <i data-lucide="file-check"></i>
                    <span id="fileName"></span>
                    <button onclick="clearFile()" style="margin-left: auto; background: none; border: none; color: var(--gray-500); cursor: pointer;">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div id="uploadProgress" class="upload-progress">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <div class="loading-spinner"></div>
                        <span>Uploading and analyzing your data...</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 100%;"></div>
                    </div>
                </div>
                <input type="file" id="csvFile" accept=".csv" class="file-input">
                <button id="uploadBtn" onclick="uploadFile()" class="btn btn-primary" style="margin-top: 1rem; width: 100%;" disabled>
                    <i data-lucide="zap" class="btn-icon"></i>
                    Analyze Dataset
                </button>
                <div id="uploadStatus"></div>
            </div>

            <div class="card">
                <div class="card-header">
                    <i data-lucide="message-circle" class="card-icon"></i>
                    <h2 class="card-title">Query Interface</h2>
                </div>
                <textarea id="promptInput" class="prompt-input" placeholder="Ask questions about your data...

Examples:
• Show revenue trends over time
• Compare performance by category  
• Display top 10 products by sales
• Create a correlation analysis"></textarea>
                <button onclick="generateChart()" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">
                    <i data-lucide="sparkles" class="btn-icon"></i>
                    Generate Visualization
                </button>
                <div id="queryStatus"></div>
            </div>
        </div>

        <div id="analysisResults" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="brain" class="card-icon"></i>
                    <h2 class="card-title">AI Analysis Results</h2>
                </div>
                <div id="analysisContent"></div>
            </div>
        </div>

        <div id="autoChartsSection" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="bar-chart" class="card-icon"></i>
                    <h2 class="card-title">Automatic Dashboard</h2>
                </div>
                <p style="color: var(--gray-600); margin-bottom: 1.5rem;">AI-generated visualizations based on your data characteristics</p>
                <div id="autoCharts" class="charts-grid"></div>
            </div>
        </div>

        <div id="reasoningSection" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="lightbulb" class="card-icon"></i>
                    <h2 class="card-title">AI Reasoning Process</h2>
                </div>
                <div id="reasoningContent" class="reasoning-section"></div>
            </div>
        </div>

        <div id="chartSection" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="trending-up" class="card-icon"></i>
                    <h2 class="card-title">Custom Visualization</h2>
                </div>
                <div id="chartContainer" class="chart-container"></div>
            </div>
        </div>

        <div id="suggestionsSection" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="compass" class="card-icon"></i>
                    <h2 class="card-title">Suggested Explorations</h2>
                </div>
                <p style="color: var(--gray-600); margin-bottom: 1.5rem;">AI-generated questions tailored to your specific dataset</p>
                <div id="suggestions" class="suggestions-grid"></div>
            </div>
        </div>
    </div>

    <script>
        // Initialize Lucide icons
        lucide.createIcons();
        
        let currentDatasetId = null;
        let currentAnalysis = null;

        // Upload and analyze CSV file
        async function uploadFile() {
            const fileInput = document.getElementById('csvFile');
            const statusDiv = document.getElementById('uploadStatus');
            const uploadProgress = document.getElementById('uploadProgress');
            const uploadBtn = document.getElementById('uploadBtn');

            if (!fileInput.files || fileInput.files.length === 0) {
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="alert-circle"></i>Please select a CSV file first.</div>';
                lucide.createIcons();
                return;
            }

            // Show upload progress
            uploadProgress.classList.add('show');
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<div class="loading-spinner"></div>Processing...';
            statusDiv.innerHTML = '';

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                // Hide upload progress
                uploadProgress.classList.remove('show');

                if (response.ok) {
                    currentDatasetId = result.datasetId;
                    currentAnalysis = result.analysis;
                    
                    // Show success with prominent styling
                    statusDiv.innerHTML = '<div class="status success" style="font-size: 1rem; padding: 1.5rem; margin: 1.5rem 0; background: var(--success-50); border: 2px solid var(--success-500);"><i data-lucide="check-circle"></i><strong>Success!</strong> Dataset uploaded and analyzed successfully! Scroll down to see your insights.</div>';
                    lucide.createIcons();
                    
                    // Update button state
                    uploadBtn.disabled = false;
                    uploadBtn.innerHTML = '<i data-lucide="refresh-cw" class="btn-icon"></i>Upload New Dataset';
                    
                    // Show analysis results with animation
                    setTimeout(() => {
                        showAnalysisResults(result.analysis, result.schema, result.sampleRows);
                        
                        // Show auto-generated charts  
                        if (result.analysis.autoCharts && result.analysis.autoCharts.length > 0) {
                            setTimeout(() => showAutoCharts(result.analysis.autoCharts), 300);
                        }
                        
                        // Show suggested prompts
                        if (result.analysis.suggestedPrompts) {
                            setTimeout(() => showSuggestedPrompts(result.analysis.suggestedPrompts), 600);
                        }
                        
                        // Scroll to results
                        setTimeout(() => {
                            document.getElementById('analysisResults').scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }, 800);
                    }, 500);
                    
                } else {
                    statusDiv.innerHTML = '<div class="status error"><i data-lucide="x-circle"></i><strong>Upload Failed:</strong> ' + result.error + '</div>';
                    lucide.createIcons();
                    
                    // Reset button
                    uploadBtn.disabled = false;
                    uploadBtn.innerHTML = '<i data-lucide="zap" class="btn-icon"></i>Analyze Dataset';
                }
            } catch (error) {
                uploadProgress.classList.remove('show');
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="x-circle"></i><strong>Network Error:</strong> ' + error.message + '</div>';
                lucide.createIcons();
                
                // Reset button
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = '<i data-lucide="zap" class="btn-icon"></i>Analyze Dataset';
            }
        }
        
        // Handle file selection
        function handleFileSelect() {
            const fileInput = document.getElementById('csvFile');
            const uploadArea = document.getElementById('uploadArea');
            const fileSelected = document.getElementById('fileSelected');
            const fileName = document.getElementById('fileName');
            const uploadBtn = document.getElementById('uploadBtn');
            
            if (fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                uploadArea.classList.add('has-file');
                fileSelected.style.display = 'flex';
                fileName.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
                uploadBtn.disabled = false;
                lucide.createIcons();
            }
        }
        
        // Clear file selection
        function clearFile() {
            const fileInput = document.getElementById('csvFile');
            const uploadArea = document.getElementById('uploadArea');
            const fileSelected = document.getElementById('fileSelected');
            const uploadBtn = document.getElementById('uploadBtn');
            const statusDiv = document.getElementById('uploadStatus');
            
            fileInput.value = '';
            uploadArea.classList.remove('has-file');
            fileSelected.style.display = 'none';
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<i data-lucide="zap" class="btn-icon"></i>Analyze Dataset';
            statusDiv.innerHTML = '';
            
            // Hide all results sections
            document.getElementById('analysisResults').style.display = 'none';
            document.getElementById('autoChartsSection').style.display = 'none';
            document.getElementById('suggestionsSection').style.display = 'none';
            document.getElementById('reasoningSection').style.display = 'none';
            document.getElementById('chartSection').style.display = 'none';
            
            lucide.createIcons();
        }

        // Generate custom chart from user query
        async function generateChart() {
            const promptInput = document.getElementById('promptInput');
            const statusDiv = document.getElementById('queryStatus');

            if (!currentDatasetId) {
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="alert-circle"></i>Please upload a CSV file first.</div>';
                lucide.createIcons();
                return;
            }

            if (!promptInput.value.trim()) {
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="alert-circle"></i>Please enter a question about your data.</div>';
                lucide.createIcons();
                return;
            }

            statusDiv.innerHTML = '<div class="status info"><div class="loading-spinner"></div>AI is analyzing your request...</div>';

            try {
                const response = await fetch('/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        datasetId: currentDatasetId,
                        prompt: promptInput.value
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    statusDiv.innerHTML = '<div class="status success"><i data-lucide="check-circle"></i>AI analysis complete! Chart generated successfully!</div>';
                    lucide.createIcons();
                    
                    // Show AI reasoning if available
                    if (result.reasoning) {
                        showReasoning(result.reasoning);
                    }
                    
                    // Show the generated chart
                    showChart(result.chartSpec);
                    
                } else {
                    statusDiv.innerHTML = '<div class="status error"><i data-lucide="x-circle"></i>Query failed: ' + result.error + '</div>';
                    lucide.createIcons();
                }
            } catch (error) {
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="x-circle"></i>Query error: ' + error.message + '</div>';
                lucide.createIcons();
            }
        }

        // Display analysis results
        function showAnalysisResults(analysis, schema, sampleRows) {
            const analysisSection = document.getElementById('analysisResults');
            const analysisContent = document.getElementById('analysisContent');
            
            let metricsHtml = '<div class="metrics-grid">';
            metricsHtml += '<div class="metric-card"><div class="metric-value">' + schema.length + '</div><div class="metric-label">Total Columns</div></div>';
            metricsHtml += '<div class="metric-card"><div class="metric-value">' + sampleRows.length + '</div><div class="metric-label">Sample Rows</div></div>';
            metricsHtml += '<div class="metric-card"><div class="metric-value">' + analysis.dataQuality.completeness + '%</div><div class="metric-label">Data Quality</div></div>';
            metricsHtml += '<div class="metric-card"><div class="metric-value">' + schema.filter(col => col.type === 'number').length + '</div><div class="metric-label">Numeric Columns</div></div>';
            metricsHtml += '</div>';
            
            let contentHtml = metricsHtml;
            contentHtml += '<h3 class="section-title"><i data-lucide="file-text"></i>Dataset Summary</h3>';
            contentHtml += '<p style="color: var(--gray-700); line-height: 1.6; margin-bottom: 1.5rem;">' + analysis.summary + '</p>';
            
            contentHtml += '<h3 class="section-title"><i data-lucide="eye"></i>Key Insights</h3>';
            contentHtml += '<ul class="insights-list">';
            analysis.insights.forEach(insight => {
                contentHtml += '<li>' + insight + '</li>';
            });
            contentHtml += '</ul>';
            
            if (analysis.businessInsights) {
                contentHtml += '<h3 class="section-title"><i data-lucide="target"></i>Business Insights</h3>';
                contentHtml += '<ul class="insights-list">';
                analysis.businessInsights.forEach(insight => {
                    contentHtml += '<li>' + insight + '</li>';
                });
                contentHtml += '</ul>';
            }
            
            if (analysis.dataQuality.issues.length > 0) {
                contentHtml += '<h3 class="section-title"><i data-lucide="alert-triangle"></i>Data Quality Issues</h3>';
                contentHtml += '<ul class="insights-list">';
                analysis.dataQuality.issues.forEach(issue => {
                    contentHtml += '<li>' + issue + '</li>';
                });
                contentHtml += '</ul>';
            }
            
            analysisContent.innerHTML = contentHtml;
            analysisSection.style.display = 'block';
            lucide.createIcons();
        }

        // Display auto-generated charts
        function showAutoCharts(autoCharts) {
            const autoChartsSection = document.getElementById('autoChartsSection');
            const autoChartsContainer = document.getElementById('autoCharts');
            
            autoChartsContainer.innerHTML = '';
            
            autoCharts.forEach((chart, index) => {
                const chartDiv = document.createElement('div');
                chartDiv.className = 'chart-container';
                chartDiv.innerHTML = '<h3 class="chart-title">' + chart.title + '</h3><p class="chart-description">' + chart.description + '</p><div id="autoChart' + index + '" style="height: 400px;"></div>';
                autoChartsContainer.appendChild(chartDiv);
                
                // Render the chart
                setTimeout(() => {
                    try {
                        Plotly.newPlot('autoChart' + index, chart.chartSpec.data, {
                            ...chart.chartSpec.layout,
                            font: { family: 'Inter, sans-serif', size: 12, color: '#1e293b' },
                            plot_bgcolor: 'rgba(255, 255, 255, 0.8)',
                            paper_bgcolor: 'rgba(255, 255, 255, 0.8)'
                        }, {
                            responsive: true,
                            displayModeBar: true,
                            displaylogo: false,
                            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
                        });
                    } catch (error) {
                        console.error('Auto chart rendering error:', error);
                        document.getElementById('autoChart' + index).innerHTML = '<div style="text-align: center; color: var(--gray-500); padding: 40px;"><i data-lucide="alert-circle" style="width: 2rem; height: 2rem; margin-bottom: 1rem;"></i><p>Chart rendering failed</p><small>Chart type: ' + (chart.chartSpec.data[0]?.type || 'unknown') + '</small></div>';
                        lucide.createIcons();
                    }
                }, 100 * index);
            });
            
            autoChartsSection.style.display = 'block';
        }

        // Display AI reasoning process
        function showReasoning(reasoning) {
            const reasoningSection = document.getElementById('reasoningSection');
            const reasoningContent = document.getElementById('reasoningContent');
            
            let contentHtml = '<div class="reasoning-title"><i data-lucide="brain"></i>AI Analysis Process</div>';
            contentHtml += '<div class="reasoning-content">';
            contentHtml += '<p style="margin-bottom: 1rem;">' + reasoning.reasoning + '</p>';
            contentHtml += '<h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--gray-800);">Chart Selection</h4>';
            contentHtml += '<p style="margin-bottom: 0.5rem;"><strong>Recommended Chart Type:</strong> ' + reasoning.recommendedChartType + '</p>';
            contentHtml += '<p style="margin-bottom: 0.5rem;"><strong>Primary Variables:</strong> ' + reasoning.primaryVariables.join(', ') + '</p>';
            contentHtml += '<p style="margin-bottom: 1rem;"><strong>Expected Outcome:</strong> ' + reasoning.expectedOutcome + '</p>';
            
            if (reasoning.considerations) {
                contentHtml += '<h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--gray-800);">Key Considerations</h4>';
                contentHtml += '<ul style="list-style: disc; margin-left: 1.5rem;">';
                reasoning.considerations.forEach(consideration => {
                    contentHtml += '<li style="margin-bottom: 0.25rem;">' + consideration + '</li>';
                });
                contentHtml += '</ul>';
            }
            
            contentHtml += '</div>';
            reasoningContent.innerHTML = contentHtml;
            reasoningSection.style.display = 'block';
            lucide.createIcons();
        }

        // Display generated chart
        function showChart(chartSpec) {
            const chartSection = document.getElementById('chartSection');
            const chartContainer = document.getElementById('chartContainer');
            
            try {
                // Clear any existing chart
                chartContainer.innerHTML = '<div id="customChart" style="height: 500px;"></div>';
                
                // Create new chart with professional styling
                Plotly.newPlot('customChart', chartSpec.data, {
                    ...chartSpec.layout,
                    font: { family: 'Inter, sans-serif', size: 12, color: '#1e293b' },
                    plot_bgcolor: 'rgba(255, 255, 255, 0.8)',
                    paper_bgcolor: 'rgba(255, 255, 255, 0.8)',
                    margin: { l: 60, r: 40, t: 60, b: 60 }
                }, {
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d']
                });
                
                chartSection.style.display = 'block';
                
                // Scroll to chart
                chartSection.scrollIntoView({ behavior: 'smooth' });
                
            } catch (plotError) {
                console.error('Plotly error:', plotError);
                chartContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--gray-500); background: var(--gray-50); border-radius: var(--border-radius-lg);"><i data-lucide="alert-circle" style="width: 2rem; height: 2rem; margin-bottom: 1rem;"></i><h3>Chart Rendering Failed</h3><p>The AI generated a chart specification, but it could not be rendered properly.</p><details style="margin-top: 20px; text-align: left;"><summary style="cursor: pointer; font-weight: 600; color: var(--primary-600);">View Raw Chart Specification</summary><pre style="background: white; padding: 15px; border-radius: 8px; overflow: auto; margin-top: 10px; font-size: 12px; border: 1px solid var(--gray-200);">' + JSON.stringify(chartSpec, null, 2) + '</pre></details></div>';
                chartSection.style.display = 'block';
                lucide.createIcons();
            }
        }

        // Display suggested prompts
        function showSuggestedPrompts(suggestedPrompts) {
            const suggestionsSection = document.getElementById('suggestionsSection');
            const suggestionsContainer = document.getElementById('suggestions');
            
            let contentHtml = '';
            suggestedPrompts.forEach(prompt => {
                contentHtml += '<div class="suggestion-card" onclick="setQuery(\\'' + prompt.prompt + '\\')"><div class="suggestion-title">' + prompt.prompt + '</div><div class="suggestion-description">' + prompt.description + '</div><span class="suggestion-category">' + prompt.category + '</span></div>';
            });
            
            suggestionsContainer.innerHTML = contentHtml;
            suggestionsSection.style.display = 'block';
        }

        // Set query in prompt input
        function setQuery(query) {
            document.getElementById('promptInput').value = query;
            document.getElementById('promptInput').focus();
        }

        // Add keyboard shortcuts
        document.getElementById('promptInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                generateChart();
            }
        });

        // Add file selection event listener
        document.getElementById('csvFile').addEventListener('change', handleFileSelect);

        // Add file drag and drop functionality
        const fileInput = document.getElementById('csvFile');
        const uploadArea = document.querySelector('.file-upload-area');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        uploadArea.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight() {
            uploadArea.classList.add('dragover');
        }

        function unhighlight() {
            uploadArea.classList.remove('dragover');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0 && files[0].name.endsWith('.csv')) {
                fileInput.files = files;
                handleFileSelect(); // Show file selected state
            } else {
                const statusDiv = document.getElementById('uploadStatus');
                statusDiv.innerHTML = '<div class="status warning"><i data-lucide="alert-triangle"></i>Please select a valid CSV file.</div>';
                lucide.createIcons();
            }
        }
    </script>
</body>
</html>`;
}