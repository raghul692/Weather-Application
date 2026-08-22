import React from 'react';

export default function GlassCard({ children, className = '', glow = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 relative overflow-hidden ${glow ? 'glow-cyan border-sky-500/30' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
