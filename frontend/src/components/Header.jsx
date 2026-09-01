import React from 'react';
import { Layers, Upload, Download, MapPin, CheckCircle2, Shield } from 'lucide-react';

export default function Header({ 
  onOpenIngest, 
  onExport,
  selectedSector,
  onSelectSector 
}) {
  return (
    <header className="h-16 bg-surface border-b border-surface-border flex items-center justify-between px-5 z-30 select-none">
      {/* Left: Emblem & National Platform Brand */}
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-indigo-400 p-0.5 shadow-md shadow-emerald-500/10 flex items-center justify-center">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-outfit text-lg font-bold tracking-tight text-white flex items-center">
              PROJECT <span className="text-emerald-400 ml-1.5 font-extrabold tracking-wider">A.L.I.G.N.</span>
            </h1>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              DoLR • SVAMITVA & NAKSHA
            </span>
          </div>
          <p className="text-[11px] text-slate-400 -mt-0.5">
            Autonomous Land Integration & GeoAI Network for Cadastral Record Harmonization
          </p>
        </div>
      </div>

      {/* Center: Sector Selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center bg-surface-raised/80 hover:bg-surface-raised border border-surface-border rounded-xl px-3.5 py-1.5 shadow-sm transition-all">
          <MapPin className="w-4 h-4 text-indigo-400 mr-2 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-mono font-semibold tracking-wider text-slate-400">Cadastral Sector</span>
            <select 
              value={selectedSector}
              onChange={(e) => onSelectSector(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-3 -ml-0.5"
            >
              <option value="pune_ward14" className="bg-slate-900 text-white">Ward 14, Pune Urban Sector (1,420 Parcels)</option>
              <option value="nagpur_sec3" className="bg-slate-900 text-white">Ward 03, Nagpur Peri-Urban (980 Parcels)</option>
              <option value="thane_sec8" className="bg-slate-900 text-white">Ward 08, Thane Metropolitan (2,150 Parcels)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenIngest}
          className="flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-surface-raised hover:bg-slate-800 border border-surface-border text-slate-200 hover:text-white transition-all shadow-sm active:scale-95"
          title="Drag and Drop GeoTIFF / Shapefiles / Khasra CSV"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span>Ingest Data</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-surface-raised hover:bg-slate-800 border border-surface-border text-slate-200 hover:text-white transition-all shadow-sm active:scale-95"
          title="Export GeoPackage, Shapefile, GeoJSON & Bhu-Aadhaar PDFs"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
