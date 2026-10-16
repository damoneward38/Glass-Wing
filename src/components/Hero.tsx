import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sliders, Monitor, Play, Check, Layers, RefreshCw } from 'lucide-react';

interface HeroProps {
  onOpenCheckout: (plan?: 'starter' | 'pro' | 'enterprise') => void;
  onOpenDocs: () => void;
  onOpenPlayground: () => void;
}

export function Hero({ onOpenCheckout, onOpenDocs, onOpenPlayground }: HeroProps) {
  const [opacity, setOpacity] = useState(0.85);
  const [blur, setBlur] = useState(28);
  const [activeTab, setActiveTab] = useState<'effects' | 'windows' | 'monitors' | 'animations' | 'config'>('effects');
  const [acrylicEnabled, setAcrylicEnabled] = useState(true);
  const [windowState, setWindowState] = useState<'normal' | 'minimized' | 'maximized'>('normal');
  const [activeMonitor, setActiveMonitor] = useState(1);

  const resetMockup = () => {
    setOpacity(0.85);
    setBlur(28);
    setAcrylicEnabled(true);
    setWindowState('normal');
    setActiveMonitor(1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-28 pb-16 px-4 md:px-8 text-center relative z-10">
      {/* Version badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onClick={onOpenDocs}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-vibrant/30 bg-cyan-vibrant/5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-cyan-vibrant uppercase mb-6 cursor-pointer hover:bg-cyan-vibrant/10 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-vibrant animate-pulse" />
        Production-Ready v2.4.0 — Now with Acrylic Shader Engine
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter mb-4 leading-[1.05]"
      >
        <span className="block bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
          Window Management
        </span>
        <span className="block bg-gradient-to-r from-cyan-vibrant via-purple-vibrant to-pink-vibrant bg-clip-text text-transparent italic">
          Reimagined.
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-2xl text-white/60 text-sm md:text-lg leading-relaxed mb-8"
      >
        The <span className="text-white font-medium">only transparent window system</span> engineered for modern desktop applications — with real-time blur, acrylic shaders, and intelligent multi-monitor DPI awareness.
      </motion.p>

      {/* Hero Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-16"
      >
        <button
          onClick={() => onOpenCheckout('pro')}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-vibrant to-blue-vibrant text-black font-extrabold text-sm uppercase tracking-wider shadow-2xl glow-cyan hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Start Free Trial
        </button>

        <button
          onClick={onOpenDocs}
          className="px-8 py-3.5 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm hover:border-cyan-vibrant hover:text-cyan-vibrant hover:glow-cyan transition-all"
        >
          View Documentation & API →
        </button>

        <button
          onClick={onOpenPlayground}
          className="px-6 py-3.5 rounded-full bg-purple-vibrant/10 border border-purple-vibrant/30 text-purple-vibrant font-bold text-sm hover:bg-purple-vibrant hover:text-black transition-all flex items-center gap-2"
        >
          <Sliders className="w-4 h-4" />
          Interactive Studio
        </button>
      </motion.div>

      {/* Interactive Window Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-full max-w-4xl"
      >
        <AnimatePresence mode="wait">
          {windowState === 'minimized' ? (
            <motion.div
              key="minimized"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-4 rounded-2xl glass border border-cyan-vibrant/40 flex items-center justify-between max-w-md mx-auto"
            >
              <span className="text-xs font-mono text-cyan-vibrant">🪟 Window Minimized to Taskbar</span>
              <button
                onClick={() => setWindowState('normal')}
                className="px-3 py-1 rounded-lg bg-cyan-vibrant text-black text-xs font-bold"
              >
                Restore Window
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="normal"
              animate={{
                scale: windowState === 'maximized' ? 1.04 : 1,
                y: [0, -6, 0]
              }}
              transition={{
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="rounded-3xl overflow-hidden border border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.8)] text-left transition-all"
              style={{
                backdropFilter: `blur(${blur}px) saturate(180%)`,
                backgroundColor: acrylicEnabled ? `rgba(2, 6, 18, ${opacity * 0.85})` : `rgba(10, 15, 30, ${opacity})`
              }}
            >
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-white/5 border-b border-white/10 select-none">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWindowState('minimized')}
                    className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:opacity-80 transition-opacity"
                    title="Close / Minimize Window"
                  />
                  <button
                    onClick={() => setWindowState('minimized')}
                    className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:opacity-80 transition-opacity"
                    title="Minimize Window"
                  />
                  <button
                    onClick={() => setWindowState(windowState === 'maximized' ? 'normal' : 'maximized')}
                    className="w-3.5 h-3.5 rounded-full bg-[#28c840] hover:opacity-80 transition-opacity"
                    title="Toggle Maximize"
                  />
                </div>
                
                <div className="text-xs font-mono text-white/50 tracking-wider">
                  GlassWing Control Panel — v2.4.0 [Interactive Live Mockup]
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetMockup}
                    className="text-white/40 hover:text-white transition-colors"
                    title="Reset parameters"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-2 h-2 rounded-full bg-[#00ff9d]" />
                </div>
              </div>

              {/* Window Body */}
              <div className="flex flex-col md:flex-row min-h-[320px]">
                {/* Sidebar Navigation inside window */}
                <div className="flex md:flex-col gap-1 p-3 bg-white/[0.02] border-r border-white/10 overflow-x-auto md:w-44 shrink-0">
                  <WindowNavItem active={activeTab === 'effects'} onClick={() => setActiveTab('effects')} icon="✨" label="Effects" />
                  <WindowNavItem active={activeTab === 'windows'} onClick={() => setActiveTab('windows')} icon="🪟" label="Windows" />
                  <WindowNavItem active={activeTab === 'monitors'} onClick={() => setActiveTab('monitors')} icon="📺" label="Monitors" />
                  <WindowNavItem active={activeTab === 'animations'} onClick={() => setActiveTab('animations')} icon="⚡" label="Springs" />
                  <WindowNavItem active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon="⚙️" label="Config" />
                </div>

                {/* Main Content Pane inside Mockup */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-6">
                  {activeTab === 'effects' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Live Opacity Slider */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60 font-medium">Window Opacity</span>
                            <span className="font-mono text-cyan-vibrant font-bold">{(opacity * 100).toFixed(0)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="1.0"
                            step="0.01"
                            value={opacity}
                            onChange={(e) => setOpacity(parseFloat(e.target.value))}
                            className="w-full accent-cyan-vibrant cursor-pointer"
                          />
                        </div>

                        {/* Live Blur Slider */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60 font-medium">Gaussian Blur</span>
                            <span className="font-mono text-purple-vibrant font-bold">{blur}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            value={blur}
                            onChange={(e) => setBlur(parseInt(e.target.value))}
                            className="w-full accent-purple-vibrant cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Acrylic toggle & live stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div
                          onClick={() => setAcrylicEnabled(!acrylicEnabled)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${acrylicEnabled ? 'bg-cyan-vibrant/10 border-cyan-vibrant text-cyan-vibrant' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                          <div className="text-[10px] uppercase font-bold tracking-wider">Acrylic Material</div>
                          <div className="text-sm font-bold mt-1">{acrylicEnabled ? 'ENABLED' : 'DISABLED'}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-white/40">Render Pipeline</div>
                          <div className="text-sm font-bold text-[#00ff9d] mt-1">144 FPS (2ms)</div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 col-span-2 sm:col-span-1">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-white/40">GPU Accelerator</div>
                          <div className="text-sm font-bold text-white mt-1">DirectComposition</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'windows' && (
                    <div className="space-y-4">
                      <div className="text-xs text-white/50">Active Composited Windows in Session:</div>
                      <div className="space-y-2">
                        {['Main Editor Window (1920x1080)', 'Inspector Palette (Float, Always-On-Top)', 'Terminal Overlay (Blur: 32px, Acrylic)'].map((w, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white">
                            <span>{w}</span>
                            <span className="px-2 py-0.5 rounded bg-cyan-vibrant/10 text-cyan-vibrant text-[10px] font-mono">Rendered</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'monitors' && (
                    <div className="space-y-4">
                      <div className="text-xs text-white/50">Multi-Display DPI Awareness:</div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { num: 1, res: '3840x2160', scale: '150% DPI' },
                          { num: 2, res: '2560x1440', scale: '100% DPI' },
                          { num: 3, res: '1920x1080', scale: '125% DPI' }
                        ].map((m) => (
                          <div
                            key={m.num}
                            onClick={() => setActiveMonitor(m.num)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${activeMonitor === m.num ? 'bg-cyan-vibrant/10 border-cyan-vibrant text-cyan-vibrant' : 'bg-white/5 border-white/10 text-white/70'}`}
                          >
                            <div className="text-xs font-bold">Display #{m.num}</div>
                            <div className="text-[10px] text-white/40">{m.res}</div>
                            <div className="text-[10px] font-mono mt-1 text-[#00ff9d]">{m.scale}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'animations' && (
                    <div className="space-y-4">
                      <div className="text-xs text-white/50">Physics-Based Spring Configuration:</div>
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-purple-300">
                        <code>{`spring: { tension: 180, damping: 24, mass: 1 }\nrenderEngine: 'GPU-DirectX'`}</code>
                      </div>
                    </div>
                  )}

                  {activeTab === 'config' && (
                    <div className="space-y-4">
                      <div className="text-xs text-white/50">Exportable JSON Configuration:</div>
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-cyan-vibrant overflow-x-auto">
                        <pre>{JSON.stringify({ opacity, blurRadius: blur, acrylic: acrylicEnabled }, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                  {/* Bottom bar inside mockup */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                    <span>DirectComposition 3D Compositor</span>
                    <button
                      onClick={onOpenPlayground}
                      className="text-cyan-vibrant hover:underline flex items-center gap-1 font-bold"
                    >
                      Open Full Screen Studio →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Down arrow */}
      <div
        onClick={() => {
          const el = document.getElementById('stats');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="mt-16 flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-pointer animate-bounce select-none"
      >
        <span className="text-[10px] tracking-[0.3em] font-bold">EXPLORE ENGINE</span>
        <span className="text-lg">↓</span>
      </div>
    </div>
  );
}

function WindowNavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${active ? 'bg-cyan-vibrant/10 text-cyan-vibrant border border-cyan-vibrant/20 font-bold' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
