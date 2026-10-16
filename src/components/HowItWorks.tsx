import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Sparkles, Terminal } from 'lucide-react';

interface HowItWorksProps {
  onOpenPlayground: () => void;
  onOpenDocs: () => void;
}

const steps = [
  {
    num: "1",
    title: "Install the Core Engine",
    desc: "Single package install for Node, Electron, Tauri, or native C++ / Rust bindings.",
    code: `npm install @glass-wing/core\n# or with bun\nbun add @glass-wing/core`,
    rawCopy: 'npm install @glass-wing/core'
  },
  {
    num: "2",
    title: "Declare Your Glass Window",
    desc: "Fully typed configuration object with IntelliSense and runtime schema checks.",
    code: `import { WindowManager } from '@glass-wing/core';\n\nconst wm = new WindowManager({\n  opacity: 0.85,\n  blurRadius: 28,\n  acrylic: { tintColor: "#00f5ff" }\n});`,
    rawCopy: `import { WindowManager } from '@glass-wing/core';\nconst wm = new WindowManager({ opacity: 0.85, blurRadius: 28 });\nawait wm.launch();`
  },
  {
    num: "3",
    title: "Launch with 144 FPS Hardware Acceleration",
    desc: "One async call launches the window. The DirectComposition pipeline handles compositing.",
    code: `await wm.launch();\n\n// Subscribe to reactive monitor movement\nwm.on('move', ({ monitorIndex }) => {\n  console.log('Rendering on monitor #' + monitorIndex);\n});`,
    rawCopy: `await wm.launch();`
  }
];

export function HowItWorks({ onOpenPlayground, onOpenDocs }: HowItWorksProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="px-4 md:px-12 py-28 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <div className="text-xs font-bold tracking-[0.4em] text-cyan-vibrant uppercase mb-3">// Quick Start</div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
          Up & Running in <span className="text-cyan-vibrant">3 Minutes</span>
        </h2>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-6 md:gap-8 group">
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-cyan-vibrant to-blue-vibrant flex items-center justify-center text-black font-extrabold text-base md:text-lg shadow-lg glow-cyan relative z-10 shrink-0">
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div className="w-0.5 flex-1 bg-gradient-to-b from-cyan-vibrant to-purple-vibrant opacity-20 -my-2 group-hover:opacity-40 transition-opacity" />
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="pb-12 pt-1 flex-1"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight text-white">{step.title}</h3>
              <p className="text-white/50 text-sm mb-4 leading-relaxed">{step.desc}</p>
              
              <div className="relative p-4 md:p-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto group/code">
                <pre className="text-cyan-vibrant whitespace-pre-wrap">
                  {step.code}
                </pre>
                
                <button
                  onClick={() => handleCopy(i, step.rawCopy)}
                  className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5"
                  title="Copy Snippet"
                >
                  {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onOpenPlayground}
          className="px-6 py-3 rounded-full bg-cyan-vibrant text-black font-bold text-xs uppercase tracking-wider glow-cyan hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Test in Interactive Studio
        </button>
        <button
          onClick={onOpenDocs}
          className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs hover:border-cyan-vibrant hover:text-cyan-vibrant transition-all flex items-center gap-2"
        >
          <Terminal className="w-4 h-4" />
          Full Developer Documentation
        </button>
      </div>
    </div>
  );
}
