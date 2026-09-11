'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Users, Calendar, Sparkles, ChevronRight, CheckCircle2, Navigation, Compass } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { UKRAINE_REGIONS, CITY_TO_REGIONS, UkraineRegion } from '../data/ukraineMapRegions';

interface CityHub {
  id: string;
  name: string;
  region: string;
  projectsCount: number;
  participants: string;
  focus: string;
  x: number; // Percentage on 1000x670 SVG canvas
  y: number; // Percentage on 1000x670 SVG canvas
  labelPos?: 'top' | 'bottom' | 'left' | 'right';
}

const CITIES: CityHub[] = [
  { id: 'kyiv', name: 'Київ', region: 'Столиця', projectsCount: 18, participants: '650+', focus: 'Центральний офіс, координація Erasmus+ та Академія лідерства', x: 49.2, y: 28.1, labelPos: 'bottom' },
  { id: 'lviv', name: 'Львів', region: 'Захід', projectsCount: 12, participants: '380+', focus: 'Міжнародні молодіжні обміни, софт-скіли та фасилітація', x: 17.5, y: 35.8, labelPos: 'left' },
  { id: 'dnipro', name: 'Дніпро', region: 'Схід / Центр', projectsCount: 9, participants: '290+', focus: 'Хаб соціальної інтеграції та психологічна підтримка молоді ВПО', x: 71.5, y: 47.0, labelPos: 'top' },
  { id: 'kharkiv', name: 'Харків', region: 'Схід', projectsCount: 7, participants: '210+', focus: 'Молодіжна стійкість, волонтерські ініціативи та цифрові навички', x: 81.0, y: 31.5, labelPos: 'bottom' },
  { id: 'odesa', name: 'Одеса', region: 'Південь', projectsCount: 6, participants: '190+', focus: 'Соціальне підприємництво та екологічні кампанії', x: 51.0, y: 70.0, labelPos: 'bottom' },
  { id: 'vinnytsia', name: 'Вінниця', region: 'Поділля', projectsCount: 5, participants: '150+', focus: 'Клуб проєктного менеджменту та публічних дебатів', x: 40.5, y: 43.5, labelPos: 'bottom' },
  { id: 'poltava', name: 'Полтава', region: 'Центр', projectsCount: 4, participants: '130+', focus: 'Тренінги з медіаграмотності та критичного мислення', x: 66.5, y: 35.5, labelPos: 'top' },
  { id: 'lutsk', name: 'Луцьк', region: 'Волинь', projectsCount: 4, participants: '120+', focus: 'Волонтерські табори та неформальна освіта старшокласників', x: 21.5, y: 23.0, labelPos: 'top' },
  { id: 'if', name: 'Івано-Франківськ', region: 'Прикарпаття', projectsCount: 5, participants: '160+', focus: 'Гірські лідерські табори та розвиток активних спільнот', x: 18.8, y: 49.0, labelPos: 'top' },
  { id: 'uzhhorod', name: 'Ужгород', region: 'Закарпаття', projectsCount: 6, participants: '180+', focus: 'Транскордонна співпраця з європейськими молодіжними ГО', x: 8.8, y: 51.5, labelPos: 'bottom' },
  { id: 'zaporizhzhia', name: 'Запоріжжя', region: 'Південний схід', projectsCount: 4, participants: '140+', focus: 'Арт-терапія та безпечні простори для молоді', x: 73.0, y: 55.5, labelPos: 'bottom' },
  { id: 'ternopil', name: 'Тернопіль', region: 'Галичина', projectsCount: 3, participants: '110+', focus: 'Студентське лідерство та профорієнтаційні хакатони', x: 24.5, y: 39.5, labelPos: 'right' },
  { id: 'cherkasy', name: 'Черкаси', region: 'Центр', projectsCount: 3, participants: '95+', focus: 'Розвиток молодіжних рад та громадської участі', x: 55.5, y: 38.8, labelPos: 'bottom' },
  { id: 'chernivtsi', name: 'Чернівці', region: 'Буковина', projectsCount: 4, participants: '125+', focus: 'Культурна дипломатія та міжкультурний діалог', x: 25.5, y: 56.0, labelPos: 'bottom' },
];

export default function InteractiveMapSection() {
  const [selectedCity, setSelectedCity] = useState<CityHub>(CITIES[0]);
  const [hoveredRegion, setHoveredRegion] = useState<UkraineRegion | null>(null);
  const { openVolunteer } = useAdmin();

  // Mapping from region id to corresponding city id if any
  const regionToCityMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(CITY_TO_REGIONS).forEach(([cityId, rIds]) => {
      rIds.forEach((rId) => {
        map[rId] = cityId;
      });
    });
    return map;
  }, []);

  // Active region IDs for currently selected city
  const activeRegionIds = useMemo(() => {
    return CITY_TO_REGIONS[selectedCity.id] || [];
  }, [selectedCity.id]);

  const handleRegionClick = (regionId: string) => {
    const targetCityId = regionToCityMap[regionId];
    if (targetCityId) {
      const city = CITIES.find((c) => c.id === targetCityId);
      if (city) {
        setSelectedCity(city);
      }
    }
  };

  return (
    <section id="map" className="py-16 sm:py-24 bg-[#081626] relative overflow-hidden border-t border-white/10">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Всеукраїнська діяльність</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Осередки MAP у 14 містах України
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Ми створюємо локальні точки тяжіння для молоді, об&apos;єднуючи активістів від Ужгорода до Харкова, від Чернігова до Одеси та Криму у єдину мережу спільної дії.
          </p>
        </div>

        {/* Interactive Layout: Map + City Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Authentic SVG Map of Ukraine with regions and city hubs */}
          <div className="lg:col-span-7 bg-[#0e2238] rounded-3xl border border-white/10 p-5 sm:p-7 shadow-2xl relative flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Географічна мапа осередків України
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Натисніть на область або місто
              </span>
            </div>

            {/* Geographic Ukraine Map Canvas */}
            <div
              className="map-canvas-container relative w-full rounded-2xl bg-[#081626]/80 border border-white/10 overflow-hidden flex items-center justify-center p-2 sm:p-3 shadow-inner"
              style={{ aspectRatio: '1000 / 670' }}
            >
              {/* Top-left HUD badge showing active or hovered oblast */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 pointer-events-none">
                <div className="map-hud-badge bg-[#081626]/90 border border-white/15 px-2.5 py-1 rounded-lg backdrop-blur-md shadow-lg flex items-center gap-2">
                  <span className="text-xs">🇺🇦</span>
                  <div className="text-[11px] font-bold text-slate-200">
                    {hoveredRegion ? (
                      <span className="hud-title text-sky-300">{hoveredRegion.nameUa}</span>
                    ) : (
                      <span>{selectedCity.region} • {selectedCity.name}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom-right sovereignty note */}
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 pointer-events-none hidden sm:block">
                <div className="map-hud-badge bg-[#081626]/85 border border-white/10 px-2 py-0.5 rounded-md text-[10px] text-slate-400">
                  24 області • м. Київ • АР Крим
                </div>
              </div>

              {/* SVG Vector Map of Ukraine (Genuine coordinates) */}
              <svg
                viewBox="0 0 1000 670"
                className="w-full h-full select-none"
                aria-label="Інтерактивна векторна карта України"
              >
                <defs>
                  {/* Delicate cartographic background grid */}
                  <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="1" />
                  </pattern>

                  {/* Filter for active city halo glow */}
                  <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Subtle Grid Background */}
                <rect width="1000" height="670" fill="url(#mapGrid)" />

                {/* Delicate Geographic Reference Lines */}
                <line x1="250" y1="50" x2="250" y2="620" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                <line x1="500" y1="50" x2="500" y2="620" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                <line x1="750" y1="50" x2="750" y2="620" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                <line x1="50" y1="220" x2="950" y2="220" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                <line x1="50" y1="440" x2="950" y2="440" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />

                {/* 26 Administrative Regions of Ukraine (All Oblasts, Kyiv City, Crimea) */}
                <g id="ukraine-regions">
                  {UKRAINE_REGIONS.map((region) => {
                    const isHighlighted = activeRegionIds.includes(region.id);
                    const isHovered = hoveredRegion?.id === region.id;
                    const hasCityHub = Boolean(regionToCityMap[region.id]);

                    return (
                      <path
                        key={region.id}
                        id={region.id}
                        d={region.d}
                        aria-label={region.nameUa}
                        onClick={() => handleRegionClick(region.id)}
                        onMouseEnter={() => setHoveredRegion(region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        className={`map-region transition-all duration-250 ${
                          hasCityHub ? 'cursor-pointer' : 'cursor-default'
                        } ${isHighlighted ? 'map-region-active' : ''} ${isHovered && !isHighlighted ? 'map-region-hover' : ''}`}
                      >
                        <title>{region.nameUa}{hasCityHub ? ' — Осередок MAP' : ''}</title>
                      </path>
                    );
                  })}
                </g>
              </svg>

              {/* Interactive City Nodes (Pin markers positioned on the true map) */}
              {CITIES.map((city) => {
                const isSelected = selectedCity.id === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city)}
                    style={{ left: `${city.x}%`, top: `${city.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 p-1.5 focus:outline-none"
                    title={`${city.name} — ${city.projectsCount} проєктів`}
                    aria-label={`Осередок у м. ${city.name}`}
                  >
                    <span className="relative flex items-center justify-center">
                      {isSelected && (
                        <span className="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-ping" />
                      )}
                      
                      {/* Pulse outer ring */}
                      <span
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                          isSelected
                            ? 'bg-amber-400 border-white scale-125 shadow-lg shadow-amber-400/70'
                            : 'bg-sky-400 border-[#081626] group-hover:scale-125 group-hover:bg-amber-300 shadow-md'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </span>
                    </span>

                    {/* City Name Label */}
                    {(() => {
                      let posClass = 'top-full left-1/2 -translate-x-1/2 mt-1';
                      if (city.labelPos === 'top') posClass = 'bottom-full left-1/2 -translate-x-1/2 mb-1.5';
                      if (city.labelPos === 'left') posClass = 'right-full top-1/2 -translate-y-1/2 mr-1.5';
                      if (city.labelPos === 'right') posClass = 'left-full top-1/2 -translate-y-1/2 ml-1.5';

                      return (
                        <span
                          className={`absolute ${posClass} map-city-label ${
                            isSelected ? 'selected' : ''
                          } text-[10px] sm:text-[11px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded-md transition-all shadow-md ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 font-black scale-105 z-30 ring-2 ring-amber-500/50'
                              : 'bg-[#081626]/90 text-slate-200 group-hover:text-white border border-white/15 backdrop-blur-xs group-hover:scale-105'
                          }`}
                        >
                          {city.name}
                        </span>
                      );
                    })()}
                  </button>
                );
              })}
            </div>

            {/* Quick city pills */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Швидкий вибір міста:
                </span>
                <span className="text-[11px] text-sky-400">
                  14 активних осередків
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {CITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCity(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedCity.id === c.id
                        ? 'bg-[#3b7da5] text-white shadow-xs scale-105'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Selected City Detail Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0e2238] to-[#122c4a] rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <MapPin className="w-4 h-4" />
                  <span>Осередок MAP • {selectedCity.region}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  Активний хаб
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white">
                  м. {selectedCity.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCity.focus}
                </p>
              </div>

              {/* Impact counters for city */}
              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="bg-[#081626]/80 p-4 rounded-2xl border border-white/10 space-y-1 shadow-inner">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Проєктів проведено</span>
                  </div>
                  <div className="text-2xl font-black text-white">
                    {selectedCity.projectsCount}+
                  </div>
                </div>

                <div className="bg-[#081626]/80 p-4 rounded-2xl border border-white/10 space-y-1 shadow-inner">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Учасників молоді</span>
                  </div>
                  <div className="text-2xl font-black text-white">
                    {selectedCity.participants}
                  </div>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Регулярні офлайн-зустрічі та розмовні клуби</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Можливість подачі на гранти та програми Erasmus+</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Локальна менторська підтримка для нових ініціатив</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={openVolunteer}
                className="w-full flex items-center justify-center gap-2 bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer text-sm group hover:shadow-sky-500/25"
              >
                <span>Долучитися до осередку в м. {selectedCity.name}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
