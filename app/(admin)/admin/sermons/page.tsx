'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  sermon_date: string;
  content_type: 'audio' | 'text';
}

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSermons = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/sermons`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setSermons(data.sermons || data.data || []);
      } else {
        setError('Failed to load sermons');
      }
    } catch {
      setError('Failed to load sermons');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/sermons/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setSermons((prev) => prev.filter((s) => s.id !== deleteId));
        setSuccessMessage('Sermon deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to delete sermon');
      }
    } catch {
      setError('Failed to delete sermon');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading sermons...</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sermons</h1>
        <Link
          href="/admin/sermons/create"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium min-h-[44px] inline-flex items-center justify-center"
        >
          Create Sermon
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

      {sermons.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No sermons yet.</p>
          <Link
            href="/admin/sermons/create"
            className="mt-3 inline-block text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Upload your first sermon
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Speaker</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Type</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sermons.map((sermon) => (
                <tr key={sermon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {sermon.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{sermon.speaker}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(sermon.sermon_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        sermon.content_type === 'audio'
                          ? 'bg-gold-50 text-gold-700'
                          : 'bg-navy-50 text-navy-700'
                      }`}
                    >
                      {sermon.content_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/sermons/${sermon.id}/edit`}
                          className="px-3 py-2 text-sm text-navy-600 hover:text-navy-800 font-medium min-h-[44px] inline-flex items-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(sermon.id)}
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
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Sermon</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this sermon? This action cannot be undone.
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
