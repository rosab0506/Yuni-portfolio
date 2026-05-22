'use client';

/**
 * Authentication Context
 * 
 * Provides secure Supabase authentication for admin-only CMS.
 * 
 * SECURITY NOTES:
 * - This is a SINGLE-ADMIN system
 * - No public signup allowed
 * - Password changes done ONLY via Supabase Dashboard
 * - Session persists across browser refreshes
 * - Works in both development and production
 */

import type { ReactNode } from 'react';
import type { Session, User, AuthError } from '@supabase/supabase-js';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type Role = 'admin' | 'user';

export type AuthState = {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** User's role (admin for authenticated users) */
  role: Role | null;
  /** Loading state during session checks */
  isLoading: boolean;
  /** Error from last auth operation */
  error: string | null;
  /** Current user email (for display purposes only) */
  userEmail: string | null;
};

export type AuthContextValue = AuthState & {
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Clear any auth errors */
  clearError: () => void;
};

// ============================================================================
// Context
// ============================================================================

export const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    isLoading: true, // Start loading until we check session
    error: null,
    userEmail: null,
  });

  /**
   * Update auth state from Supabase session.
   * All authenticated users are treated as admin (single-admin system).
   */
  const updateAuthState = useCallback((session: Session | null) => {
    if (session?.user) {
      setState({
        isAuthenticated: true,
        role: 'admin', // Single admin system - all authenticated users are admin
        isLoading: false,
        error: null,
        userEmail: session.user.email ?? null,
      });
    } else {
      setState({
        isAuthenticated: false,
        role: null,
        isLoading: false,
        error: null,
        userEmail: null,
      });
    }
  }, []);

  /**
   * Sign in with email and password.
   * Uses Supabase Auth - no mock fallback in production.
   */
  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      // Development fallback when Supabase is not configured
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Auth] Supabase not configured - using mock auth (DEV only)');
        setState({
          isAuthenticated: true,
          role: 'admin',
          isLoading: false,
          error: null,
          userEmail: email,
        });
        return { success: true };
      }
      return { success: false, error: 'Authentication service not configured' };
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const errorMessage = getAuthErrorMessage(error);
        setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        return { success: false, error: errorMessage };
      }

      if (data.session) {
        updateAuthState(data.session);
        return { success: true };
      }

      setState(prev => ({ ...prev, isLoading: false, error: 'No session returned' }));
      return { success: false, error: 'Authentication failed' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [updateAuthState]);

  /**
   * Sign out the current user.
   */
  const signOut = useCallback(async () => {
    if (!supabase) {
      // Development fallback
      setState({
        isAuthenticated: false,
        role: null,
        isLoading: false,
        error: null,
        userEmail: null,
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[Auth] Sign out error:', error.message);
    }
    
    // Always clear state even if signOut fails
    setState({
      isAuthenticated: false,
      role: null,
      isLoading: false,
      error: null,
      userEmail: null,
    });
  }, []);

  /**
   * Clear authentication errors.
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Initialize auth state and listen for changes.
   * This ensures admin stays logged in across page refreshes.
   */
  useEffect(() => {
    // Store reference to supabase client for use in async functions
    const client = supabase;
    
    if (!client) {
      // No Supabase configured - mark as not loading
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Check current session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await client.auth.getSession();
        
        if (error) {
          console.error('[Auth] Error getting session:', error.message);
          setState(prev => ({ ...prev, isLoading: false, error: error.message }));
          return;
        }
        
        updateAuthState(session);
      } catch (err) {
        console.error('[Auth] Unexpected error:', err);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, session) => {
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            updateAuthState(session);
            break;
          case 'SIGNED_OUT':
            updateAuthState(null);
            break;
          case 'USER_UPDATED':
            updateAuthState(session);
            break;
          default:
            // For other events, just update if session changed
            updateAuthState(session);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signIn, signOut, clearError }),
    [state, signIn, signOut, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Convert Supabase auth errors to user-friendly messages.
 * Does not expose sensitive details.
 */
function getAuthErrorMessage(error: AuthError): string {
  // Map common error codes to user-friendly messages
  const errorMap: Record<string, string> = {
    'invalid_credentials': 'Invalid email or password',
    'invalid_grant': 'Invalid email or password',
    'user_not_found': 'Invalid email or password', // Don't reveal if user exists
    'email_not_confirmed': 'Please verify your email address',
    'too_many_requests': 'Too many attempts. Please try again later',
    'user_banned': 'Account has been disabled',
  };

  // Check for known error messages
  const message = error.message?.toLowerCase() ?? '';
  
  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password';
  }
  
  if (message.includes('email not confirmed')) {
    return 'Please verify your email address';
  }

  // Return mapped error or generic message
  return errorMap[error.message] ?? 'Authentication failed. Please try again.';
}

