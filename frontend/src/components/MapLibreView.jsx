import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Plus, Minus, RotateCcw, Box, Map as MapIcon, 
  Satellite, Layers, Sliders, Eye, EyeOff, ShieldCheck, 
  AlertTriangle, Compass, CheckCircle2, Sun, Moon
} from 'lucide-react';
import { 
  PUNE_CENTER, 
  DEFAULT_ZOOM, 
  getHarmonizedGeoJSON, 
  getLegacyGeoJSON, 
  municipalInfrastructureGeoJSON 
} from '../data/puneGeoJsonFixtures';

// Basemap Tile Sources
const BASEMAPS = {
  satellite: {
    name: 'Esri Satellite',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    maxzoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  streets: {
    name: 'Carto Positron (Light)',
    tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
    maxzoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  dark: {
    name: 'Carto Dark Matter',
    tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
    maxzoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

export default function MapLibreView({
  parcelsList,
  selectedParcel,
  onSelectParcel,
  layerVisibility,
  layerOpacity,
  viewMode,
  onChangeViewMode,
  theme = 'dark'
}) {
  const containerRef = useRef(null);
  const leftMapContainerRef = useRef(null);
  const rightMapContainerRef = useRef(null);

  const leftMapRef = useRef(null);
  const rightMapRef = useRef(null);

  // Split-Screen Swipe position (0% - 100%)
  const [swipePos, setSwipePos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Selected Basemap: 'satellite' | 'streets' | 'dark'
  const [activeBasemap, setActiveBasemap] = useState('satellite');

  // Hovered parcel state for popup
  const [hoveredInfo, setHoveredInfo] = useState(null);

  // GeoJSON data
  const harmonizedData = getHarmonizedGeoJSON();
  const legacyData = getLegacyGeoJSON();

  // Create MapLibre style object for selected basemap
  const createMapStyle = useCallback((basemapKey) => {
    const basemap = BASEMAPS[basemapKey] || BASEMAPS.satellite;
    return {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: basemap.tiles,
          tileSize: 256,
          maxzoom: basemap.maxzoom,
          attribution: basemap.attribution
        }
      },
      layers: [
        {
          id: 'raster-layer',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    };
  }, []);

  // Initialize Dual Synchronized MapLibre Instances
  useEffect(() => {
    if (!leftMapContainerRef.current || !rightMapContainerRef.current) return;

    // 1. Initialize Left Map (Legacy Distorted Layer)
    const leftMap = new Map({
      container: leftMapContainerRef.current,
      style: createMapStyle(activeBasemap),
      center: PUNE_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: viewMode === '3d' ? 50 : 0,
      bearing: viewMode === '3d' ? -15 : 0,
      attributionControl: false
    });

    // 2. Initialize Right Map (AI Harmonized Layer)
    const rightMap = new Map({
      container: rightMapContainerRef.current,
      style: createMapStyle(activeBasemap),
      center: PUNE_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: viewMode === '3d' ? 50 : 0,
      bearing: viewMode === '3d' ? -15 : 0,
      attributionControl: false
    });

    leftMapRef.current = leftMap;
    rightMapRef.current = rightMap;

    // Dual Map Camera Synchronization
    let isSyncing = false;
    const syncMaps = (sourceMap, targetMap) => {
      if (isSyncing) return;
      isSyncing = true;
      targetMap.jumpTo({
        center: sourceMap.getCenter(),
        zoom: sourceMap.getZoom(),
        bearing: sourceMap.getBearing(),
        pitch: sourceMap.getPitch()
      });
      isSyncing = false;
    };

    leftMap.on('move', () => syncMaps(leftMap, rightMap));
    rightMap.on('move', () => syncMaps(rightMap, leftMap));

    // Setup Layers on Load for Left Map (Legacy Shajra)
    leftMap.on('load', () => {
      // Add Legacy GeoJSON Source
      leftMap.addSource('legacy-parcels', {
        type: 'geojson',
        data: legacyData
      });

      // Legacy Fill (Distorted Blue)
      leftMap.addLayer({
        id: 'legacy-fill',
        type: 'fill',
        source: 'legacy-parcels',
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.22
        }
      });

      // Legacy Outline (Dashed Blue Line)
      leftMap.addLayer({
        id: 'legacy-line',
        type: 'line',
        source: 'legacy-parcels',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2.0,
          'line-dasharray': [3, 2]
        }
      });

      // Add Municipal Infrastructure
      leftMap.addSource('infrastructure', {
        type: 'geojson',
        data: municipalInfrastructureGeoJSON
      });

      leftMap.addLayer({
        id: 'infra-drainage',
        type: 'line',
        source: 'infrastructure',
        paint: {
          'line-color': '#06b6d4',
          'line-width': 4.0,
          'line-dasharray': [4, 2]
        }
      });
    });

    // Setup Layers on Load for Right Map (AI Harmonized SAM-2)
    rightMap.on('load', () => {
      // Add Harmonized GeoJSON Source
      rightMap.addSource('harmonized-parcels', {
        type: 'geojson',
        data: harmonizedData
      });

      // 1. 2D / 3D Extrusion or Fill
      rightMap.addLayer({
        id: 'harmonized-fill',
        type: 'fill',
        source: 'harmonized-parcels',
        paint: {
          'fill-color': [
            'match',
            ['get', 'status'],
            'Encroachment', '#f43f5e',
            'Review', '#f59e0b',
            'Approved', '#10b981',
            '#10b981'
          ],
          'fill-opacity': [
            'match',
            ['get', 'status'],
            'Encroachment', 0.55,
            'Review', 0.40,
            0.32
          ]
        }
      });

      // 2. Crisp Wall Boundaries (Solid Snapped Green / Red Outline)
      rightMap.addLayer({
        id: 'harmonized-line',
        type: 'line',
        source: 'harmonized-parcels',
        paint: {
          'line-color': [
            'match',
            ['get', 'status'],
            'Encroachment', '#f43f5e',
            'Review', '#f59e0b',
            'Approved', '#10b981',
            '#10b981'
          ],
          'line-width': [
            'match',
            ['get', 'status'],
            'Encroachment', 3.2,
            2.2
          ]
        }
      });

      // 3. 3D Digital Twin Building Extrusions (Active when 3D enabled)
      rightMap.addLayer({
        id: 'harmonized-3d-extrusion',
        type: 'fill-extrusion',
        source: 'harmonized-parcels',
        layout: {
          visibility: viewMode === '3d' ? 'visible' : 'none'
        },
        paint: {
          'fill-extrusion-color': [
            'match',
            ['get', 'status'],
            'Encroachment', '#e11d48',
            'Review', '#d97706',
            'Approved', '#059669',
            '#059669'
          ],
          'fill-extrusion-height': ['get', 'ndsm_height_m'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.75
        }
      });

      // 4. Centroid Labels
      rightMap.addLayer({
        id: 'harmonized-labels',
        type: 'symbol',
        source: 'harmonized-parcels',
        layout: {
          'text-field': ['get', 'khasra_no'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 11,
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1.5
        }
      });

      // 5. Municipal Infrastructure (Drainage & Roads)
      rightMap.addSource('infrastructure-right', {
        type: 'geojson',
        data: municipalInfrastructureGeoJSON
      });

      rightMap.addLayer({
        id: 'infra-drainage-right',
        type: 'line',
        source: 'infrastructure-right',
        paint: {
          'line-color': '#06b6d4',
          'line-width': 4.0,
          'line-dasharray': [4, 2]
        }
      });

      rightMap.addLayer({
        id: 'infra-road-right',
        type: 'line',
        source: 'infrastructure-right',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 8.0,
          'line-opacity': 0.5
        }
      });

      // Parcel Click Handler
      rightMap.on('click', 'harmonized-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const props = e.features[0].properties;
          onSelectParcel(props);
        }
      });

      // Cursor & Hover Tooltip
      rightMap.on('mousemove', 'harmonized-fill', (e) => {
        rightMap.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features.length > 0) {
          setHoveredInfo({
            props: e.features[0].properties,
            x: e.point.x,
            y: e.point.y
          });
        }
      });

      rightMap.on('mouseleave', 'harmonized-fill', () => {
        rightMap.getCanvas().style.cursor = '';
        setHoveredInfo(null);
      });
    });

    return () => {
      leftMap.remove();
      rightMap.remove();
    };
  }, [createMapStyle]);

  // Update Basemap Style dynamically
  const handleChangeBasemap = (key) => {
    setActiveBasemap(key);
    const newStyle = createMapStyle(key);
    if (leftMapRef.current) leftMapRef.current.setStyle(newStyle);
    if (rightMapRef.current) rightMapRef.current.setStyle(newStyle);
  };

  // Toggle 3D Digital Twin Pitch and 3D Extrusion
  useEffect(() => {
    const pitch = viewMode === '3d' ? 55 : 0;
    const bearing = viewMode === '3d' ? -20 : 0;

    if (leftMapRef.current) {
      leftMapRef.current.easeTo({ pitch, bearing, duration: 800 });
    }
    if (rightMapRef.current) {
      rightMapRef.current.easeTo({ pitch, bearing, duration: 800 });
      if (rightMapRef.current.getLayer('harmonized-3d-extrusion')) {
        rightMapRef.current.setLayoutProperty(
          'harmonized-3d-extrusion',
          'visibility',
          viewMode === '3d' ? 'visible' : 'none'
        );
      }
    }
  }, [viewMode]);

  // Smooth Split-Screen Slider Dragging
  const handleSliderMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingSlider(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const newPos = Math.max(0, Math.min(100, (clientX / rect.width) * 100));
    setSwipePos(newPos);
  };

  const handleMouseUp = () => {
    setIsDraggingSlider(false);
  };

  // Zoom and View Controls
  const handleZoom = (delta) => {
    if (rightMapRef.current) {
      rightMapRef.current.zoomTo(rightMapRef.current.getZoom() + delta, { duration: 300 });
    }
  };

  const handleResetView = () => {
    if (rightMapRef.current) {
      rightMapRef.current.flyTo({
        center: PUNE_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: viewMode === '3d' ? 50 : 0,
        bearing: viewMode === '3d' ? -15 : 0,
        duration: 800
      });
      setSwipePos(50);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative flex-1 h-full w-full overflow-hidden select-none bg-slate-950 font-sans"
    >
      {/* 1. Left Map Viewport (Legacy Distorted Cadastre) */}
      <div
        ref={leftMapContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          clipPath: `polygon(0 0, ${swipePos}% 0, ${swipePos}% 100%, 0 100%)`
        }}
        className="h-full z-0 pointer-events-none"
      />

      {/* 2. Right Map Viewport (AI-Harmonized Snapped Boundaries) */}
      <div
        ref={rightMapContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          clipPath: `polygon(${swipePos}% 0, 100% 0, 100% 100%, ${swipePos}% 100%)`
        }}
        className="h-full z-10"
      />

      {/* 3. Draggable Split-Screen Slider Handle */}
      <div
        style={{ left: `${swipePos}%` }}
        onMouseDown={handleSliderMouseDown}
        className="absolute top-0 bottom-0 w-10 -ml-5 z-30 flex items-center justify-center cursor-ew-resize group"
      >
        {/* Glow Line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-emerald-400 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>

        {/* Center Circular Handle */}
        <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-2 border-cyan-400 shadow-xl shadow-cyan-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Sliders className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
        </div>
      </div>

      {/* 4. Floating Header Pill: Live KPIs (Top Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-xl flex items-center space-x-3 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
          <div className="flex items-center space-x-1.5">
            <span className="text-cyan-500 font-bold">📍 Ward 14, Pune</span>
            <span className="text-slate-400">|</span>
            <span>1,420 Parcels</span>
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>96.4% Harmonized</span>
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <div className="flex items-center space-x-1 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            <span>28 Encroachments Flagged</span>
          </div>
        </div>
      </div>

      {/* Floating Split Mode Badges */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="bg-blue-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-400/40 text-blue-200 font-mono text-xs font-bold shadow-lg flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>LEGACY DISTORTED (Shajra)</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-400/40 text-emerald-200 font-mono text-xs font-bold shadow-lg flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AI HARMONIZED (SAM-2 + nDSM)</span>
        </div>
      </div>

      {/* 5. Floating Controls: Basemap & 3D Extrusion (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center space-x-2">
        {/* Basemap Switcher */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center space-x-1">
          <button
            onClick={() => handleChangeBasemap('satellite')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeBasemap === 'satellite'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Esri Satellite</span>
          </button>

          <button
            onClick={() => handleChangeBasemap('streets')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeBasemap === 'streets'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Carto Positron</span>
          </button>

          <button
            onClick={() => handleChangeBasemap('dark')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeBasemap === 'dark'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark Matter</span>
          </button>
        </div>

        {/* 2D / 3D Digital Twin Extrusion Toggle */}
        <button
          onClick={() => onChangeViewMode(viewMode === '2d' ? '3d' : '2d')}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xl border backdrop-blur-md transition-all ${
            viewMode === '3d'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
          }`}
        >
          <Box className="w-4 h-4 text-cyan-400" />
          <span>{viewMode === '3d' ? '3D Digital Twin (Active)' : 'Enable 3D Extrusion'}</span>
        </button>
      </div>

      {/* 6. Map Zoom & Reset Navigation Toolbar (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col space-y-1.5">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col space-y-1">
          <button
            onClick={() => handleZoom(0.5)}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.5)}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-0.5"></div>
          <button
            onClick={handleResetView}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            title="Reset Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hover Tooltip on Parcel */}
      {hoveredInfo && !isDraggingSlider && (
        <div
          style={{
            left: `${hoveredInfo.x + 15}px`,
            top: `${hoveredInfo.y + 15}px`
          }}
          className="absolute z-40 pointer-events-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl text-xs min-w-[200px] animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-800">
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {hoveredInfo.props.khasra_no}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                hoveredInfo.props.status === 'Encroachment'
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  : hoveredInfo.props.status === 'Review'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {hoveredInfo.props.status_chip || hoveredInfo.props.status}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="font-medium text-slate-800 dark:text-slate-200">
              {hoveredInfo.props.owner_en}
            </div>
            <div className="text-slate-500 font-mono text-[10px]">
              {hoveredInfo.props.ulpin}
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[10px] pt-1 border-t border-slate-200 dark:border-slate-800/50">
              <span>Surveyed: <b>{hoveredInfo.props.surveyed_area_sqm} m²</b></span>
              <span>AI Conf: <b className="text-cyan-500">{hoveredInfo.props.confidence_score}%</b></span>
            </div>
            {hoveredInfo.props.is_encroaching && (
              <div className="mt-1.5 p-1 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-[10px] text-rose-600 dark:text-rose-300 font-medium">
                ⚠️ {hoveredInfo.props.encroachment_type} (+{hoveredInfo.props.encroached_area_sqm} m²)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
