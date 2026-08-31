import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Compass, Activity } from 'lucide-react';

export default function MetricRibbon({ metrics, isHarmonizing }) {
  return (
    <div className="bg-surface/80 border-b border-surface-border px-5 py-2.5 flex items-center justify-between gap-4 overflow-x-auto select-none">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-7xl mx-auto">
        {/* KPI 1: Total Parcels */}
        <div className="gis-glass-card rounded-lg p-2.5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Parcels</div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold font-mono text-white">
                {metrics?.totalParcels?.toLocaleString() || '1,420'}
              </span>
              <span className="text-[10px] font-medium text-emerald-400 font-mono">100% Indexed</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Harmonization Rate */}
        <div className="gis-glass-card rounded-lg p-2.5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Harmonization Rate</div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold font-mono text-emerald-400">
                {metrics?.harmonizationRatePct || 96.4}%
              </span>
              <span className="text-[10px] font-medium text-slate-400 font-mono">Planar Clean</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Active Encroachments */}
        <div className="gis-glass-card rounded-lg p-2.5 flex items-center space-x-3 border-rose-500/30 bg-rose-950/20">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-rose-300">Active Conflicts</div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold font-mono text-rose-400">
                {metrics?.activeEncroachments ?? 0}
              </span>
              <span className="text-[10px] font-medium text-rose-300 font-mono">Drainage / RoW</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Avg AI Confidence */}
        <div className="gis-glass-card rounded-lg p-2.5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Mean AI Confidence</div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold font-mono text-cyan-400">
                {metrics?.avgConfidencePct || 94.8}%
              </span>
              <span className="text-[10px] font-medium text-cyan-300/70 font-mono">SAM-2 + Soundex</span>
            </div>
          </div>
        </div>

        {/* KPI 5: TPS Warping Precision */}
        <div className="gis-glass-card rounded-lg p-2.5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">TPS Warp Precision</div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold font-mono text-amber-400">
                {metrics?.tpsWarpRmseCm || 4.2} cm
              </span>
              <span className="text-[10px] font-medium text-slate-400 font-mono">64 Tie-Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
