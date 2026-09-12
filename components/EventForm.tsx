'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiSend } from '@/lib/api-client';

interface EventData {
  title: string;
  event_date: string;
  location: string;
  description: string;
  detail_page_status: 'off' | 'not_started' | 'draft' | 'published';
  detail_page_path: string | null;
}
const blank: EventData = { title: '', event_date: '', location: '', description: '', detail_page_status: 'off', detail_page_path: '' };
const input = 'mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gold-300';

export function EventForm({ id }: { id?: string }) {
  const router = useRouter();
  const [data, setData] = useState<EventData>(blank);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(!id);
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    apiGet<EventData>(`/api/admin/events/${id}`, { signal: controller.signal }).then(event => {
      if (controller.signal.aborted) return;
      const date = new Date(event.event_date);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setData({ ...event, event_date: localDate });
      setLoaded(true);
    }).catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError('');
    try {
      await apiSend(id ? `/api/admin/events/${id}` : '/api/admin/events', id ? 'PUT' : 'POST', {
        ...data, event_date: new Date(data.event_date).toISOString(),
        detail_page_path: data.detail_page_status === 'off' ? null : data.detail_page_path?.trim() || null,
      });
      router.push('/admin/events');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save event'); }
    finally { setSaving(false); }
  }
  return <div className="max-w-2xl">
    <h1 className="mb-6 text-2xl font-bold text-navy-900">{id ? 'Edit Event' : 'Create Event'}</h1>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
    {loading ? <p role="status">Loading event…</p> : loaded && <form onSubmit={submit} className="rounded-xl border bg-white p-6">
      <fieldset disabled={saving} className="space-y-6 disabled:opacity-60">
        <label className="block text-sm font-medium" htmlFor="event-title">Title<input id="event-title" required maxLength={200} value={data.title} onChange={e => setData({ ...data, title: e.target.value })} className={input} /></label>
        <label className="block text-sm font-medium" htmlFor="event-date">Date and time<input id="event-date" type="datetime-local" required value={data.event_date} onChange={e => setData({ ...data, event_date: e.target.value })} className={input} /></label>
        <label className="block text-sm font-medium" htmlFor="event-location">Location<input id="event-location" required maxLength={300} value={data.location} onChange={e => setData({ ...data, location: e.target.value })} className={input} /></label>
        <label className="block text-sm font-medium" htmlFor="event-description">Description<textarea id="event-description" required maxLength={2000} rows={5} value={data.description} onChange={e => setData({ ...data, description: e.target.value })} className={input} /></label>
        <div className="space-y-4 rounded-xl border border-navy-100 bg-navy-50 p-5">
          <label className="flex items-center gap-3 font-semibold text-navy-900"><input type="checkbox" checked={data.detail_page_status !== 'off'} onChange={e => setData({ ...data, detail_page_status: e.target.checked ? 'not_started' : 'off' })} />Dedicated event page</label>
          <p className="text-sm text-gray-600">Choose this for celebrations that need a manually built page. Regular events remain calendar entries.</p>
          {data.detail_page_status !== 'off' && <>
            <label className="block text-sm font-medium" htmlFor="page-status">Page status<select id="page-status" className={input} value={data.detail_page_status} onChange={e => setData({ ...data, detail_page_status: e.target.value as EventData['detail_page_status'] })}><option value="not_started">Not started</option><option value="draft">Draft</option><option value="published">Published</option></select></label>
            <label className="block text-sm font-medium" htmlFor="page-path">Event page path<input id="page-path" className={input} placeholder="/events/cultural-harvest-2026" maxLength={240} pattern="/events/[a-z0-9]+(-[a-z0-9]+)*" required={data.detail_page_status === 'published'} value={data.detail_page_path || ''} onChange={e => setData({ ...data, detail_page_path: e.target.value })} /><span className="mt-2 block font-normal text-gray-600">Enter the path supplied when your custom page is built.</span></label>
            {data.detail_page_status === 'published' && <label className="flex items-start gap-3 text-sm text-navy-900"><input type="checkbox" required className="mt-1" />I have opened the completed page and confirmed it is ready for visitors.</label>}
            <p className="text-sm text-gray-600">“View event” appears publicly only when the status is Published and a page path is supplied. Saving these settings does not build the page.</p>
          </>}
        </div>
        <div className="flex gap-3"><button type="submit" className="rounded-lg bg-navy-900 px-6 py-3 font-semibold text-white">{saving ? 'Saving…' : id ? 'Save changes' : 'Create event'}</button><button type="button" onClick={() => router.push('/admin/events')} className="rounded-lg bg-gray-100 px-6 py-3">Cancel</button></div>
      </fieldset>
    </form>}
  </div>;
}
