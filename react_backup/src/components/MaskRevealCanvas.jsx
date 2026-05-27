import { useEffect, useRef } from 'react';

export default function MaskRevealCanvas({ imageSrc, backImageSrc }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const time = useRef(0);

  // Keep track of trailing liquid splash points
  const trail = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Create an offscreen buffer canvas for high-performance GPU compositing
    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');

    const imgFront = new Image();
    imgFront.src = imageSrc; // Portrait WITH VR headset

    const imgBack = new Image();
    imgBack.src = backImageSrc; // Plain portrait WITHOUT VR headset

    const REVEAL_RADIUS = 200; // base splat radius
    const SHRINK_TIME_SECONDS = 2.4; // dissipation time
    const LERP_SPEED = 0.08;

    // Track mouse coordinates
    const mouseTarget = { x: -9999, y: -9999 };
    const mouseCurrent = { x: -9999, y: -9999 };
    let hasEntered = false;
    let lastRegisteredPos = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseEnter = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseTarget.x = x;
      mouseTarget.y = y;
      mouseCurrent.x = x;
      mouseCurrent.y = y;
      lastRegisteredPos = { x, y };
      
      hasEntered = true;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseTarget.x = x;
      mouseTarget.y = y;

      if (!hasEntered) {
        mouseCurrent.x = x;
        mouseCurrent.y = y;
        lastRegisteredPos = { x, y };
        hasEntered = true;
      }
    };

    const handleMouseLeave = () => {
      mouseTarget.x = -9999;
      mouseTarget.y = -9999;
      hasEntered = false;
    };

    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const lerp = (a, b, t) => a + (b - a) * t;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Increment wave phase timer
      time.current += 1.0;

      // Lerp mouse coordinate glide
      if (hasEntered) {
        mouseCurrent.x = lerp(mouseCurrent.x, mouseTarget.x, LERP_SPEED);
        mouseCurrent.y = lerp(mouseCurrent.y, mouseTarget.y, LERP_SPEED);

        // Add splash trail node if cursor moves by more than 10px
        const distMoved = Math.hypot(mouseCurrent.x - lastRegisteredPos.x, mouseCurrent.y - lastRegisteredPos.y);
        if (distMoved > 10) {
          trail.current.push({
            x: mouseCurrent.x,
            y: mouseCurrent.y,
            radius: REVEAL_RADIUS,
            maxRadius: REVEAL_RADIUS,
            wobblePhase: Math.random() * Math.PI * 2,
            life: 1.0, // ages down to 0.0
            isCursor: false,
          });
          lastRegisteredPos = { x: mouseCurrent.x, y: mouseCurrent.y };
        }
      }

      // Update fluid age and decay trail points
      const dt = 1 / 60; // 60fps time step
      trail.current.forEach((node) => {
        if (!node.isCursor) {
          node.life -= dt / SHRINK_TIME_SECONDS;
          node.radius = node.maxRadius * Math.pow(node.life, 1.6); // Shrink curve
        }
      });

      // Filter out aged nodes
      trail.current = trail.current.filter((node) => node.isCursor || node.life > 0);

      // Render images
      if (imgFront.complete && imgBack.complete) {
        const scale = Math.max(
          canvas.width / imgFront.naturalWidth,
          canvas.height / imgFront.naturalHeight
        );
        const drawW = imgFront.naturalWidth * scale;
        const drawH = imgFront.naturalHeight * scale;
        const drawX = (canvas.width - drawW) / 2;
        const drawY = (canvas.height - drawH) / 2;

        // 1. Draw base plain portrait (always visible behind fluid splash)
        ctx.drawImage(imgBack, drawX, drawY, drawW, drawH);

        // 2. Collect all active splash nodes
        const activeBlobs = [...trail.current];
        if (hasEntered) {
          activeBlobs.push({
            x: mouseCurrent.x,
            y: mouseCurrent.y,
            radius: REVEAL_RADIUS,
            wobblePhase: 0,
            isCursor: true,
          });
        }

        // 3. Render Liquid Splash Mask inside the Offscreen Canvas Buffer
        if (activeBlobs.length > 0) {
          maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          maskCtx.save();

          activeBlobs.forEach((blob) => {
            // Liquid deformation math per node
            const wobble = Math.sin(time.current * 0.05 + blob.wobblePhase) * (blob.radius * 0.08);
            const r = Math.max(0, blob.radius + wobble);

            // Draw circular splash as soft radial gradients that blend organically
            const grad = maskCtx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r);
            grad.addColorStop(0, 'rgba(255,255,255,1.0)');
            grad.addColorStop(0.7, 'rgba(255,255,255,0.85)');
            grad.addColorStop(1, 'rgba(255,255,255,0.0)');

            maskCtx.fillStyle = grad;
            maskCtx.beginPath();
            maskCtx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
            maskCtx.fill();
          });

          // 4. Clip the front VR portrait strictly to this soft splash
          maskCtx.globalCompositeOperation = 'source-in';
          maskCtx.drawImage(imgFront, drawX, drawY, drawW, drawH);
          maskCtx.restore();

          // 5. Draw completed offscreen composited splash on top of main canvas
          ctx.drawImage(maskCanvas, 0, 0);
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    imgFront.onload = () => draw();
    imgBack.onload = () => draw();
    if (imgFront.complete && imgBack.complete) draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [imageSrc, backImageSrc]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-30 pointer-events-auto"
      style={{ mixBlendMode: 'normal', background: 'transparent' }}
    />
  );
}
