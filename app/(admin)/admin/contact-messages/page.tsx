'use client';

import { useEffect, useState } from 'react';
import { apiGetList } from '@/lib/api-client';
import { Icon } from '@/components/Icon';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiGetList<ContactMessage[]>(`/api/admin/contact-messages?page=${page}`, { signal: controller.signal })
      .then(result => {
        if (controller.signal.aborted) return;
        setMessages(result.data);
        setTotal(result.meta?.total ?? 0);
      })
      .catch(err => {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Unable to load messages.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, reload]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-navy-900">Contact Messages</h1><p className="mt-2 text-gray-600">Messages sent through the public contact form.</p></div>
        <button disabled={loading} onClick={() => setReload(value => value + 1)} className="rounded-xl border border-navy-200 bg-white px-5 py-3 text-sm font-semibold text-navy-800 disabled:opacity-50">Refresh</button>
      </div>
      {loading ? <p role="status" className="py-12 text-center text-navy-600">Loading messages…</p> : error ? <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">{error} Use Refresh to try again.</p> : <>
        <p className="mb-4 text-sm text-gray-500">{total} message{total === 1 ? '' : 's'} · Newest first</p>
        {messages.length === 0 ? <div className="rounded-2xl border bg-white px-6 py-16 text-center"><Icon name="mail" className="text-4xl text-navy-300" /><h2 className="mt-3 text-lg font-bold text-navy-900">No messages yet</h2><p className="mt-2 text-gray-500">New contact form submissions will appear here.</p></div> : <div className="space-y-5">{messages.map(message => <article key={message.id} className="min-w-0 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3"><h2 className="break-words text-xl font-bold text-navy-900">{message.subject}</h2><time className="text-xs text-gray-500" dateTime={message.created_at}>{new Date(message.created_at).toLocaleString()}</time></div>
          <p className="mt-3 break-words font-semibold text-navy-800">{message.name}</p>
          <a href={`mailto:${message.email}`} className="break-all text-sm text-navy-600 underline underline-offset-4">{message.email}</a>
          {message.phone && <p className="mt-1 break-words text-sm text-gray-600">Phone: {message.phone}</p>}
          <p className="mt-5 whitespace-pre-wrap break-words border-t border-navy-50 pt-5 text-gray-700">{message.message}</p>
        </article>)}</div>}
        <div className="mt-6 flex items-center justify-between gap-3"><button disabled={page === 1} onClick={() => { setLoading(true); setPage(value => value - 1); }} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Previous</button><span className="text-sm text-gray-600">Page {page} of {Math.max(1, Math.ceil(total / 20))}</span><button disabled={page * 20 >= total} onClick={() => { setLoading(true); setPage(value => value + 1); }} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Next</button></div>
      </>}
    </div>
  );
}
