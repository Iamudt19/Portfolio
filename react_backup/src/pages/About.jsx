import { motion } from 'framer-motion';

const SKILLS = [
  { name: 'Front-End Engineering', level: 95, details: 'React, Next.js, Framer Motion, Tailwind, TypeScript' },
  { name: 'Back-End & Architecture', level: 88, details: 'Node.js, PostgreSQL, REST APIs, WebSockets' },
  { name: 'Creative Web Technology', level: 92, details: 'HTML5 Canvas, SVG Animation, Web Audio, GLSL' },
  { name: 'AI & Developer Tooling', level: 85, details: 'LLM Orchestration, Prompt Engineering, Sandboxing' },
];

export default function About() {
  return (
    <main className="min-h-screen bg-white pt-32 px-6 md:px-12 lg:px-20 pb-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-16 md:mb-20">
          <span className="font-sans text-xs tracking-[0.3em] text-black/40 uppercase block mb-4">
            The Developer Behind the Canvas
          </span>
          <h1 className="font-serif text-[60px] md:text-[80px] lg:text-[100px] font-bold tracking-tight leading-none text-black">
            ABOUT
          </h1>
        </header>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Bio text (Left side) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-lg md:text-xl text-black/80 leading-relaxed font-medium"
            >
              I'm Udit, a creative full-stack developer and UI engineer. I specialize in crafting blazing fast web applications that combine high-performance code with thoughtful, immersive interactive design.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-base md:text-lg text-black/60 leading-relaxed"
            >
              My coding philosophy revolves around minimalism, accessibility, and high craftsmanship. Whether building complex reactive dashboards like <strong className="text-black font-semibold">Chaptr</strong>, programming physics-based canvas animations, or managing real-time systems, I focus on clean structure, pixel-perfection, and clean logic.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-base md:text-lg text-black/60 leading-relaxed"
            >
              I leverage frameworks like Next.js and tools like Framer Motion to build animations that act as natural extensions of user intentions—creating micro-interactions that elevate simple websites into premium digital experiences.
            </motion.p>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-4 mt-8 border-t border-black/5 pt-8">
              <div>
                <span className="font-sans text-xs tracking-wider text-black/40 uppercase block mb-1">Location</span>
                <span className="font-serif text-lg font-bold text-black">New Delhi, India</span>
              </div>
              <div>
                <span className="font-sans text-xs tracking-wider text-black/40 uppercase block mb-1">Availability</span>
                <span className="font-serif text-lg font-bold text-black">Freelance / Full-Time</span>
              </div>
            </div>
          </div>

          {/* Skills (Right side) */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <div>
              <h2 className="font-sans font-bold tracking-widest uppercase text-xs mb-6 text-black/40">
                Core Competencies
              </h2>
              <div className="flex flex-col gap-6">
                {SKILLS.map((s, idx) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-black/15 pb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-serif text-lg font-bold text-black">{s.name}</span>
                      <span className="font-sans text-xs font-bold text-black/40">{s.level}%</span>
                    </div>
                    {/* Dynamic visual slider */}
                    <div className="w-full h-[2px] bg-black/5 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.level}%` }}
                        transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
                        className="h-full bg-black"
                      />
                    </div>
                    <span className="font-sans text-xs text-black/50 leading-none">
                      {s.details}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
