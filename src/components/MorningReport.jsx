import React from 'react';
import { Sun, X } from 'lucide-react';

/* -------------------------------------------------------------------------
   COMPONENT: MorningReport
   Displays the daily summary of what the 'idiot' adventurer did overnight.
   ------------------------------------------------------------------------- */

const MorningReport = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/40 to-slate-900 p-6 border-b border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-full text-amber-400 border border-amber-500/30">
                <Sun size={28} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white tracking-wide">Day {log.day}</h2>
                <div className="text-xs text-amber-200/60 font-mono uppercase tracking-widest">Morning Report</div>
            </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            
            {/* The Quote / Incident */}
            <div className="relative">
                <div className="absolute -left-2 -top-2 text-4xl text-slate-700 font-serif">“</div>
                <p className="text-lg text-slate-200 italic font-serif leading-relaxed px-4">
                    {log.incidentText}
                </p>
                <div className="absolute -right-2 -bottom-4 text-4xl text-slate-700 font-serif">”</div>
            </div>

            <div className="h-px bg-slate-800 w-full" />

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Last Night's Sleep</span>
                    <span className="text-sm text-slate-300 font-medium flex items-center gap-2">
                        {log.sleepLoc}
                    </span>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Expenses</span>
                    <span className="text-sm text-amber-400 font-medium">
                        {log.rent.includes('Paid') ? log.rent.split(':')[1] : '0g'}
                    </span>
                </div>
            </div>

            {/* Status Summary */}
            <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20 text-center">
                <span className="text-[10px] text-indigo-300 font-bold uppercase block mb-1">Current Mood</span>
                <span className="text-xs text-indigo-200">{log.status}</span>
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
                Start Day
            </button>
        </div>

      </div>
    </div>
  );
};

export default MorningReport;
