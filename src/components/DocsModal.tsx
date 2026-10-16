import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Terminal, Code2, BookOpen, Layers, Cpu } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export function DocsModal({ isOpen, onClose, onOpenCheckout }: DocsModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<'install' | 'quickstart' | 'acrylic' | 'multimonitor' | 'api'>('quickstart');

  if (!isOpen) return null;

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl h-[85vh] rounded-3xl border border-white/10 glass bg-dark-bg/95 flex flex-col overflow-hidden shadow-2xl glow-cyan"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="text-xl">🪟</span>
            <div>
              <div className="font-bold text-sm text-white">Glass Wing Documentation & SDK Reference</div>
              <div className="text-[10px] font-mono text-cyan-vibrant">v2.4.0 • DirectComposition & Acrylic Renderer</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCheckout}
              className="px-4 py-1.5 rounded-full bg-cyan-vibrant text-black text-xs font-bold hover:scale-105 transition-transform"
            >
              Get Production License
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-white/10 p-4 space-y-1 bg-white/[0.01] shrink-0 hidden md:block overflow-y-auto">
            <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase px-3 py-2">Guides</div>
            <DocNavBtn active={selectedSection === 'install'} onClick={() => setSelectedSection('install')} icon={<Terminal className="w-4 h-4" />} label="Installation & Setup" />
            <DocNavBtn active={selectedSection === 'quickstart'} onClick={() => setSelectedSection('quickstart')} icon={<Code2 className="w-4 h-4" />} label="Quick Start Guide" />
            
            <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase px-3 py-2 pt-4">Core Systems</div>
            <DocNavBtn active={selectedSection === 'acrylic'} onClick={() => setSelectedSection('acrylic')} icon={<Layers className="w-4 h-4" />} label="Acrylic Shader API" />
            <DocNavBtn active={selectedSection === 'multimonitor'} onClick={() => setSelectedSection('multimonitor')} icon={<Cpu className="w-4 h-4" />} label="Multi-Monitor Engine" />
            <DocNavBtn active={selectedSection === 'api'} onClick={() => setSelectedSection('api')} icon={<BookOpen className="w-4 h-4" />} label="TypeScript Definitions" />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
            {selectedSection === 'install' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Installation & Requirements</h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  Glass Wing supports Windows 10/11, macOS Sonoma/Sequoia, and Linux Wayland/X11 with GPU compositing.
                </p>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-sm relative group">
                  <div className="text-white/40 mb-2"># Install via npm, yarn, or pnpm</div>
                  <pre className="text-cyan-vibrant">npm install @glass-wing/core</pre>
                  <button
                    onClick={() => copyCode('install_npm', 'npm install @glass-wing/core')}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white"
                  >
                    {copiedId === 'install_npm' ? <Check className="w-4 h-4 text-[#00ff9d]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {selectedSection === 'quickstart' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Quick Start: Launch Your First Transparent Window</h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  Initialize the `WindowManager` with your preferred glass transparency, blur radius, and spring animation parameters.
                </p>

                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs md:text-sm relative group">
                  <pre className="text-cyan-vibrant whitespace-pre-wrap">{`import { WindowManager, AcrylicMaterial } from '@glass-wing/core';

// 1. Initialize window instance
const wm = new WindowManager({
  title: "GlassWing Studio",
  width: 1200,
  height: 800,
  opacity: 0.85,
  blurRadius: 28,
  acrylic: {
    tintColor: "#00f5ff",
    tintOpacity: 0.15,
    noiseIntensity: 0.03
  },
  animation: {
    spring: { tension: 180, damping: 24 }
  }
});

// 2. Launch with GPU Acceleration
await wm.launch();

// 3. Listen to reactive window events
wm.on('monitorChange', (event) => {
  console.log(\`Moved to monitor: \${event.monitorIndex} with DPI \${event.scaleFactor}\`);
});`}</pre>
                  <button
                    onClick={() => copyCode('quickstart_code', `import { WindowManager } from '@glass-wing/core';\nconst wm = new WindowManager({ opacity: 0.85, blurRadius: 28 });\nawait wm.launch();`)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white"
                  >
                    {copiedId === 'quickstart_code' ? <Check className="w-4 h-4 text-[#00ff9d]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {selectedSection === 'acrylic' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Acrylic Shader API (v2.4.0)</h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  The acrylic renderer leverages DirectComposition on Windows and Metal Shading Language on macOS to compose a multi-layer acrylic backdrop with sub-pixel noise and luminous highlights.
                </p>
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-purple-300">
                  <pre className="whitespace-pre-wrap">{`interface AcrylicConfig {
  tintColor: string;       // Hex or rgba color string
  tintOpacity: number;     // 0.0 to 1.0 (default: 0.20)
  blurRadius: number;      // 0 to 64px Gaussian pass
  noiseIntensity: number;  // 0.0 to 0.10 micro-grain texture
  blendMode: 'luminous' | 'multiply' | 'screen';
}`}</pre>
                </div>
              </div>
            )}

            {selectedSection === 'multimonitor' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Multi-Monitor Awareness</h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  Zero jitter when dragging transparent windows across displays with heterogeneous scaling (e.g. 200% Retina laptop connected to 100% 144Hz external monitor).
                </p>
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-[#00ff9d]">
                  <pre className="whitespace-pre-wrap">{`const monitors = await wm.getMonitors();
console.log(monitors);
// [{ id: 0, primary: true, scaleFactor: 2.0, refreshRate: 144 },
//  { id: 1, primary: false, scaleFactor: 1.0, refreshRate: 60 }]`}</pre>
                </div>
              </div>
            )}

            {selectedSection === 'api' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">TypeScript Definitions</h2>
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-white/80 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{`export interface WindowConfig {
  id?: string;
  title?: string;
  width?: number;
  height?: number;
  opacity?: number;
  blurRadius?: number;
  acrylic?: boolean | AcrylicConfig;
  alwaysOnTop?: boolean;
  licenseKey?: string;
}

export declare class WindowManager {
  constructor(config: WindowConfig);
  launch(): Promise<void>;
  close(): Promise<void>;
  minimize(): Promise<void>;
  maximize(): Promise<void>;
  setOpacity(opacity: number): void;
  setBlurRadius(radius: number): void;
  on(event: string, handler: (data: any) => void): void;
}`}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DocNavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 text-left ${active ? 'bg-cyan-vibrant/10 text-cyan-vibrant border border-cyan-vibrant/20 font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
