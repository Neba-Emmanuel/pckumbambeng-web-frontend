'use client';

import { API_BASE_URL } from '@/lib/api-base';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API_URL = API_BASE_URL;

interface Announcement {
  expires_on: string | null;
  id: number;
  title: string;
  published_at: string;
  attachment_path?: string;
}

export default function AdminAnnouncementsPage() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/announcements?page=${page}`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || data.data || []);
        setTotal(data.meta?.total ?? 0);
        setPageSize(data.meta?.pageSize ?? 20);
      } else {
        setError('Failed to load announcements');
      }
    } catch {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/announcements/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        if (announcements.length === 1 && page > 1) setPage(p => p - 1);
        else await fetchAnnouncements();
        setSuccessMessage('Announcement deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to delete announcement');
      }
    } catch {
      setError('Failed to delete announcement');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading announcements...</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <Link
          href="/admin/announcements/create"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium min-h-[44px] inline-flex items-center justify-center"
        >
          Create Announcement
        </Link>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No announcements yet.</p>
          <Link
            href="/admin/announcements/create"
            className="mt-3 inline-block text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Create your first announcement
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Published</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Show until</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Attachment</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {announcement.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(announcement.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {announcement.expires_on ? <><span>{announcement.expires_on}</span><span className="mt-1 block text-xs font-semibold text-navy-700">{announcement.expires_on < new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Douala', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()) ? 'Expired · hidden from public' : 'Active'}</span></> : 'No expiry'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {announcement.attachment_path ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-navy-50 text-navy-700">
                        Attached
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/announcements/${announcement.id}/edit`}
                        className="px-3 py-2 text-sm text-navy-600 hover:text-navy-800 font-medium min-h-[44px] inline-flex items-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(announcement.id)}
                        className="px-3 py-2 text-sm text-red-600 hover:text-red-800 font-medium min-h-[44px] inline-flex items-center"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {total > pageSize && <nav aria-label="Announcement pages" className="mt-5 flex items-center justify-between gap-3">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="min-h-[44px] rounded-lg bg-navy-50 px-4 font-medium text-navy-900 disabled:opacity-40">Previous</button>
        <span className="text-sm">Page {page} of {Math.ceil(total / pageSize)}</span>
        <button disabled={page * pageSize >= total} onClick={() => setPage(p => p + 1)} className="min-h-[44px] rounded-lg bg-navy-50 px-4 font-medium text-navy-900 disabled:opacity-40">Next</button>
      </nav>}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Announcement</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this announcement? This action cannot be undone.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 min-h-[44px]"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
