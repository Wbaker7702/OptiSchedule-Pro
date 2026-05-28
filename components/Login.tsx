
import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Activity, ShieldAlert } from 'lucide-react';
import { APP_VERSION } from '../constants';
import { validateEmail, validatePassword, sanitizeInput } from '../validators';
import { getCsrfHeaders } from '../services/csrf';

interface LoginProps {
  onLogin: () => void;
}

/** ISSUE #2 FIX: Real backend authentication with validation */
const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    
    // ISSUE #8 FIX: Validate email format
    if (!validateEmail(email)) {
      setError('Invalid email format. Please enter a valid corporate email address.');
      return;
    }
    
    // ISSUE #8 FIX: Validate password meets security requirements
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(`Password requirements not met: ${passwordValidation.errors[0]}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // ISSUE #2 & #4 FIX: Call backend authentication endpoint
      // Backend validates credentials and returns HTTP-only cookie with session token
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...await getCsrfHeaders()
        },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({
          email: sanitizeInput(email),
          password: password // Password sent to backend for bcrypt comparison
        })
      });
      
      if (response.status === 429) {
        // ISSUE #5 FIX: Handle rate limiting (brute force protection)
        setError('Too many login attempts. Please try again later.');
        setIsLoading(false);
        return;
      }
      
      if (response.status === 401) {
        setError('Invalid credentials. Please check your email and password.');
        setIsLoading(false);
        return;
      }
      
      if (response.status === 403) {
        setError('Your account is locked or disabled. Contact support.');
        setIsLoading(false);
        return;
      }
      
      if (!response.ok) {
        // ISSUE #9 FIX: Specific error messages for debugging
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(`Authentication failed: ${errorData.message || 'Please try again'}`);
        setIsLoading(false);
        return;
      }
      
      // Authentication successful - session cookie now set by backend
      setIsLoading(false);
      onLogin();
    } catch (error) {
      // ISSUE #9 FIX: Log security errors but don't expose details to user
      console.error('[SECURITY] Login error:', error);
      setError('Authentication service unavailable. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Security Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-800 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-700 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-slate-600 rounded-full opacity-30"></div>
      </div>

      <div className="bg-slate-900 w-full max-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden relative z-10 max-w-md">
        <div className="bg-slate-900 p-8 text-center relative border-b border-slate-800">
          <div className="absolute top-4 right-4 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
             <ShieldCheck className="w-3 h-3 text-blue-500" />
             <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Defender Active</span>
          </div>
          <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-2xl mb-6 shadow-xl border border-slate-700">
            <Activity className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-xl font-black text-white mb-2 tracking-[0.1em] uppercase">Microsoft Defender portal</h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Security Operations v3.1</p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Authentication Required</h2>
            <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-widest">Microsoft Defender security enforcement</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-400 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Corporate ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="user@contoso.com"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Policy Clearance Token</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>
              <p className="text-[9px] text-slate-500 mt-2">Min 12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char</p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={`w-full flex items-center justify-center py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/10 text-xs font-black uppercase tracking-wider transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authorizing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Initialize Access <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 font-mono font-bold uppercase tracking-widest">
              <ShieldAlert className="w-3 h-3" />
              <span>Microsoft Defender security standard • {APP_VERSION}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
