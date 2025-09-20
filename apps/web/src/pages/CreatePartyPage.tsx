import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'

function ClickToSetMarker({ setCoords }: { setCoords: (lnglat: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setCoords([e.latlng.lng, e.latlng.lat])
    }
  })
  return null
}

export default function CreatePartyPage() {
  const nav = useNavigate()
  const [form, setForm] = useState<any>({
    title: '', description: '', category: 'music', visibility: 'public',
    date: new Date().toISOString().slice(0,10), startTime: '19:00', endTime: '22:00',
    location: { name: '', geo: undefined as any },
    capacity: 10, price: 0
  })

  const create = useMutation({
    mutationFn: () => api.createParty({
      ...form,
      date: new Date(form.date),
      location: form.location.geo ? { name: form.location.name, geo: { type: 'Point', coordinates: form.location.geo.coordinates } } : { name: form.location.name }
    }),
    onSuccess: (res) => nav(`/party/${res.party._id}`)
  })

  function set<K extends string>(key: K, value: any) {
    setForm((f: any) => ({ ...f, [key]: value }))
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(pos => {
      set('location', {
        ...form.location,
        geo: { type: 'Point', coordinates: [pos.coords.longitude, pos.coords.latitude] as [number, number] }
      })
    })
  }

  const coords = form.location.geo?.coordinates as [number, number] | undefined

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Create a New Party</h1>
      <div className="card p-4 space-y-3">
        <input className="input" placeholder="Title" value={form.title} onChange={e => set('title', e.target.value)} />
        <textarea className="input h-28" placeholder="Description" value={form.description} onChange={e => set('description', e.target.value)} />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
            <option>music</option><option>food</option><option>tech</option><option>sports</option><option>gaming</option>
          </select>
          <select className="input" value={form.visibility} onChange={e => set('visibility', e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private (approval required)</option>
          </select>
          <input type="date" className="input" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input className="input" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
          <input className="input" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
          <input className="input" type="number" min={0} placeholder="Capacity" value={form.capacity} onChange={e => set('capacity', Number(e.target.value))} />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <input className="input" placeholder="Location name"
                 value={form.location.name} onChange={e => set('location', { ...form.location, name: e.target.value })} />
          <div className="flex gap-2">
            <button className="btn" onClick={useMyLocation}>Use my location</button>
            <span className="text-sm text-gray-600">Or click on the map to drop a pin</span>
          </div>
          <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: 300, width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            {coords && <Marker position={[coords[1], coords[0]]} />}
            <ClickToSetMarker setCoords={(lnglat) => set('location', { ...form.location, geo: { type: 'Point', coordinates: lnglat } })} />
          </MapContainer>
          {coords && (
            <div className="text-sm text-gray-600">Lat/Lng: {coords[1].toFixed(5)}, {coords[0].toFixed(5)}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input className="input" type="number" min={0} placeholder="Price (₹)" value={form.price} onChange={e => set('price', Number(e.target.value))} />
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn" onClick={() => history.back()}>Cancel</button>
          <button className="btn btn-primary" onClick={() => create.mutate()} disabled={create.isPending}>
            Publish Party
          </button>
        </div>
      </div>
    </div>
  )
}
