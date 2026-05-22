/**
 * Auth Service Layer - Supabase Auth Ready
 * 
 * This service provides authentication operations.
 * Currently uses mock localStorage auth for DEV, structured for Supabase Auth.
 * 
 * TODO [SUPABASE AUTH]: Replace with Supabase Auth implementation
 */

import type { AuthUser, AuthSession, ApiResponse, ApiError } from '../types/database.types';

// ============================================================================
// Auth Types
// ============================================================================

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthServiceConfig {
  /** Storage key for mock auth state */
  storageKey?: string;
  /** Enable debug logging */
  debug?: boolean;
}

export interface AuthService {
  // Session Management
  getSession: () => Promise<ApiResponse<AuthSession>>;
  refreshSession: () => Promise<ApiResponse<AuthSession>>;
  
  // Authentication
  signInWithPassword: (credentials: AuthCredentials) => Promise<ApiResponse<AuthSession>>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<ApiResponse<void>>;
  signOut: () => Promise<ApiResponse<void>>;
  
  // User Management
  getUser: () => Promise<ApiResponse<AuthUser>>;
  
  // Event Listeners
  onAuthStateChange: (callback: (session: AuthSession | null) => void) => () => void;
}

// ============================================================================
// Mock Implementation (DEV ONLY)
// ============================================================================

const DEFAULT_STORAGE_KEY = 'portfolio.mockAuth';

/**
 * Creates a mock auth service for development.
 * 
 * TODO [SUPABASE AUTH]: This entire implementation will be replaced with:
 * - Supabase Auth client methods
 * - OAuth providers (Google, GitHub)
 * - Real JWT session management
 * - Row Level Security integration
 * 
 * IMPORTANT: This mock service accepts ANY credentials in DEV mode.
 * Production will use Supabase Auth with proper validation.
 */
export function createMockAuthService(config: AuthServiceConfig = {}): AuthService {
  const { storageKey = DEFAULT_STORAGE_KEY, debug = false } = config;
  
  const listeners = new Set<(session: AuthSession | null) => void>();
  
  const log = (message: string, data?: unknown) => {
    if (debug) {
      console.log(`[AuthService] ${message}`, data ?? '');
    }
  };

  const createMockSession = (email: string): AuthSession => ({
    user: {
      id: 'mock-user-id',
      email,
      role: 'admin',
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
    },
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600000, // 1 hour
  });

  const notifyListeners = (session: AuthSession | null) => {
    listeners.forEach(callback => callback(session));
  };

  const getStoredSession = (): AuthSession | null => {
    // Only use mock auth in development
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }
    
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      
      const parsed = JSON.parse(raw);
      if (parsed.isAuthenticated && parsed.role) {
        // Convert legacy format to new session format
        return {
          user: {
            id: 'mock-user-id',
            email: 'admin@example.com',
            role: parsed.role,
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
          },
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_at: Date.now() + 3600000,
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const setStoredSession = (session: AuthSession | null) => {
    if (session) {
      // Store in legacy format for compatibility
      localStorage.setItem(storageKey, JSON.stringify({
        isAuthenticated: true,
        role: session.user?.role ?? 'admin',
      }));
    } else {
      localStorage.removeItem(storageKey);
    }
    notifyListeners(session);
  };

  return {
    // ========================================================================
    // Session Management
    // ========================================================================

    getSession: async () => {
      log('getSession');
      const session = getStoredSession();
      return { data: session ?? { user: null, access_token: null, refresh_token: null, expires_at: null }, error: null };
    },

    refreshSession: async () => {
      log('refreshSession');
      const session = getStoredSession();
      if (session) {
        // Extend expiry
        session.expires_at = Date.now() + 3600000;
        setStoredSession(session);
      }
      return { data: session ?? { user: null, access_token: null, refresh_token: null, expires_at: null }, error: null };
    },

    // ========================================================================
    // Authentication
    // ========================================================================

    signInWithPassword: async (credentials: AuthCredentials) => {
      log('signInWithPassword', { email: credentials.email });
      
      // In DEV mode, accept any credentials
      if (process.env.NODE_ENV !== 'development') {
        return {
          data: null,
          error: { message: 'Mock auth only available in development', code: 'AUTH_ERROR' } as ApiError,
        };
      }

      const session = createMockSession(credentials.email);
      setStoredSession(session);
      
      return { data: session, error: null };
    },

    signInWithOAuth: async (provider: 'google' | 'github') => {
      log('signInWithOAuth', { provider });
      
      /**
       * TODO [SUPABASE AUTH]: Implement OAuth with Supabase
       * 
       * ```typescript
       * const { data, error } = await supabase.auth.signInWithOAuth({
       *   provider,
       *   options: {
       *     redirectTo: `${window.location.origin}/mhe-control-center/auth/callback`,
       *   },
       * });
       * ```
       */
      
      // Mock: Just log and return success
      console.log(`[MOCK] Would redirect to ${provider} OAuth`);
      return { data: undefined, error: null };
    },

    signOut: async () => {
      log('signOut');
      setStoredSession(null);
      return { data: undefined, error: null };
    },

    // ========================================================================
    // User Management
    // ========================================================================

    getUser: async () => {
      log('getUser');
      const session = getStoredSession();
      return { 
        data: session?.user ?? null, 
        error: session ? null : { message: 'No authenticated user', code: 'NOT_AUTHENTICATED' } as ApiError,
      };
    },

    // ========================================================================
    // Event Listeners
    // ========================================================================

    onAuthStateChange: (callback: (session: AuthSession | null) => void) => {
      listeners.add(callback);
      
      // Listen to storage events for cross-tab sync
      const handleStorage = (event: StorageEvent) => {
        if (event.key === storageKey) {
          callback(getStoredSession());
        }
      };
      window.addEventListener('storage', handleStorage);
      
      // Return cleanup function
      return () => {
        listeners.delete(callback);
        window.removeEventListener('storage', handleStorage);
      };
    },
  };
}

// ============================================================================
// Singleton Instance
// ============================================================================

let authServiceInstance: AuthService | null = null;

/**
 * Get the auth service singleton.
 * Uses mock service in DEV, will use Supabase in production.
 * 
 * TODO [SUPABASE AUTH]: Replace with Supabase-backed service
 */
export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = createMockAuthService({ debug: process.env.NODE_ENV === 'development' });
  }
  return authServiceInstance;
}

// ============================================================================
// TODO [SUPABASE AUTH]: Supabase Implementation Placeholder
// ============================================================================

/**
 * Creates a Supabase Auth service.
 * 
 * TODO [SUPABASE AUTH]: Implement when Supabase credentials are provided
 * 
 * Example implementation:
 * ```typescript
 * import { createClient, SupabaseClient } from '@supabase/supabase-js';
 * 
 * export function createSupabaseAuthService(supabase: SupabaseClient): AuthService {
 *   return {
 *     getSession: async () => {
 *       const { data: { session }, error } = await supabase.auth.getSession();
 *       return { data: session, error };
 *     },
 *     signInWithPassword: async (credentials) => {
 *       const { data, error } = await supabase.auth.signInWithPassword(credentials);
 *       return { data: data.session, error };
 *     },
 *     signInWithOAuth: async (provider) => {
 *       const { error } = await supabase.auth.signInWithOAuth({
 *         provider,
 *         options: { redirectTo: `${window.location.origin}/mhe-control-center/auth/callback` }
 *       });
 *       return { data: undefined, error };
 *     },
 *     signOut: async () => {
 *       const { error } = await supabase.auth.signOut();
 *       return { data: undefined, error };
 *     },
 *     getUser: async () => {
 *       const { data: { user }, error } = await supabase.auth.getUser();
 *       return { data: user, error };
 *     },
 *     onAuthStateChange: (callback) => {
 *       const { data: { subscription } } = supabase.auth.onAuthStateChange(
 *         (event, session) => callback(session)
 *       );
 *       return () => subscription.unsubscribe();
 *     },
 *   };
 * }
 * ```
 */
