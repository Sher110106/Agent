import { Env, AuthCredentials, AuthSession, LoginRequest, LoginResponse } from './types';
import { generateUUID } from './utils';

// Hardcoded credentials as requested
const VALID_CREDENTIALS: AuthCredentials = {
  username: 'Plaksha-HR',
  password: 'AgentHR1'
};

// Session expiry time (24 hours)
const SESSION_EXPIRY_HOURS = 24;

/**
 * Authenticate user with username and password
 */
export async function authenticateUser(loginRequest: LoginRequest): Promise<LoginResponse> {
  const { username, password } = loginRequest;

  // Check credentials
  if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
    const sessionId = generateUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (SESSION_EXPIRY_HOURS * 60 * 60 * 1000));

    return {
      success: true,
      sessionId
    };
  }

  return {
    success: false,
    error: 'Invalid username or password'
  };
}

/**
 * Create and store a new session
 */
export async function createSession(env: Env, username: string): Promise<string> {
  const sessionId = generateUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (SESSION_EXPIRY_HOURS * 60 * 60 * 1000));

  const session: AuthSession = {
    sessionId,
    username,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };

  // Store session in KV with TTL
  await env.KV.put(`session:${sessionId}`, JSON.stringify(session), {
    expirationTtl: SESSION_EXPIRY_HOURS * 60 * 60 // 24 hours in seconds
  });

  return sessionId;
}

/**
 * Validate a session
 */
export async function validateSession(env: Env, sessionId: string): Promise<AuthSession | null> {
  if (!sessionId) {
    return null;
  }

  try {
    const sessionData = await env.KV.get(`session:${sessionId}`);
    if (!sessionData) {
      return null;
    }

    const session: AuthSession = JSON.parse(sessionData);
    
    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    if (now > expiresAt) {
      // Session expired, clean it up
      await env.KV.delete(`session:${sessionId}`);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

/**
 * Extract session ID from request cookies or headers
 */
export function extractSessionId(request: Request): string | null {
  // Try to get from Authorization header first
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try to get from cookies
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'sessionId') {
        return value;
      }
    }
  }

  return null;
}

/**
 * Check if request is authenticated
 */
export async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  const sessionId = extractSessionId(request);
  if (!sessionId) {
    return false;
  }

  const session = await validateSession(env, sessionId);
  return session !== null;
}

/**
 * Handle login request
 */
export async function handleLogin(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as LoginRequest;
    const authResult = await authenticateUser(body);

    if (authResult.success && authResult.sessionId) {
      // Create session
      const sessionId = await createSession(env, body.username);

      return new Response(JSON.stringify({
        success: true,
        sessionId
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_EXPIRY_HOURS * 60 * 60}; Path=/`
        }
      });
    }

    return new Response(JSON.stringify(authResult), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid request format'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * Handle logout request
 */
export async function handleLogout(request: Request, env: Env): Promise<Response> {
  const sessionId = extractSessionId(request);
  
  if (sessionId) {
    // Delete session from KV
    await env.KV.delete(`session:${sessionId}`);
  }

  return new Response(JSON.stringify({
    success: true,
    message: 'Logged out successfully'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Set-Cookie': 'sessionId=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
    }
  });
}

/**
 * Generate login page HTML
 */
export function getLoginPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Business Analysis HR Agent</title>
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
            
            --error-50: #fef2f2;
            --error-500: #ef4444;
            
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            background: linear-gradient(135deg, var(--primary-50) 0%, var(--gray-100) 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-900);
        }
        
        .login-container {
            background: white;
            border-radius: 1rem;
            box-shadow: var(--shadow-lg);
            padding: 2rem;
            width: 100%;
            max-width: 400px;
            margin: 1rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-bottom: 2rem;
        }
        
        .logo-icon {
            width: 2.5rem;
            height: 2.5rem;
            background: var(--primary-500);
            border-radius: 0.75rem;
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
            text-align: center;
            color: var(--gray-600);
            margin-bottom: 2rem;
            font-size: 0.875rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--gray-700);
            font-size: 0.875rem;
        }
        
        .form-input {
            width: 100%;
            padding: 0.875rem 1rem;
            border: 1px solid var(--gray-300);
            border-radius: 0.5rem;
            font-family: inherit;
            font-size: 0.875rem;
            transition: all 0.2s ease-in-out;
            background: white;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--primary-500);
            box-shadow: 0 0 0 3px var(--primary-100);
        }
        
        .btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.875rem 1rem;
            border: none;
            border-radius: 0.5rem;
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
        
        .alert {
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .alert-error {
            background: var(--error-50);
            color: var(--error-500);
            border: 1px solid #fecaca;
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
        
        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="login-container fade-in">
        <div class="logo">
            <div class="logo-icon">
                <i data-lucide="bar-chart-3"></i>
            </div>
            <h1>Business Analysis HR Agent</h1>
        </div>
        <p class="subtitle">Please sign in to access the analytics platform</p>
        
        <form id="loginForm">
            <div id="errorMessage" style="display: none;"></div>
            
            <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <input type="text" id="username" name="username" class="form-input" required autocomplete="username">
            </div>
            
            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" name="password" class="form-input" required autocomplete="current-password">
            </div>
            
            <button type="submit" id="loginBtn" class="btn btn-primary">
                <i data-lucide="log-in"></i>
                Sign In
            </button>
        </form>
    </div>

    <script>
        // Initialize Lucide icons
        lucide.createIcons();
        
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');
        const loginBtn = document.getElementById('loginBtn');
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Show loading state
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<div class="loading-spinner"></div>Signing in...';
            errorMessage.style.display = 'none';
            
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Store session ID in localStorage as backup
                    if (result.sessionId) {
                        localStorage.setItem('sessionId', result.sessionId);
                    }
                    
                    // Redirect to main application
                    window.location.href = '/';
                } else {
                    // Show error
                    errorMessage.innerHTML = '<div class="alert alert-error"><i data-lucide="alert-circle"></i>' + (result.error || 'Login failed') + '</div>';
                    errorMessage.style.display = 'block';
                    lucide.createIcons();
                    
                    // Reset form
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<i data-lucide="log-in"></i>Sign In';
                    lucide.createIcons();
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.innerHTML = '<div class="alert alert-error"><i data-lucide="alert-circle"></i>Network error. Please try again.</div>';
                errorMessage.style.display = 'block';
                lucide.createIcons();
                
                // Reset form
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i data-lucide="log-in"></i>Sign In';
                lucide.createIcons();
            }
        });
        
        // Handle Enter key press
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    </script>
</body>
</html>`;
} 