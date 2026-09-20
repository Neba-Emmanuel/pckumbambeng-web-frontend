'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api-base';
import { appendUpload } from '@/lib/upload-file';
import { apiGet } from '@/lib/api-client';
import { PreacherPhoto } from './PreacherPhoto';

const input = 'mt-2 w-full rounded-xl border border-navy-100 bg-white px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500';
type SermonData = { preacher_id?: number | null; title: string; speaker: string; sermon_date: string; content_type: 'audio' | 'text'; text_content: string | null; preacher_image?: string | null; audio_path?: string | null };
export function SermonForm({ id }: { id?: string }) {
  const router = useRouter();
  const [data, setData] = useState<SermonData>({ title: '', speaker: '', sermon_date: '', content_type: 'text', text_content: '' });
  const [audio, setAudio] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [savedSpeaker, setSavedSpeaker] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [loaded, setLoaded] = useState(!id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    apiGet<SermonData>(`/api/sermons/${id}`, { signal: controller.signal }).then(value => { setData({ ...value, sermon_date: value.sermon_date.slice(0, 10) }); setLoaded(true); setSavedSpeaker(value.speaker); }).catch(() => { if (!controller.signal.aborted) setError('Unable to load this sermon. Refresh to try again.'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);
  useEffect(() => {
    if (!photo) { setPreview(''); return; }
    const url = URL.createObjectURL(photo); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    if (!data.title.trim() || !data.speaker.trim()) { setError('Enter a title and preacher name.'); return; }
    if (data.content_type === 'text' && !data.text_content?.trim()) { setError('Enter the sermon text.'); return; }
    if (data.content_type === 'audio' && !audio && !data.audio_path) { setError('Choose an audio recording.'); return; }
    setBusy(true);
    try {
      const form = new FormData();
      for (const key of ['title', 'speaker', 'sermon_date', 'content_type', 'text_content'] as const) form.append(key, data[key] || '');
      if (audio && data.content_type === 'audio') await appendUpload(form, 'audio', audio);
      if (photo) await appendUpload(form, 'preacher_image', photo);
      const res = await fetch(`${API_BASE_URL}/api/admin/sermons${id ? `/${id}` : ''}`, { method: id ? 'PUT' : 'POST', credentials: 'include', body: form });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error?.message || 'Unable to save sermon.'); }
      router.push('/admin/sermons');
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to save sermon. Please try again.'); } finally { setBusy(false); }
  }
  return <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-widest text-gold-700">Sermon library</p><h1 className="mt-2 text-3xl font-bold text-navy-900">{id ? 'Edit sermon' : 'Share a sermon'}</h1><p className="mb-7 mt-3 text-gray-600">Add the message, introduce the preacher, and help the congregation revisit the Word.</p>{error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}{loading ? <p role="status">Loading sermon…</p> : loaded && <form onSubmit={submit} className="space-y-6 rounded-2xl border border-navy-100 bg-white p-5 sm:p-8"><fieldset disabled={busy} className="space-y-6 disabled:opacity-60">
    <label className="block font-semibold">Sermon title<input className={input} required maxLength={200} value={data.title} onChange={e => setData({ ...data, title: e.target.value })} /></label>
    <label className="block font-semibold">Preacher’s name<input className={input} required maxLength={100} value={data.speaker} onChange={e => setData({ ...data, speaker: e.target.value })} placeholder="Enter the pastor or guest preacher’s name" /><span className="mt-2 block text-sm font-normal text-gray-600">We save the preacher’s information with this sermon. Use the same name next time to reuse their photo automatically.</span></label>
    <div className="flex flex-wrap items-center gap-5 rounded-xl bg-navy-50 p-5"><PreacherPhoto path={preview || (data.speaker === savedSpeaker ? data.preacher_image : null)} name={data.speaker || 'Preacher'} /><div className="min-w-0 flex-1"><label htmlFor="preacher-photo" className="block font-semibold">Preacher’s photo (optional)</label><input id="preacher-photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-3 block w-full text-sm" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) { setError('Choose a JPG, PNG or WebP photo up to 10 MB.'); return; } setPhoto(file); setError(''); }} /><p className="mt-2 text-xs text-gray-600">Upload once. Leave empty to keep the saved photo. A new photo updates all sermons by this preacher. JPG, PNG or WebP · Up to 10 MB.</p>{photo && <button type="button" className="mt-2 min-h-[44px] text-sm underline" onClick={() => setPhoto(null)}>Cancel new photo</button>}</div></div>
    <label className="block font-semibold">Sermon date<input className={input} type="date" required value={data.sermon_date} onChange={e => setData({ ...data, sermon_date: e.target.value })} /></label>
    <label className="block font-semibold">Format<select className={input} value={data.content_type} onChange={e => setData({ ...data, content_type: e.target.value as 'audio' | 'text' })}><option value="text">Written sermon</option><option value="audio">Audio recording with optional text</option></select></label>
    {data.content_type === 'audio' && <label className="block font-semibold">Audio recording<input type="file" className="mt-3 block w-full text-sm" accept="audio/mpeg,audio/wav,.mp3,.wav" onChange={e => { const file = e.target.files?.[0]; if (!file) { setAudio(null); return; } if (!['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav'].includes(file.type) || file.size > 100 * 1024 * 1024) { setAudio(null); e.target.value = ''; setError('Choose an MP3 or WAV recording up to 100 MB.'); return; } setAudio(file); setError(''); }} /><span className="mt-2 block text-xs font-normal text-gray-600">MP3 or WAV · Maximum 100 MB{data.audio_path ? ' · Leave empty to keep the current recording.' : ''}</span></label>}
    <label className="block font-semibold">Sermon text {data.content_type === 'audio' ? '(optional)' : ''}<textarea className={`${input} min-h-[260px] font-normal leading-relaxed`} required={data.content_type === 'text'} maxLength={100000} value={data.text_content || ''} onChange={e => setData({ ...data, text_content: e.target.value })} placeholder="Scripture reading, sermon message, and reflections…" /><span className="mt-2 block text-xs font-normal text-gray-600">Paragraph breaks are preserved on the public sermon page.</span></label>
    <div className="flex gap-4"><button className="min-h-[48px] rounded-xl bg-navy-900 px-6 py-3 font-semibold text-white" type="submit">{busy ? 'Saving…' : 'Save sermon'}</button><button type="button" className="min-h-[48px] px-4 text-navy-700" onClick={() => router.push('/admin/sermons')}>Cancel</button></div>
  </fieldset></form>}</div>;
}
