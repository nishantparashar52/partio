import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PartyCard from '../components/PartyCard';
import CategoryPills from '../components/CategoryPills';


export default function LandingPage() {
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [geo, setGeo] = useState<{lat?: number; lng?: number}>({});

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['parties', category, q, geo.lat, geo.lng],
    queryFn: () => api.listParties({ category, q, lat: geo.lat, lng: geo.lng, radiusKm: 10 }),
  });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-2xl bg-white/70 p-6 shadow-soft ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
        <div className="grid items-center gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Find parties by <span className="text-brand-600">interest</span> & location
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
              Discover what’s happening near you—music, food, tech, sports, and more.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input className="input" placeholder="Search (e.g., indie music, home chef, hackathon)" value={q} onChange={(e)=>setQ(e.target.value)} />
              <button className="btn-ghost" onClick={() => setGeo(geo)}>Use my location {geo.lat ? '✅' : ''}</button>
            </div>
            <div className="mt-3"><CategoryPills value={category} onChange={setCategory} /></div>
          </div>
          <div className="hidden md:block">
            <div className="h-40 rounded-2xl bg-gradient-to-br from-brand-500/15 to-brand-700/10" />
          </div>
        </div>
      </section>

      {isLoading && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({length:6}).map((_,i)=><div key={i} className="card p-4"><div className="h-40 w-full skeleton" /><div className="mt-3 h-4 w-3/4 skeleton" /><div className="mt-2 h-3 w-1/2 skeleton" /></div>)}
      </div>}
      {error && <div className="text-red-600">{(error as Error).message}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(data?.parties || []).map((p: any) => <PartyCard key={p._id} p={p} />)}
      </div>
    </div>
  );
}
