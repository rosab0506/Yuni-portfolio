import type { Dispatch, SetStateAction } from 'react';
import type { CmsData, CollectionItem, CollectionKey, SingletonKey } from '../context/CmsContext';

export type CmsRepository = {
  updateSingleton: (key: SingletonKey, values: Record<string, unknown>) => void;
  createItem: (key: CollectionKey, values: Record<string, unknown>) => void;
  updateItem: (key: CollectionKey, id: string, values: Record<string, unknown>) => void;
  deleteItem: (key: CollectionKey, id: string) => void;
  replaceCollection: (key: CollectionKey, items: CollectionItem[]) => void;
  addContactMessage: (message: Record<string, unknown>) => void;
  updateContactMessage: (id: string, values: Record<string, unknown>) => void;
  deleteContactMessage: (id: string) => void;
  setActiveResume: (resumeId: string) => void;
};

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
type ContactMessage = CmsData['collections']['contactMessages'][number];
type ResumeItem = CmsData['collections']['resumes'][number];

export const createCmsRepository = (
  setData: Dispatch<SetStateAction<CmsData>>
): CmsRepository => ({
  updateSingleton: (key, values) => {
    setData((prev) => ({
      ...prev,
      singletons: {
        ...prev.singletons,
        [key]: {
          ...(prev.singletons[key] as Record<string, unknown>),
          ...values,
        },
      },
    }));
  },
  createItem: (key, values) => {
    setData((prev) => ({
      ...prev,
      collections: {
        ...prev.collections,
        [key]: [
          ...prev.collections[key],
          {
            id: createId(),
            ...values,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    }));
  },
  updateItem: (key, id, values) => {
    setData((prev) => ({
      ...prev,
      collections: {
        ...prev.collections,
        [key]: prev.collections[key].map((item) =>
          (item as CollectionItem).id === id
            ? { ...(item as CollectionItem), ...values, updatedAt: new Date().toISOString() }
            : item
        ),
      },
    }));
  },
  deleteItem: (key, id) => {
    setData((prev) => ({
      ...prev,
      collections: {
        ...prev.collections,
        [key]: prev.collections[key].filter((item) => (item as CollectionItem).id !== id),
      },
    }));
  },
  replaceCollection: (key, items) => {
    setData((prev) => ({
      ...prev,
      collections: {
        ...prev.collections,
        [key]: items,
      },
    }));
  },
  addContactMessage: (message) => {
    setData((prev) => ({
      ...prev,
      collections: {
        ...prev.collections,
        contactMessages: [
          ...prev.collections.contactMessages,
          {
            id: createId(),
            name: String(message.name ?? ''),
            email: String(message.email ?? ''),
            subject: String(message.subject ?? ''),
            message: String(message.message ?? ''),
            status: (message.status as ContactMessage['status']) ?? 'new',
            createdAt: String(message.createdAt ?? new Date().toISOString()),
            handledBy: String(message.handledBy ?? ''),
            handledAt: String(message.handledAt ?? ''),
          } satisfies ContactMessage,
        ],
      },
    }));
  },
  updateContactMessage: (id, values) => {
    const updates = values as Partial<ContactMessage>;
    setData((prev) => ({
      ...prev,
      collections: {
        ...prev.collections,
        contactMessages: prev.collections.contactMessages.map((item) =>
          (item as ContactMessage).id === id ? ({ ...item, ...updates } as ContactMessage) : item
        ),
      },
    }));
  },
  deleteContactMessage: (id) => {
    setData((prev) => ({
      ...prev,
      collections: {
        ...prev.collections,
        contactMessages: prev.collections.contactMessages.filter((item) => (item as CollectionItem).id !== id),
      },
    }));
  },
  setActiveResume: (resumeId) => {
    const now = new Date().toISOString();
    setData((prev) => ({
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
        resumes: prev.collections.resumes.map((item) =>
          (item as ResumeItem).id === resumeId
            ? ({ ...item, status: 'active', updatedAt: now } as ResumeItem)
            : ({ ...item, status: 'inactive', updatedAt: now } as ResumeItem)
        ),
      },
    }));
  },
});
