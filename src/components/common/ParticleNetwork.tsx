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

interface ParticleNetworkProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  particleColor?: string;
  lineColor?: string;
  speed?: number;
}

export function ParticleNetwork({
  className = '',
  particleCount = 80,
  connectionDistance = 150,
  particleColor = '139, 92, 246', // Purple RGB
  lineColor = '99, 102, 241', // Indigo RGB
  speed = 0.3,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, [particleCount, speed]);

  const drawParticle = useCallback((
    ctx: CanvasRenderingContext2D,
    particle: Particle,
    time: number
  ) => {
    const pulse = Math.sin(time * particle.pulseSpeed + particle.pulseOffset) * 0.3 + 0.7;
    const currentOpacity = particle.opacity * pulse;
    const currentRadius = particle.radius * (0.8 + pulse * 0.4);

    // Glow effect
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, currentRadius * 4
    );
    gradient.addColorStop(0, `rgba(${particleColor}, ${currentOpacity})`);
    gradient.addColorStop(0.5, `rgba(${particleColor}, ${currentOpacity * 0.3})`);
    gradient.addColorStop(1, `rgba(${particleColor}, 0)`);

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, currentRadius * 4, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Core particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particleColor}, ${currentOpacity + 0.2})`;
    ctx.fill();
  }, [particleColor]);

  const drawConnections = useCallback((
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    mouseX: number,
    mouseY: number
  ) => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.4;
          
          // Create gradient line
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          gradient.addColorStop(0, `rgba(${lineColor}, ${opacity * particles[i].opacity})`);
          gradient.addColorStop(0.5, `rgba(${particleColor}, ${opacity * 0.8})`);
          gradient.addColorStop(1, `rgba(${lineColor}, ${opacity * particles[j].opacity})`);

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = opacity * 1.5;
          ctx.stroke();
        }
      }

      // Mouse interaction - connect particles near mouse
      const mouseDx = particles[i].x - mouseX;
      const mouseDy = particles[i].y - mouseY;
      const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

      if (mouseDistance < connectionDistance * 1.5) {
        const opacity = (1 - mouseDistance / (connectionDistance * 1.5)) * 0.6;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(${particleColor}, ${opacity})`;
        ctx.lineWidth = opacity * 2;
        ctx.stroke();
      }
    }
  }, [connectionDistance, lineColor, particleColor]);

  const updateParticles = useCallback((
    particles: Particle[],
    width: number,
    height: number,
    mouseX: number,
    mouseY: number
  ) => {
    for (const particle of particles) {
      // Mouse repulsion
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 120) {
        const force = (120 - distance) / 120;
        const angle = Math.atan2(dy, dx);
        particle.vx += Math.cos(angle) * force * 0.02;
        particle.vy += Math.sin(angle) * force * 0.02;
      }

      // Apply velocity with damping
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Soft boundaries - particles wrap around
      if (particle.x < -50) particle.x = width + 50;
      if (particle.x > width + 50) particle.x = -50;
      if (particle.y < -50) particle.y = height + 50;
      if (particle.y > height + 50) particle.y = -50;

      // Random drift
      particle.vx += (Math.random() - 0.5) * 0.01;
      particle.vy += (Math.random() - 0.5) * 0.01;

      // Speed limit
      const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (currentSpeed > speed * 2) {
        particle.vx = (particle.vx / currentSpeed) * speed * 2;
        particle.vy = (particle.vy / currentSpeed) * speed * 2;
      }
    }
  }, [speed]);

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

      // Draw connections first (behind particles)
      drawConnections(ctx, particlesRef.current, mouseRef.current.x, mouseRef.current.y);

      // Draw and update particles
      time += 1;
      for (const particle of particlesRef.current) {
        drawParticle(ctx, particle, time);
      }

      updateParticles(
        particlesRef.current,
        rect.width,
        rect.height,
        mouseRef.current.x,
        mouseRef.current.y
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, drawParticle, drawConnections, updateParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ 
        background: 'transparent',
        pointerEvents: 'auto',
      }}
    />
  );
}
