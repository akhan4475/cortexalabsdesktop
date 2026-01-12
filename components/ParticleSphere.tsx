import React, { useEffect, useRef } from 'react';

const ParticleSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Handle High DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: { x: number; y: number; z: number; size: number }[] = [];
    const particleCount = 600;
    const sphereRadius = Math.min(width, height) * 0.35;
    
    // Initialize particles using Fibonacci Sphere algorithm for even distribution
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      particles.push({ 
        x: x * sphereRadius, 
        y: y * sphereRadius, 
        z: z * sphereRadius,
        size: Math.random() * 1.5 + 0.5 
      });
    }

    // State variables
    let rotationX = 0;
    let rotationY = 0;
    
    let isDragging = false;
    let isHovering = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Velocities
    // Initial idle speeds - Increased for faster spin
    const idleSpeedY = 0.008; 
    const idleSpeedX = 0.004;
    
    let currentSpeedX = idleSpeedX;
    let currentSpeedY = idleSpeedY;

    // Interaction Constants
    const dragSensitivity = 0.005;
    const friction = 0.95;
    const returnToIdleEase = 0.05;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      // Stop automatic momentum when grabbed so it doesn't drift while holding still
      currentSpeedX = 0;
      currentSpeedY = 0;
    };

    const handleMouseMoveWindow = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      // Direct rotation control (Position Control)
      rotationY += dx * dragSensitivity;
      rotationX += dy * dragSensitivity;

      // Update speed to track the throw momentum
      currentSpeedY = dx * dragSensitivity;
      currentSpeedX = dy * dragSensitivity;
    };

    const handleMouseUpWindow = () => {
      isDragging = false;
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      // Note: We do NOT set isDragging to false here. 
      // This allows the user to drag the sphere even if their cursor slips outside the canvas bounds,
      // which is a better UX for drag interactions.
    };

    // Event Listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Window listeners for drag continuity
    window.addEventListener('mousemove', handleMouseMoveWindow);
    window.addEventListener('mouseup', handleMouseUpWindow);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (!isDragging) {
        if (!isHovering) {
            // When NOT hovered: Smoothly return to the specific idle spin
            currentSpeedY += (idleSpeedY - currentSpeedY) * returnToIdleEase;
            currentSpeedX += (idleSpeedX - currentSpeedX) * returnToIdleEase;
        } else {
            // When hovered but NOT dragging: Apply friction to the last throw/movement
            // This creates a nice "free spin" feel after a drag release while still hovering
            currentSpeedY *= friction;
            currentSpeedX *= friction;
        }

        // Apply calculated speeds
        rotationY += currentSpeedY;
        rotationX += currentSpeedX;
      }
      // If isDragging is true, rotation is updated directly in handleMouseMoveWindow

      // Sort particles by Z depth so front ones draw on top
      particles.sort((a, b) => {
        const az = a.z * Math.cos(rotationX) - a.y * Math.sin(rotationX);
        const bz = b.z * Math.cos(rotationX) - b.y * Math.sin(rotationX);
        return az - bz; 
      });

      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#3ECE8D'; // Horizon Accent Green

      particles.forEach((p) => {
        // Rotate around Y axis
        let x1 = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
        let z1 = p.z * Math.cos(rotationY) + p.x * Math.sin(rotationY);

        // Rotate around X axis
        let y1 = p.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        let z2 = z1 * Math.cos(rotationX) + p.y * Math.sin(rotationX);

        // Perspective projection
        const scale = 400 / (400 + z2); // Perspective depth
        const x2d = cx + x1 * scale;
        const y2d = cy + y1 * scale;

        // Draw particle
        const alpha = Math.max(0.1, (z2 + sphereRadius) / (2 * sphereRadius)); // Fade out back particles
        
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMoveWindow);
      window.removeEventListener('mouseup', handleMouseUpWindow);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block cursor-grab active:cursor-grabbing"
    />
  );
};

export default ParticleSphere;