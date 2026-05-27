import { useEffect, useRef } from 'react';

export default function WavyBackground() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const animFrameRef = useRef(null);
  const phase = useRef(0);

  // Physics simulation data
  const gridPoints = useRef([]); // 2D array [linesCount][pointsCount]
  const pathElements = useRef([]); // 1D array of SVG path elements

  // Cursor tracking
  const mouseTarget = useRef({ x: -9999, y: -9999 });
  const mouseCurrent = useRef({ x: -9999, y: -9999 });
  const mouseVelocity = useRef(0);
  const prevMousePos = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    // 1. Resize Handler & Grid Initialization
    const linesCount = 24;
    const pointsCount = 80;

    const initGrid = () => {
      const width = container.clientWidth || container.offsetWidth || 1200;
      const height = container.clientHeight || container.offsetHeight || 800;

      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;

      // Clear existing paths
      pathElements.current.forEach((el) => el.remove());
      pathElements.current = [];
      gridPoints.current = [];

      const xGap = width / (linesCount - 1);
      const yGap = height / (pointsCount - 1);

      // Initialize physics nodes
      for (let i = 0; i < linesCount; i++) {
        const lineNodes = [];
        const x = xGap * i;

        for (let j = 0; j < pointsCount; j++) {
          const y = yGap * j;
          lineNodes.push({
            x,
            y,
            wx: 0, // wave x displacement
            wy: 0, // wave y displacement
            cx: 0, // cursor x displacement
            cy: 0, // cursor y displacement
            vx: 0, // cursor x velocity
            vy: 0, // cursor y velocity
          });
        }
        gridPoints.current.push(lineNodes);

        // Create native SVG path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#222222');
        path.setAttribute('stroke-width', '1.1');
        path.setAttribute('opacity', '0.15');
        svg.appendChild(path);
        pathElements.current.push(path);
      }
    };

    initGrid();
    window.addEventListener('resize', initGrid);

    // 2. Mouse Tracking Listeners
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseTarget.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseTarget.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // 3. Easing & Physics Render Loop
    const draw = () => {
      if (!svg || gridPoints.current.length === 0) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      // Continuous wave phase shift
      phase.current += 0.012;

      // Lerp cursor coordinates
      mouseCurrent.current.x = mouseCurrent.current.x + (mouseTarget.current.x - mouseCurrent.current.x) * 0.08;
      mouseCurrent.current.y = mouseCurrent.current.y + (mouseTarget.current.y - mouseCurrent.current.y) * 0.08;

      // Calculate cursor speed/velocity for force intensity
      if (prevMousePos.current.x !== -9999) {
        const dx = mouseTarget.current.x - prevMousePos.current.x;
        const dy = mouseTarget.current.y - prevMousePos.current.y;
        const instSpeed = Math.hypot(dx, dy);
        mouseVelocity.current = mouseVelocity.current + (instSpeed - mouseVelocity.current) * 0.1;
      }
      prevMousePos.current = { ...mouseTarget.current };

      const influenceRadius = Math.max(160, Math.min(260, mouseVelocity.current * 1.5));
      const forceScale = 0.0006;

      const nodes = gridPoints.current;
      const paths = pathElements.current;

      // Update Node Physics
      for (let i = 0; i < linesCount; i++) {
        const lineNodes = nodes[i];
        const path = paths[i];
        if (!lineNodes || !path) continue;

        const pathCoords = [];

        for (let j = 0; j < pointsCount; j++) {
          const node = lineNodes[j];
          
          // Layered sine wave displacement
          const waveAngle = node.x * 0.003 + node.y * 0.0025 + phase.current;
          node.wx = Math.cos(waveAngle) * 16;
          node.wy = Math.sin(waveAngle) * 6;

          // Mouse Force Field Calculations
          const actualX = node.x + node.wx;
          const actualY = node.y + node.wy;
          const dx = actualX - mouseCurrent.current.x;
          const dy = actualY - mouseCurrent.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist < influenceRadius) {
            const ease = 1 - dist / influenceRadius; // 0 to 1 scaling
            const repulsion = Math.cos(dist * 0.0015) * ease * influenceRadius * mouseVelocity.current * forceScale;
            const pushAngle = Math.atan2(dy, dx);
            
            node.vx += Math.cos(pushAngle) * repulsion;
            node.vy += Math.sin(pushAngle) * repulsion;
          }

          // Spring physics (return pull and damping friction)
          node.vx += -node.cx * 0.015;
          node.vy += -node.cy * 0.015;
          node.vx *= 0.94;
          node.vy *= 0.94;

          node.cx += node.vx;
          node.cy += node.vy;

          // Clamp max deformation to prevent rendering glitches
          node.cx = Math.max(-60, Math.min(60, node.cx));
          node.cy = Math.max(-60, Math.min(60, node.cy));

          // Calculate final drawn coordinates
          const finalX = actualX + node.cx;
          const finalY = actualY + node.cy;

          pathCoords.push(`${j === 0 ? 'M' : 'L'} ${finalX} ${finalY}`);
        }

        // Direct DOM update (no virtual DOM overhead!)
        path.setAttribute('d', pathCoords.join(' '));
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', initGrid);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 opacity-25 pointer-events-none overflow-hidden"
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      />
    </div>
  );
}
