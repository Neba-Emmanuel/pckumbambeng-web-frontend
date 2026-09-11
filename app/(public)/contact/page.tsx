'use client';

import { FormEvent, useState } from 'react';
import { Icon } from '@/components/Icon';
import { apiSend } from '@/lib/api-client';

const mapQuery = encodeURIComponent('Presbyterian Church Kumba Mbeng, Kumba, Cameroon');
const inputClass = 'mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-300/40';

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setSending(true);
    setError('');
    setSent(false);
    try {
      await apiSend('/api/contact', 'POST', values);
      form.reset();
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-hero px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-300">Our doors are open</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">Let’s connect.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">Planning your first visit, looking for fellowship, or have a question? Reach out to the Kumba-Mbeng Congregation team. We would love to hear from you.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-5 lg:gap-16 lg:px-8">
        <div className="lg:col-span-2">
          <span className="text-sm font-bold uppercase tracking-wider text-gold-600">A place to belong</span>
          <h2 className="mt-3 text-3xl font-bold text-navy-900">Come as you are.</h2>
          <p className="mt-4 text-gray-600">Join us in worship or send a message to our Congregation team using the form.</p>
          <div className="mt-8 space-y-7">
            <div className="flex gap-4"><Icon name="location_on" className="text-navy-700 text-2xl" /><div><h3 className="font-bold text-navy-900">Visit the Congregation</h3><p className="mt-1 text-gray-600">Presbyterian Church Kumba-Mbeng<br />Kumba, South West Region, Cameroon</p></div></div>
            <div className="flex gap-4"><Icon name="mail" className="text-navy-700 text-2xl" /><div className="min-w-0"><h3 className="font-bold text-navy-900">Email us</h3><a href="mailto:contact@pckumbambeng.org" className="mt-1 inline-block break-all text-navy-700 underline underline-offset-4">contact@pckumbambeng.org</a></div></div>
            <div className="flex gap-4"><Icon name="church" className="text-navy-700 text-2xl" /><div><h3 className="font-bold text-navy-900">Sunday worship</h3><p className="mt-1 text-gray-600">1st Service · 7:00 AM<br />2nd Service · 9:30 AM</p></div></div>
          </div>
          <div className="mt-9 rounded-2xl border border-gold-200 bg-gold-50 p-6"><p className="font-semibold text-navy-900">New to our community?</p><p className="mt-2 text-sm text-navy-700">Tell us you’re planning a visit. We’ll be glad to help you feel at home.</p></div>
        </div>

        <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-lg sm:p-9 lg:col-span-3">
          <h2 className="text-2xl font-bold text-navy-900">Send us a message</h2>
          <p className="mt-2 text-sm text-gray-600">All fields are required except phone number.</p>
          <form onSubmit={submit} className="mt-7 space-y-5">
            <fieldset disabled={sending} className="space-y-5 disabled:opacity-60">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-navy-900" htmlFor="contact-name">Your name<input className={inputClass} id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={120} /></label>
                <label className="block text-sm font-semibold text-navy-900" htmlFor="contact-email">Email address<input className={inputClass} id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
              </div>
              <label className="block text-sm font-semibold text-navy-900" htmlFor="contact-phone">Phone number <span className="font-normal text-gray-500">(optional)</span><input className={inputClass} id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
              <label className="block text-sm font-semibold text-navy-900" htmlFor="contact-subject">Subject<input className={inputClass} id="contact-subject" name="subject" required minLength={2} maxLength={160} placeholder="How can we help?" /></label>
              <label className="block text-sm font-semibold text-navy-900" htmlFor="contact-message">Your message<textarea className={inputClass + ' resize-y'} id="contact-message" name="message" rows={6} required minLength={10} maxLength={5000} placeholder="Share your question or tell us about your planned visit…" /></label>
              <p className="text-xs text-gray-500">Your contact details and message will be shared with the Congregation administrators so they can respond.</p>
              <button type="submit" className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold px-6 py-3 font-bold text-navy-900 shadow-sm transition-shadow hover:shadow-glow disabled:cursor-wait sm:w-auto">{sending ? 'Sending…' : 'Send message'}<Icon name="send" className="text-xl" /></button>
            </fieldset>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
            {sent && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-800">Thank you! Your message has been received by the Congregation team.</p>}
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="map-heading">
        <div className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8"><div><h2 id="map-heading" className="text-2xl font-bold text-navy-900">How to find us</h2><p className="mt-2 text-gray-600">We look forward to welcoming you.</p></div><a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-navy-50 px-5 py-3 font-semibold text-navy-800">Open Google Maps<Icon name="open_in_new" className="text-lg" /></a></div>
          <iframe title="Google Maps: Presbyterian Church Kumba-Mbeng" src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`} className="h-[360px] w-full border-0 sm:h-[440px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      </section>
    </div>
  );
}
