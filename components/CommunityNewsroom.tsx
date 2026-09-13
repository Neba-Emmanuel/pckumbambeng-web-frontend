'use client';

import { useState } from 'react';
import { FacebookPageEmbed } from '@/components/FacebookPageEmbed';
import { Icon } from '@/components/Icon';

const stations = [
  { city: 'Buea', frequency: '95.30', region: 'South West', url: 'https://www.facebook.com/cbsradiobuea', description: 'Explore stories and community updates shared by CBS Radio Buea.' },
  { city: 'Bamenda', frequency: '101.0', region: 'North West', url: 'https://www.facebook.com/cbsradiobamenda', description: 'Follow the conversations and updates shared by CBS Radio Bamenda.' },
];

export function CommunityNewsroom() {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [copyFallback, setCopyFallback] = useState(false);
  const station = stations[selected];
  const name = `CBS Radio ${station.city}`;

  async function share() {
    setFeedback('');
    setCopyFallback(false);
    if (navigator.share) {
      try { await navigator.share({ title: name, url: station.url }); return; }
      catch (error) { if (error instanceof Error && error.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(station.url); setFeedback('Station link copied.'); }
    catch { setCopyFallback(true); setFeedback('Select and copy the link below.'); }
  }

  return <div>
    <section className="relative overflow-hidden bg-gradient-hero px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0 dot-pattern opacity-20" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-10">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-300"><Icon name="radio" className="text-xl" />Faith. Community. Connection.</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">Your community.<br /><span className="text-gold-300">Many voices.</span></h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">A little closer to the stories that bring us together. Choose a station and explore its latest Facebook updates.</p>
        </div>
        <div aria-hidden="true" className="hidden h-48 items-center gap-2 lg:flex">
          {[28, 52, 38, 80, 58, 100, 72, 44, 88, 60, 34, 50].map((height, i) => <span key={i} className="w-3 rounded-full bg-gold-300/40" style={{ height: `${height}%` }} />)}
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-6 flex items-center gap-3"><span className="h-px w-8 bg-gold-500" /><h2 className="text-sm font-bold uppercase tracking-widest text-navy-700">Community newsroom</h2></div>
      <div className="grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside>
          <h3 className="mb-2 text-2xl font-bold text-navy-900">Choose your station</h3>
          <p className="mb-6 text-sm text-gray-600">Two stations. A window into our community.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1" role="group" aria-label="Choose a radio station">
            {stations.map((item, index) => <button key={item.city} type="button" aria-pressed={selected === index} aria-controls="station-reader" onClick={() => { setSelected(index); setFeedback(''); setCopyFallback(false); }} className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${selected === index ? 'border-navy-800 bg-gradient-navy text-white shadow-lg' : 'border-navy-100 bg-white text-navy-900 hover:border-navy-300'}`}>
              <span className={`mb-5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${selected === index ? 'text-gold-300' : 'text-navy-500'}`}>{item.region}<Icon name={selected === index ? 'check_circle' : 'radio'} className="text-xl" /></span>
              <span className="block text-3xl font-bold tracking-tight">{item.frequency}<span className="ml-2 text-sm font-medium opacity-70">FM</span></span>
              <span className="mt-2 block text-lg font-semibold">CBS Radio {item.city}</span>
              <span className={`mt-5 flex items-center gap-2 text-sm ${selected === index ? 'text-gold-300' : 'text-navy-600'}`}>{selected === index ? 'Selected station' : 'Explore updates'}<Icon name="arrow_forward" className="text-lg" /></span>
            </button>)}
          </div>
          <div className="mt-6 rounded-2xl border border-gold-200 bg-gold-50 p-5"><Icon name="forum" className="text-2xl text-gold-700" /><h3 className="mt-2 font-bold text-navy-900">Keep the conversation going</h3><p className="mt-2 text-sm text-navy-700">Found something worth sharing? Open a post on Facebook to share it with friends and family.</p></div>
        </aside>

        <section id="station-reader" aria-label={`${name} updates`} className="min-w-0 overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-sm">
          <div className="border-b border-navy-100 p-5 sm:p-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-navy-500">The community feed · {station.region}</p>
            <h2 className="text-2xl font-bold text-navy-900">{name}</h2>
            <p className="mt-2 text-sm text-gray-600">{station.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={share} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"><Icon name="share" className="text-lg" />Share station</button>
              <button type="button" aria-expanded={expanded} aria-controls="station-feed" onClick={() => setExpanded(value => !value)} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"><Icon name={expanded ? 'unfold_less' : 'unfold_more'} className="text-lg" />{expanded ? 'Compact reader' : 'Expand reader'}</button>
            </div>
            <p role="status" className="mt-2 text-sm text-navy-700">{feedback}</p>
            {copyFallback && <input aria-label="Station link to copy" readOnly value={station.url} onFocus={event => event.currentTarget.select()} className="mt-2 w-full rounded-lg border p-3 text-sm" />}
          </div>
          <div id="station-feed" className="bg-warm-gray px-2 py-5 sm:px-5"><FacebookPageEmbed key={station.url} url={station.url} title={name} height={expanded ? 960 : 640} /></div>
          <div className="border-t border-navy-100 p-5 sm:px-7"><a href={station.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-navy-800 hover:underline">Open {name} on Facebook<Icon name="open_in_new" className="text-lg" /></a><p className="mt-2 text-xs leading-relaxed text-gray-500">Posts are displayed by Facebook. If the feed is blank or asks you to sign in, open the station’s page using the link above.</p></div>
        </section>
      </div>
    </div>
  </div>;
}
