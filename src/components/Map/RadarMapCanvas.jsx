import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Layers, MapPin, Wind, Thermometer, CloudRain, ShieldAlert } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function RadarMapCanvas() {
  const { activeCity } = useApp();
  const [activeLayer, setActiveLayer] = useState('radar'); // 'radar', 'temp', 'wind', 'aqi'
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeStep, setTimeStep] = useState(0);
  const canvasRef = useRef(null);

  // Play animation loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeStep(prev => (prev + 1) % 10);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Render Radar Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear Canvas
    ctx.fillStyle = '#070B14';
    ctx.fillRect(0, 0, width, height);

    // Draw Map Grid / Geography Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Dynamic Radar Layer
    const timeShift = timeStep * 15;
    const centerX = width / 2;
    const centerY = height / 2;

    if (activeLayer === 'radar') {
      // Draw simulated precipitation echo blobs
      const grad = ctx.createRadialGradient(
        centerX + timeShift - 50, centerY - timeShift / 2, 20,
        centerX + timeShift, centerY, 180
      );
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.7)'); // Cyan
      grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.5)'); // Indigo
      grad.addColorStop(0.8, 'rgba(168, 85, 247, 0.3)'); // Purple
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX + timeShift - 30, centerY - 20, 160, 0, Math.PI * 2);
      ctx.fill();

      // Additional cell blob
      const grad2 = ctx.createRadialGradient(
        centerX - 100 + timeShift, centerY + 60, 10,
        centerX - 80 + timeShift, centerY + 60, 100
      );
      grad2.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // Red heavy cell
      grad2.addColorStop(0.6, 'rgba(245, 158, 11, 0.4)'); // Yellow
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(centerX - 90 + timeShift, centerY + 60, 90, 0, Math.PI * 2);
      ctx.fill();
    } else if (activeLayer === 'temp') {
      // Heatmap gradient
      const grad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 300);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.6)');
      grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.2)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (activeLayer === 'wind') {
      // Wind Vector Arrows
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      for (let x = 60; x < width; x += 60) {
        for (let y = 60; y < height; y += 60) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 20, y - 10 + (timeStep % 3));
          ctx.stroke();
        }
      }
    } else if (activeLayer === 'aqi') {
      // AQI cloud density
      const grad = ctx.createRadialGradient(centerX + 40, centerY - 40, 30, centerX + 40, centerY - 40, 220);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
      grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw Radar Sweep Line
    const sweepAngle = (timeStep / 10) * Math.PI * 2;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(sweepAngle) * 350, centerY + Math.sin(sweepAngle) * 350);
    ctx.stroke();

    // Center City Pin
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter';
    ctx.fillText(`${activeCity?.name || 'Selected Station'}`, centerX + 12, centerY + 4);

  }, [activeLayer, timeStep, activeCity]);

  const timeLabels = [
    '-45 min', '-35 min', '-25 min', '-15 min', '-5 min',
    'NOW', '+10 min', '+20 min', '+30 min', '+45 min'
  ];

  return (
    <div className="space-y-4">
      {/* Layer selector & controls header */}
      <GlassCard glow className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" /> Live Atmospheric Doppler
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Doppler Radar & Overlay Telemetry
            </h2>
          </div>

          {/* Layer buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700 flex-wrap">
            <button
              onClick={() => setActiveLayer('radar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeLayer === 'radar' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" /> Radar Reflectivity
            </button>
            <button
              onClick={() => setActiveLayer('temp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeLayer === 'temp' ? 'bg-amber-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" /> Thermal Map
            </button>
            <button
              onClick={() => setActiveLayer('wind')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeLayer === 'wind' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" /> Stream Vectors
            </button>
            <button
              onClick={() => setActiveLayer('aqi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeLayer === 'aqi' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> AQI Particle
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Radar Canvas Container */}
      <GlassCard className="w-full p-0 overflow-hidden relative border border-sky-500/30">
        <canvas
          ref={canvasRef}
          width={800}
          height={420}
          className="w-full h-[420px] object-cover rounded-3xl"
        />

        {/* Legend Overlay */}
        <div className="absolute top-4 right-4 glass-card p-3 rounded-2xl border border-white/10 text-xs space-y-1.5 pointer-events-none">
          <div className="font-bold text-white uppercase text-[10px] tracking-wider">Reflectivity dBZ</div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-sky-400" /> <span className="text-slate-300">Light (15-30)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-indigo-500" /> <span className="text-slate-300">Moderate (30-45)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" /> <span className="text-slate-300">Heavy (45-60+)</span>
          </div>
        </div>

        {/* Timeline Playback Bar */}
        <div className="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-2xl border border-white/10 flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-sky-500 text-white hover:bg-sky-400 shadow-md transition-all shrink-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <div className="flex-1 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            {timeLabels.map((label, idx) => (
              <button
                key={idx}
                onClick={() => setTimeStep(idx)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-telemetry font-bold transition-all ${
                  timeStep === idx ? 'bg-sky-400 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
