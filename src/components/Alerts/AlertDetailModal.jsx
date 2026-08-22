import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, ShieldAlert, Clock, Info, CheckCircle2 } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function AlertDetailModal() {
  const { activeAlertModal, closeAlertModal } = useApp();

  if (!activeAlertModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05070A]/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-red-500/50 glow-cyan relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-500/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                OFFICIAL METEOROLOGICAL WARNING
              </span>
              <h3 className="text-xl font-extrabold text-white">{activeAlertModal.title}</h3>
            </div>
          </div>

          <button
            onClick={closeAlertModal}
            className="p-2 rounded-xl glass-card text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-200">
            <span className="font-bold">Severity: {activeAlertModal.severity || 'HIGH'}</span>
            <span className="font-mono-telemetry text-xs">Issued: {activeAlertModal.issued || '10 mins ago'}</span>
          </div>

          <div>
            <h4 className="font-bold text-white mb-1">Description</h4>
            <p className="text-slate-300 leading-relaxed">
              {activeAlertModal.description}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-1">Recommended Safety Actions</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Avoid non-essential outdoor travel during peak reflectivity hours.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Secure outdoor items & monitor real-time Doppler radar stream.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={closeAlertModal}
            className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs shadow-md"
          >
            Acknowledge Bulletin
          </button>
        </div>
      </div>
    </div>
  );
}
