'use client';

/**
 * CMS Context - Central Data Store
 * 
 * Provides CMS data and operations throughout the app.
 * Uses Supabase for data storage with mock fallback in development.
 */

import type { ReactNode } from 'react';
import React, { createContext, useMemo, useState, useCallback, useEffect } from 'react';
import cmsMock from '../data/mock/cms.mock.json';
import { createCmsRepository } from '../services/cmsRepository';
import { isSupabaseConfigured } from '../lib/supabase';
import * as supabaseCms from '../services/supabaseCms';

// ============================================================================
// Types
// ============================================================================

export type CmsData = typeof cmsMock;
export type SingletonKey = keyof CmsData['singletons'];
export type CollectionKey = keyof CmsData['collections'];
export type CollectionItem = Record<string, unknown> & { id: string };

/**
 * Loading state for async operations
 */
export type CmsLoadingState = {
  /** Initial data loading */
  isLoading: boolean;
  /** Specific operation in progress */
  isMutating: boolean;
  /** Which operation is in progress */
  mutatingOperation: string | null;
};

/**
 * Error state for operations
 */
export type CmsErrorState = {
  /** Last error message */
  error: string | null;
  /** Which operation caused the error */
  errorOperation: string | null;
};

type CmsContextValue = {
  data: CmsData;
  loadingState: CmsLoadingState;
  errorState: CmsErrorState;
  /** Clear the current error */
  clearError: () => void;
  // Singleton operations
  updateSingleton: (key: SingletonKey, values: Record<string, unknown>) => void;
  // Collection operations
  createItem: (key: CollectionKey, values: Record<string, unknown>) => void;
  updateItem: (key: CollectionKey, id: string, values: Record<string, unknown>) => void;
  deleteItem: (key: CollectionKey, id: string) => void;
  replaceCollection: (key: CollectionKey, items: CollectionItem[]) => void;
  // Contact messages
  addContactMessage: (message: Record<string, unknown>) => void;
  updateContactMessage: (id: string, values: Record<string, unknown>) => void;
  deleteContactMessage: (id: string) => void;
  // Resume
  setActiveResume: (resumeId: string) => void;
};

// ============================================================================
// Context
// ============================================================================

export const CmsContext = createContext<CmsContextValue | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

export function CmsProvider({ children }: { children: ReactNode }) {
  /**
   * Whether to use Supabase for data operations.
   * Falls back to in-memory mock data if Supabase is not configured.
   */
  const useSupabase = isSupabaseConfigured();

  /**
   * CMS Data State
   */
  const [data, setData] = useState<CmsData>(() => cmsMock);

  /**
   * Loading State
   */
  const [loadingState, setLoadingState] = useState<CmsLoadingState>({
    isLoading: true, // Start loading to fetch from Supabase
    isMutating: false,
    mutatingOperation: null,
  });

  /**
   * Error State
   */
  const [errorState, setErrorState] = useState<CmsErrorState>({
    error: null,
    errorOperation: null,
  });

  /**
   * Fetch data from Supabase on mount
   */
  useEffect(() => {
    async function loadData() {
      if (!useSupabase) {
        console.log('[CmsContext] Using mock data (Supabase not configured)');
        setLoadingState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        console.log('[CmsContext] Fetching CRITICAL data from Supabase...');
        // 1. Fetch Critical Data (Fastest possible paint)
        const criticalData = await supabaseCms.fetchCriticalCmsData();

        if (criticalData) {
          setData(prev => ({
            ...prev,
            singletons: criticalData.singletons!,
            collections: {
              ...prev.collections,
              // Only overwrite collections that have actual data from Supabase
              ...Object.fromEntries(
                Object.entries(criticalData.collections!).filter(([, v]) => Array.isArray(v) ? v.length > 0 : v != null)
              ),
            }
          }));
          console.log('[CmsContext] Critical data loaded.');
        }

        // 2. Hide Loader Immediately
        setLoadingState(prev => ({ ...prev, isLoading: false }));

        // 3. Fetch Deferred Data (Background)
        console.log('[CmsContext] Fetching DEFERRED data...');
        const deferredCollections = await supabaseCms.fetchDeferredCmsData();

        if (deferredCollections) {
          setData(prev => ({
            ...prev,
            collections: {
              ...prev.collections,
              // Only overwrite collections that have actual data from Supabase
              ...Object.fromEntries(
                Object.entries(deferredCollections).filter(([, v]) => Array.isArray(v) ? v.length > 0 : v != null)
              ),
            }
          }));
          console.log('[CmsContext] Deferred data loaded.');
        }

      } catch (err) {
        console.error('[CmsContext] Failed to fetch from Supabase:', err);
        setErrorState({
          error: err instanceof Error ? err.message : 'Failed to load data',
          errorOperation: 'initialLoad'
        });
        // On critical error, stop loading so user isn't stuck
        setLoadingState(prev => ({ ...prev, isLoading: false }));
      }
    }

    loadData();
  }, [useSupabase]);

  const clearError = useCallback(() => {
    setErrorState({ error: null, errorOperation: null });
  }, []);

  /**
   * Wrap an async operation with loading/error handling.
   */
  const wrapOperation = useCallback(async (operation: string, fn: () => Promise<void> | void) => {
    setLoadingState((prev) => ({ ...prev, isMutating: true, mutatingOperation: operation }));
    setErrorState({ error: null, errorOperation: null });

    try {
      await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setErrorState({ error: message, errorOperation: operation });
      console.error(`[CmsContext] ${operation} failed:`, err);
      throw err; // Re-throw so callers can handle
    } finally {
      setLoadingState((prev) => ({ ...prev, isMutating: false, mutatingOperation: null }));
    }
  }, []);

  // Create local repository for mock fallback
  const localRepo = useMemo(() => createCmsRepository(setData), []);

  // Wrap all repository methods for consistent loading/error handling
  // Uses Supabase when configured, falls back to local repo
  const wrappedMethods = useMemo(() => ({
    updateSingleton: async (key: SingletonKey, values: Record<string, unknown>) => {
      await wrapOperation(`updateSingleton:${key}`, async () => {
        if (useSupabase) {
          await supabaseCms.updateSingleton(key, values);
        }
        // Always update local state for immediate UI feedback
        localRepo.updateSingleton(key, values);
      });
    },
    createItem: async (key: CollectionKey, values: Record<string, unknown>) => {
      await wrapOperation(`createItem:${key}`, async () => {
        if (useSupabase) {
          const newItem = await supabaseCms.createItem(key, values);
          // Update local state with the server-generated item (includes ID)
          setData(prev => ({
            ...prev,
            collections: {
              ...prev.collections,
              [key]: [...prev.collections[key], newItem as CollectionItem],
            },
          }));
        } else {
          localRepo.createItem(key, values);
        }
      });
    },
    updateItem: async (key: CollectionKey, id: string, values: Record<string, unknown>) => {
      await wrapOperation(`updateItem:${key}:${id}`, async () => {
        if (useSupabase) {
          await supabaseCms.updateItem(key, id, values);
        }
        localRepo.updateItem(key, id, values);
      });
    },
    deleteItem: async (key: CollectionKey, id: string) => {
      await wrapOperation(`deleteItem:${key}:${id}`, async () => {
        if (useSupabase) {
          // Only update local state if Supabase delete succeeds
          await supabaseCms.deleteItem(key, id);
          localRepo.deleteItem(key, id);
        } else {
          localRepo.deleteItem(key, id);
        }
      });
    },
    replaceCollection: async (key: CollectionKey, items: CollectionItem[]) => {
      await wrapOperation(`replaceCollection:${key}`, async () => {
        // For now, just update local state
        // Full collection replacement would need batch operations in Supabase
        localRepo.replaceCollection(key, items);
      });
    },
    addContactMessage: async (message: Record<string, unknown>) => {
      await wrapOperation('addContactMessage', async () => {
        if (useSupabase) {
          const newMessage = await supabaseCms.addContactMessage(message);
          setData(prev => ({
            ...prev,
            collections: {
              ...prev.collections,
              contactMessages: [
                newMessage as typeof prev.collections.contactMessages[number],
                ...prev.collections.contactMessages,
              ],
            },
          }));
        } else {
          localRepo.addContactMessage(message);
        }
      });
    },
    updateContactMessage: async (id: string, values: Record<string, unknown>) => {
      await wrapOperation(`updateContactMessage:${id}`, async () => {
        if (useSupabase) {
          await supabaseCms.updateContactMessage(id, values);
        }
        localRepo.updateContactMessage(id, values);
      });
    },
    deleteContactMessage: async (id: string) => {
      await wrapOperation(`deleteContactMessage:${id}`, async () => {
        if (useSupabase) {
          await supabaseCms.deleteContactMessage(id);
        }
        localRepo.deleteContactMessage(id);
      });
    },
    setActiveResume: async (resumeId: string) => {
      await wrapOperation(`setActiveResume:${resumeId}`, async () => {
        if (useSupabase) {
          await supabaseCms.setActiveResume(resumeId);
          // Refresh local state after Supabase update
          const now = new Date().toISOString();
          setData(prev => ({
            ...prev,
            singletons: {
              ...prev.singletons,
              resumeSettings: {
                ...(prev.singletons.resumeSettings as Record<string, unknown>),
                activeResumeId: resumeId,
              },
            },
            collections: {
              ...prev.collections,
              resumes: prev.collections.resumes.map((item) => {
                const resume = item as typeof prev.collections.resumes[number];
                return {
                  ...resume,
                  status: resume.id === resumeId ? 'active' as const : 'inactive' as const,
                  updatedAt: now,
                };
              }),
            },
          }));
        } else {
          localRepo.setActiveResume(resumeId);
        }
      });
    },
  }), [localRepo, wrapOperation, useSupabase]);

  const value = useMemo<CmsContextValue>(
    () => ({
      data,
      loadingState,
      errorState,
      clearError,
      ...wrappedMethods,
    }),
    [data, loadingState, errorState, clearError, wrappedMethods]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

