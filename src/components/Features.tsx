import { motion } from 'motion/react';
import { ArrowRight, Code2, Sparkles } from 'lucide-react';

interface FeaturesProps {
  onOpenDocs: () => void;
  onOpenPlayground: () => void;
  onOpenCheckout: (plan?: 'starter' | 'pro' | 'enterprise') => void;
}

const features = [
  {
    icon: "🌊",
    title: "Real-Time Blur Engine",
    desc: "GPU-accelerated Gaussian blur with dynamic radius control. Renders at 144fps without frame drops across all window layers.",
    tag: "Core",
    action: "playground",
    buttonLabel: "Test Blur Shader"
  },
  {
    icon: "💎",
    title: "Acrylic Renderer",
    desc: "True Windows 11 & macOS style acrylic material with tint, saturation, and sub-pixel noise control. Fully programmable via TypeScript API.",
    tag: "New in v2.4",
    action: "playground",
    buttonLabel: "Launch Acrylic Studio"
  },
  {
    icon: "📺",
    title: "Multi-Monitor Awareness",
    desc: "Automatic detection of monitor DPI, color depth, and scale factor. Windows behave perfectly across heterogeneous display setups.",
    tag: "Core",
    action: "docs",
    buttonLabel: "Read Monitor API"
  },
  {
    icon: "⚡",
    title: "Event Bus Architecture",
    desc: "Typed, async event system for window focus, blur, resize, and move events. Zero-overhead pub/sub with automatic cleanup.",
    tag: "Core",
    action: "docs",
    buttonLabel: "View Event Specs"
  },
  {
    icon: "🎞️",
    title: "Spring Animation System",
    desc: "Physics-based spring animations with configurable tension and damping. Supports fade, slide, scale, and custom keyframes.",
    tag: "New in v2.4",
    action: "playground",
    buttonLabel: "Tune Physics Springs"
  },
  {
    icon: "🔧",
    title: "Config-Driven Design",
    desc: "Zero-code window configuration via JSON. Hot-reload supported. Define glass effects, opacity, tint, and sequences declaratively.",
    tag: "Production",
    action: "checkout",
    buttonLabel: "Get Enterprise License"
  }
];

export function Features({ onOpenDocs, onOpenPlayground, onOpenCheckout }: FeaturesProps) {
  const handleAction = (type: string) => {
    if (type === 'playground') onOpenPlayground();
    else if (type === 'docs') onOpenDocs();
    else if (type === 'checkout') onOpenCheckout('enterprise');
  };

  return (
    <div className="px-4 md:px-12 py-28 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <div className="text-xs font-bold tracking-[0.4em] text-cyan-vibrant uppercase mb-3">// Core Capabilities</div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight">
          Built for the <br />
          <span className="bg-gradient-to-r from-cyan-vibrant to-purple-vibrant bg-clip-text text-transparent">Next Generation</span> of Desktop UI
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="group relative p-7 rounded-3xl border border-white/10 glass hover:border-cyan-vibrant/40 transition-all hover:bg-white/[0.03] flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-vibrant/5 blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-vibrant/10 transition-colors" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${f.tag.includes('New') ? 'bg-pink-vibrant/10 text-pink-vibrant border border-pink-vibrant/30' : 'bg-white/10 text-white/60'}`}>
                  {f.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2.5 tracking-tight group-hover:text-cyan-vibrant transition-colors">
                {f.title}
              </h3>
              
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                {f.desc}
              </p>
            </div>

            <button
              onClick={() => handleAction(f.action)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-vibrant/50 text-white/80 hover:text-cyan-vibrant text-xs font-bold transition-all flex items-center justify-between group/btn"
            >
              <span>{f.buttonLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
