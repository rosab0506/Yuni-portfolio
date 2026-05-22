'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { DataTable } from '../../components/DataTable';
import { useCms } from '../../../hooks/useCms';
import { Inbox } from 'lucide-react';
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

export function ContactMessagesPage() {
  const { data, updateContactMessage, deleteContactMessage } = useCms();

  const rows = (data.collections.contactMessages ?? []) as MessageItem[];

  const columns = useMemo(
    () => [
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'subject', header: 'Subject' },
      {
        key: 'status',
        header: 'Status',
        render: (row: MessageItem) => (
          <select
            className="rounded border border-white/10 bg-[#0B1320]/60 px-2 py-1 text-xs text-[#C9D1D9]"
            value={row.status ?? 'new'}
            onChange={(event) => {
              const nextStatus = event.target.value as MessageItem['status'];
              updateContactMessage(row.id, {
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
        ),
      },
      {
        key: 'id',
        header: 'Detail',
        render: (row: MessageItem) => (
          <Link className="text-[#C77DFF] underline" href={`/mhe-control-center/messages/${row.id}`}>
            View
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Contact Messages</h1>
        <p className="mt-1 text-sm text-[#C9D1D9]">Manage inbound inquiries and updates.</p>
      </div>
      
      {rows.length > 0 ? (
        <div className="rounded border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            onDelete={async (row) => {
              if (!confirm(`Are you sure you want to delete message from "${row.name}"?`)) {
                return;
              }
              try {
                await deleteContactMessage(row.id);
                alert('✓ Message deleted successfully!');
              } catch (error) {
                console.error('Failed to delete message:', error);
                alert('Failed to delete message. Please try again.');
              }
            }}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#0B1320]/80 p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#C77DFF]/10 flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-[#C77DFF]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Messages Yet</h3>
            <p className="text-[#C9D1D9] max-w-md">
              Contact messages from the public contact form will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
