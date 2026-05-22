import type { ReactNode } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  renderMobileItem?: (row: T, onEdit?: (row: T) => void, onDelete?: (row: T) => void) => ReactNode;
};

export function DataTable<T>({ columns, rows, rowKey, onEdit, onDelete, renderMobileItem }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1320]/80 shadow-sm">
      {/* Mobile View */}
      <div className="md:hidden p-4 space-y-4">
        {rows.length === 0 && (
          <div className="text-center text-white/60 py-8">No items found</div>
        )}
        {rows.map((row) => (
          <div key={rowKey(row)} className="bg-[#0B1320] border border-white/10 rounded-xl p-4 space-y-3">
            {renderMobileItem ? (
              renderMobileItem(row, onEdit, onDelete)
            ) : (
              // Default Fallback Mobile Card
              <>
                <div className="space-y-2">
                  {columns.slice(0, 3).map((col) => (
                    <div key={String(col.key)}>
                      <span className="text-xs text-white/40 uppercase tracking-wider">{col.header}: </span>
                      <span className="text-sm text-[#C9D1D9]">
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                      </span>
                    </div>
                  ))}
                </div>
                {(onEdit || onDelete) && (
                  <div className="flex gap-2 pt-3 border-t border-white/10 mt-3">
                    {onEdit && (
                      <button
                        className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg bg-[#C77DFF]/10 border border-[#C77DFF]/30 px-3 py-2 text-xs font-medium text-[#C77DFF] hover:bg-[#C77DFF]/20 transition-colors"
                        onClick={() => onEdit(row)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                        onClick={() => onDelete(row)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-[#0B1320]/60 to-[#0B1320]/80 border-b border-white/10">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-5 py-4 font-semibold text-white/60 text-xs uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-5 py-4 font-semibold text-white/60 text-xs uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-12 text-center text-white/60">
                  No items found
                </td>
              </tr>
            )}
            {rows.map((row, index) => (
              <tr
                key={rowKey(row)}
                className="hover:bg-white/5 transition-colors"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {columns.map((col) => {
                  const cellValue = String((row as Record<string, unknown>)[col.key as string] ?? '');
                  return (
                    <td
                      key={String(col.key)}
                      className="px-5 py-4 text-[#C9D1D9] truncate max-w-[200px]"
                      title={cellValue}
                    >
                      {col.render ? col.render(row) : cellValue}
                    </td>
                  );
                })}
                {(onEdit || onDelete) && (
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#C77DFF]/10 border border-[#C77DFF]/30 px-3 py-1.5 text-xs font-medium text-[#C77DFF] hover:bg-[#C77DFF]/20 transition-colors"
                          onClick={() => onEdit(row)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
