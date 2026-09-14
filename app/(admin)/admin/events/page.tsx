'use client';

import { API_BASE_URL } from '@/lib/api-base';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API_URL = API_BASE_URL;

interface Event {
  id: number;
  title: string;
  event_date: string;
  location: string;
  description: string;
  detail_page_status?: 'off' | 'not_started' | 'draft' | 'published';
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/events`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || data.data || []);
      } else {
        setError('Failed to load events');
      }
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/events/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== deleteId));
        setSuccessMessage('Event deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to delete event');
      }
    } catch {
      setError('Failed to delete event');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading events...</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <Link
          href="/admin/events/create"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium min-h-[44px] inline-flex items-center justify-center"
        >
          Create Event
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

      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No events yet.</p>
          <Link
            href="/admin/events/create"
            className="mt-3 inline-block text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date & Time</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Location</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => {
                const eventDate = new Date(event.event_date);
                const isPast = eventDate < new Date();
                return (
                  <tr key={event.id} className={`hover:bg-gray-50 ${isPast ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {event.title}
                      <span className="mt-1 block text-xs text-navy-600">{({ off: 'Regular event', not_started: 'Page: Not started', draft: 'Page: Draft', published: 'Page: Published' })[event.detail_page_status || 'off']}</span>
                      {isPast && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                          Past
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {eventDate.toLocaleDateString()} at{' '}
                      {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{event.location}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="px-3 py-2 text-sm text-navy-600 hover:text-navy-800 font-medium min-h-[44px] inline-flex items-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(event.id)}
                          className="px-3 py-2 text-sm text-red-600 hover:text-red-800 font-medium min-h-[44px] inline-flex items-center"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Event</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
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
