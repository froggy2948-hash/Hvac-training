import React from 'react';
import { CycleReadings, RefrigerantType } from '../types';

interface ManifoldGaugesProps {
  readings: CycleReadings;
  refrigerant: RefrigerantType;
  meteringDevice: string;
}

export const ManifoldGauges: React.FC<ManifoldGaugesProps> = ({
  readings,
  refrigerant,
  meteringDevice,
}) => {
  // Low side angle calculation: 0 to 300 psig mapped to -130° to +130°
  const maxLowPress = refrigerant === 'R-410A' || refrigerant === 'R-454B' ? 300 : 200;
  const lowAngle = Math.min(130, Math.max(-130, (readings.suctionPressure / maxLowPress) * 260 - 130));

  // High side angle calculation: 0 to 600 psig mapped to -130° to +130°
  const maxHighPress = refrigerant === 'R-410A' || refrigerant === 'R-454B' ? 600 : 400;
  const highAngle = Math.min(130, Math.max(-130, (readings.headPressure / maxHighPress) * 260 - 130));

  const superheatDelta = readings.superheat - readings.targetSuperheat;
  const subcoolingDelta = readings.subcooling - readings.targetSubcooling;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Digital Manifold Analyzer</span>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Dual Pressure-Temperature Analyzer
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
              {refrigerant}
            </span>
          </h3>
        </div>
        <div className="text-right text-xs font-mono text-slate-400">
          Metering: <span className="text-slate-200 font-semibold">{meteringDevice}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ================= LOW SIDE GAUGE (BLUE) ================= */}
        <div className="bg-slate-950/70 border border-blue-900/40 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
              Low Side (Suction / Vapor)
            </span>
            <span className="text-xs font-mono text-slate-400">0 - {maxLowPress} psig</span>
          </div>

          {/* Low Side Analog + Digital Gauge Display */}
          <div className="flex items-center justify-center my-1 relative">
            <svg className="w-36 h-36" viewBox="0 0 100 100">
              {/* Dial Background */}
              <circle cx="50" cy="50" r="44" fill="#0f172a" stroke="#1e3a8a" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="41" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 3" />
              
              {/* Dial Ticks */}
              {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((deg) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = 50 + 34 * Math.cos(rad);
                const y1 = 50 + 34 * Math.sin(rad);
                const x2 = 50 + 40 * Math.cos(rad);
                const y2 = 50 + 40 * Math.sin(rad);
                return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="1.2" />;
              })}

              {/* Needle */}
              <g transform={`rotate(${lowAngle} 50 50)`} className="transition-transform duration-300">
                <line x1="50" y1="50" x2="50" y2="15" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="50" r="4" fill="#60a5fa" />
              </g>

              {/* Digital Center Readout */}
              <rect x="26" y="58" width="48" height="18" rx="3" fill="#020617" stroke="#1e40af" strokeWidth="1" />
              <text x="50" y="70" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold" fontFamily="monospace">
                {readings.suctionPressure.toFixed(1)}
              </text>
              <text x="50" y="75" textAnchor="middle" fill="#94a3b8" fontSize="4.5" fontFamily="sans-serif">
                psig
              </text>
            </svg>
          </div>

          {/* Digital Telemetry Table */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-2 pt-2 border-t border-slate-800">
            <div className="bg-slate-900/80 p-1.5 rounded">
              <span className="text-slate-400 block text-[10px]">Evap Sat Temp (SST)</span>
              <span className="text-blue-300 font-bold text-sm">{readings.evapSatTemp.toFixed(1)}°F</span>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded">
              <span className="text-slate-400 block text-[10px]">Suction Line Temp</span>
              <span className="text-slate-200 font-bold text-sm">{readings.suctionLineTemp.toFixed(1)}°F</span>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded col-span-2 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">Actual Superheat (SH)</span>
                <span className="text-sky-300 font-bold text-sm">{readings.superheat.toFixed(1)}°F</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Target Superheat</span>
                <span className="text-slate-300 text-sm font-semibold">{readings.targetSuperheat.toFixed(1)}°F</span>
              </div>
            </div>
          </div>

          {/* Superheat Health Assessment */}
          <div className="mt-2 text-[11px] font-sans flex items-center justify-between text-slate-300 bg-slate-900 px-2 py-1 rounded">
            <span>SH Status:</span>
            <span className={`font-semibold ${
              Math.abs(superheatDelta) <= 3
                ? 'text-emerald-400'
                : superheatDelta > 3
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}>
              {Math.abs(superheatDelta) <= 3
                ? 'Nominal Range'
                : superheatDelta > 3
                ? `High (+${superheatDelta.toFixed(1)}°F starved)`
                : `Low (${superheatDelta.toFixed(1)}°F floodback)`}
            </span>
          </div>
        </div>

        {/* ================= HIGH SIDE GAUGE (RED) ================= */}
        <div className="bg-slate-950/70 border border-rose-900/40 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              High Side (Discharge / Liquid)
            </span>
            <span className="text-xs font-mono text-slate-400">0 - {maxHighPress} psig</span>
          </div>

          {/* High Side Analog + Digital Gauge Display */}
          <div className="flex items-center justify-center my-1 relative">
            <svg className="w-36 h-36" viewBox="0 0 100 100">
              {/* Dial Background */}
              <circle cx="50" cy="50" r="44" fill="#0f172a" stroke="#881337" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="41" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 3" />

              {/* Dial Ticks */}
              {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((deg) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = 50 + 34 * Math.cos(rad);
                const y1 = 50 + 34 * Math.sin(rad);
                const x2 = 50 + 40 * Math.cos(rad);
                const y2 = 50 + 40 * Math.sin(rad);
                return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fb7185" strokeWidth="1.2" />;
              })}

              {/* Needle */}
              <g transform={`rotate(${highAngle} 50 50)`} className="transition-transform duration-300">
                <line x1="50" y1="50" x2="50" y2="15" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="50" r="4" fill="#f43f5e" />
              </g>

              {/* Digital Center Readout */}
              <rect x="26" y="58" width="48" height="18" rx="3" fill="#020617" stroke="#9f1239" strokeWidth="1" />
              <text x="50" y="70" textAnchor="middle" fill="#fb7185" fontSize="9" fontWeight="bold" fontFamily="monospace">
                {readings.headPressure.toFixed(1)}
              </text>
              <text x="50" y="75" textAnchor="middle" fill="#94a3b8" fontSize="4.5" fontFamily="sans-serif">
                psig
              </text>
            </svg>
          </div>

          {/* Digital Telemetry Table */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-2 pt-2 border-t border-slate-800">
            <div className="bg-slate-900/80 p-1.5 rounded">
              <span className="text-slate-400 block text-[10px]">Cond Sat Temp (CST)</span>
              <span className="text-rose-300 font-bold text-sm">{readings.condSatTemp.toFixed(1)}°F</span>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded">
              <span className="text-slate-400 block text-[10px]">Liquid Line Temp</span>
              <span className="text-slate-200 font-bold text-sm">{readings.liquidLineTemp.toFixed(1)}°F</span>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded col-span-2 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">Actual Subcooling (SC)</span>
                <span className="text-amber-300 font-bold text-sm">{readings.subcooling.toFixed(1)}°F</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Target Subcooling</span>
                <span className="text-slate-300 text-sm font-semibold">{readings.targetSubcooling.toFixed(1)}°F</span>
              </div>
            </div>
          </div>

          {/* Subcooling Health Assessment */}
          <div className="mt-2 text-[11px] font-sans flex items-center justify-between text-slate-300 bg-slate-900 px-2 py-1 rounded">
            <span>SC Status:</span>
            <span className={`font-semibold ${
              Math.abs(subcoolingDelta) <= 3
                ? 'text-emerald-400'
                : subcoolingDelta > 3
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}>
              {Math.abs(subcoolingDelta) <= 3
                ? 'Nominal Range'
                : subcoolingDelta > 3
                ? `High (+${subcoolingDelta.toFixed(1)}°F stacked)`
                : `Low (${subcoolingDelta.toFixed(1)}°F depleted)`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
