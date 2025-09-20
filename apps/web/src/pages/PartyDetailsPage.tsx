// apps/web/src/pages/PartyDetailsPage.tsx
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useState } from 'react';

export default function PartyDetailsPage() {
  const { id = '' } = useParams();
  const qc = useQueryClient();
  const [message, setMessage] = useState('');

  const { data, isLoading, error } = useQuery({ queryKey: ['party', id], queryFn: () => api.getParty(id), enabled: !!id });
  const join = useMutation({
    mutationFn: () => api.join(id, message),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['party', id] }); alert('Request sent / joined'); }
  });

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{(error as Error).message}</div>;

  const p = data?.party;
  const cover = p.images?.[0] || `https://picsum.photos/seed/${p._id}/1200/600`;

  return (
    <div className="space-y-4">
      <header className="relative overflow-hidden rounded-2xl">
        <img src={cover} alt={p.title} className="h-60 w-full object-cover sm:h-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-white drop-shadow sm:text-4xl">{p.title}</h1>
            <div className="mt-1 text-sm text-white/90">
              <span className="badge bg-white/20 capitalize">{p.category}</span>
              <span className="ml-2">{new Date(p.date).toLocaleString()}</span>
              {p.visibility === 'private' && <span className="ml-2 badge bg-white/20">Private</span>}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <section className="card p-5 prose prose-sm dark:prose-invert">
            <h2>About</h2>
            <p>{p.description}</p>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <div className="font-semibold">Location</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{p.location?.name || 'TBD'}</div>
            </div>
            <div className="card p-5">
              <div className="font-semibold">Capacity & Price</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{p.capacity || '—'} seats • ₹{p.price || 0}</div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="card p-5">
            <label className="block text-sm font-medium">Message to host (optional)</label>
            <textarea className="input h-24" value={message} onChange={e => setMessage(e.target.value)} />
            <button className="btn-primary mt-3 w-full" onClick={() => join.mutate()} disabled={join.isPending}>
              {p.visibility === 'public' ? 'Join Now' : 'Request to Join'}
            </button>
            <div className="mt-2 text-xs text-gray-500">We keep actions clear and text legible for all ages (contrast AA+).{/* [5](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)[6](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast) */}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
