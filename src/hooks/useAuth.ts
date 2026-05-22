/**
 * Auth Hook - Access authentication state and methods
 * 
 * Provides access to Supabase auth context for admin CMS.
 * 
 * Usage:
 * ```typescript
 * const { isAuthenticated, isLoading, signIn, signOut } = useAuth();
 * 
 * // Handle login
 * const handleLogin = async (email: string, password: string) => {
 *   const { success, error } = await signIn(email, password);
 *   if (!success) console.error(error);
 * };
 * 
 * // Check loading state during auth operations
 * if (isLoading) return <Spinner />;
 * 
 * // Check authentication
 * if (!isAuthenticated) return <Navigate to="/admin/login" />;
 * ```
 */

'use client';

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

/**
 * Helper hook to check if user is authenticated.
 * Returns only the authentication status.
 */
export function useIsAuthenticated() {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
}

/**
 * Helper hook to get user role.
 */
export function useUserRole() {
  const { role, isAuthenticated } = useAuth();
  return { role, isAuthenticated };
}
