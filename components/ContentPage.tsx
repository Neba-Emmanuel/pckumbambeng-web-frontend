import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

export function ContentPage({
  title,
  eyebrow,
  description,
  icon,
  children,
  action,
}: {
  title: string;
  eyebrow: string;
  description: string;
  icon: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-warm-white">
      <header className="relative overflow-hidden bg-navy-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border-[40px] border-white/5"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-200">
            <Icon name={icon} className="text-xl" />
            {eyebrow}
          </p>
          <h1 className="max-w-4xl break-words font-serif text-4xl leading-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-navy-100">{description}</p>
          {action && <div className="mt-6">{action}</div>}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">{children}</div>
    </div>
  );
}
