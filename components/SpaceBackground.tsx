import React, { useEffect, useRef } from 'react';

const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // DPI handling for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Particle setup
    const stars: { x: number; y: number; z: number; color: string }[] = [];
    const numStars = 400; // Amount of stars
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Brand colors + white/grey
    const colors = ['#ffffff', '#a1a1a1', '#3ECE8D', '#1a4d33'];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - centerX,
        y: Math.random() * height - centerY,
        z: Math.random() * width,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animateId: number;

    const animate = () => {
      // Clear with slight fade for potential trail effect, or full clear
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;

      // Update and Draw
      stars.forEach(star => {
        // Move star closer (decrease Z)
        star.z -= 0.2; // Speed of travel

        // Reset star if it passes the viewer or moves too far
        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - cx;
          star.y = Math.random() * height - cy;
        }

        // Projection math
        // x' = x / z * constant
        const k = 128.0 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;
        
        // Calculate size and opacity based on depth (z)
        // Closer stars (low z) are bigger and brighter
        const size = (1 - star.z / width) * 2.0;
        const opacity = (1 - star.z / width);

        if (px >= 0 && px <= width && py >= 0 && py <= height && size > 0) {
           ctx.beginPath();
           ctx.fillStyle = star.color;
           ctx.globalAlpha = opacity;
           ctx.arc(px, py, size, 0, Math.PI * 2);
           ctx.fill();
        }
      });
      
      ctx.globalAlpha = 1.0;
      animateId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none', opacity: 0.6 }} />;
};

export default SpaceBackground;