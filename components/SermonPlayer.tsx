'use client';

import { API_BASE_URL } from '@/lib/api-base';

import { useRef, useState } from 'react';

const API_URL = API_BASE_URL;

interface SermonPlayerProps {
  sermonId: number;
  title: string;
  speaker: string;
}

export default function SermonPlayer({ sermonId, title, speaker }: SermonPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState(false);

  const streamUrl = `${API_URL}/api/sermons/${sermonId}/stream`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{speaker}</p>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Unable to load audio. Please try again later.
        </div>
      ) : (
        <audio
          ref={audioRef}
          controls
          crossOrigin="use-credentials"
          className="w-full"
          onError={() => setError(true)}
          preload="metadata"
        >
          <source src={streamUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
