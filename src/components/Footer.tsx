import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles, Terminal, X, Check, Copy } from 'lucide-react';

interface FooterProps {
  onOpenCheckout: (plan?: 'starter' | 'pro' | 'enterprise') => void;
  onOpenDocs: () => void;
  onOpenPlayground: () => void;
  onOpenAdmin: () => void;
  onScrollTo: (id: string) => void;
}

export function Footer({ onOpenCheckout, onOpenDocs, onOpenPlayground, onOpenAdmin, onScrollTo }: FooterProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copiedClone, setCopiedClone] = useState(false);

  const copyCloneCmd = () => {
    navigator.clipboard.writeText('git clone https://github.com/glass-wing/core.git');
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <footer className="relative z-10 pt-20">
      {/* Final CTA Banner */}
      <div className="px-4 pb-32 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-vibrant/5 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-vibrant mb-4 inline-block">
            // Elevate Your Desktop App
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight mb-6 leading-none text-white">
            Your UI Deserves <br />
            <span className="bg-gradient-to-r from-cyan-vibrant via-purple-vibrant to-pink-vibrant bg-clip-text text-transparent">
              Glass-Level Polish.
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-white/50 text-sm md:text-base mb-10 leading-relaxed">
            Join 40,000+ developers building transparent, hardware-accelerated desktop interfaces with Glass Wing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenCheckout('pro')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-vibrant to-blue-vibrant text-black font-extrabold text-xs uppercase tracking-widest shadow-2xl glow-cyan hover:scale-105 transition-transform"
            >
              Start Free — No Credit Card
            </button>
            <button
              onClick={() => setActiveModal('github')}
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs tracking-wide hover:border-white/20 transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-cyan-vibrant" />
              <span>View on GitHub ↗</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer Navigation Columns */}
      <div className="px-6 md:px-12 py-16 border-t border-white/10 bg-black/60 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪟</span>
              <span className="text-xl font-display font-bold text-white tracking-tight">Project Glass Wing</span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed max-w-sm">
              The high-performance, GPU-accelerated window compositor and acrylic blur engine for Electron, Tauri, and native desktop systems.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-purple-vibrant/10 border border-purple-vibrant/30 text-purple-vibrant text-xs font-bold hover:bg-purple-vibrant hover:text-black transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal Login</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onScrollTo('features')} className="text-white/40 hover:text-cyan-vibrant transition-colors">Features</button></li>
              <li><button onClick={() => onScrollTo('pricing')} className="text-white/40 hover:text-cyan-vibrant transition-colors">Pricing</button></li>
              <li><button onClick={() => setActiveModal('changelog')} className="text-white/40 hover:text-cyan-vibrant transition-colors">Changelog v2.4.0</button></li>
              <li><button onClick={() => setActiveModal('roadmap')} className="text-white/40 hover:text-cyan-vibrant transition-colors">2026 Roadmap</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase mb-4">Developers</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={onOpenDocs} className="text-white/40 hover:text-cyan-vibrant transition-colors">Documentation</button></li>
              <li><button onClick={onOpenDocs} className="text-white/40 hover:text-cyan-vibrant transition-colors">API Reference</button></li>
              <li><button onClick={() => setActiveModal('github')} className="text-white/40 hover:text-cyan-vibrant transition-colors">GitHub Repository</button></li>
              <li><button onClick={() => setActiveModal('npm')} className="text-white/40 hover:text-cyan-vibrant transition-colors">npm Package</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => setActiveModal('about')} className="text-white/40 hover:text-cyan-vibrant transition-colors">About Team</button></li>
              <li><button onClick={() => setActiveModal('terms')} className="text-white/40 hover:text-cyan-vibrant transition-colors">Terms of Service</button></li>
              <li><button onClick={() => setActiveModal('privacy')} className="text-white/40 hover:text-cyan-vibrant transition-colors">Privacy Policy</button></li>
              <li><button onClick={onOpenAdmin} className="text-white/40 hover:text-purple-vibrant transition-colors">Admin Gateway</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30 tracking-widest uppercase">
          <div>© 2026 Project Glass Wing • Administrator: damonward38@gmail.com</div>
          <div className="text-cyan-vibrant/60 font-mono">144 FPS Hardware Composited</div>
        </div>
      </div>

      {/* Interactive Modal for Footer Links */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-3xl border border-white/10 glass bg-dark-bg/95 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {activeModal === 'github' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-vibrant" />
                    GitHub Source Repository
                  </h3>
                  <p className="text-xs text-white/60">
                    Clone the Glass Wing runtime and experiment with the DirectComposition acrylic shader samples.
                  </p>
                  <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-xs text-cyan-vibrant flex items-center justify-between">
                    <span>git clone https://github.com/glass-wing/core.git</span>
                    <button onClick={copyCloneCmd} className="text-white/50 hover:text-white ml-2">
                      {copiedClone ? <Check className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'changelog' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">Changelog — v2.4.0</h3>
                  <div className="text-xs text-white/70 space-y-2">
                    <div className="font-bold text-cyan-vibrant">• New Acrylic Shaders:</div>
                    <p>Sub-pixel micro noise blending with customizable luminance tint layers.</p>
                    <div className="font-bold text-purple-vibrant">• DirectComposition Pipeline:</div>
                    <p>Up to 144 FPS compositing on Windows 11 with 1.84ms P99 render latency.</p>
                    <div className="font-bold text-[#00ff9d]">• Multi-Monitor Per-Monitor V2:</div>
                    <p>DPI auto-correction across mixed scale display matrices.</p>
                  </div>
                </div>
              )}

              {activeModal === 'roadmap' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">2026 Architectural Roadmap</h3>
                  <ul className="text-xs text-white/70 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00ff9d]" />
                      <span>Q1 2026: DirectComposition Acrylic Engine (Shipped v2.4.0)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-vibrant" />
                      <span>Q2 2026: Vulkan Wayland Compositor for Linux Desktops</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-vibrant" />
                      <span>Q3 2026: Spatial 3D Depth Windows & WebXR Bridge</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeModal === 'npm' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">npm Registry Package</h3>
                  <p className="text-xs text-white/60">Official packages are distributed via npm and private artifactory:</p>
                  <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-vibrant">
                    npm install @glass-wing/core @glass-wing/react
                  </pre>
                </div>
              )}

              {activeModal === 'about' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">About Project Glass Wing</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Glass Wing was conceived by systems engineers and UI craftspeople frustrated by the lack of native-grade blur and acrylic glass effects in modern cross-platform desktop frameworks.
                  </p>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">Software License Terms</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Commercial licenses permit distribution within proprietary commercial desktop applications without royalty fees. Source access is governed by the Enterprise Master Agreement.
                  </p>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">Privacy Policy</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Glass Wing collects zero telemetry from window renders or desktop processes. License activation validates cryptographic keys via secure SSL with zero telemetry logging.
                  </p>
                </div>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
              >
                Close Dialog
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
