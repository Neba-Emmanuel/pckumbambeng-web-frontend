'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api-client';
import { Icon } from '@/components/Icon';
import styles from './harvest.module.css';

interface EventDetails { title: string; event_date: string; location: string; description: string; }

export function HarvestDetails() {
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    apiGet<EventDetails>('/api/events/page/cultural-harvest-2026', { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setEvent(data); })
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [retry]);

  function calendar() {
    if (!event) return;
    const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
    const timestamp = (value: Date) => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const contents = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PC Kumba-Mbeng//Events//EN', 'BEGIN:VEVENT', 'UID:cultural-harvest-2026@pckumbambeng.org', `DTSTAMP:${timestamp(new Date())}`, `DTSTART:${timestamp(new Date(event.event_date))}`, `SUMMARY:${escape(event.title)}`, `LOCATION:${escape(event.location)}`, `DESCRIPTION:${escape(event.description)}`, `URL:${window.location.href}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([contents], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'cultural-harvest-2026.ics'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (error) return <div role="alert" className="rounded-lg border border-[#aa5133]/30 p-6"><p>We couldn’t load the latest event details. Please try again or contact the parish before planning your visit.</p><button onClick={() => setRetry(value => value + 1)} className="mt-3 min-h-[44px] font-semibold underline">Try again</button></div>;
  if (!event) return <p role="status" className="py-8">Loading the latest celebration details…</p>;
  return <>
    <div className="grid gap-6 border-y border-[#252943]/15 py-7 sm:grid-cols-3">
      <div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#aa5133]">The date</p><p className="text-xl font-semibold">{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Douala' })}</p></div>
      <div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#aa5133]">Gathering time</p><p className="text-xl font-semibold">{new Date(event.event_date).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Africa/Douala' })}</p><p className="mt-1 text-sm text-gray-600">Cameroon time</p></div>
      <div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#aa5133]">Our meeting place</p><p className="text-xl font-semibold">{event.location}</p></div>
    </div>
    <p className="mt-7 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-[#535361]">{event.description}</p>
    <button onClick={calendar} className={`${styles.button} mt-6`}><Icon name="calendar_add_on" className="text-xl" />Add to my calendar</button>
  </>;
}

export function ShareHarvest() {
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  async function share() {
    const href = window.location.href;
    setMessage(''); setUrl('');
    if (navigator.share) {
      try { await navigator.share({ title: 'Cultural Harvest 2026 · PC Kumba-Mbeng', text: 'Celebrate faith, heritage and thanksgiving with us.', url: href }); return; }
      catch (error) { if (error instanceof Error && error.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(href); setMessage('Invitation link copied.'); }
    catch { setUrl(href); setMessage('Copy this link to share the invitation.'); }
  }
  return <div><button onClick={share} className={styles.button}><Icon name="share" className="text-xl" />Share the invitation</button><p role="status" className="mt-3 text-sm">{message}</p>{url && <input aria-label="Invitation link" readOnly value={url} onFocus={e => e.currentTarget.select()} className="mt-2 w-full rounded border p-3 text-sm text-gray-900" />}</div>;
}
