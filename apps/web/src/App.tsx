import { Routes, Route, Link, NavLink } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PartyDetailsPage from './pages/PartyDetailsPage';
import CreatePartyPage from './pages/CreatePartyPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import { MotionConfig } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from './lib/auth';


function ThemeToggle() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  return (
    <button className="btn-ghost" aria-label="Toggle theme" onClick={() => setDark(d => !d)}>
      {dark ? '🌙' : '☀️'}
    </button>
  );
}

export default function App() {
  const { user, logout } = useAuth();
  return (
    <MotionConfig reducedMotion="user">{/* respects OS setting */}{/* [8](https://motion.dev/)[9](https://framermotionexamples.com/example/framer-motion-reducedmotion) */}
      <div className="min-h-screen bg-hero-radial">
        <nav className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-md dark:bg-neutral-950/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link to="/" className="font-display text-2xl font-extrabold text-brand-700 dark:text-brand-400">
              PartyFindr
            </Link>
            <div className="flex items-center gap-2">
              <NavLink to="/create" className="btn-primary hidden sm:inline-flex">Create Party</NavLink>
              <NavLink to="/dashboard" className="btn-ghost">My Parties</NavLink>              
              {!user ? (
                  <Link to="/auth" className="btn">Login</Link>
                ) : (
                  <button className="btn" onClick={logout}>Logout</button>
                )}

              <ThemeToggle />
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/party/:id" element={<PartyDetailsPage />} />
            <Route path="/create" element={<CreatePartyPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
      </div>
    </MotionConfig>
  );
}
