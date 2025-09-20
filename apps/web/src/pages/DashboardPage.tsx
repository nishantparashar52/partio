import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [tab, setTab] = useState<'hosting'|'attending'|'requests'>('hosting')
  const qc = useQueryClient()
  const hostingQ = useQuery({ queryKey: ['me','hosting'], queryFn: () => api.myParties('host') })
  const attendingQ = useQuery({ queryKey: ['me','attending'], queryFn: () => api.myParties('guest') })
  const requestsQ = useQuery({ queryKey: ['me','requests'], queryFn: api.listRequests })

  const approve = useMutation({
    mutationFn: (id: string) => api.approveRequest(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['me','requests'] }); qc.invalidateQueries({ queryKey: ['me','attending'] }); }
  })
  const reject = useMutation({
    mutationFn: (id: string) => api.rejectRequest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me','requests'] })
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button className={`btn ${tab==='hosting' ? 'btn-primary' : ''}`} onClick={() => setTab('hosting')}>Hosting</button>
        <button className={`btn ${tab==='attending' ? 'btn-primary' : ''}`} onClick={() => setTab('attending')}>Attending</button>
        <button className={`btn ${tab==='requests' ? 'btn-primary' : ''}`} onClick={() => setTab('requests')}>Requests</button>
      </div>

      {tab==='hosting' && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {(hostingQ.data?.parties || []).map((p: any) => (
            <div key={p._id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-500">{new Date(p.date).toLocaleString()}</div>
                </div>
                <Link to={`/party/${p._id}`} className="btn">Manage</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='attending' && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {(attendingQ.data?.parties || []).map((p: any) => (
            <div key={p._id} className="card p-4">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-500">Host • {new Date(p.date).toLocaleString()}</div>
              <Link to={`/party/${p._id}`} className="btn mt-2">View</Link>
            </div>
          ))}
        </div>
      )}

      {tab==='requests' && (
        <div className="space-y-2">
          {(requestsQ.data?.requests || []).map((r: any) => (
            <div key={r._id} className="card p-3 flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">{r.userId?.email}</div>
                <div className="text-gray-600">Party: {r.partyId?.title}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={() => reject.mutate(r._id)}>Reject</button>
                <button className="btn btn-primary" onClick={() => approve.mutate(r._id)}>Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
