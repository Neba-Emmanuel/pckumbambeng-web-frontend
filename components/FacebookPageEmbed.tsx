'use client';

import { useEffect, useRef, useState } from 'react';

export function FacebookPageEmbed({ url, title, height = 640 }: { url: string; title: string; height?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.min(500, Math.floor(entry.contentRect.width)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const params = new URLSearchParams({
    href: url,
    tabs: 'timeline',
    width: String(width ?? 500),
    height: String(height),
    small_header: 'false',
    adapt_container_width: 'true',
    hide_cover: 'false',
    show_facepile: 'false',
  });

  return (
    <div ref={container} className="mx-auto w-full max-w-[500px] bg-white" style={{ minHeight: height }}>
      {width !== null && width >= 180 ? (
        <iframe
          key={width}
          src={`https://www.facebook.com/plugins/page.php?${params}`}
          title={`${title} Facebook timeline`}
          width={width}
          height={height}
          className="block max-w-full border-0"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : <p className="p-5 text-sm text-gray-500">Open the Facebook page below to read its updates.</p>}
    </div>
  );
}
