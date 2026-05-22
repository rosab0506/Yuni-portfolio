/**
 * CMS Hook - Access CMS data and operations
 * 
 * Provides access to CMS context with loading and error states.
 * 
 * Usage:
 * ```typescript
 * const { data, loadingState, errorState, updateSingleton } = useCms();
 * 
 * // Check loading state
 * if (loadingState.isMutating) {
 *   return <Spinner />;
 * }
 * 
 * // Check for errors
 * if (errorState.error) {
 *   return <ErrorMessage message={errorState.error} />;
 * }
 * ```
 */

'use client';

import { useContext } from 'react';
import { CmsContext } from '../context/CmsContext';

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error('useCms must be used within CmsProvider');
  }
  return ctx;
}

/**
 * Helper hook to get just the CMS data without operations.
 * Useful for components that only read data.
 */
export function useCmsData() {
  const { data } = useCms();
  return data;
}

/**
 * Helper hook to get loading state.
 * Useful for showing loading indicators.
 */
export function useCmsLoading() {
  const { loadingState } = useCms();
  return loadingState;
}

/**
 * Helper hook to get error state.
 * Useful for showing error messages.
 */
export function useCmsError() {
  const { errorState, clearError } = useCms();
  return { ...errorState, clearError };
}
