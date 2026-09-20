import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/Icon';

const serviceSchedule = [
  { icon: 'wb_sunny', title: '1st Divine Worship', detail: 'English & Choral Liturgy', time: '7:00 AM' },
  { icon: 'auto_stories', title: 'Sunday School', detail: 'Children & Youth Classes', time: '7:00 AM & 9:30AM' },
  { icon: 'church', title: '2nd Divine Worship', detail: 'Main Congregation Assembly', time: '9:30 AM' },
  { icon: 'menu_book', title: 'Thursday Bible Study', detail: 'Verse-by-verse Scripture', time: '5:00 PM' },
  // { icon: 'volunteer_activism', title: 'Friday Fasting & Prayer', detail: 'Healing & Deliverance', time: '4:30 PM' },
  { icon: 'diversity_3', title: 'Fellowship Gatherings', detail: 'CYF · CWF · CMF · Choir', time: 'Weekly' },
];

const fellowships = [
  { img: '/cyf-logo.png', name: 'Christian Youth Fellowship (CYF)', desc: 'Empowering young believers through scripture, leadership, and choral competitions.', meet: 'Tuesday 4:00 PM' },
  { img: '/cwf-logo.jpeg', name: 'Christian Women Fellowship (CWF)', desc: 'The pillar of Congregation prayer, hospitality, benevolence, and community welfare.', meet: 'Tuesdays 4:00 PM' },
  { img: '/cmf-logo.jpeg', name: 'Christian Men Fellowship (CMF)', desc: 'Men dedicated to godly leadership, stewardship, and mentoring the young.', meet: 'Wednesday 4:00 PM' },
  { img: '/lay-training-logo.jpg', name: 'Congregation Choirs & Singing Bands', desc: 'From classical Presbyterian hymns to contemporary African choral praise.', meet: 'Tues - Sat rehearsals' },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-hero">
        <Image
          src="/hero-banner.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-navy-950/70 lg:bg-gradient-to-r lg:from-navy-950/90 lg:via-navy-950/70 lg:to-navy-950/35" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          {/* Upcoming gathering pill */}
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-gold-300 animate-pulse" />
            <span className="text-sm text-white/85 font-medium">
              Next Divine Worship — Sunday 9:30 AM
            </span>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Headline + CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-3 text-gold-300">
                <span className="text-xs uppercase tracking-widest font-bold">
                  Kumba-Mbeng Congregation
                </span>
                <span className="h-0.5 w-12 bg-gold-300/50" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
                A House of Prayer, Fellowship &amp; Faithful Witness in{' '}
                <span className="text-gradient-gold">Kumba-Mbeng</span>
              </h1>
              <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
                Presbyterian Church in Cameroon — Kumba-Mbeng Congregation. Welcoming all people
                across Kumba Presbytery and beyond to grow in Christ, worship with reverent joy,
                and serve our community with sacrificial love.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 bg-gradient-gold text-navy-900 font-bold rounded-xl shadow-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
                >
                  <Icon name="church" className="text-[20px]" />
                  Plan Your Visit
                </Link>
                <Link
                  href="/sermons"
                  className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 min-h-[44px]"
                >
                  <Icon name="play_circle" className="text-gold-300 text-[22px]" />
                  Watch Latest Sermon
                </Link>
              </div>
            </div>

            {/* Congregation theme card */}
            {/* <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-navy-800/70 backdrop-blur-md p-8 text-white border border-white/10">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-gold-400/20 blur-2xl pointer-events-none" />
                <div className="relative flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-gradient-gold text-navy-900 text-xs font-bold uppercase tracking-wider">
                      Congregation Theme
                    </span>
                    <span className="italic text-gold-300 text-sm">2 Corinthians 5:7</span>
                  </div>
                  <h3 className="text-2xl font-bold">Living by Unshakable Faith</h3>
                  <p className="text-white/80 leading-relaxed">
                    &ldquo;For we walk by faith, not by sight.&rdquo; Standing resilient in
                    prayer, fellowship, and service across Meme Division.
                  </p>
                  <div className="pt-4 flex items-center justify-between border-t border-white/10 text-sm">
                    <span className="flex items-center gap-2 text-gold-300">
                      <Icon name="history_edu" className="text-[18px]" />
                      <span className="text-xs font-bold tracking-wide uppercase">Est. 1964 · Kumba</span>
                    </span>
                    <span className="italic text-white/70 text-[13px]">Pacesetters</span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-14">
            {[
              { n: '50+', l: 'Years of Gospel Witness' },
              { n: '12', l: 'Active Fellowships' },
              { n: '2', l: 'Sunday Worship Services' },
              { n: '1,200+', l: 'Faithful Congregants' },
            ].map((s) => (
              <div key={s.l} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-3xl font-bold text-gold-300 leading-none mb-1">{s.n}</span>
                <span className="text-sm text-white/80">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#fbf9f6"
            />
          </svg>
        </div>
      </section>

      {/* ── Service Schedule ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-gold-600 mb-3">
              Liturgy &amp; Gatherings
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900">Weekly Order of Worship</h2>
            <div className="mt-4 w-20 h-1 bg-gradient-gold rounded-full mx-auto" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {serviceSchedule.map((s) => (
              <div key={s.title} className="card-elevated p-8 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center group-hover:bg-navy-100 transition-colors">
                    <Icon name={s.icon} className="text-navy-700 text-[28px]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gold-100 text-navy-900 text-sm font-bold">
                    {s.time}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-navy-900">{s.title}</h3>
                <p className="mt-1 text-gray-500 text-sm">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Sermon ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-navy text-white shadow-2xl relative overflow-hidden p-8 lg:p-12">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-navy-700/50 blur-3xl pointer-events-none" />
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-navy-950 shadow-2xl">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/shmUMCq1Z5A"
                    title="Featured sermon video"
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col gap-4">
                <span className="px-3 py-1 rounded bg-gradient-gold text-navy-900 text-xs font-bold uppercase tracking-wider w-fit">
                  Featured Sermon
                </span>
                <h3 className="text-2xl font-bold">Watch our featured sermon</h3>
                <p className="text-white/80 leading-relaxed">
                  Take a moment to listen, reflect, and grow in faith through God’s Word.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=shmUMCq1Z5A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-gold-300 hover:text-gold-200"
                >
                  Watch on YouTube <span className="sr-only">(opens in a new tab)</span>
                  <Icon name="open_in_new" className="text-[18px]" />
                </a>
                <Link
                  href="/sermons"
                  className="inline-flex items-center gap-2 text-gold-300 font-semibold hover:text-gold-200 transition-colors mt-1"
                >
                  Browse Full Sermon Archive
                  <Icon name="arrow_forward" className="text-[18px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fellowships ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-gold-600 mb-3">
              Fellowship Wings
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900">A Place for Every Hand &amp; Heart</h2>
            <div className="mt-4 w-20 h-1 bg-gradient-gold rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {fellowships.map((f) => (
              <div key={f.name} className="card-elevated p-8 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center text-navy-800 mb-4">
                    <Image src={f.img} alt={f.name} width={32} height={32} className="text-[24px] rounded-full" />
                  </div>
                  <h3 className="font-bold text-lg text-navy-900 mb-2">{f.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.desc}</p>
                </div>
                <div className="text-sm text-navy-800 bg-navy-50 rounded-lg px-3 py-2">
                  <span className="font-bold">Meets:</span> {f.meet}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-10 right-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Come Worship With Us</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Join a loving community of believers committed to growing together in faith,
            fellowship, and service. All are welcome.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-navy-900 font-bold rounded-xl shadow-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
          >
            Get in Touch
            <Icon name="arrow_forward" className="text-[20px]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
