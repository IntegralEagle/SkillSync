import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo, LogoIcon } from '@/components/Logo';
import type { Theme } from '@/lib/useTheme';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Find Team', path: '/create' },
  { label: 'Talent Pool', path: '/talent' },
  { label: 'My Team', path: '/team' },
  { label: 'About', path: '/about' },
];

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg-base/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Link to="/create" className="btn-primary">
            Find My Team
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            className="rounded-lg p-2 text-slate-300 hover:bg-white/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-bg-surface px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link to="/create" onClick={() => setOpen(false)} className="btn-primary mt-2">
              <LogoIcon className="h-4 w-4" /> Find My Team
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
