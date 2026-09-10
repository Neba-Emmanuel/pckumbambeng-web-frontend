'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  body: z.string().min(1, 'Body is required'),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) {
      setAttachment(null);
      return;
    }

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only PDF, PNG, and JPG files are allowed');
      setAttachment(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setFileError('File must be less than 10MB');
      setAttachment(null);
      return;
    }

    setAttachment(file);
  };

  const onSubmit = async (data: AnnouncementFormData) => {
    setSubmitting(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('body', data.body);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const res = await fetch(`${API_URL}/api/admin/announcements`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        router.push('/admin/announcements');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setServerError(
          errorData?.error?.message || errorData?.message || 'Failed to create announcement'
        );
      }
    } catch {
      setServerError('Failed to create announcement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Announcement</h1>

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
            placeholder="Announcement title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Body <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            rows={6}
            {...register('body')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-y"
            placeholder="Announcement content..."
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
          )}
        </div>

        {/* Attachment */}
        <div>
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
            Attachment (optional)
          </label>
          <input
            id="attachment"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          <p className="mt-1 text-xs text-gray-500">PDF, PNG, or JPG. Max 10MB.</p>
          {fileError && (
            <p className="mt-1 text-sm text-red-600">{fileError}</p>
          )}
          {attachment && (
            <p className="mt-1 text-sm text-emerald-600">
              Selected: {attachment.name} ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Announcement'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/announcements')}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
