import { upload } from '@vercel/blob/client';
import { API_BASE_URL } from './api-base';

export async function appendUpload(form: FormData, field: 'audio' | 'attachment' | 'preacher_image', file: File) {
  if (field !== 'preacher_image' && process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_BLOB_UPLOADS !== 'true') {
    form.append(field, file);
    return;
  }
  const folder = field === 'audio' ? 'sermons' : field === 'preacher_image' ? 'preachers' : 'announcements';
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const result = await upload(`${folder}/${crypto.randomUUID()}.${extension}`, file, {
    access: 'public',
    handleUploadUrl: `${API_BASE_URL}/api/uploads/blob`,
    multipart: file.size > 4 * 1024 * 1024,
  });
  form.append(`${field}_url`, result.url);
}
