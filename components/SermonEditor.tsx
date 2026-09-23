'use client';

import { useRef, useState } from 'react';
import { safeSermonLink, SermonText } from './SermonText';

type Format = 'bold' | 'italic' | 'heading' | 'subheading' | 'bullets' | 'numbers' | 'quote' | 'link';
export function formatSermon(value: string, start: number, end: number, format: Format, url = '') {
  let selected = value.slice(start, end);
  let replacement: string;
  if (['heading', 'subheading', 'bullets', 'numbers', 'quote'].includes(format)) {
    start = start === 0 ? 0 : value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', Math.max(start, end - 1)); end = lineEnd === -1 ? value.length : lineEnd;
    selected = value.slice(start, end) || 'Your text';
    replacement = selected.split('\n').map((line, i) => `${format === 'heading' ? '# ' : format === 'subheading' ? '## ' : format === 'bullets' ? '- ' : format === 'numbers' ? `${i + 1}. ` : '> '}${line.replace(/^(#{1,3}\s+|>\s?|[-*]\s+|\d+\.\s+)/, '')}`).join('\n');
  } else {
    selected ||= format === 'link' ? 'Link text' : 'Your text';
    replacement = format === 'bold' ? `**${selected}**` : format === 'italic' ? `*${selected}*` : `[${selected}](${url})`;
  }
  return { text: value.slice(0, start) + replacement + value.slice(end), start, end: start + replacement.length };
}
const control = 'min-h-[40px] rounded-lg border border-navy-100 bg-white px-3 text-sm font-semibold text-navy-800 hover:bg-navy-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-500';
export function SermonEditor({ value, onChange, required }: { value: string; onChange: (value: string) => void; required: boolean }) {
  const area = useRef<HTMLTextAreaElement>(null);
  const range = useRef({ start: 0, end: 0 });
  const [preview, setPreview] = useState(false);
  const [link, setLink] = useState(false);
  const [url, setUrl] = useState('https://');
  const [error, setError] = useState('');
  function apply(format: Format, href = '') {
    const start = format === 'link' ? range.current.start : area.current?.selectionStart || 0;
    const end = format === 'link' ? range.current.end : area.current?.selectionEnd || 0;
    const result = formatSermon(value, start, end, format, href);
    if (result.text.length > 100000) { setError('Sermon text cannot exceed 100,000 characters.'); return; }
    onChange(result.text); setError(''); setLink(false);
    requestAnimationFrame(() => { area.current?.focus(); area.current?.setSelectionRange(result.start, result.end); });
  }
  return <div><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><label htmlFor="sermon-text" className="font-semibold">Sermon text {required ? '' : '(optional)'}</label><div className="flex gap-2"><button type="button" className={control} aria-pressed={!preview} onClick={() => setPreview(false)}>Write</button><button type="button" className={control} aria-pressed={preview} onClick={() => { setPreview(true); setLink(false); }}>Preview</button></div></div>
    <div className="overflow-hidden rounded-xl border border-navy-200 bg-white">{!preview && <div role="group" aria-label="Text formatting" className="flex flex-wrap gap-2 border-b border-navy-100 bg-navy-50 p-3">{([
      ['bold', 'Bold', 'Bold (Ctrl or ⌘ B)'], ['italic', 'Italic', 'Italic (Ctrl or ⌘ I)'], ['heading', 'Heading', 'Heading'], ['subheading', 'Subheading', 'Subheading'], ['bullets', '• List', 'Bulleted list'], ['numbers', '1. List', 'Numbered list'], ['quote', 'Quote', 'Scripture quote'],
    ] as const).map(([format, label, title]) => <button key={format} type="button" title={title} aria-label={title} className={control} onMouseDown={e => e.preventDefault()} onClick={() => apply(format)}>{label}</button>)}<button type="button" className={control} onMouseDown={e => e.preventDefault()} onClick={() => { range.current = { start: area.current?.selectionStart || 0, end: area.current?.selectionEnd || 0 }; setLink(true); setUrl('https://'); }}>Link</button></div>}
      {link && <div className="border-b border-navy-100 bg-navy-50 p-4"><label className="block text-sm font-semibold" htmlFor="sermon-link">Web address</label><div className="mt-2 flex flex-wrap gap-2"><input autoFocus id="sermon-link" type="url" value={url} onChange={e => setUrl(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-navy-200 px-3 py-2" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const href = safeSermonLink(url); if (href) apply('link', href); else setError('Enter a valid https:// or http:// web address.'); } }} /><button type="button" className={control} onClick={() => { const href = safeSermonLink(url); if (!href) { setError('Enter a valid https:// or http:// web address.'); return; } apply('link', href); }}>Insert link</button><button type="button" className={control} onClick={() => { setLink(false); setError(''); }}>Cancel</button></div></div>}
      {preview ? <div className="min-h-[300px] p-5 sm:p-6" aria-label="Sermon text preview">{value.trim() ? <SermonText text={value} /> : <p className="text-gray-500">Your formatted sermon will appear here.</p>}</div> : <textarea ref={area} id="sermon-text" aria-describedby="sermon-editor-help" className="block min-h-[320px] w-full resize-y border-0 p-5 font-normal leading-relaxed text-navy-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-navy-500" required={required} maxLength={100000} value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && ['b', 'i'].includes(e.key.toLowerCase())) { e.preventDefault(); apply(e.key.toLowerCase() === 'b' ? 'bold' : 'italic'); } }} placeholder="Scripture reading, sermon message, and reflections…" />}
    </div><div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-gray-600"><p id="sermon-editor-help">Select text, then choose a format. Use Preview to see the finished message.</p><span>{value.trim() ? value.trim().split(/\s+/).length : 0} words · {value.length.toLocaleString()} / 100,000 characters</span></div>{error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}</div>;
}
