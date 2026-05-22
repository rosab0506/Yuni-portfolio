import { useEffect, useRef } from 'react';

interface AuroraMeshProps {
  className?: string;
  variant?: 'dark' | 'light';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export function AuroraMesh({ className = '', variant = 'dark' }: AuroraMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Create particles - more particles for better visibility
    const initParticles = () => {
      const particleCount = Math.min(Math.floor((width * height) / 8000), 150);
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 2,
          opacity: Math.random() * 0.6 + 0.4
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = '#0B1320';
      ctx.fillRect(0, 0, width, height);

      // Draw soft radial gradient glow in center
      const centerGlow = ctx.createRadialGradient(
        width * 0.5, height * 0.35, 0,
        width * 0.5, height * 0.35, width * 0.5
      );
      centerGlow.addColorStop(0, 'rgba(199, 125, 255, 0.12)');
      centerGlow.addColorStop(0.5, 'rgba(157, 78, 221, 0.06)');
      centerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const connectionDistance = 180;
      const mouseRadius = 250;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction - particles move away from cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouseRadius && dist > 0) {
          const force = (mouseRadius - dist) / mouseRadius;
          p.vx -= (dx / dist) * force * 0.3;
          p.vy -= (dy / dist) * force * 0.3;
        }

        // Apply velocity with damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Add slight random movement
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle glow (outer)
        const particleGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 6);
        particleGlow.addColorStop(0, `rgba(255, 255, 255, ${p.opacity * 0.4})`);
        particleGlow.addColorStop(0.4, `rgba(199, 125, 255, ${p.opacity * 0.2})`);
        particleGlow.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = particleGlow;
        ctx.fill();

        // Draw solid white particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < connectionDistance) {
            const opacity = (1 - dist2 / connectionDistance) * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw connection to mouse if close
        if (dist < mouseRadius && dist > 0) {
          const opacity = (1 - dist / mouseRadius) * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(199, 125, 255, ${opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Draw mouse cursor glow when active
      if (mouse.x > 0 && mouse.y > 0 && mouse.x < width && mouse.y < height) {
        const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
        cursorGlow.addColorStop(0, 'rgba(199, 125, 255, 0.25)');
        cursorGlow.addColorStop(0.5, 'rgba(199, 125, 255, 0.08)');
        cursorGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
        ctx.fillStyle = cursorGlow;
        ctx.fill();
      }

      // Add subtle vignette
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, height * 0.3,
        width / 2, height / 2, Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(11, 19, 32, 0.4)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
      className={className}
    />
  );
}
