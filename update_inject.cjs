const fs = require('fs');

let content = fs.readFileSync('c:/Users/iamud/OneDrive/Desktop/Portfolio/inject_portfolio_complete.cjs', 'utf8');

// 1. Replace hardcoded projects section
const newProjectsSection = `<section id="work" class="mb-36 scroll-mt-28">
        <span class="font-sans-custom text-xs font-bold tracking-[0.3em] uppercase opacity-40 block mb-4 text-[var(--text-color)]">Curated Projects</span>
        <h2 class="font-outfit text-4xl md:text-5xl font-black tracking-tight mb-16 leading-[1.0] text-[var(--text-color)]">WORK DIRECTORY</h2>
        <div class="flex flex-col border-t border-[var(--border-color)]" id="dynamic-projects-container">
        </div>
      </section>`;

// Replace from `<section id="work"` to `</section>`
content = content.replace(/<section id="work"[\s\S]*?<\/section>/, newProjectsSection);

// 2. Replace hardcoded timeline section
const newTimelineSection = `<section id="timeline" class="mb-36 scroll-mt-28">
        <span class="font-sans-custom text-xs font-bold tracking-[0.3em] uppercase opacity-40 block mb-4 text-[var(--text-color)]">Chronicle</span>
        <h2 class="font-outfit text-4xl md:text-5xl font-black tracking-tight mb-16 leading-[1.0] text-[var(--text-color)]">EXPERIENCE TIMELINE</h2>
        <div class="relative timeline-track" id="dynamic-timeline-container">
        </div>
      </section>`;

content = content.replace(/<section id="timeline"[\s\S]*?<\/section>/, newTimelineSection);

// 3. Update defaultSettings
const newDefaultSettings = `const defaultSettings = {
      name: "Udit",
      title: "Creative Technologist / UI & IoT Engineer",
      pitch: "Developing high-fidelity interactive architectures, custom canvas WebGL simulations, and robust embedded IoT networks where low-level engineering meets visual high art.",
      bio1: "My engineering philosophy bridges two worlds: visual design excellence and low-level hardware-software performance. I thrive on bringing complex visual animations to life with spring physics and fluid math, and building responsive, low-latency applications that respond instantly to touch, gesture, and telemetry streams.",
      bio2: "Whether orchestrating thousands of active nodes inside an interactive outline canvas editor, mapping out real-time telemetry streams over MQTT/WebSockets, or soldering customized ESP32 microcontrollers to automate physical space nodes, I am driven by the pursuit of bulletproof, pixel-perfect, and ultra-high performance user environments.",
      skill1: "92",
      skill2: "84",
      skill3: "89",
      email: "iamudt19@gmail.com",
      github: "https://github.com/Iamudt19",
      linkedin: "https://linkedin.com",
      projects: [
        {
          prefix: "/01 · EDITOR TOOLBOX",
          title: "Chaptr",
          desc: "A premium collaborative markdown editor and screenplay outline sandbox facilitating structured creative drafts without distractions.",
          tags: "React, Next.js, Slate.js, Tailwind",
          img: "/assets/custom_previews/chaptr.png",
          codeLink: "https://github.com/Iamudt19/Chaptr",
          demoLink: "https://github.com/Iamudt19/Chaptr"
        },
        {
          prefix: "/02 · AGENT ORCHESTRATION",
          title: "Antigravity AI",
          desc: "An agentic workspace visualization dashboard orchestrating background nodes, running parallel sandboxed developer tasks, and tracking multi-agent pipelines.",
          tags: "Node.js, WebSockets, Tailwind, Docker",
          img: "/assets/custom_previews/antigravity.png",
          codeLink: "",
          demoLink: ""
        },
        {
          prefix: "/03 · LOW-LATENCY GRAPHICS",
          title: "Chronos Timeline",
          desc: "Low-latency audio waveform scheduler and frame sequencer. Supports custom envelope nodes, high-frequency render triggers, and real-time interactive canvas controls.",
          tags: "TypeScript, Canvas API, Web Audio",
          img: "/assets/custom_previews/chronos.png",
          codeLink: "#",
          demoLink: "#"
        },
        {
          prefix: "/04 · CYBER-PHYSICAL SYSTEM",
          title: "Aether IoT Node",
          desc: "Futuristic real-time MQTT dashboard for embedded sensor clusters. Automatically plots ambient data curves, tracks hardware state buffers, and sends fast relay control pulses.",
          tags: "C/C++ (ESP32), MQTT, WebSockets, Canvas API",
          img: "/assets/custom_previews/aether_iot.png",
          codeLink: "#",
          demoLink: "#"
        }
      ],
      timeline: [
        {
          period: "2025 - PRESENT",
          title: "Lead Interactive Engineer",
          company: "Chaptr outline editor",
          color: "#7420df",
          bullets: "Architected optimized canvas viewport rendering queues, elevating editor speeds by 40% for larger creative outline text datasets.\\nPioneered flexible CSS theme variables for absolute obsidian-level modes."
        },
        {
          period: "2024 - 2025",
          title: "WebGL & Creative Technologist",
          company: "Self-Employed / Freelance",
          color: "#ff4b82",
          bullets: "Built dynamic landing pages integrating custom responsive shaders, fluid masks, and spring physics.\\nDesigned high-frequency telemetry visualizer feeds using sub-15ms WebSockets channels."
        },
        {
          period: "2023 - 2024",
          title: "Embedded Systems IoT Winner",
          company: "SmartLabs Hackathon Node",
          color: "#20b2aa",
          bullets: "Designed and soldered low-level ESP32 microcontrollers configured with secure MQTT telemetry channels.\\nDeployed an ultra-low energy environmental sensor array, maintaining 99.9% telemetry stream uptime."
        }
      ]
    };`;

content = content.replace(/const defaultSettings = \{[\s\S]*?proj4_desc:.*?\"\n    \};/, newDefaultSettings);

// 4. Update loadPortfolioCustomizations to render projects and timeline dynamically
const renderLogic = `
        { id: 'editable-email', prop: 'href', val: 'mailto:' + data.email },
        { id: 'editable-email-txt', prop: 'innerHTML', val: '<div class="w-10 h-10 rounded-full border border-[var(--border-color)] flex items-center justify-center text-lg bg-[var(--panel-bg)]">✉</div>' + data.email },
        { id: 'editable-github', prop: 'href', val: data.github },
        { id: 'editable-linkedin', prop: 'href', val: data.linkedin }
      ];

      updates.forEach(u => {
        const el = document.getElementById(u.id);
        if (el) {
          if (u.prop === 'style.width') {
            if (el.style.width !== u.val) {
              el.style.width = u.val;
            }
          } else {
            if (el[u.prop] !== u.val) {
              el[u.prop] = u.val;
            }
          }
        }
      });

      // Render Dynamic Projects
      const projContainer = document.getElementById('dynamic-projects-container');
      if (projContainer) {
        projContainer.innerHTML = '';
        const projects = data.projects || defaultSettings.projects;
        projects.forEach(proj => {
          let tagsHtml = '';
          if (proj.tags) {
            const tags = proj.tags.split(',').map(t => t.trim()).filter(Boolean);
            tagsHtml = '<div class="flex flex-wrap gap-1.5">' + 
              tags.map(t => '<span class="px-2.5 py-1 rounded bg-[var(--panel-bg)] border border-[var(--border-color)] text-[var(--text-color)] font-sans-custom text-[10px] font-bold tracking-wider uppercase">' + t + '</span>').join('') + 
              '</div>';
          }
          
          let ctaHtml = '';
          if (proj.codeLink || proj.demoLink) {
             ctaHtml = '<div class="flex gap-3 mt-6 lg:mt-0 pointer-events-auto">';
             if (proj.codeLink) {
               ctaHtml += '<a href="' + proj.codeLink + '" target="_blank" class="px-4 py-2.5 rounded-full btn-secondary font-sans-custom text-[10px] font-bold tracking-wider uppercase no-underline flex items-center justify-center">Code</a>';
             }
             if (proj.demoLink) {
               ctaHtml += '<a href="' + proj.demoLink + '" target="_blank" class="px-4 py-2.5 rounded-full btn-primary font-sans-custom text-[10px] font-bold tracking-wider uppercase no-underline flex items-center justify-center">Live Demo</a>';
             }
             ctaHtml += '</div>';
          } else {
             ctaHtml = '<div class="flex gap-3 mt-6 lg:mt-0 pointer-events-auto"><span class="px-4 py-2.5 rounded-full btn-secondary font-sans-custom text-[10px] font-bold tracking-wider uppercase opacity-40 cursor-not-allowed">Closed</span><span class="px-4 py-2.5 rounded-full btn-primary font-sans-custom text-[10px] font-bold tracking-wider uppercase opacity-40 cursor-not-allowed">Internal</span></div>';
          }

          const html = '<div class="project-link group py-12 border-b border-[var(--border-color)] flex flex-col lg:flex-row justify-between items-start lg:items-center cursor-pointer transition-all duration-300 hover:px-4" data-img="' + (proj.img || '') + '"><div class="max-w-xl"><span class="font-sans-custom text-xs font-bold opacity-30 block mb-3 text-[var(--text-color)]">' + (proj.prefix || '') + '</span><h3 class="font-averia text-4xl md:text-5xl font-black tracking-tight uppercase group-hover:translate-x-3 transition-transform duration-300 text-[var(--text-color)] mb-3">' + (proj.title || '') + '</h3><p class="font-sans-custom text-xs md:text-sm opacity-60 leading-relaxed mb-4 text-[var(--text-color)] font-light">' + (proj.desc || '') + '</p>' + tagsHtml + '</div>' + ctaHtml + '</div>';
          projContainer.innerHTML += html;
        });
        
        // Re-attach portal listeners to new projects
        const links = document.querySelectorAll('.project-link');
        links.forEach(link => {
          if (!link.__listenerAttached) {
            link.__listenerAttached = true;
            link.addEventListener('mouseenter', (e) => {
              const imgUrl = e.currentTarget.dataset.img;
              const portalImg = document.querySelector('#project-portal img');
              if (portalImg) portalImg.src = imgUrl;
              portalActive = true;
              const portal = document.getElementById('project-portal');
              if (portal) portal.style.opacity = '1';
            });
            link.addEventListener('mousemove', (e) => {
              targetX = e.clientX + 30;
              targetY = e.clientY + 30;
            });
            link.addEventListener('mouseleave', () => {
              portalActive = false;
              const portal = document.getElementById('project-portal');
              if (portal) portal.style.opacity = '0';
            });
          }
        });
      }

      // Render Dynamic Timeline
      const timelineContainer = document.getElementById('dynamic-timeline-container');
      if (timelineContainer) {
        timelineContainer.innerHTML = '';
        const timeline = data.timeline || defaultSettings.timeline;
        timeline.forEach((item, idx) => {
           const color = item.color || '#7420df';
           const bullets = item.bullets ? item.bullets.split('\\n').map(b => '<li>' + b.trim() + '</li>').join('') : '';
           const alignClass = (idx % 2 === 0) ? 'md:flex-row-reverse' : '';
           
           const html = '<div class="relative pl-10 md:pl-0 md:flex items-center justify-between mb-16 ' + alignClass + ' group"><div class="absolute left-0 top-1.5 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-[var(--bg-color)] shadow-md z-10 transition-transform duration-300 group-hover:scale-125" style="background-color: ' + color + ';"></div><div class="w-full md:w-[45%] p-6 rounded-2xl glass-card"><span class="font-sans-custom text-[10px] font-bold uppercase tracking-wider block mb-2" style="color: ' + color + ';">' + (item.period || '') + '</span><h3 class="font-outfit text-lg font-bold text-[var(--text-color)] mb-1">' + (item.title || '') + '</h3><h4 class="font-sans-custom text-xs font-semibold opacity-60 text-[var(--text-color)] mb-4">' + (item.company || '') + '</h4><ul class="list-disc list-inside space-y-2 text-xs opacity-75 font-sans-custom font-light pl-1 text-[var(--text-color)]">' + bullets + '</ul></div><div class="hidden md:block w-[45%]"></div></div>';
           timelineContainer.innerHTML += html;
        });
      }
`;

content = content.replace(/\{ id: 'editable-email'[\s\S]*?updates\.forEach\(u => \{[\s\S]*?\}\);/, renderLogic);

// Clean up old proj properties
content = content.replace(/\{ id: 'proj\d-title'[\s\S]*?\},\s*/g, '');

fs.writeFileSync('c:/Users/iamud/OneDrive/Desktop/Portfolio/inject_portfolio_complete.cjs', content, 'utf8');
console.log('Update script finished.');
