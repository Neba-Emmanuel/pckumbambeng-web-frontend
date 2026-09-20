'use client';

import { appendUpload } from '@/lib/upload-file';

import { API_BASE_URL } from '@/lib/api-base';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const API_URL = API_BASE_URL;

const announcementSchema = z.object({
  expires_on: z.union([z.string().date('Choose a valid date'), z.literal('')]).optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  body: z.string().min(1, 'Body is required'),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [existingAttachment, setExistingAttachment] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/announcements/${id}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          const announcement = data.data || data.announcement || data;
          reset({
            title: announcement.title,
            body: announcement.body,
            expires_on: announcement.expires_on || '',
          });
          if (announcement.attachment_path) {
            setExistingAttachment(announcement.attachment_path);
          }
        } else {
          setServerError('Failed to load announcement');
        }
      } catch {
        setServerError('Failed to load announcement');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id, reset]);

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

    const maxSize = 10 * 1024 * 1024;
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
      formData.append('expires_on', data.expires_on || '');
      if (attachment) {
        await appendUpload(formData, 'attachment', attachment);
      }

      const res = await fetch(`${API_URL}/api/admin/announcements/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        router.push('/admin/announcements');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setServerError(
          errorData?.error?.message || errorData?.message || 'Failed to update announcement'
        );
      }
    } catch {
      setServerError('Failed to update announcement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading announcement...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Announcement</h1>

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

        <div>
          <label htmlFor="expires_on" className="mb-1 block text-sm font-medium text-gray-700">Show until (optional)</label>
          <input id="expires_on" type="date" {...register('expires_on')} aria-describedby="expiry-help" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-navy-500" />
          <p id="expiry-help" className="mt-2 text-sm text-gray-500">Visible through this date in Cameroon time, then automatically hidden. Leave blank to keep it visible. You can still edit expired announcements here.</p>
          {errors.expires_on && <p className="mt-1 text-sm text-red-600">{errors.expires_on.message}</p>}
        </div>

        {/* Attachment */}
        <div>
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
            Attachment (optional)
          </label>
          {existingAttachment && !attachment && (
            <p className="mb-2 text-sm text-gray-600">
              Current attachment: <span className="font-medium">{existingAttachment.split('/').pop()}</span>
            </p>
          )}
          <input
            id="attachment"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          <p className="mt-1 text-xs text-gray-500">PDF, PNG, or JPG. Max 10MB. Upload to replace existing.</p>
          {fileError && (
            <p className="mt-1 text-sm text-red-600">{fileError}</p>
          )}
          {attachment && (
            <p className="mt-1 text-sm text-emerald-600">
              New file: {attachment.name} ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
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
            {submitting ? 'Saving...' : 'Save Changes'}
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
