'use client';

import { appendUpload } from '@/lib/upload-file';

import { API_BASE_URL } from '@/lib/api-base';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const API_URL = API_BASE_URL;

const sermonSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
    speaker: z.string().min(1, 'Speaker is required'),
    sermon_date: z.string().min(1, 'Date is required'),
    content_type: z.enum(['audio', 'text'], {
      required_error: 'Content type is required',
    }),
    text_content: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.content_type === 'text') {
        return !!data.text_content && data.text_content.trim().length > 0;
      }
      return true;
    },
    { message: 'Text content is required for text sermons', path: ['text_content'] }
  );

type SermonFormData = z.infer<typeof sermonSchema>;

export default function CreateSermonPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SermonFormData>({
    resolver: zodResolver(sermonSchema),
    defaultValues: {
      content_type: 'audio',
    },
  });

  const contentType = watch('content_type');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) {
      setAudioFile(null);
      return;
    }

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only MP3 and WAV files are allowed');
      setAudioFile(null);
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setFileError('File must be less than 100MB');
      setAudioFile(null);
      return;
    }

    setAudioFile(file);
  };

  const onSubmit = async (data: SermonFormData) => {
    // Validate audio file for audio sermons
    if (data.content_type === 'audio' && !audioFile) {
      setFileError('Audio file is required for audio sermons');
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('speaker', data.speaker);
      formData.append('sermon_date', data.sermon_date);
      formData.append('content_type', data.content_type);

      if (data.content_type === 'text' && data.text_content) {
        formData.append('text_content', data.text_content);
      }

      if (audioFile) {
        await appendUpload(formData, 'audio', audioFile);
      }

      const res = await fetch(`${API_URL}/api/admin/sermons`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        router.push('/admin/sermons');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setServerError(
          errorData?.error?.message || errorData?.message || 'Failed to create sermon'
        );
      }
    } catch {
      setServerError('Failed to create sermon. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Sermon</h1>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Sermon title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Speaker */}
        <div>
          <label htmlFor="speaker" className="block text-sm font-medium text-gray-700 mb-1">
            Speaker <span className="text-red-500">*</span>
          </label>
          <input
            id="speaker"
            type="text"
            {...register('speaker')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Speaker name"
          />
          {errors.speaker && (
            <p className="mt-1 text-sm text-red-600">{errors.speaker.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="sermon_date" className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="sermon_date"
            type="date"
            {...register('sermon_date')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
          {errors.sermon_date && (
            <p className="mt-1 text-sm text-red-600">{errors.sermon_date.message}</p>
          )}
        </div>

        {/* Content Type */}
        <div>
          <label htmlFor="content_type" className="block text-sm font-medium text-gray-700 mb-1">
            Content Type <span className="text-red-500">*</span>
          </label>
          <select
            id="content_type"
            {...register('content_type')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          >
            <option value="audio">Audio</option>
            <option value="text">Text</option>
          </select>
          {errors.content_type && (
            <p className="mt-1 text-sm text-red-600">{errors.content_type.message}</p>
          )}
        </div>

        {/* Audio Upload (shown when content_type is audio) */}
        {contentType === 'audio' && (
          <div>
            <label htmlFor="audio" className="block text-sm font-medium text-gray-700 mb-1">
              Audio File <span className="text-red-500">*</span>
            </label>
            <input
              id="audio"
              type="file"
              accept=".mp3,.wav"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
            <p className="mt-1 text-xs text-gray-500">MP3 or WAV. Max 100MB.</p>
            {fileError && (
              <p className="mt-1 text-sm text-red-600">{fileError}</p>
            )}
            {audioFile && (
              <p className="mt-1 text-sm text-emerald-600">
                Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}

        {/* Text Content (shown when content_type is text) */}
        {contentType === 'text' && (
          <div>
            <label htmlFor="text_content" className="block text-sm font-medium text-gray-700 mb-1">
              Sermon Text <span className="text-red-500">*</span>
            </label>
            <textarea
              id="text_content"
              rows={8}
              {...register('text_content')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-y"
              placeholder="Enter sermon text content..."
            />
            {errors.text_content && (
              <p className="mt-1 text-sm text-red-600">{errors.text_content.message}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Sermon'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/sermons')}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
