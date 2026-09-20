'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/Icon';

export function LeadershipPortrait({ src, name, role, featured = false }: {
  src: string;
  name: string;
  role: string;
  featured?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const available = src && failedSrc !== src;

  return (
    <div className={`relative mx-auto shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-navy-50 via-white to-navy-100 ring-2 ring-navy-100 ring-offset-4 ring-offset-white shadow-sm ${featured ? 'h-44 w-44' : 'h-36 w-36'}`}>
      {available ? (
        <Image
          src={src}
          alt={`Portrait of ${name === 'Name to be announced' ? role : name}`}
          fill
          sizes={featured ? '176px' : '144px'}
          className="object-cover object-top"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center text-navy-600">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-navy-100 bg-white/80" aria-hidden="true">
            <Icon name="person" className="text-4xl" />
          </span>
          <p className="text-xs font-medium">Photo coming soon</p>
        </div>
      )}
    </div>
  );
}
