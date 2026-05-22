import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Types ---
interface AnimatedBackgroundProps {
  className?: string;
  variant?: 'default' | 'admin';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

// --- Utility ---
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Component ---
export function AnimatedBackground({ className, variant = 'default' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 1. Setup Dimensions & Resize Listener
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Canvas Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with DPR support for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    // Configuration based on variant
    const particleCount = variant === 'admin'
      ? Math.floor((dimensions.width * dimensions.height) / 25000) // Fewer particles for admin
      : Math.floor((dimensions.width * dimensions.height) / 15000);

    const connectionDist = variant === 'admin' ? 120 : 150;
    const baseSpeed = variant === 'admin' ? 0.05 : 0.08;

    // Initialize Particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * baseSpeed * 2,
        vy: (Math.random() - 0.5) * baseSpeed * 2,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1, // Subtle opacity
      });
    }

    // Animation Loop
    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw Particles & Connections
      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > dimensions.width) p.vx *= -1;
        if (p.y < 0 || p.y > dimensions.height) p.vy *= -1;

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199, 125, 255, ${p.opacity})`; // Soft Purple/Pinkish
        ctx.fill();

        // Connect to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.15; // Very subtle connection
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(199, 125, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, variant]);

  // 3. Motion Blobs Configuration
  // Using Framer Motion for smooth, organic, non-repetitive morphing
  const blobVariants = {
    animate: {
      scale: [1, 1.1, 0.9, 1],
      x: [0, 30, -20, 0],
      y: [0, -40, 20, 0],
      opacity: [0.3, 0.4, 0.3, 0.3],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#0B1320]',
        className
      )}
    >
      {/* 
        Layer 1: Deep Gradient Base 
        This provides the foundational "Atmosphere" 
      */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1320] via-[#111827] to-[#0F172A]" />

      {/* 
        Layer 2: Soft Morphing Blobs (Framer Motion)
        These create the premium "glowing" effect without being harsh.
      */}
      <div className="absolute inset-0 filter blur-[100px] opacity-40">
        {/* Top Left - Cyan/Blue Tone */}
        <motion.div
          variants={blobVariants}
          animate="animate"
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#06b6d4]/20"
        />

        {/* Bottom Right - Purple/Fuchsia Tone */}
        <motion.div
          variants={blobVariants}
          animate="animate"
          transition={{ duration: 18, delay: 2 }} // Offset duration/delay for randomness
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#C77DFF]/20"
        />

        {/* Center/Random - Soft Violet */}
        <motion.div
          variants={blobVariants}
          animate="animate"
          transition={{ duration: 22, delay: 5 }}
          className="absolute top-[30%] left-[30%] w-[30%] h-[30%] rounded-full bg-[#9D4EDD]/15"
        />
      </div>

      {/* 
        Layer 3: Canvas Particle Network 
        Adds the crisp technical/SaaS detail largely transparent on top.
      */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* 
        Layer 4: Subtle Vignette 
        Focuses attention on the center content 
      */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B1320_120%)] opacity-60" />
    </div>
  );
}
