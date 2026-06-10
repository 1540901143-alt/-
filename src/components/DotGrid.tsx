import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import './DotGrid.css';

// Throttling helper to optimize performance
const throttle = (func: Function, limit: number) => {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};

// Color utility to interpolate between base and active colors
function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 47, g: 41, b: 58 }; // default to #2F293A
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number; // control physical damping
  returnDuration?: number; // dynamic elastic pull
  className?: string;
  style?: React.CSSProperties;
}

interface Dot {
  cx: number;
  cy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function DotGrid({
  dotSize = 5,
  gap = 15,
  baseColor = '#2F293A',
  activeColor = '#5227FF',
  proximity = 120,
  speedTrigger = 80,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 3000,
  resistance = 750, // Higher value means softer movement resistance
  returnDuration = 1.5,
  className = '',
  style
}: DotGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  
  // Track continuous client space cursor state to handle offset calculations accurately
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    clientX: -9999,
    clientY: -9999,
    vx: 0,
    vy: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  // Handle building/rebuilding grid on dimensions change
  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({
          cx,
          cy,
          x: cx,
          y: cy,
          vx: 0,
          vy: 0
        });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  // Primary animation update and draw loop using pure high-performance Canvas equations
  useEffect(() => {
    let rafId: number;
    const proxSq = proximity * proximity;

    const updateAndDraw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Track pointer location relative to canvas bounds
      const rect = canvas.getBoundingClientRect();
      const pointer = pointerRef.current;
      const px = pointer.clientX - rect.left;
      const py = pointer.clientY - rect.top;

      // Adjust spring and fluid friction coefficients for organic elastic rebound
      const stiffness = 0.08 / returnDuration; // spring strength
      const friction = Math.max(0.7, 1 - (120 / resistance)); // dampening factor

      for (const dot of dotsRef.current) {
        // Distance calculation to anchor point
        const dxAnchor = dot.cx - dot.x;
        const dyAnchor = dot.cy - dot.y;

        // Apply progressive returning spring force toward resting spot.
        dot.vx += dxAnchor * stiffness;
        dot.vy += dyAnchor * stiffness;

        // Interactive cursor push force
        const dxCursor = dot.x - px;
        const dyCursor = dot.y - py;
        const distCursorSq = dxCursor * dxCursor + dyCursor * dyCursor;

        if (distCursorSq < proxSq) {
          const dist = Math.sqrt(distCursorSq || 1);
          // Stronger force the closer the pointer gets
          const forceFactor = (1 - dist / proximity); 
          const pushForce = forceFactor * 2.8;

          // Push dot away from mouse
          dot.vx += (dxCursor / dist) * pushForce;
          dot.vy += (dyCursor / dist) * pushForce;
        }

        // Apply friction and compute next coordinates
        dot.vx *= friction;
        dot.vy *= friction;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Color interpolation calculations
        let color = baseColor;
        const distSqToAnchor = (dot.x - px) * (dot.x - px) + (dot.y - py) * (dot.y - py);
        if (distSqToAnchor <= proxSq) {
          const dist = Math.sqrt(distSqToAnchor || 1);
          const t = 1 - dist / proximity;
          
          // Smooth blend
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          color = `rgb(${r},${g},${b})`;
        }

        // Draw Dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      rafId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, dotSize, returnDuration, resistance]);

  // Attach ResizeObserver to keep canvas layout synchronized
  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => buildGrid());
      if (wrapperRef.current) {
        ro.observe(wrapperRef.current);
      }
    } else if (typeof window !== "undefined") {
      (window as any).addEventListener("resize", buildGrid);
    }
    return () => {
      if (ro) {
        ro.disconnect();
      } else if (typeof window !== "undefined") {
        (window as any).removeEventListener("resize", buildGrid);
      }
    };
  }, [buildGrid]);

  // Handle mouse move & click shockwave effects
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }

      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;

      // Track raw client coordinates to allow local canvas bounds offset mapping
      pr.clientX = e.clientX;
      pr.clientY = e.clientY;

      if (speed > speedTrigger) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const localPx = e.clientX - rect.left;
        const localPy = e.clientY - rect.top;

        for (const dot of dotsRef.current) {
          const dist = Math.hypot(dot.cx - localPx, dot.cy - localPy);
          if (dist < proximity) {
            // Apply kinetic acceleration in direction of cursor path
            const factor = (1 - dist / proximity) * 0.15;
            dot.vx += vx * factor;
            dot.vy += vy * factor;
          }
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      // Push all dots away with a sudden burst of energy
      for (const dot of dotsRef.current) {
        const dx = dot.x - cx;
        const dy = dot.y - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < shockRadius) {
          const falloff = Math.max(0, 1 - dist / shockRadius);
          // Apply instant acceleration outwards
          const outwardX = dist > 0 ? (dx / dist) : (Math.random() - 0.5);
          const outwardY = dist > 0 ? (dy / dist) : (Math.random() - 0.5);
          
          dot.vx += outwardX * shockStrength * falloff * 8;
          dot.vy += outwardY * shockStrength * falloff * 8;
        }
      }
    };

    const throttledMove = throttle(onMove, 16); // High responsiveness
    window.addEventListener('mousemove', throttledMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('click', onClick);
    };
  }, [maxSpeed, speedTrigger, proximity, shockRadius, shockStrength]);

  return (
    <section className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
}
