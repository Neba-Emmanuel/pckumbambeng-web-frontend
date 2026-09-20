'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api-client';
import { API_BASE_URL } from '@/lib/api-base';
import { appendUpload } from '@/lib/upload-file';
import { PreacherPhoto } from './PreacherPhoto';

export type Preacher = { id: number; name: string; kind: 'pastor' | 'guest'; image_url: string | null };
const input = 'mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 focus:ring-2 focus:ring-navy-500';
export function PreacherPicker({ value, onChange, onEditing }: { value?: number | null; onChange: (preacher: Preacher) => void; onEditing: (editing: boolean) => void }) {
  const [preachers, setPreachers] = useState<Preacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [editor, setEditor] = useState<'new' | 'edit' | null>(null);
  const [name, setName] = useState('');
  const [kind, setKind] = useState<Preacher['kind']>('guest');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [remove, setRemove] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const selected = preachers.find(preacher => preacher.id === value);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    apiGet<Preacher[]>('/api/admin/preachers', { signal: controller.signal }).then(setPreachers).catch(() => { if (!controller.signal.aborted) setError('Unable to load saved preachers. Please try again.'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [reload]);
  useEffect(() => {
    if (!photo) { setPreview(''); return; }
    const url = URL.createObjectURL(photo); setPreview(url); return () => URL.revokeObjectURL(url);
  }, [photo]);
  function open(mode: 'new' | 'edit') {
    setEditor(mode); onEditing(true); setName(mode === 'edit' ? selected?.name || '' : ''); setKind(mode === 'edit' ? selected?.kind || 'guest' : 'guest'); setPhoto(null); setRemove(false); setError(''); setStatus('');
  }
  async function save() {
    if (!name.trim()) { setError('Enter the preacher’s name.'); return; }
    setBusy(true); setError('');
    try {
      const body: Record<string, unknown> = { name: name.trim(), kind, remove_image: remove };
      if (photo) { const form = new FormData(); await appendUpload(form, 'preacher_image', photo); body.preacher_image_url = form.get('preacher_image_url'); }
      const response = await fetch(`${API_BASE_URL}/api/admin/preachers${editor === 'edit' ? `/${value}` : ''}`, { method: editor === 'edit' ? 'PUT' : 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'Unable to save preacher.');
      const saved = result.data as Preacher;
      setPreachers(list => [...list.filter(preacher => preacher.id !== saved.id), saved]); onChange(saved); setEditor(null); onEditing(false); setPhoto(null); setStatus('Preacher saved. This profile and photo can be reused for every sermon.');
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to save preacher.'); } finally { setBusy(false); }
  }
  return <section className="rounded-2xl border border-navy-100 bg-navy-50 p-5" aria-labelledby="preacher-heading"><h2 id="preacher-heading" className="text-xl font-bold text-navy-900">Choose a preacher</h2><p className="mt-2 text-sm text-gray-600">One profile, one photo, as many sermons as you need.</p>
    {loading ? <p role="status" className="mt-4">Loading preachers…</p> : <><label className="mt-4 block font-semibold" htmlFor="saved-preacher">Saved preacher</label><select id="saved-preacher" required disabled={!!editor} value={value || ''} className={input} onChange={e => { const preacher = preachers.find(p => p.id === Number(e.target.value)); if (preacher) { onChange(preacher); setStatus(''); } }}><option value="" disabled>Select a preacher</option>{(['pastor', 'guest'] as const).map(type => <optgroup key={type} label={type === 'pastor' ? 'Our pastors' : 'Guest preachers'}>{preachers.filter(p => p.kind === type).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</optgroup>)}</select>
      {!editor && <><div className="mt-4 flex flex-wrap items-center gap-4">{selected && <><PreacherPhoto path={selected.image_url} name={selected.name} /><p className="text-sm text-gray-600">{selected.image_url ? 'Saved photo will appear on this sermon.' : 'No photo yet. You can add one to this profile.'}</p></>}</div><div className="mt-4 flex flex-wrap gap-4"><button type="button" className="min-h-[44px] rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white" onClick={() => open('new')}>Add guest / preacher</button>{selected && <button type="button" className="min-h-[44px] text-sm font-semibold text-navy-800 underline" onClick={() => open('edit')}>Edit profile or photo</button>}</div></>}
    </>}
    {editor && <fieldset disabled={busy} className="mt-5 space-y-4 rounded-xl bg-white p-4"><legend className="font-bold text-navy-900">{editor === 'new' ? 'New preacher profile' : 'Edit preacher profile'}</legend><label className="block text-sm font-semibold">Name<input maxLength={100} className={input} value={name} onChange={e => setName(e.target.value)} /></label><label className="block text-sm font-semibold">Preacher type<select className={input} value={kind} onChange={e => setKind(e.target.value as Preacher['kind'])}><option value="guest">Guest preacher</option><option value="pastor">Regular pastor</option></select></label><PreacherPhoto path={preview || (editor === 'edit' && !remove ? selected?.image_url : null)} name={name || 'Preacher'} /><label className="block text-sm font-semibold">Profile photo<input type="file" className="mt-3 block w-full text-sm" accept="image/jpeg,image/png,image/webp" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) { setError('Choose a JPG, PNG or WebP photo up to 10 MB.'); return; } setPhoto(file); setRemove(false); setError(''); }} /></label><p className="text-xs text-gray-600">JPG, PNG or WebP · Up to 10 MB. Upload once and reuse on future sermons. Updating this profile changes all sermons linked to it.</p>{(photo || (editor === 'edit' && selected?.image_url)) && !remove && <button type="button" className="min-h-[44px] text-sm underline" onClick={() => { setPhoto(null); setRemove(true); }}>Remove photo</button>}<div className="flex flex-wrap gap-3"><button type="button" className="min-h-[44px] rounded-lg bg-navy-900 px-4 font-semibold text-white" onClick={save}>{busy ? 'Saving profile…' : 'Save preacher'}</button><button type="button" className="min-h-[44px] px-4 text-navy-700" onClick={() => { setEditor(null); onEditing(false); setPhoto(null); setError(''); }}>Cancel</button></div></fieldset>}
    {error && <div role="alert" className="mt-4 text-sm text-red-700">{error}{!editor && <button type="button" className="ml-2 min-h-[44px] underline" onClick={() => setReload(n => n + 1)}>Reload preachers</button>}</div>}<p role="status" className="mt-3 text-sm text-navy-700">{status}</p>
  </section>;
}
