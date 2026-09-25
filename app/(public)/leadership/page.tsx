import Link from "next/link";
import { Icon } from "@/components/Icon";
import { LeadershipPortrait } from "@/components/LeadershipPortrait";
import leadershipSections from "../data";

export default function LeadershipPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-surface-low">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-navy-100/60 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {/* <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-ink-variant">
            <Link href="/" className="inline-flex items-center hover:text-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-700">Home</Link>
            <span aria-hidden="true" className="text-gold-700">/</span>
            <span aria-current="page" className="font-semibold text-navy-900">Leadership</span>
          </nav> */}
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-700">
                <Icon name="shield_person" className="text-xl" />
                Serving our congregation
              </p>
              <h1 className="max-w-2xl text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                Shepherds &amp; Servants of the Flock
              </h1>
              <p className="mt-5 max-w-2xl text-base text-ink-variant sm:text-lg">
                Meet the dedicated men and women guiding our church in faith, fellowship, and
                compassionate service in Kumba-Mbeng.
              </p>
            </div>
            <figure className="rounded-xl border-l-4 border-gold-500 bg-white p-6 shadow-sm lg:col-span-5 sm:p-8">
              <Icon name="format_quote" className="mb-3 text-3xl text-gold-700" />
              <blockquote className="text-xl italic leading-relaxed text-navy-900">
                “Obey your leaders and submit to them, for they are keeping watch over your souls,
                as those who will have to give an account.”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-gold-700">
                — Hebrews 13:17
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <nav
        aria-label="Leadership sections"
        className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 pt-8 sm:px-6 lg:px-8"
      >
        {leadershipSections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white px-4 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-700"
          >
            <Icon name={section.icon} className="text-lg" />
            {section.title}
          </a>
        ))}
      </nav>

      {leadershipSections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="mx-auto max-w-7xl scroll-mt-32 px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-700">
                {section.overline}
              </p>
              <h2
                id={`${section.id}-heading`}
                className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl"
              >
                {section.title}
              </h2>
              <p className="mt-3 max-w-2xl text-ink-variant">{section.description}</p>
            </div>
            <span className="self-start whitespace-nowrap rounded-full bg-navy-50 px-4 py-2 text-sm font-semibold text-navy-800">
              {section.countLabel}
            </span>
          </div>
          <div
            className={`mt-6 grid gap-4 ${section.gridClass} ${section.id === "pastors" ? "max-w-3xl" : ""}`}
          >
            {section.members.map((member) => (
              <article key={member.id} className="px-4 py-6 text-center">
                <LeadershipPortrait
                  src={member.picture}
                  name={member.name}
                  role={member.role}
                  featured={section.id === "pastors"}
                />
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-gold-700">
                    {member.role}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-navy-900">{member.name}</h3>
                  {"group" in member && (
                    <p className="mt-2 text-sm text-ink-variant">{String(member.group)}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section
        id="pastoral-care"
        aria-labelledby="pastoral-care-heading"
        className="scroll-mt-32 bg-surface-low px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl bg-white shadow-sm md:grid-cols-2">
          <div className="bg-navy-900 p-6 text-white sm:p-8">
            <Icon name="volunteer_activism" className="text-3xl text-gold-300" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold-200">
              Pastoral presence
            </p>
            <h2 id="pastoral-care-heading" className="mt-3 text-2xl font-bold sm:text-3xl">
              Counseling &amp; Pastoral Care
            </h2>
            <p className="mt-4 text-navy-100">
              Find support through prayer, spiritual guidance, family concerns, and times of
              bereavement.
            </p>
          </div>
          <div className="flex flex-col items-start justify-center p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-navy-900">Speak with our pastoral team</h3>
            <p className="mt-3 text-ink-variant">
              Contact the Congregation to ask about availability and arrange a conversation with a
              member of the team.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-700"
            >
              Contact the Congregation <Icon name="arrow_forward" className="text-lg" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
