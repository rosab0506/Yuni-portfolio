'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';

/**
 * Auth Callback Page
 * 
 * Handles OAuth callback redirects from Supabase Auth.
 * Supabase automatically handles session via onAuthStateChange in AuthContext,
 * this page just provides visual feedback during the process.
 */
export function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL params
        const error = searchParams?.get('error') ?? null;
        const errorDescription = searchParams?.get('error_description') ?? null;

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Authentication failed. Please try again.');
          return;
        }

        // If Supabase is configured, it will automatically handle the session
        // via the onAuthStateChange listener in AuthContext
        if (supabase) {
          // Wait a moment for Supabase to process the callback
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Check if session was established
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            setStatus('error');
            setMessage(sessionError.message || 'Failed to verify session.');
            return;
          }
          
          if (session) {
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            
            setTimeout(() => {
              router.push('/mhe-control-center/dashboard');
            }, 1500);
          } else {
            // No session found - might still be processing
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            
            if (retrySession) {
              setStatus('success');
              setMessage('Authentication successful! Redirecting...');
              setTimeout(() => {
                router.push('/mhe-control-center/dashboard');
              }, 1500);
            } else {
              setStatus('error');
              setMessage('No session found. Please try logging in again.');
            }
          }
        } else {
          // Supabase not configured - dev mode fallback
          if (process.env.NODE_ENV === 'development') {
            setStatus('error');
            setMessage('Supabase is not configured. Please add environment variables.');
          } else {
            setStatus('error');
            setMessage('Authentication service not available.');
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && status === 'loading') {
      setStatus('success');
      setMessage('Authentication successful! Redirecting...');
      setTimeout(() => {
        router.push('/mhe-control-center/dashboard');
      }, 1500);
    }
  }, [isAuthenticated, isLoading, router, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1320] via-[#0B1320] to-[#0B1320]/80 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C77DFF]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9D4EDD]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="rounded-3xl bg-[#0B1320]/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#C77DFF]/20 border border-[#C77DFF]/30">
                <Loader2 className="w-10 h-10 text-[#C77DFF] animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            )}
            {status === 'error' && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border border-red-500/30 animate-scale-in">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Welcome Back!'}
            {status === 'error' && 'Authentication Failed'}
          </h1>

          {/* Message */}
          <p className="text-white/60 mb-6">{message}</p>

          {/* Progress/Actions */}
          {status === 'loading' && (
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] animate-progress" />
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 text-[#C77DFF]">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span className="text-sm font-medium">Redirecting to dashboard...</span>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/mhe-control-center/login')}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] text-white font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/30 hover:shadow-xl hover:shadow-[#C77DFF]/40 transition-all duration-300"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-white/60 font-medium hover:text-white transition-colors"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-white/40 text-sm mt-6">
          Secure authentication powered by Supabase
        </p>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
