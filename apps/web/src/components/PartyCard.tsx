// apps/web/src/components/PartyCard.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PartyCard({ p }: { p: any }) {
  const cover = p.images?.[0] || `https://picsum.photos/seed/${p._id}/640/400`;
  return (
    <motion.article
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,.15)' }}
      className="card overflow-hidden"
    >
      <div className="relative h-44 w-full">
        <img src={cover} alt={p.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-3 bottom-3 flex items-center gap-2 text-white">
          <span className="badge bg-white/20 capitalize">{p.category}</span>
          {p.visibility === 'private' && <span className="badge bg-white/20">Private</span>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold">{p.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
        <div className="mt-2 text-sm text-gray-500">
          {new Date(p.date).toLocaleDateString()} {p.startTime ? `• ${p.startTime}` : ''}
          {' • '}{p.attendeesCount ?? 0} going
        </div>
        <div className="mt-3">
          <Link to={`/party/${p._id}`} className="btn-primary">View Details</Link>
        </div>
      </div>
    </motion.article>
  );
}
