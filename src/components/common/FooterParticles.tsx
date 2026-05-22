import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface FooterParticlesProps {
  className?: string;
}

export function FooterParticles({ className = '' }: FooterParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const particleCount = 40;
  const connectionDistance = 120;
  const particleColor = '147, 130, 255';
  const lineColor = '99, 102, 241';
  const speed = 0.2;

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      if (particlesRef.current.length === 0) {
        particlesRef.current = initParticles(rect.width, rect.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const particles = particlesRef.current;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = opacity * 1.2;
            ctx.stroke();
          }
        }

        // Mouse interaction
        const mouseDx = particles[i].x - mouseX;
        const mouseDy = particles[i].y - mouseY;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDistance < connectionDistance * 1.2) {
          const opacity = (1 - mouseDistance / (connectionDistance * 1.2)) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(${particleColor}, ${opacity})`;
          ctx.lineWidth = opacity * 1.5;
          ctx.stroke();
        }
      }

      // Draw and update particles
      time += 1;
      for (const particle of particles) {
        const pulse = Math.sin(time * particle.pulseSpeed + particle.pulseOffset) * 0.3 + 0.7;
        const currentOpacity = particle.opacity * pulse;
        const currentRadius = particle.radius * (0.8 + pulse * 0.4);

        // Glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentRadius * 3
        );
        gradient.addColorStop(0, `rgba(${particleColor}, ${currentOpacity})`);
        gradient.addColorStop(1, `rgba(${particleColor}, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${currentOpacity + 0.2})`;
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.995;
        particle.vy *= 0.995;

        // Boundaries
        if (particle.x < -30) particle.x = rect.width + 30;
        if (particle.x > rect.width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = rect.height + 30;
        if (particle.y > rect.height + 30) particle.y = -30;

        // Random drift
        particle.vx += (Math.random() - 0.5) * 0.008;
        particle.vy += (Math.random() - 0.5) * 0.008;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
