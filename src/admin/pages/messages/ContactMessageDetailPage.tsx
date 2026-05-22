'use client';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useCms } from '../../../hooks/useCms';
import type { CollectionItem } from '../../../context/CmsContext';

type MessageItem = CollectionItem & {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  status?: 'new' | 'read' | 'archived';
  createdAt?: string;
  handledBy?: string;
  handledAt?: string;
};

export function ContactMessageDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const { data, updateContactMessage, deleteContactMessage } = useCms();

  const rows = (data.collections.contactMessages ?? []) as MessageItem[];
  const message = rows.find((row) => row.id === id);

  if (!message) {
    return (
      <div className="rounded border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm">
        <p className="text-sm text-[#C9D1D9]">Message not found.</p>
        <Link className="mt-3 inline-block text-sm text-[#C77DFF] underline" href="/mhe-control-center/messages">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Message Detail</h1>
        <Link className="mt-2 inline-block text-sm text-[#C77DFF] underline" href="/mhe-control-center/messages">
          Back to messages
        </Link>
      </div>
      <div className="rounded border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase text-white/60">Name</div>
            <div className="text-sm text-white">{message.name}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-white/60">Email</div>
            <div className="text-sm text-white">{message.email}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-white/60">Subject</div>
            <div className="text-sm text-white">{message.subject}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-white/60">Created</div>
            <div className="text-sm text-white">{message.createdAt}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-white/60">Status</div>
            <select
              className="mt-1 rounded border border-white/10 bg-[#0B1320]/60 px-2 py-1 text-sm text-[#C9D1D9]"
              value={message.status ?? 'new'}
              onChange={(event) => {
                const nextStatus = event.target.value as MessageItem['status'];
                updateContactMessage(message.id, {
                  status: nextStatus,
                  handledBy: nextStatus === 'new' ? '' : 'mhe-control-center',
                  handledAt: nextStatus === 'new' ? '' : new Date().toISOString(),
                });
              }}
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <div className="text-xs uppercase text-white/60">Handled By</div>
            <div className="text-sm text-white">{message.handledBy || '—'}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-white/60">Handled At</div>
            <div className="text-sm text-white">{message.handledAt || '—'}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs uppercase text-white/60">Message</div>
          <div className="mt-1 rounded border border-white/10 bg-[#0B1320]/60 p-3 text-sm text-[#C9D1D9]">
            {message.message}
          </div>
        </div>
        <button
          className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100 transition-colors"
          onClick={() => {
            deleteContactMessage(message.id);
            router.push('/mhe-control-center/messages');
          }}
        >
          Delete message
        </button>
      </div>
    </div>
  );
}
