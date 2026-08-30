import React from 'react';
import { Layers, Upload, Download, Sparkles, ShieldCheck, MapPin, Database, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  onOpenIngest, 
  onTriggerHarmonize, 
  isHarmonizing, 
  onExport,
  selectedSector,
  onSelectSector 
}) {
  return (
    <header className="h-16 bg-surface border-b border-surface-border flex items-center justify-between px-5 z-30 select-none">
      {/* Left: Emblem & National Platform Brand */}
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-cyan-600 to-emerald-400 p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-outfit text-lg font-bold tracking-tight text-white flex items-center">
              PROJECT <span className="text-cyan-400 ml-1">A.L.I.G.N.</span>
            </h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-500 border border-brand-500/30 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse mr-1"></span>
              Ministry of Rural Development (DoLR)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 -mt-0.5">
            Autonomous Land Integration & GeoAI Network for Cadastral Record Harmonization
          </p>
        </div>
      </div>

      {/* Center: Sector Selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center bg-surface-raised border border-surface-border rounded-lg px-3 py-1.5 shadow-inner">
          <MapPin className="w-4 h-4 text-cyan-400 mr-2" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-mono font-medium text-slate-400">Selected Cadastral Sector</span>
            <select 
              value={selectedSector}
              onChange={(e) => onSelectSector(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-4"
            >
              <option value="pune_ward14" className="bg-surface text-white">Ward 14, Pune Urban Sector (1,420 Parcels)</option>
              <option value="nagpur_sec3" className="bg-surface text-white">Ward 03, Nagpur Peri-Urban (980 Parcels)</option>
              <option value="thane_sec8" className="bg-surface text-white">Ward 08, Thane Metropolitan (2,150 Parcels)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenIngest}
          className="flex items-center space-x-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-surface-raised hover:bg-slate-800 border border-surface-border text-slate-200 hover:text-white transition-all shadow-sm"
          title="Drag and Drop GeoTIFF / Shapefiles / Khasra CSV"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ingest Data</span>
        </button>

        <button
          onClick={onTriggerHarmonize}
          disabled={isHarmonizing}
          className={`flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-lg ${
            isHarmonizing 
              ? 'bg-cyan-600/50 text-cyan-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isHarmonizing ? 'animate-spin' : ''}`} />
          <span>{isHarmonizing ? 'Running GeoAI Pipeline...' : 'Re-Harmonize (FastSAM)'}</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center space-x-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-surface-raised hover:bg-slate-800 border border-surface-border text-slate-200 hover:text-white transition-all shadow-sm"
          title="Export GeoPackage, Shapefile, GeoJSON & Bhu-Aadhaar PDFs"
        >
          <Download className="w-3.5 h-3.5 text-brand-500" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
