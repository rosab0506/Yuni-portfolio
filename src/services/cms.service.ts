/**
 * CMS Service Layer - Async-Ready Repository Pattern
 * 
 * This service provides an abstraction layer over CMS data operations.
 * Currently uses in-memory mock data, but is structured for easy Supabase integration.
 * 
 * TODO [SUPABASE]: Replace implementation with Supabase client calls
 */

import type { CmsData, CollectionItem, CollectionKey, SingletonKey } from '../context/CmsContext';
import type { ApiResponse, ApiError } from '../types/database.types';

// ============================================================================
// Error Handling
// ============================================================================

export class CmsServiceError extends Error {
  constructor(
    message: string,
    public code: string = 'CMS_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'CmsServiceError';
  }

  toApiError(): ApiError {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

// ============================================================================
// Service Types
// ============================================================================

export interface CmsServiceConfig {
  /** Enable console logging for debugging */
  debug?: boolean;
  /** Simulated network delay in ms (dev only) */
  mockDelay?: number;
}

export interface CmsService {
  // Singletons
  getSingleton: <T extends Record<string, unknown>>(key: SingletonKey) => Promise<ApiResponse<T>>;
  updateSingleton: (key: SingletonKey, values: Record<string, unknown>) => Promise<ApiResponse<void>>;
  
  // Collections
  getCollection: <T extends CollectionItem>(key: CollectionKey) => Promise<ApiResponse<T[]>>;
  getCollectionItem: <T extends CollectionItem>(key: CollectionKey, id: string) => Promise<ApiResponse<T>>;
  createItem: (key: CollectionKey, values: Record<string, unknown>) => Promise<ApiResponse<CollectionItem>>;
  updateItem: (key: CollectionKey, id: string, values: Record<string, unknown>) => Promise<ApiResponse<void>>;
  deleteItem: (key: CollectionKey, id: string) => Promise<ApiResponse<void>>;
  reorderItems: (key: CollectionKey, items: CollectionItem[]) => Promise<ApiResponse<void>>;
  
  // Contact Messages
  getContactMessages: () => Promise<ApiResponse<CollectionItem[]>>;
  createContactMessage: (message: Record<string, unknown>) => Promise<ApiResponse<CollectionItem>>;
  updateContactMessage: (id: string, values: Record<string, unknown>) => Promise<ApiResponse<void>>;
  deleteContactMessage: (id: string) => Promise<ApiResponse<void>>;
  
  // Resume
  setActiveResume: (resumeId: string) => Promise<ApiResponse<void>>;
}

// ============================================================================
// Mock Implementation (DEV ONLY)
// ============================================================================

/**
 * Creates a mock CMS service that operates on in-memory state.
 * 
 * TODO [SUPABASE]: This entire implementation will be replaced with:
 * - Supabase client for data operations
 * - Real-time subscriptions for live updates
 * - Proper error handling with Supabase error types
 * 
 * @param getData - Function to get current CMS data state
 * @param setData - React state setter for CMS data
 * @param config - Service configuration options
 */
export function createMockCmsService(
  getData: () => CmsData,
  setData: React.Dispatch<React.SetStateAction<CmsData>>,
  config: CmsServiceConfig = {}
): CmsService {
  const { debug = false, mockDelay = 0 } = config;

  const log = (message: string, data?: unknown) => {
    if (debug) {
      console.log(`[CmsService] ${message}`, data ?? '');
    }
  };

  const delay = () => 
    mockDelay > 0 ? new Promise(resolve => setTimeout(resolve, mockDelay)) : Promise.resolve();

  const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const timestamp = () => new Date().toISOString();

  // Helper to wrap operations in try/catch and return ApiResponse
  const wrapOperation = async <T>(
    operation: () => T | Promise<T>,
    operationName: string
  ): Promise<ApiResponse<T>> => {
    try {
      await delay();
      const result = await operation();
      log(`${operationName} succeeded`, result);
      return { data: result, error: null };
    } catch (err) {
      const error = err instanceof CmsServiceError 
        ? err.toApiError()
        : { message: err instanceof Error ? err.message : 'Unknown error', code: 'UNKNOWN' };
      log(`${operationName} failed`, error);
      return { data: null, error };
    }
  };

  return {
    // ========================================================================
    // Singleton Operations
    // ========================================================================
    
    getSingleton: async <T extends Record<string, unknown>>(key: SingletonKey) => {
      return wrapOperation(() => {
        const data = getData();
        const singleton = data.singletons[key];
        if (!singleton) {
          throw new CmsServiceError(`Singleton '${key}' not found`, 'NOT_FOUND');
        }
        return singleton as unknown as T;
      }, `getSingleton(${key})`);
    },

    updateSingleton: async (key: SingletonKey, values: Record<string, unknown>) => {
      return wrapOperation(() => {
        setData(prev => ({
          ...prev,
          singletons: {
            ...prev.singletons,
            [key]: {
              ...(prev.singletons[key] as Record<string, unknown>),
              ...values,
              updatedAt: timestamp(),
            },
          },
        }));
      }, `updateSingleton(${key})`);
    },

    // ========================================================================
    // Collection Operations
    // ========================================================================

    getCollection: async <T extends CollectionItem>(key: CollectionKey) => {
      return wrapOperation(() => {
        const data = getData();
        return (data.collections[key] ?? []) as T[];
      }, `getCollection(${key})`);
    },

    getCollectionItem: async <T extends CollectionItem>(key: CollectionKey, id: string) => {
      return wrapOperation(() => {
        const data = getData();
        const items = data.collections[key] ?? [];
        const item = items.find(i => (i as CollectionItem).id === id);
        if (!item) {
          throw new CmsServiceError(`Item '${id}' not found in '${key}'`, 'NOT_FOUND');
        }
        return item as unknown as T;
      }, `getCollectionItem(${key}, ${id})`);
    },

    createItem: async (key: CollectionKey, values: Record<string, unknown>) => {
      return wrapOperation(() => {
        const newItem: CollectionItem = {
          id: createId(),
          ...values,
          createdAt: timestamp(),
          updatedAt: timestamp(),
        };
        
        setData(prev => ({
          ...prev,
          collections: {
            ...prev.collections,
            [key]: [...prev.collections[key], newItem],
          },
        }));
        
        return newItem;
      }, `createItem(${key})`);
    },

    updateItem: async (key: CollectionKey, id: string, values: Record<string, unknown>) => {
      return wrapOperation(() => {
        setData(prev => ({
          ...prev,
          collections: {
            ...prev.collections,
            [key]: prev.collections[key].map(item =>
              (item as CollectionItem).id === id
                ? { ...(item as CollectionItem), ...values, updatedAt: timestamp() }
                : item
            ),
          },
        }));
      }, `updateItem(${key}, ${id})`);
    },

    deleteItem: async (key: CollectionKey, id: string) => {
      return wrapOperation(() => {
        setData(prev => ({
          ...prev,
          collections: {
            ...prev.collections,
            [key]: prev.collections[key].filter(item => (item as CollectionItem).id !== id),
          },
        }));
      }, `deleteItem(${key}, ${id})`);
    },

    reorderItems: async (key: CollectionKey, items: CollectionItem[]) => {
      return wrapOperation(() => {
        // Apply orderIndex to each item based on position
        const orderedItems = items.map((item, index) => ({
          ...item,
          orderIndex: index + 1,
          updatedAt: timestamp(),
        }));
        
        setData(prev => ({
          ...prev,
          collections: {
            ...prev.collections,
            [key]: orderedItems,
          },
        }));
      }, `reorderItems(${key})`);
    },

    // ========================================================================
    // Contact Messages
    // ========================================================================

    getContactMessages: async () => {
      return wrapOperation(() => {
        const data = getData();
        return data.collections.contactMessages as CollectionItem[];
      }, 'getContactMessages');
    },

    createContactMessage: async (message: Record<string, unknown>) => {
      return wrapOperation(() => {
        const newMessage: CollectionItem = {
          id: createId(),
          name: String(message.name ?? ''),
          email: String(message.email ?? ''),
          subject: String(message.subject ?? ''),
          message: String(message.message ?? ''),
          status: 'new',
          createdAt: timestamp(),
          handledBy: '',
          handledAt: '',
        };
        
        setData(prev => {
          const existingMessages = prev.collections.contactMessages as CollectionItem[];
          return {
            ...prev,
            collections: {
              ...prev.collections,
              contactMessages: [...existingMessages, newMessage] as typeof prev.collections.contactMessages,
            },
          };
        });
        
        return newMessage;
      }, 'createContactMessage');
    },

    updateContactMessage: async (id: string, values: Record<string, unknown>) => {
      return wrapOperation(() => {
        setData(prev => {
          const existingMessages = prev.collections.contactMessages as CollectionItem[];
          return {
            ...prev,
            collections: {
              ...prev.collections,
              contactMessages: existingMessages.map(item =>
                item.id === id
                  ? { ...item, ...values } as CollectionItem
                  : item
              ) as typeof prev.collections.contactMessages,
            },
          };
        });
      }, `updateContactMessage(${id})`);
    },

    deleteContactMessage: async (id: string) => {
      return wrapOperation(() => {
        setData(prev => {
          const existingMessages = prev.collections.contactMessages as CollectionItem[];
          return {
            ...prev,
            collections: {
              ...prev.collections,
              contactMessages: existingMessages.filter(
                item => item.id !== id
              ) as typeof prev.collections.contactMessages,
            },
          };
        });
      }, `deleteContactMessage(${id})`);
    },

    // ========================================================================
    // Resume Management
    // ========================================================================

    setActiveResume: async (resumeId: string) => {
      return wrapOperation(() => {
        const now = timestamp();
        
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
            resumes: prev.collections.resumes.map(item => ({
              ...item,
              status: (item as CollectionItem).id === resumeId ? 'active' : 'inactive',
              updatedAt: now,
            })),
          },
        }));
      }, `setActiveResume(${resumeId})`);
    },
  };
}

// ============================================================================
// TODO [SUPABASE]: Supabase Implementation Placeholder
// ============================================================================

/**
 * Creates a Supabase-backed CMS service.
 * 
 * TODO [SUPABASE]: Implement when Supabase credentials are provided
 * 
 * Example implementation:
 * ```typescript
 * export function createSupabaseCmsService(
 *   supabase: SupabaseClient,
 *   config?: CmsServiceConfig
 * ): CmsService {
 *   return {
 *     getSingleton: async (key) => {
 *       const { data, error } = await supabase
 *         .from(`cms_${key}`)
 *         .select('*')
 *         .single();
 *       return { data, error };
 *     },
 *     // ... other methods
 *   };
 * }
 * ```
 */
