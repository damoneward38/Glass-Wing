import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, X, ExternalLink } from 'lucide-react';

const testimonials = [
  {
    name: "Sasha Kim",
    role: "Lead Engineer @ Vercel Desktop",
    text: "Glass Wing replaced our entire custom window management system in under a day. The TypeScript types are absolutely immaculate — IntelliSense just works.",
    avatar: "SK",
    gradient: "from-cyan-vibrant to-blue-vibrant",
    metrics: "2.1ms blur latency • 144 FPS"
  },
  {
    name: "Marcus Reed",
    role: "Core Desktop Architect @ Notion",
    text: "The acrylic renderer is a game-changer. Our Electron app now looks indistinguishable from native Windows 11 and macOS apps. Users are obsessed with the polish.",
    avatar: "MR",
    gradient: "from-purple-vibrant to-pink-vibrant",
    metrics: "3.2M daily active windows"
  },
  {
    name: "Ava Liu",
    role: "Senior Dev @ Linear",
    text: "144fps glass effects on a 4K display with 2ms latency. I genuinely didn't believe it was possible until we shipped it to 10k users without a hitch.",
    avatar: "AL",
    gradient: "from-green-500 to-cyan-vibrant",
    metrics: "Zero frame drops"
  },
  {
    name: "Tom J.",
    role: "Staff Engineer @ Figma",
    text: "Config hot-reload alone saved us hours every week. We iterate on glass effects in real-time without restarting the app. Absolutely surgical.",
    avatar: "TJ",
    gradient: "from-pink-vibrant to-purple-vibrant",
    metrics: "Saved 40+ engineering hours"
  },
  {
    name: "Nina W.",
    role: "Principal Dev @ JetBrains",
    text: "Multi-monitor support that actually works — including mixed DPI setups. This is the kind of polish that used to take months to build in-house.",
    avatar: "NW",
    gradient: "from-yellow-400 to-pink-vibrant",
    metrics: "Cross-platform Linux & Win"
  },
  {
    name: "Dev Kapoor",
    role: "Product Lead @ Arc Browser",
    text: "We evaluated 6 solutions. Glass Wing was the only one with spring animations that feel human. Our users keep asking how we made the UI feel alive.",
    avatar: "DK",
    gradient: "from-blue-vibrant to-purple-vibrant",
    metrics: "4.9/5 User satisfaction"
  }
];

export function Testimonials() {
  const [activeStory, setActiveStory] = useState<typeof testimonials[0] | null>(null);

  return (
    <div className="px-4 md:px-12 py-28 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <div className="text-xs font-bold tracking-[0.4em] text-cyan-vibrant uppercase mb-3">// Verified Engineering Reviews</div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
          Engineers <span className="text-cyan-vibrant">Ship Faster</span> with Glass Wing
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            onClick={() => setActiveStory(t)}
            className="p-7 rounded-3xl border border-white/10 glass hover:border-cyan-vibrant/30 transition-all flex flex-col justify-between group cursor-pointer hover:bg-white/[0.03]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-yellow-400 gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-cyan-vibrant bg-cyan-vibrant/5 border border-cyan-vibrant/20 px-2 py-0.5 rounded-full">
                  {t.metrics}
                </span>
              </div>

              <p className="text-white/80 text-xs md:text-sm leading-relaxed italic mb-6">
                "{t.text}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-black text-black group-hover:scale-110 transition-transform`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold tracking-tight text-white">{t.name}</div>
                  <div className="text-[10px] text-white/40 font-medium">{t.role}</div>
                </div>
              </div>

              <span className="text-[10px] text-white/30 group-hover:text-cyan-vibrant transition-colors">
                Story →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-7 rounded-3xl border border-white/10 glass bg-dark-bg/95 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveStory(null)}
                className="absolute top-6 right-6 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${activeStory.gradient} flex items-center justify-center text-sm font-bold text-black`}>
                  {activeStory.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{activeStory.name}</h4>
                  <div className="text-xs text-cyan-vibrant">{activeStory.role}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/70 leading-relaxed space-y-3 mb-6">
                <p>"{activeStory.text}"</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#00ff9d]">
                  <span>Metric Validated:</span>
                  <span>{activeStory.metrics}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveStory(null)}
                className="w-full py-3 rounded-xl bg-cyan-vibrant text-black text-xs font-bold hover:scale-[1.01] transition-transform"
              >
                Close Verification Story
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
