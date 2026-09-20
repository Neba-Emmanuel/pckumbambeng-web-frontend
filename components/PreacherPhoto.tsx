'use client';

import Image from 'next/image';
import { useState } from 'react';
import { API_BASE_URL } from '@/lib/api-base';
import { Icon } from './Icon';

export function PreacherPhoto({ path, name }: { path?: string | null; name: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  const src = path?.startsWith('https://') || path?.startsWith('blob:') ? path : path ? `${API_BASE_URL}/uploads/${path.replace(/^\/?uploads\//, '')}` : '';
  return <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-navy-100 shadow-sm sm:h-28 sm:w-28">{src && failed !== src ? <Image unoptimized src={src} alt={`Portrait of ${name}`} fill sizes="112px" className="object-cover object-top" onError={() => setFailed(src)} /> : <span className="flex h-full items-center justify-center text-navy-600" aria-label={`Preacher: ${name}`}><Icon name="person" className="text-5xl" /></span>}</div>;
}
