import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  speedX: number;
  waveOffset: number;
  waveAmplitude: number;
  color: string;
}

interface PerformanceMetrics {
  fps: number;
  lastFrameTime: number;
  frameCount: number;
}

export default function MysticalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const performanceRef = useRef<PerformanceMetrics>({
    fps: 60,
    lastFrameTime: performance.now(),
    frameCount: 0,
  });
  const isVisibleRef = useRef<boolean>(true);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  // Detect mobile and determine particle count
  const getParticleCount = (): number => {
    const isMobile = window.innerWidth < 768;
    const baseCount = isMobile ? 15 : 40;
    return isLowPerformance ? Math.floor(baseCount * 0.5) : baseCount;
  };

  // Particle colors based on cosmic theme
  const particleColors = [
    'rgba(99, 102, 241, ', // cosmic blue
    'rgba(168, 85, 247, ', // mystic purple
    'rgba(129, 140, 248, ', // lighter cosmic
    'rgba(192, 132, 252, ', // lighter mystic
  ];

  // Initialize particles
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const count = getParticleCount();
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2, // 2-6px
        opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7
        speedY: Math.random() * 0.3 + 0.1, // slow upward drift
        speedX: Math.random() * 0.2 - 0.1, // slight horizontal movement
        waveOffset: Math.random() * Math.PI * 2,
        waveAmplitude: Math.random() * 1.5 + 0.5,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      });
    }

    particlesRef.current = particles;
  };

  // Update particle positions
  const updateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current.forEach((particle) => {
      // Move particle upward
      particle.y -= particle.speedY;

      // Add horizontal wave motion
      particle.waveOffset += 0.02;
      particle.x += Math.sin(particle.waveOffset) * particle.waveAmplitude * 0.1;

      // Wrap around screen edges
      if (particle.y < -10) {
        particle.y = canvas.height + 10;
        particle.x = Math.random() * canvas.width;
      }
      if (particle.x < -10) {
        particle.x = canvas.width + 10;
      }
      if (particle.x > canvas.width + 10) {
        particle.x = -10;
      }
    });
  };

  // Draw particles on canvas
  const drawParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each particle
    particlesRef.current.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${particle.opacity})`;
      ctx.fill();
    });
  };

  // Calculate FPS
  const calculateFPS = (currentTime: number) => {
    const metrics = performanceRef.current;
    metrics.frameCount++;

    const elapsed = currentTime - metrics.lastFrameTime;
    if (elapsed >= 1000) {
      metrics.fps = Math.round((metrics.frameCount * 1000) / elapsed);
      metrics.frameCount = 0;
      metrics.lastFrameTime = currentTime;

      // Detect low performance (below 55fps)
      if (metrics.fps < 55 && !isLowPerformance) {
        setIsLowPerformance(true);
        initParticles(); // Reinitialize with fewer particles
      }
    }
  };

  // Animation loop
  const animate = (currentTime: number) => {
    if (!isVisibleRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    calculateFPS(currentTime);
    updateParticles();
    drawParticles();

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Handle window resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reinitialize particles with new dimensions
    initParticles();
  };

  // Handle visibility change (pause when tab not visible)
  const handleVisibilityChange = () => {
    isVisibleRef.current = !document.hidden;
  };

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    initParticles();

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Add event listeners
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLowPerformance]);

  return (
    <>
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-950 via-mystic-950 to-cosmic-900 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
