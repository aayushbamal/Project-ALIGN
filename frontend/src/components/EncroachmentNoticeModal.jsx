import React, { useState } from 'react';
import { X, Download, AlertTriangle, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { generateEncroachmentNoticePDF } from '../utils/pdf-generator';

export default function EncroachmentNoticeModal({ isOpen, onClose, conflict }) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !conflict) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateEncroachmentNoticePDF(conflict);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-surface border border-rose-500/40 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-rose-500/30 flex items-center justify-between bg-rose-950/40">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="font-outfit text-sm font-bold text-white">
              Official Municipal Encroachment Notice (Section 248 MLRC)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-rose-900/50 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Preview Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1.5 font-mono text-[11px]">
            <div className="text-rose-400 font-bold">NOTICE REF: PMC/REV/ENC/2026/{conflict.id || '001'}</div>
            <div className="text-slate-300">TO: <b className="text-white">{conflict.owner_name} ({conflict.owner_vernacular})</b></div>
            <div className="text-slate-400">ULPIN: {conflict.ulpin} | Khasra: {conflict.khasra_no}</div>
            <div className="text-slate-400">Location: Ward 14, Pune Urban Sector (Haveli Taluk)</div>
          </div>

          <div className="space-y-2 text-slate-300 leading-relaxed bg-surface-raised p-4 rounded-xl border border-surface-border">
            <div className="text-xs font-bold text-white">STATUTORY VIOLATION SUMMARY:</div>
            <p>
              Autonomous GeoAI drone surveillance (5cm GSD) and topological conflation have detected an unauthorized physical structure encroaching beyond legally registered boundaries:
            </p>
            <div className="p-2.5 rounded bg-rose-950/50 border border-rose-500/40 font-mono text-[11px] text-rose-300 space-y-1">
              <div>• Violation: <b>{conflict.discrepancy_type}</b></div>
              <div>• Measured Encroachment Area: <b>{conflict.variance_sqm || `+${conflict.encroached_area_sqm} sq.m`}</b></div>
              <div>• Centroid: <b>{conflict.centroid?.[1]?.toFixed(6)}° N, {conflict.centroid?.[0]?.toFixed(6)}° E</b></div>
              <div>• AI Confidence: <b>{conflict.confidence}</b></div>
            </div>
            <p className="text-[11px] text-slate-400">
              You are required to show cause within 15 days or remove the structure, failing which summary municipal demolition will be executed.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-raised hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating Notice...' : 'Export Official PDF Notice'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
