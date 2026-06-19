import type { ReactNode } from 'react';
import { Search, X, ChevronUp, ChevronDown, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onTogglePublish?: (row: T) => void;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  title?: string;
  action?: ReactNode;
}

export function DataTable<T extends { id: string; is_published?: boolean }>({
  columns,
  rows,
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onTogglePublish,
  searchKeys = [],
  emptyMessage = 'No items found.',
  title,
  action,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = rows.filter((row) => {
    if (!search) return true;
    return searchKeys.some((k) => {
      const val = row[k];
      return String(val ?? '').toLowerCase().includes(search.toLowerCase());
    });
  });

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey];
        const bv = (b as Record<string, unknown>)[sortKey];
        const cmp = String(av ?? '').localeCompare(String(bv ?? ''));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {(title || action || searchKeys.length > 0) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {title && <h2 className="font-display text-xl font-bold text-white">{title}</h2>}
          <div className="flex items-center gap-3">
            {searchKeys.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-52 rounded-xl border border-white/10 bg-ink-900/60 pl-9 pr-8 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/40 focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            {action}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/40">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-stone-400">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={col.width ? { width: col.width } : undefined}
                      className="px-4 py-3 text-left"
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(col.key)}
                          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-400 hover:text-white"
                        >
                          {col.label}
                          {sortKey === col.key ? (
                            sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                          ) : null}
                        </button>
                      ) : (
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">
                          {col.label}
                        </span>
                      )}
                    </th>
                  ))}
                  {(onEdit || onDelete || onTogglePublish) && (
                    <th className="w-24 px-4 py-3 text-right">
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">
                        Actions
                      </span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {sorted.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-white/[0.02]">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render
                          ? col.render(row)
                          : (
                            <span className="text-sm text-stone-200">
                              {String((row as Record<string, unknown>)[col.key] ?? '')}
                            </span>
                          )}
                      </td>
                    ))}
                    {(onEdit || onDelete || onTogglePublish) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {onTogglePublish && (
                            <button
                              type="button"
                              onClick={() => onTogglePublish(row)}
                              title={row.is_published ? 'Unpublish' : 'Publish'}
                              className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                            >
                              {row.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-stone-600" />}
                            </button>
                          )}
                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(row)}
                              title="Edit"
                              className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(row)}
                              title="Delete"
                              className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
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
        )}
      </div>

      {!loading && !error && (
        <p className="text-xs text-stone-500">
          {sorted.length} {sorted.length === 1 ? 'item' : 'items'}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}
    </div>
  );
}
