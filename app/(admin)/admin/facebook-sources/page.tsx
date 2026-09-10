'use client';

import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FacebookSource {
  id: number;
  page_id: string;
  page_name: string;
  is_active: boolean;
}

export default function AdminFacebookSourcesPage() {
  const [sources, setSources] = useState<FacebookSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add source form state
  const [pageId, setPageId] = useState('');
  const [pageName, setPageName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSources = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/facebook-sources`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to load Facebook sources');
      }

      const data = await res.json();
      setSources(data.data || data.sources || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load Facebook sources'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!pageId.trim() || !pageName.trim() || !accessToken.trim()) {
      setFormError('All fields are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/facebook-sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          page_id: pageId.trim(),
          page_name: pageName.trim(),
          access_token: accessToken.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error?.message || data?.message || 'Failed to add source'
        );
      }

      setFormSuccess('Facebook source added successfully');
      setPageId('');
      setPageName('');
      setAccessToken('');
      await fetchSources();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Failed to add source'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSource = async (id: number) => {
    setIsDeleting(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/facebook-sources/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error?.message || data?.message || 'Failed to remove source'
        );
      }

      setDeleteConfirmId(null);
      await fetchSources();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to remove source'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Facebook Sources</h1>
      <p className="mt-1 text-sm text-gray-600">
        Manage configured Facebook page sources for content aggregation
      </p>

      {/* Sources List */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Configured Sources
        </h2>

        {isLoading && (
          <div className="mt-4 text-center text-gray-500">
            Loading sources...
          </div>
        )}

        {error && (
          <div
            className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {!isLoading && !error && sources.length === 0 && (
          <div className="mt-4 rounded-md bg-gray-100 p-6 text-center text-gray-500">
            No Facebook sources configured yet
          </div>
        )}

        {!isLoading && !error && sources.length > 0 && (
          <div className="mt-4 overflow-hidden overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Page Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Page ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sources.map((source) => (
                  <tr key={source.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {source.page_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {source.page_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          source.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {source.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {deleteConfirmId === source.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-500">
                            Confirm?
                          </span>
                          <button
                            onClick={() => handleRemoveSource(source.id)}
                            disabled={isDeleting}
                            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 min-h-[44px] min-w-[44px]"
                          >
                            {isDeleting ? 'Removing...' : 'Yes, Remove'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={isDeleting}
                            className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 min-h-[44px] min-w-[44px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(source.id)}
                          className="rounded bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors min-h-[44px] min-w-[44px]"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add Source Form */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">
          Add New Source
        </h2>

        {formError && (
          <div
            className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            {formError}
          </div>
        )}

        {formSuccess && (
          <div
            className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-700"
            role="status"
          >
            {formSuccess}
          </div>
        )}

        <form
          onSubmit={handleAddSource}
          className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div>
            <label
              htmlFor="page_id"
              className="block text-sm font-medium text-gray-700"
            >
              Page ID
            </label>
            <input
              id="page_id"
              type="text"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder="e.g. 123456789012345"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="page_name"
              className="block text-sm font-medium text-gray-700"
            >
              Page Name
            </label>
            <input
              id="page_name"
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="e.g. CBS Buea"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="access_token"
              className="block text-sm font-medium text-gray-700"
            >
              Access Token
            </label>
            <input
              id="access_token"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Facebook Page Access Token"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors min-h-[44px]"
            >
              {isSubmitting ? 'Adding...' : 'Add Source'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
