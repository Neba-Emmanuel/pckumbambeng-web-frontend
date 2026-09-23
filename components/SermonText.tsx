import { Fragment, type ReactNode } from 'react';

// A deliberately small Markdown subset. React escapes all text; raw HTML is never executed.
export function safeSermonLink(value: string): string | null {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
function inline(text: string, depth = 0): ReactNode {
  if (depth > 5) return text;
  const pattern = /\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g;
  const result: ReactNode[] = []; let cursor = 0; let match;
  while ((match = pattern.exec(text))) {
    result.push(text.slice(cursor, match.index));
    if (match[1]) {
      const href = safeSermonLink(match[2]);
      result.push(href ? <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline underline-offset-4">{inline(match[1], depth + 1)}<span className="sr-only"> (opens in a new tab)</span></a> : match[0]);
    } else if (match[3]) result.push(<strong key={match.index}>{match[3]}</strong>);
    else result.push(<em key={match.index}>{match[4]}</em>);
    cursor = pattern.lastIndex;
  }
  result.push(text.slice(cursor));
  return result;
}
export function SermonText({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim()) { index++; continue; }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const Heading = heading[1].length === 1 ? 'h3' : heading[1].length === 2 ? 'h4' : 'h5';
      blocks.push(<Heading key={index} className="mt-8 font-serif text-2xl font-bold leading-snug text-navy-900">{inline(heading[2])}</Heading>); index++; continue;
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = []; const start = index;
      while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ''));
      blocks.push(<blockquote key={start} className="border-l-4 border-gold-400 bg-gold-50 px-5 py-3 italic">{inline(quote.join('\n'))}</blockquote>); continue;
    }
    const ordered = /^\d+\.\s+/.test(line); const bullet = /^[-*]\s+/.test(line);
    if (ordered || bullet) {
      const start = index; const items: ReactNode[] = []; const pattern = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
      while (index < lines.length && pattern.test(lines[index])) { items.push(<li key={index}>{inline(lines[index].replace(pattern, ''))}</li>); index++; }
      blocks.push(ordered ? <ol key={start} start={Number.parseInt(line, 10)} className="list-decimal space-y-2 pl-7">{items}</ol> : <ul key={start} className="list-disc space-y-2 pl-7">{items}</ul>); continue;
    }
    const start = index; const paragraph: string[] = [lines[index++]];
    while (index < lines.length && lines[index].trim() && !/^(#{1,3}\s|>\s?|[-*]\s|\d+\.\s)/.test(lines[index])) paragraph.push(lines[index++]);
    blocks.push(<p key={start}>{paragraph.map((part, i) => <Fragment key={i}>{i > 0 && <br />}{inline(part)}</Fragment>)}</p>);
  }
  return <div className="space-y-5 whitespace-pre-wrap break-words text-base leading-8 text-gray-700">{blocks}</div>;
}
