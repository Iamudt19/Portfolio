import { useRef, useEffect, useState } from 'react';

export default function MarqueeTicker({
  items,           // string[] — list of words/phrases to scroll
  fontClass,       // tailwind font class e.g. "font-sans" or "font-serif"
  fontSize,        // tailwind size e.g. "text-[164px]"
  opacity,         // tailwind opacity e.g. "opacity-10" or "opacity-100"
  speed = 40,      // seconds for one full loop
  direction = -1,  // -1 = left, 1 = right
  gap = 60,        // px gap between items
}) {
  const trackRef = useRef(null);
  const [clones, setClones] = useState(1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Ensure we have enough copies to fill screen
    const totalWidth = track.scrollWidth;
    const needed = Math.ceil((window.innerWidth * 2) / totalWidth) + 1;
    setClones(Math.max(needed, 2));
  }, [items]);

  const content = items.join('  ·  ');
  const copies = Array.from({ length: clones + 1 }, (_, i) => i);

  return (
    <div className={`overflow-hidden w-full flex ${opacity}`}>
      <div
        ref={trackRef}
        className={`flex whitespace-nowrap ${fontClass} ${fontSize} font-bold leading-none tracking-tight`}
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === -1 ? 'normal' : 'reverse',
          gap: `${gap}px`,
        }}
      >
        {copies.map((i) => (
          <span key={i} style={{ paddingRight: `${gap}px`, flexShrink: 0 }}>
            {content}
          </span>
        ))}
      </div>
    </div>
  );
}
