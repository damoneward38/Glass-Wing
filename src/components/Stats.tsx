import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Stats() {
  return (
    <div className="px-6 md:px-12 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 rounded-3xl overflow-hidden border border-white/10 glass">
        <StatCell target={40000} label="Developers Using Glass Wing" suffix="+" />
        <StatCell target={144} label="Max FPS — GPU Accelerated" />
        <StatCell target={2} label="Average Render Latency" suffix="ms" />
        <StatCell target={99.9} label="Uptime SLA (Enterprise)" suffix="%" decimals={1} />
      </div>
    </div>
  );
}

function StatCell({ target, label, suffix = "", decimals = 0 }: { target: number; label: string; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const duration = 2000;
      const startTime = performance.now();

      const update = () => {
        const now = performance.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        const current = start + (end - start) * ease;
        setCount(current);
        if (progress < 1) requestAnimationFrame(update);
      };
      
      requestAnimationFrame(update);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="bg-dark-bg/80 p-8 md:p-12 text-center group hover:bg-white/[0.02] transition-colors">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter bg-gradient-to-br from-white via-cyan-vibrant to-purple-vibrant bg-clip-text text-transparent"
      >
        {count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </motion.div>
      <div className="mt-2 text-[10px] md:text-xs text-white/40 font-bold tracking-[0.2em] uppercase">
        {label}
      </div>
    </div>
  );
}
