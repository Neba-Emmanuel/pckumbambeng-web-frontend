import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/Icon';
import { HarvestDetails, ShareHarvest } from './HarvestDetails';
import styles from './harvest.module.css';
import { HarvestCard } from './HarvestCard';

export const metadata: Metadata = {
  title: 'Cultural Harvest 2026 | PC Kumba-Mbeng',
  description: 'A celebration of faith, heritage and thanksgiving. Join Cultural Harvest 2026 at Presbyterian Church Kumba-Mbeng.',
  openGraph: { title: 'Cultural Harvest 2026 · PC Kumba-Mbeng', description: 'Filled with the bread of Life... We will give with joyful hearts. John 6:30–35.', type: 'website' },
};

function HarvestArtwork() {
  return <svg viewBox="0 0 440 510" role="img" aria-label="Illustration of a harvest basket, grain, traditional drum and gong framed by textile patterns" className={`w-full ${styles.art}`}>
    <defs>
      <pattern id="harvest-weave" width="20" height="16" patternUnits="userSpaceOnUse"><rect width="20" height="16" fill="#9b5638" /><path d="M0 2h20M0 10h20" stroke="#e0a86c" strokeWidth="3" /><path d="M5 0v8m10 0v8" stroke="#522f2a" strokeWidth="2" /></pattern>
      <pattern id="harvest-trim" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#29344a" /><path d="M20 3L37 20 20 37 3 20Z" fill="none" stroke="#ebc780" strokeWidth="3" /><path d="M20 13l7 7-7 7-7-7Z" fill="#bd6844" /></pattern>
    </defs>
    <circle cx="220" cy="193" r="135" fill="#f1d7a4" />
    <circle cx="220" cy="193" r="113" fill="none" stroke="#bc7650" strokeWidth="1" strokeDasharray="3 8" />
    <path d="M49 376Q220 326 391 376v92H49Z" fill="#bc6848" />
    <path d="M44 393h352v59H44Z" fill="url(#harvest-trim)" />
    <g stroke="#555d3d" strokeWidth="4" fill="none"><path d="M185 304Q116 218 118 132M261 301Q328 232 320 124M218 298V119" /></g>
    <g fill="#586441"><ellipse cx="113" cy="154" rx="12" ry="31" transform="rotate(-35 113 154)" /><ellipse cx="135" cy="183" rx="12" ry="30" transform="rotate(38 135 183)" /><ellipse cx="135" cy="219" rx="12" ry="31" transform="rotate(-40 135 219)" /><ellipse cx="313" cy="157" rx="12" ry="30" transform="rotate(32 313 157)" /><ellipse cx="299" cy="198" rx="12" ry="30" transform="rotate(-35 299 198)" /><ellipse cx="295" cy="234" rx="12" ry="30" transform="rotate(45 295 234)" /></g>
    <g fill="#b87e32"><ellipse cx="208" cy="144" rx="8" ry="22" transform="rotate(-30 208 144)" /><ellipse cx="229" cy="164" rx="8" ry="22" transform="rotate(30 229 164)" /><ellipse cx="207" cy="183" rx="8" ry="22" transform="rotate(-30 207 183)" /><ellipse cx="229" cy="202" rx="8" ry="22" transform="rotate(30 229 202)" /><ellipse cx="207" cy="220" rx="8" ry="22" transform="rotate(-30 207 220)" /></g>
    <ellipse cx="218" cy="318" rx="115" ry="36" fill="#5b392c" />
    <g><ellipse cx="172" cy="305" rx="42" ry="33" fill="#be6239" /><path d="M170 276l9-20" stroke="#586441" strokeWidth="7" /><ellipse cx="250" cy="302" rx="48" ry="34" fill="#d99441" /><path d="M253 272l-3-19" stroke="#586441" strokeWidth="6" /><path d="M146 294q-5 18 5 33m21-52q-12 29-1 60m81-65q-15 30-4 65m20-60q20 23 10 50" fill="none" stroke="#f3ba6b" strokeWidth="3" /></g>
    <path d="M103 319Q218 358 333 319l-23 80Q217 431 126 399Z" fill="url(#harvest-weave)" stroke="#573b30" strokeWidth="4" />
    <path d="M104 319q114 40 229 0" fill="none" stroke="#edc784" strokeWidth="9" />
    <path d="M72 92l9 9-9 9-9-9Zm296 0 9 9-9 9-9-9Z" fill="#29344a" />
    <g transform="translate(70 330) rotate(-12)">
      <path d="M-34-38h68L17 21l7 48q-24 10-48 0l7-48Z" fill="#985329" stroke="#4b2b1d" strokeWidth="3" />
      <path d="M-27-36-11 20-17 66M-9-36-4 20-6 69M9-36 4 20 6 69M27-36 11 20 17 66" fill="none" stroke="#f1cf8a" strokeWidth="2" />
      <ellipse cy="-38" rx="36" ry="13" fill="#ebd5ad" stroke="#b43820" strokeWidth="5" />
      <path d="M-17 19h34v10h-34Z" fill="#0c4a3e" />
    </g>
    <g transform="translate(359 281)">
      <path d="M-15-30q15-57 30 0" fill="none" stroke="#80512a" strokeWidth="3" />
      <circle r="44" fill="#d99e3d" stroke="#86521f" strokeWidth="3" />
      <circle r="35" fill="none" stroke="#f4d287" strokeWidth="2" />
      <circle r="13" fill="#ae6e2a" stroke="#ebbf64" strokeWidth="3" />
      <path d="M-22 65 26 19" stroke="#5e3421" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="26" cy="19" rx="8" ry="12" transform="rotate(40 26 19)" fill="#0c4a3e" />
    </g>
    <text x="220" y="480" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" letterSpacing="4" fill="#29344a">ROOTED IN GRATITUDE</text>
  </svg>;
}

export default function CulturalHarvestPage() {
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <Link href="/events" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[#71452a] hover:underline"><Icon name="arrow_back" className="text-lg" />All church events</Link>
        <div className="mt-6 grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <Image src="/pcc-logo.png" alt="Presbyterian Church in Cameroon logo" width={64} height={64} className="rounded-full" />
              <p className="text-xs font-bold uppercase leading-relaxed tracking-[0.16em] text-[#0b0e4a]">Presbyterian Church<br /><span className="text-[#885023]">Kumba-Mbeng</span></p>
            </div>
            <h1 className={styles.heroTitle}>Cultural<br />Harvest<span className={styles.heroYear}>2026</span></h1>
            <div className="mt-7 border-l-4 border-[#e08a1e] pl-5">
              <p className={`${styles.serif} text-2xl leading-snug text-[#0c4a3e] sm:text-3xl`}>Filled with the bread of Life...<br />We will give with joyful hearts.</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#885023]">John 6:30–35</p>
            </div>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#535361]">Bring your culture. Bring your gratitude. Join us in worship, fellowship and joyful giving.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#ill-be-there" className={styles.heroPrimary}>I’ll be there · Create my card<Icon name="arrow_forward" className="text-lg" /></a>
              <a href="#celebration-details" className={styles.heroSecondary}>Plan your visit<Icon name="arrow_downward" className="text-lg" /></a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[400px] lg:max-w-none">
            <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.24em] text-[#885023]">Many cultures. One family in Christ.</p>
            <HarvestArtwork />
            <div className="relative mx-auto -mt-4 w-fit rounded-full bg-[#0b0e4a] px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg">Faith · Heritage · Thanksgiving</div>
          </div>
        </div>
      </div>
      <div className={styles.strip} aria-hidden="true" />
    </section>

    <section id="celebration-details" className="mx-auto max-w-6xl scroll-mt-36 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#aa5133]">An invitation to gather</p>
      <h2 className={`${styles.serif} mb-8 mt-3 text-4xl sm:text-5xl`}>Make room for thanksgiving.</h2>
      <HarvestDetails />
    </section>

    {/* <section className="bg-[#efe4ce] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2 md:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#aa5133]">Our heritage, our fellowship</p><h2 className={`${styles.serif} mt-4 text-4xl sm:text-5xl`}>Different expressions.<br /><span className="italic">A shared thanksgiving.</span></h2></div><p className="self-end text-lg leading-relaxed text-[#535361]">Cultural Harvest brings our expressions of heritage into a shared act of worship. Our clothing, our voices and our gratitude tell a story of community, with Christ at the centre.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{[
          { number: '01', title: 'Wear your heritage', text: 'You are warmly invited to celebrate in cultural attire that is meaningful to you. Come as you are; everyone belongs.' },
          { number: '02', title: 'Bring a grateful heart', text: 'Make space to reflect on God’s goodness and the gifts of community, family and fellowship.' },
          { number: '03', title: 'Come together', text: 'Invite a friend, bring your family, and share the joy of worship with the congregation.' },
        ].map(item => <article key={item.number} className="border-t-2 border-[#aa5133] bg-[#fcf5e6] p-7"><span className={`${styles.serif} text-3xl italic text-[#aa5133]`}>{item.number}</span><h3 className={`${styles.serif} mb-3 mt-5 text-2xl`}>{item.title}</h3><p className="text-sm leading-relaxed text-[#535361]">{item.text}</p></article>)}</div>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 lg:gap-16 lg:px-8">
      <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#aa5133]">Before you join us</p><h2 className={`${styles.serif} mt-4 text-4xl`}>A little help<br />planning your visit.</h2><Link href="/contact" className="mt-6 inline-flex min-h-[44px] items-center gap-2 font-semibold text-[#aa5133] underline underline-offset-4">Speak with the parish team<Icon name="arrow_forward" className="text-lg" /></Link></div>
      <div className="divide-y divide-[#252943]/15">{[
        ['Is everyone welcome?', 'Yes. Whether you are a regular worshipper, visiting family, or joining us for the first time, you are welcome.'],
        ['Do I need cultural attire?', 'Cultural attire is a lovely way to celebrate your heritage, but you are welcome in whatever you feel comfortable wearing for worship.'],
        ['Where can I find the service programme?', 'Please contact the parish team for the confirmed order of service and any arrangements for groups.'],
      ].map(([question, answer]) => <details key={question} className="py-5"><summary className="cursor-pointer py-2 text-lg font-semibold">{question}</summary><p className="mt-3 text-sm leading-relaxed text-[#535361]">{answer}</p></details>)}</div>
    </section> */}

    <HarvestCard />

    <section id="invitation" className="scroll-mt-36 bg-[#aa5133] px-4 py-14 text-[#fcf5e6] sm:px-6 sm:py-20 lg:px-8"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em]">There is a place for you</p><h2 className={`${styles.serif} mt-5 text-4xl sm:text-6xl`}>Thanksgiving is richer<br /><span className="italic">when we share it.</span></h2><p className="mx-auto mb-8 mt-5 max-w-xl leading-relaxed text-[#fcf5e6]/85">Pass the invitation to a friend or family member. Let us celebrate faith and heritage together at Cultural Harvest 2026.</p><ShareHarvest /></div></section>
    <div className={styles.strip} aria-hidden="true" />
  </div>;
}
