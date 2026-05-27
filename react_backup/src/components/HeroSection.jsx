import { motion } from 'framer-motion';
import MaskRevealCanvas from './MaskRevealCanvas';
import MarqueeTicker from './MarqueeTicker';
import WavyBackground from './WavyBackground';
import developerPhoto from '../assets/your-photo.png';
import backPhoto from '../assets/your-photo-back.png';

// Custom portfolio items
const TOP_TICKER_ITEMS = [
  'I USUALLY JUST SIMPLY CODE',
];

const BOTTOM_TICKER_ITEMS = [
  'FULL STACK',
  'REACT · NEXT.JS',
  'NODE.JS',
  'UI ENGINEERING',
];

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white select-none">
      
      {/* Layer 1: Interactive Wavy Grid Background Pattern with smooth entrance (z-0) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      >
        <WavyBackground />
      </motion.div>

      {/* Layer 2: Canvas hover mask reveal in the absolute foreground (z-30) */}
      {/* Draws your plain portrait universally at 1.0 opacity on top of the text, */}
      {/* and overlays the VR headset portrait inside the organic liquid hover clipping mask! */}
      <MaskRevealCanvas imageSrc={developerPhoto} backImageSrc={backPhoto} />

      {/* Layer 3: Gradient mask at top edge (z-40) */}
      <div
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(0deg, rgba(0,0,0,0) 94%, rgb(0,0,0) 97%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,0) 94%, rgb(0,0,0) 97%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Layer 4: Marquee text rows — layered behind the portrait (z-20) */}
      {/* Container has pointer-events-none so hover coordinate tracks pass straight through the text to the canvas */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center pointer-events-none">
        
        {/* TOP TICKER ROW — slides in from the left */}
        <motion.div
          initial={{ opacity: 0, x: -120 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <MarqueeTicker
            items={TOP_TICKER_ITEMS}
            fontClass="font-sans"
            fontSize="text-[64px] md:text-[80px] lg:text-[164px]"
            opacity="opacity-10"
            speed={35}
            direction={-1}
            gap={60}
          />
        </motion.div>

        {/* DOTTED DIVIDER — expands horizontally from the left */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full border-t-2 border-dotted border-black/25 my-0 origin-left"
        />

        {/* BOTTOM TICKER ROW — slides in from the right */}
        <motion.div
          initial={{ opacity: 0, x: 120 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <MarqueeTicker
            items={BOTTOM_TICKER_ITEMS}
            fontClass="font-serif"
            fontSize="text-[64px] md:text-[80px] lg:text-[164px]"
            opacity="opacity-100"
            speed={30}
            direction={1}
            gap={60}
          />
        </motion.div>
      </div>

    </section>
  );
}
