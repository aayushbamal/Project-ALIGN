import React, { useState } from 'react';
import { 
  X, Upload, FileText, CheckCircle2, Cpu, Sparkles, 
  Layers, Database, ArrowRight, ShieldCheck, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function IngestionModal({ 
  isOpen, 
  onClose, 
  onCompleteIngest, 
  sectorInfo, 
  totalParcels = 1420, 
  conflictsCount = 34, 
  kpiMetrics 
}) {
  const [stage, setStage] = useState('upload'); // 'upload', 'processing', 'done'
  const [activeStep, setActiveStep] = useState(0);
  const wardName = sectorInfo?.name || 'Cadastral Sector';
  const executionTimeSec = +((totalParcels * 0.00028) + 0.12).toFixed(3);

  const [uploadedFiles, setUploadedFiles] = useState({
    drone: `${sectorInfo?.district || 'Sector'}_5cm_ORI_Orthomosaic.tif (1.8 GB)`,
    legacy: `Shajra_Cadastral_Vectors_${sectorInfo?.district || 'Revenue'}.shp (14.2 MB)`,
    khasra: `${sectorInfo?.district || 'State'}_RoR_Khasra_Registry_2026.csv (2.4 MB)`,
    elevation: `${sectorInfo?.district || 'Sector'}_LiDAR_DSM_DTM_Pointcloud.las (840 MB)`
  });

  if (!isOpen) return null;

  const pipelineSteps = [
    { title: "1. Deep Keypoint Matching", desc: "SuperPoint + SIFT invariant landmark extraction with TPS elastic homography warping", time: "0.8s" },
    { title: "2. Zero-Shot Physical Segmentation", desc: "SAM-2 boundary segmentation with automated nDSM eave contraction (0.4m)", time: "1.2s" },
    { title: "3. Topological Conflation & Planarization", desc: "Vertex snap-rounding (ε=15cm), sliver elimination (<2.0m²), 0 overlaps enforced", time: "0.6s" },
    { title: "4. Multilingual Semantic Attribute Linkage", desc: "IndicSoundex phonetic tokenization + Levenshtein distance across Devanagari records", time: "0.5s" },
    { title: "5. Bhu-Aadhaar (ULPIN) Minting", desc: `Generating ${totalParcels.toLocaleString()} ISO 19152 compliant 14-char ULPINs & cryptographic QR hashes`, time: "0.4s" }
  ];

  const handleStartProcessing = () => {
    setStage('processing');
    setActiveStep(0);

    // Simulate real-time progress steps
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < pipelineSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setStage('done');
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          return prev;
        }
      });
    }, 700);
  };

  const handleFinish = () => {
    onCompleteIngest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-raised">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-outfit text-sm font-bold text-white">
                Multi-Source Ingestion & GeoAI Conflation Engine
              </h3>
              <p className="text-[11px] text-slate-400">
                Co-register raw drone GeoTIFF, legacy cloth maps, and Khasra registries
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content based on stage */}
        <div className="p-5">
          {stage === 'upload' && (
            <div className="space-y-4">
              {/* File Dropzone Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-dashed border-cyan-500/40 bg-cyan-950/10 rounded-xl p-3.5 flex flex-col items-center justify-center text-center hover:border-cyan-400 transition-colors">
                  <Layers className="w-6 h-6 text-cyan-400 mb-1.5" />
                  <span className="text-xs font-semibold text-white">Drone Orthomosaic (5cm ORI)</span>
                  <span className="text-[10px] text-cyan-300 font-mono mt-1">{uploadedFiles.drone}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">GeoTIFF / Cloud-Optimized COG</span>
                </div>

                <div className="border border-dashed border-blue-500/40 bg-blue-950/10 rounded-xl p-3.5 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors">
                  <FileText className="w-6 h-6 text-blue-400 mb-1.5" />
                  <span className="text-xs font-semibold text-white">Legacy Cadastral Map</span>
                  <span className="text-[10px] text-blue-300 font-mono mt-1">{uploadedFiles.legacy}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">ESRI Shapefile / AutoCAD DXF</span>
                </div>

                <div className="border border-dashed border-emerald-500/40 bg-emerald-950/10 rounded-xl p-3.5 flex flex-col items-center justify-center text-center hover:border-emerald-400 transition-colors">
                  <Database className="w-6 h-6 text-emerald-400 mb-1.5" />
                  <span className="text-xs font-semibold text-white">Khasra Revenue Registry</span>
                  <span className="text-[10px] text-emerald-300 font-mono mt-1">{uploadedFiles.khasra}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Multilingual CSV / XLSX</span>
                </div>

                <div className="border border-dashed border-amber-500/40 bg-amber-950/10 rounded-xl p-3.5 flex flex-col items-center justify-center text-center hover:border-amber-400 transition-colors">
                  <Cpu className="w-6 h-6 text-amber-400 mb-1.5" />
                  <span className="text-xs font-semibold text-white">Elevation Surface Model</span>
                  <span className="text-[10px] text-amber-300 font-mono mt-1">{uploadedFiles.elevation}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">LAS / nDSM Grid</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-border">
                <span className="text-[11px] text-slate-400 font-mono">
                  Target Sector: <b className="text-slate-200">Ward 14, Pune Urban (Haveli)</b>
                </span>
                <button
                  onClick={handleStartProcessing}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Execute GeoAI Harmonization Pipeline</span>
                </button>
              </div>
            </div>
          )}

          {stage === 'processing' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 mb-2 animate-bounce">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <h4 className="font-outfit text-sm font-bold text-white">
                  Executing 5-Stage Autonomous GeoAI Pipeline
                </h4>
                <p className="text-[11px] text-slate-400">
                  Processing {totalParcels.toLocaleString()} cadastral parcels across {wardName}
                </p>
              </div>

              {/* Stepper Progress */}
              <div className="space-y-2.5 bg-surface-raised p-3.5 rounded-xl border border-surface-border">
                {pipelineSteps.map((step, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start space-x-3 p-2 rounded-lg transition-all ${
                        isCurrent ? 'bg-cyan-950/40 border border-cyan-500/40' : 'opacity-70'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-[10px] font-mono">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isCurrent ? 'text-cyan-300' : isDone ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {step.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stage === 'done' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-outfit text-base font-bold text-white">
                  {wardName} Successfully Harmonized!
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  {totalParcels.toLocaleString()} parcels co-registered with millimeter-precision TPS warping. {conflictsCount} encroachment disputes flagged with Section 248 legal notices ready.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-surface-raised rounded-xl border border-surface-border max-w-lg mx-auto text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">Total Parcels</div>
                  <div className="text-sm font-bold text-white">{totalParcels.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Execution Time</div>
                  <div className="text-sm font-bold text-emerald-400">{executionTimeSec} s</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Mean Confidence</div>
                  <div className="text-sm font-bold text-cyan-400">{kpiMetrics?.avgConfidencePct || 94.8}%</div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
              >
                Launch Harmonized Split-Screen Canvas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
