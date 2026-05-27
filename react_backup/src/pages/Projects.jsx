import { motion } from 'framer-motion';

const PROJECTS = [
  {
    title: 'Chaptr',
    description: 'A premium, distraction-free markdown workspace and publishing platform tailored for creative writers, screenwriters, and editors. Features real-time offline syncing, rich document outlining, and collaborative editing.',
    tech: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Node.js', 'ProseMirror'],
    github: 'https://github.com/Iamudt19/Chaptr',
    live: '#',
    category: 'Full-Stack Web App'
  },
  {
    title: 'Antigravity AI Workspace',
    description: 'An advanced developer-centric agentic assistant interface. Manages multi-agent code generations, local terminal sandboxing, real-time live preview compiling, and rich interactive Markdown canvas documents.',
    tech: ['React', 'Framer Motion', 'Tailwind CSS', 'Node.js', 'Express', 'WebSockets'],
    github: 'https://github.com/Iamudt19/antigravity',
    live: '#',
    category: 'AI Tooling'
  },
  {
    title: 'Framer Hover Reveal',
    description: 'A high-fidelity hardware-accelerated canvas hover-mask reveal engine. Implements custom radial clipping masks, linear interpolation mouse tracks, and dual infinite CSS marquee tracks.',
    tech: ['HTML5 Canvas', 'React', 'Tailwind CSS', 'Framer Motion', 'CSS Keyframes'],
    github: 'https://github.com/Iamudt19/framer-reveal',
    live: '#',
    category: 'UI Engineering'
  },
  {
    title: 'Chronos Engine',
    description: 'A low-latency, event-driven timeline controller designed for game engines and interactive web media. Provides sub-millisecond precision syncs, reverse-play, and state-machine transitions.',
    tech: ['Web Audio API', 'Web Workers', 'React', 'Three.js'],
    github: 'https://github.com/Iamudt19/chronos',
    live: '#',
    category: 'Creative Technology'
  }
];

export default function Projects() {
  return (
    <main className="min-h-screen bg-white pt-32 px-6 md:px-12 lg:px-20 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <header className="mb-16 md:mb-24">
          <span className="font-sans text-xs tracking-[0.3em] text-black/40 uppercase block mb-4">
            Curated Work
          </span>
          <h1 className="font-serif text-[60px] md:text-[80px] lg:text-[100px] font-bold tracking-tight leading-none text-black">
            PROJECTS
          </h1>
        </header>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {PROJECTS.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group border border-black/10 p-8 flex flex-col justify-between hover:border-black transition-colors duration-500 bg-neutral-50/30 hover:bg-neutral-50/80 rounded-sm relative overflow-hidden"
            >
              <div>
                {/* Category & Index */}
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-xs tracking-widest text-black/40 uppercase">
                    {p.category}
                  </span>
                  <span className="font-serif text-sm italic text-black/30 group-hover:text-black/80 transition-colors">
                    /0{idx + 1}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-4xl font-bold mb-4 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                  {p.title}
                </h2>

                {/* Description */}
                <p className="text-black/60 font-sans text-sm md:text-base leading-relaxed mb-8">
                  {p.description}
                </p>
              </div>

              <div>
                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-sans font-bold tracking-widest uppercase border border-black/10 px-2.5 py-1 group-hover:border-black/30 group-hover:bg-black group-hover:text-white transition-all duration-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex gap-6 border-t border-black/5 pt-6">
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-black hover:opacity-60 transition-opacity flex items-center gap-1"
                  >
                    GitHub <span className="inline-block transform group-hover:translate-x-0.5 transition-transform">→</span>
                  </a>
                  <a
                    href={p.live}
                    className="font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-black/40 hover:text-black hover:opacity-100 transition-all flex items-center gap-1"
                  >
                    Live Demo <span className="inline-block transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">↗</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
