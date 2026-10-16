import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';
import { ShieldCheck, Sparkles, Menu, X, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout: (plan?: 'starter' | 'pro' | 'enterprise') => void;
  onOpenDocs: () => void;
  onOpenPlayground: () => void;
  onOpenAdmin: () => void;
  onScrollTo: (id: string) => void;
}

export function Navbar({ onOpenCheckout, onOpenDocs, onOpenPlayground, onOpenAdmin, onScrollTo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 md:px-12 py-3.5 bg-dark-bg/70 backdrop-blur-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-2 group cursor-pointer select-none"
          onClick={() => {
            onScrollTo('hero');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">🪟</span>
          <span className="text-lg md:text-xl font-display font-extrabold tracking-tight bg-gradient-to-r from-cyan-vibrant to-purple-vibrant bg-clip-text text-transparent">
            Glass Wing
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-vibrant/10 text-cyan-vibrant border border-cyan-vibrant/30">
            v2.4.0
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-7">
          <NavLink onClick={() => onScrollTo('features')}>Features</NavLink>
          <NavLink onClick={onOpenDocs}>Docs & API</NavLink>
          <NavLink onClick={() => onScrollTo('pricing')}>Pricing</NavLink>
          <NavLink onClick={() => onScrollTo('testimonials')}>Reviews</NavLink>
          
          <button
            onClick={onOpenPlayground}
            className="text-xs font-semibold text-white/70 hover:text-cyan-vibrant flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-vibrant" />
            <span>Playground</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="text-xs font-semibold text-white/70 hover:text-purple-vibrant flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-vibrant" />
            <span>Admin Portal</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.04, translateY: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onOpenCheckout('pro')}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-vibrant to-blue-vibrant text-black font-extrabold text-xs shadow-lg glow-cyan transition-all"
          >
            Get Started →
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => onOpenCheckout('pro')}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-vibrant to-blue-vibrant text-black font-bold text-xs"
          >
            Get Started
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-3 pb-4"
          >
            <button
              onClick={() => { onScrollTo('features'); setMobileMenuOpen(false); }}
              className="text-left text-sm text-white/80 py-1 hover:text-cyan-vibrant"
            >
              Features
            </button>
            <button
              onClick={() => { onOpenDocs(); setMobileMenuOpen(false); }}
              className="text-left text-sm text-white/80 py-1 hover:text-cyan-vibrant"
            >
              Documentation & API
            </button>
            <button
              onClick={() => { onScrollTo('pricing'); setMobileMenuOpen(false); }}
              className="text-left text-sm text-white/80 py-1 hover:text-cyan-vibrant"
            >
              Pricing
            </button>
            <button
              onClick={() => { onOpenPlayground(); setMobileMenuOpen(false); }}
              className="text-left text-sm text-cyan-vibrant py-1 font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Live Window Playground
            </button>
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="text-left text-sm text-purple-vibrant py-1 font-bold flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Portal (damonward38@gmail.com)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-semibold text-white/70 hover:text-cyan-vibrant transition-colors tracking-wide"
    >
      {children}
    </button>
  );
}
