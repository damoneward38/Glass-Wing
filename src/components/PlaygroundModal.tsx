import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sliders, Download, Check, Sparkles, Monitor, RefreshCw } from 'lucide-react';

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export function PlaygroundModal({ isOpen, onClose, onOpenCheckout }: PlaygroundModalProps) {
  const [opacity, setOpacity] = useState(0.85);
  const [blurRadius, setBlurRadius] = useState(28);
  const [tintColor, setTintColor] = useState('#00f5ff');
  const [tintIntensity, setTintIntensity] = useState(0.15);
  const [noise, setNoise] = useState(true);
  const [activeMonitor, setActiveMonitor] = useState(1);
  const [copiedConfig, setCopiedConfig] = useState(false);

  if (!isOpen) return null;

  const currentConfig = {
    title: "Acrylic Window Sandbox",
    opacity: Number(opacity.toFixed(2)),
    blurRadius,
    acrylic: {
      tintColor,
      tintIntensity: Number(tintIntensity.toFixed(2)),
      noise
    },
    monitorIndex: activeMonitor,
    gpuAcceleration: true,
    renderEngine: "DirectComposition-v2.4"
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(currentConfig, null, 2));
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl h-[88vh] rounded-3xl border border-cyan-vibrant/30 glass bg-dark-bg/95 flex flex-col overflow-hidden shadow-2xl glow-cyan"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-vibrant/10 text-cyan-vibrant">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="font-bold text-sm text-white">Glass Wing Interactive Acrylic Sandbox</div>
              <div className="text-[10px] font-mono text-cyan-vibrant">Real-Time GPU Hardware Compositor Preview</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyConfig}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {copiedConfig ? <Check className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copiedConfig ? 'Copied Config!' : 'Export JSON Config'}</span>
            </button>
            <button
              onClick={onOpenCheckout}
              className="px-4 py-1.5 rounded-full bg-cyan-vibrant text-black text-xs font-bold hover:scale-105 transition-transform"
            >
              Purchase License
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Canvas: Live Rendered Window */}
          <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#040814] via-[#02040a] to-[#0d0618]">
            {/* Background elements to showcase real blur behind the window */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-vibrant/20 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-vibrant/20 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-around opacity-15 pointer-events-none select-none">
              <div className="text-8xl font-black text-white">144 FPS</div>
              <div className="text-8xl font-black text-cyan-vibrant">DIRECTX</div>
            </div>

            {/* The Live Acrylic Window */}
            <div
              className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-150 border border-white/20"
              style={{
                backdropFilter: `blur(${blurRadius}px) saturate(180%)`,
                backgroundColor: `rgba(255, 255, 255, ${opacity * 0.12})`,
                boxShadow: `0 30px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 30px ${tintColor}33`
              }}
            >
              {/* Tint overlay layer */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: tintColor,
                  opacity: tintIntensity
                }}
              />

              {/* Titlebar */}
              <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="text-xs font-mono text-white/70">
                  Monitor #{activeMonitor} — Acrylic v2.4.0
                </div>
                <div className="text-[10px] text-white/30 font-mono">144.0 FPS</div>
              </div>

              {/* Window Content */}
              <div className="relative z-10 p-6 space-y-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-vibrant">// Hardware Compositor</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#00ff9d]/10 text-[#00ff9d] text-[10px] font-mono">D3D11 Metal 3</span>
                </div>
                <h4 className="text-xl font-bold tracking-tight">Active Acrylic Material</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Notice how the underlying gradients and text behind this window are continuously sampled and diffused through our real-time Gaussian shader passes.
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs flex justify-between">
                  <span className="text-white/50">Blur Intensity:</span>
                  <span className="text-cyan-vibrant font-bold">{blurRadius}px</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs flex justify-between">
                  <span className="text-white/50">Window Opacity:</span>
                  <span className="text-purple-vibrant font-bold">{(opacity * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="w-full lg:w-96 p-6 border-t lg:border-t-0 lg:border-l border-white/10 bg-dark-bg/80 space-y-6 overflow-y-auto">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-cyan-vibrant mb-1">// Parameters</div>
              <h3 className="font-bold text-lg text-white">Shader Adjustments</h3>
            </div>

            {/* Opacity slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Base Opacity</span>
                <span className="font-mono text-cyan-vibrant font-bold">{(opacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-cyan-vibrant cursor-pointer"
              />
            </div>

            {/* Blur radius slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Blur Radius</span>
                <span className="font-mono text-purple-vibrant font-bold">{blurRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={blurRadius}
                onChange={(e) => setBlurRadius(parseInt(e.target.value))}
                className="w-full accent-purple-vibrant cursor-pointer"
              />
            </div>

            {/* Tint Color Swatches */}
            <div className="space-y-2">
              <span className="text-xs text-white/70">Acrylic Tint Color</span>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { name: 'Cyan', color: '#00f5ff' },
                  { name: 'Purple', color: '#a855f7' },
                  { name: 'Pink', color: '#ff006e' },
                  { name: 'Emerald', color: '#00ff9d' },
                  { name: 'Neutral', color: '#ffffff' }
                ].map((swatch) => (
                  <button
                    key={swatch.name}
                    onClick={() => setTintColor(swatch.color)}
                    className={`h-9 rounded-xl border flex items-center justify-center transition-all ${tintColor === swatch.color ? 'border-white scale-110 shadow-lg' : 'border-white/20 hover:border-white/50'}`}
                    style={{ backgroundColor: swatch.color }}
                  >
                    {tintColor === swatch.color && <Check className="w-4 h-4 text-black font-bold" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Tint Intensity */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Tint Layer Intensity</span>
                <span className="font-mono text-white font-bold">{(tintIntensity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.6"
                step="0.01"
                value={tintIntensity}
                onChange={(e) => setTintIntensity(parseFloat(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
            </div>

            {/* Multi-monitor simulation */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs text-white/70">Simulated Display Output</span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((mon) => (
                  <button
                    key={mon}
                    onClick={() => setActiveMonitor(mon)}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all ${activeMonitor === mon ? 'bg-cyan-vibrant/20 border-cyan-vibrant text-cyan-vibrant' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Display {mon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                setOpacity(0.85);
                setBlurRadius(28);
                setTintColor('#00f5ff');
                setTintIntensity(0.15);
                setActiveMonitor(1);
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
