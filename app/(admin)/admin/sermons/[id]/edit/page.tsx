'use client';
import { useParams } from 'next/navigation';
import { SermonForm } from '@/components/SermonForm';
export default function EditSermonPage() { const { id } = useParams<{ id: string }>(); return <SermonForm key={id} id={id} />; }
