import React, { useEffect, useRef } from 'react';

export default function WeatherCanvasBackground({ conditionCode = 'partly_cloudy' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle setup
    const isRain = conditionCode === 'rain' || conditionCode === 'drizzle' || conditionCode === 'thunderstorm';
    const isSnow = conditionCode === 'snow';
    const particleCount = isRain ? 100 : isSnow ? 60 : 25;

    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: isRain ? 15 + Math.random() * 20 : 0,
      radius: isSnow ? 2 + Math.random() * 3 : Math.random() * 2 + 1,
      speedY: isRain ? 8 + Math.random() * 8 : isSnow ? 1 + Math.random() * 2 : 0.2 + Math.random() * 0.3,
      speedX: isRain ? -1 - Math.random() : isSnow ? Math.sin(Math.random() * Math.PI) : 0.1,
      opacity: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.beginPath();
        if (isRain) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
          ctx.stroke();
        } else if (isSnow) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Floating dust/sunlight particles
          ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * 0.4})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [conditionCode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
}
