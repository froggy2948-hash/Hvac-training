import React from 'react';
import { CycleReadings, RefrigerantType, MeteringDeviceType, SystemCategory } from '../types';

interface SchematicProps {
  readings: CycleReadings;
  refrigerant: RefrigerantType;
  meteringDevice: MeteringDeviceType;
  systemCategory?: SystemCategory;
  operationMode?: 'cooling' | 'heating' | 'defrost';
  selectedProbe: string | null;
  onSelectProbe: (probeId: string) => void;
  showProbes: boolean;
}

export const RefrigerationSchematic: React.FC<SchematicProps> = ({
  readings,
  refrigerant,
  meteringDevice,
  systemCategory = 'split_ac',
  operationMode = 'cooling',
  selectedProbe,
  onSelectProbe,
}) => {
  const isRunning = readings.compressorRunning;
  const isHeating = systemCategory === 'heat_pump' && operationMode === 'heating';

  // Category title labels
  const categoryTitle =
    systemCategory === 'heat_pump'
      ? `Air-Source Heat Pump [${isHeating ? 'HEATING MODE' : 'COOLING MODE'}]`
      : systemCategory === 'walk_in'
      ? 'Commercial Walk-In Cooler / Freezer (Pumpdown Cycle)'
      : systemCategory === 'mini_split'
      ? 'Ductless Inverter Variable-Speed System'
      : systemCategory === 'rtu'
      ? 'Packaged Rooftop Unit (RTU with Economizer)'
      : systemCategory === 'chiller'
      ? 'Water-Cooled Centrifugal Chiller (Type III)'
      : systemCategory === 'ice_machine'
      ? 'Commercial Cube Ice Machine (Hot Gas Harvest Bypass)'
      : systemCategory === 'geothermal'
      ? 'Geothermal Water-to-Air Heat Pump (Coaxial Water Loop)'
      : systemCategory === 'vrf'
      ? 'VRF Multi-Split Heat Recovery (Branch Selector & EEV)'
      : systemCategory === 'hydrocarbon_r290'
      ? 'R-290 Hydrocarbon Reach-In Merchandiser (A3 Flammable)'
      : systemCategory === 'supermarket_rack'
      ? 'Supermarket Parallel Compressor Rack (EPR Valves & Header)'
      : systemCategory === 'transport_reefer'
      ? 'Transport Refrigeration Unit (STV & Standby Dual Drive)'
      : systemCategory === 'crac_datacenter'
      ? 'Precision Data Center Downflow CRAC (Electrode Humidifier)'
      : 'Vapor-Compression Split System';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
      {/* Header and Thermodynamic State Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 mb-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-100 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            {categoryTitle}
          </span>
          <span className="text-slate-400 font-mono">[{refrigerant} · {meteringDevice}]</span>
        </div>

        {/* 4 Thermodynamic Cycle Phases Legend */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-600 inline-block"></span>
            High-P Superheated Vapor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span>
            High-P Subcooled Liquid
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block"></span>
            Low-P Boiling Mixture
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block"></span>
            Low-P Superheated Vapor
          </span>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="w-full relative aspect-[16/9] min-h-[380px] max-h-[520px]">
        <svg viewBox="0 0 960 540" className="w-full h-full select-none">
          <defs>
            <linearGradient id="condenserPhaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="evaporatorPhaseGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            <filter id="probeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" />
            </filter>
          </defs>

          {/* Background Structural Zones */}
          <rect
            x="40"
            y="40"
            width="380"
            height="460"
            rx="12"
            fill="#0f172a"
            fillOpacity="0.4"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <text x="55" y="65" fill="#64748b" fontSize="12" fontWeight="700" fontFamily="sans-serif">
            {systemCategory === 'walk_in'
              ? 'WALK-IN COLD ROOM (Evaporator & Air Defrost)'
              : systemCategory === 'chiller'
              ? 'CHILLED WATER BARREL (Evaporator 44°F Loop)'
              : systemCategory === 'ice_machine'
              ? 'ICE MAKER EVAPORATOR GRID & WATER TROUGH'
              : systemCategory === 'geothermal'
              ? 'INDOOR AIR COIL (DX Evaporator Cooling)'
              : systemCategory === 'supermarket_rack'
              ? 'DAIRY / FROZEN DISPLAY CASE (EPR Regulated Coil)'
              : systemCategory === 'crac_datacenter'
              ? 'DOWNFLOW EVAPORATOR & STEAM HUMIDIFIER'
              : systemCategory === 'hydrocarbon_r290'
              ? 'R-290 REACH-IN CABINET (Pinch-off Process Tube)'
              : isHeating
              ? 'INDOOR COIL (Operating as CONDENSER in Heating)'
              : 'INDOOR AIR HANDLER / EVAPORATOR'}
          </text>

          <rect
            x="540"
            y="40"
            width="380"
            height="460"
            rx="12"
            fill="#0f172a"
            fillOpacity="0.4"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <text x="555" y="65" fill="#64748b" fontSize="12" fontWeight="700" fontFamily="sans-serif">
            {systemCategory === 'chiller'
              ? 'WATER-COOLED CONDENSER (Cooling Tower 85°F Loop)'
              : systemCategory === 'geothermal'
              ? 'COAXIAL WATER-TO-REFRIGERANT HEAT EXCHANGER (Ground Loop)'
              : systemCategory === 'supermarket_rack'
              ? 'PARALLEL COMPRESSOR RACK HEADER & RECEIVER'
              : systemCategory === 'vrf'
              ? 'VRF INVERTER CONDENSING UNIT & BRANCH SELECTOR'
              : isHeating
              ? 'OUTDOOR COIL (Operating as EVAPORATOR in Heating)'
              : 'OUTDOOR CONDENSING UNIT'}
          </text>

          {/* ================= REFRIGERANT PIPING CIRCUIT ================= */}
          {/* Discharge Line: Compressor -> Condenser Top (Red) */}
          <path
            d="M 680 340 L 680 140 L 740 140"
            fill="none"
            stroke="#e11d48"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {isRunning && (
            <path
              d="M 680 340 L 680 140 L 740 140"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeDasharray="6 10"
              className="animate-refrigerant-flow"
              opacity="0.8"
            />
          )}

          {/* Condenser Serpentine Coil (Red to amber) */}
          <path
            d="M 740 140 L 870 140 C 885 140 885 170 870 170 L 740 170 C 725 170 725 200 740 200 L 870 200 C 885 200 885 230 870 230 L 740 230 C 725 230 725 260 740 260 L 870 260"
            fill="none"
            stroke="url(#condenserPhaseGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Liquid Line: Condenser bottom -> Filter Drier -> Sight Glass -> Metering Device (Amber) */}
          <path
            d="M 870 260 L 870 450 L 590 450 L 450 450 L 260 450 L 260 370"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {isRunning && (
            <path
              d="M 870 260 L 870 450 L 590 450 L 450 450 L 260 450 L 260 370"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="5 12"
              className="animate-refrigerant-flow"
              opacity="0.7"
            />
          )}

          {/* Flash Gas & Evaporator Coil: Metering Device -> Evaporator -> Suction Header (Cyan to Blue) */}
          <path
            d="M 260 320 L 260 270 L 120 270 C 105 270 105 240 120 240 L 260 240 C 275 240 275 210 260 210 L 120 210 C 105 210 105 180 120 180 L 260 180 C 275 180 275 150 260 150 L 120 150"
            fill="none"
            stroke="url(#evaporatorPhaseGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Suction Line: Evaporator outlet -> Suction Header -> Accumulator -> Compressor Suction (Blue) */}
          <path
            d="M 120 150 L 80 150 L 80 100 L 610 100 L 610 340"
            fill="none"
            stroke="#2563eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {isRunning && (
            <path
              d="M 120 150 L 80 150 L 80 100 L 610 100 L 610 340"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeDasharray="6 12"
              className="animate-refrigerant-flow"
              opacity="0.8"
            />
          )}

          {/* Line from Accumulator to Compressor */}
          <path d="M 625 380 L 650 380" fill="none" stroke="#2563eb" strokeWidth="7" />

          {/* ================= COMPONENT GRAPHICS ================= */}

          {/* 1. COMPRESSOR (Scroll / Recip / Inverter) */}
          <g transform="translate(650, 320)">
            <rect
              x="0"
              y="0"
              width="75"
              height="110"
              rx={systemCategory === 'mini_split' ? '18' : '36'}
              fill="#1e293b"
              stroke={systemCategory === 'mini_split' ? '#38bdf8' : '#334155'}
              strokeWidth="2.5"
            />
            <circle cx="37" cy="55" r="24" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <path
              d="M 28 55 Q 37 40 46 55 Q 37 70 28 55"
              fill="none"
              stroke={isRunning ? '#38bdf8' : '#64748b'}
              strokeWidth="2.5"
              className={isRunning ? 'animate-pulse' : ''}
            />
            <text x="37.5" y="88" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontWeight="bold">
              {systemCategory === 'mini_split' ? 'DC INVERTER' : 'COMPRESSOR'}
            </text>
            <text x="37.5" y="100" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              {systemCategory === 'mini_split' && readings.inverterOutputHz ? `${readings.inverterOutputHz} Hz · ` : ''}
              {readings.compressorAmps.toFixed(1)} A
            </text>
          </g>

          {/* 2. SUCTION ACCUMULATOR */}
          <g transform="translate(595, 335)">
            <rect x="0" y="0" width="30" height="75" rx="14" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <text x="15" y="42" textAnchor="middle" fill="#64748b" fontSize="6.5" fontWeight="bold" transform="rotate(-90 15 42)">
              ACCUMULATOR
            </text>
          </g>

          {/* 3. CONDENSER COIL & FAN */}
          <g transform="translate(740, 95)">
            <circle cx="65" cy="15" r="22" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <g className={isRunning ? 'animate-spin origin-[65px_15px]' : ''}>
              <line x1="65" y1="3" x2="65" y2="27" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="53" y1="15" x2="77" y2="15" stroke="#38bdf8" strokeWidth="2.5" />
            </g>
            <text x="65" y="-12" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
              {systemCategory === 'chiller' ? 'WATER CONDENSER BARREL' : 'CONDENSER COIL & FAN'}
            </text>
            <text x="65" y="-1" textAnchor="middle" fill="#fb7185" fontSize="8" fontFamily="monospace">
              {systemCategory === 'chiller' ? 'Tower Water: 85°F -> 95°F' : `Air Exit: ${readings.condenserDischargeTemp}°F`}
            </text>
          </g>

          {/* SPECIALIZED OVERLAY: HEAT PUMP 4-WAY REVERSING VALVE */}
          {systemCategory === 'heat_pump' && (
            <g transform="translate(640, 160)">
              <rect x="0" y="0" width="95" height="42" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <text x="47.5" y="15" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">
                4-WAY REVERSING VALVE
              </text>
              <text x="47.5" y="27" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontFamily="monospace">
                Solenoid O/B: {isHeating ? 'HEATING' : 'COOLING'}
              </text>
              <text x="47.5" y="37" textAnchor="middle" fill={readings.reversingValveDeltaT && readings.reversingValveDeltaT > 5 ? '#f87171' : '#38bdf8'} fontSize="6.5" fontFamily="monospace">
                ΔT: {readings.reversingValveDeltaT?.toFixed(1) || '1.8'}°F
              </text>
            </g>
          )}

          {/* SPECIALIZED OVERLAY: COMMERCIAL WALK-IN LIQUID LINE SOLENOID & RECEIVER */}
          {systemCategory === 'walk_in' && (
            <>
              {/* Receiver Tank */}
              <g transform="translate(850, 310)">
                <rect x="0" y="0" width="38" height="60" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <text x="19" y="32" textAnchor="middle" fill="#fcd34d" fontSize="6.5" fontWeight="bold" transform="rotate(-90 19 32)">
                  RECEIVER
                </text>
              </g>

              {/* Liquid Line Solenoid Valve (LLSV) */}
              <g transform="translate(310, 435)">
                <rect x="0" y="0" width="35" height="28" rx="4" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="17.5" cy="8" r="4" fill="#38bdf8" />
                <text x="17.5" y="23" textAnchor="middle" fill="#e2e8f0" fontSize="6.5" fontWeight="bold">
                  LLSV
                </text>
              </g>
            </>
          )}

          {/* SPECIALIZED OVERLAY: RTU ECONOMIZER DAMPER */}
          {systemCategory === 'rtu' && (
            <g transform="translate(60, 20)">
              <rect x="0" y="0" width="160" height="24" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="80" y="11" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
                ECONOMIZER DAMPER
              </text>
              <text x="80" y="20" textAnchor="middle" fill="#f1f5f9" fontSize="7" fontFamily="monospace">
                Mixed Air Temp: {readings.economizerAirMixTemp || 76}°F
              </text>
            </g>
          )}

          {/* 4. LIQUID LINE FILTER DRIER */}
          <g transform="translate(480, 435)">
            <rect x="0" y="0" width="55" height="30" rx="6" fill="#334155" stroke="#475569" strokeWidth="2" />
            <polygon points="20,10 35,15 20,20" fill="#94a3b8" />
            <text x="27.5" y="27" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontWeight="bold">
              FILTER DRIER
            </text>
            {readings.filterDrierDeltaT > 2 && (
              <text x="27.5" y="-5" textAnchor="middle" fill="#f87171" fontSize="8" fontWeight="bold">
                ΔT: {readings.filterDrierDeltaT.toFixed(1)}°F RESTRICTED!
              </text>
            )}
          </g>

          {/* 5. SIGHT GLASS & MOISTURE INDICATOR */}
          <g transform="translate(370, 435)">
            <circle cx="15" cy="15" r="15" fill="#020617" stroke="#64748b" strokeWidth="2" />
            <circle
              cx="15"
              cy="15"
              r="6"
              fill={readings.moistureIndicator === 'wet' ? '#eab308' : readings.moistureIndicator === 'caution' ? '#ca8a04' : '#10b981'}
            />
            {readings.sightGlass === 'bubbles' && (
              <g fill="#93c5fd" opacity="0.8">
                <circle cx="10" cy="10" r="2.5" />
                <circle cx="18" cy="18" r="2" />
                <circle cx="12" cy="19" r="1.5" />
              </g>
            )}
            <text x="15" y="42" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">
              SIGHT GLASS ({readings.sightGlass.toUpperCase()})
            </text>
          </g>

          {/* 6. METERING DEVICE (TXV / Fixed Orifice / EEV) */}
          <g transform="translate(235, 320)">
            <polygon points="10,0 40,0 25,25 40,50 10,50 25,25" fill="#ca8a04" stroke="#eab308" strokeWidth="1.5" />
            {meteringDevice === 'TXV' && (
              <>
                <circle cx="0" cy="25" r="10" fill="#a16207" stroke="#facc15" strokeWidth="1.5" />
                <path d="M -10 25 C -40 25 -40 100 -60 100" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="2 2" />
                <rect x="-75" y="93" width="28" height="14" rx="4" fill="#a16207" stroke="#fde047" strokeWidth="1.5" />
                <text x="-61" y="103" textAnchor="middle" fill="#fef08a" fontSize="6" fontWeight="bold">
                  TXV BULB
                </text>
              </>
            )}
            {meteringDevice === 'EEV (Electronic)' && (
              <g transform="translate(-15, 12)">
                <rect x="0" y="0" width="30" height="24" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <text x="15" y="11" textAnchor="middle" fill="#38bdf8" fontSize="6" fontWeight="bold">
                  STEPPER
                </text>
                <text x="15" y="20" textAnchor="middle" fill="#f8fafc" fontSize="6" fontFamily="monospace">
                  {readings.eevPulseCount || 240}p
                </text>
              </g>
            )}
            <text x="25" y="62" textAnchor="middle" fill="#facc15" fontSize="8" fontWeight="bold">
              {meteringDevice}
            </text>
          </g>

          {/* 7. EVAPORATOR COIL & INDOOR BLOWER */}
          <g transform="translate(130, 95)">
            <rect x="30" y="5" width="60" height="25" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <g className={isRunning ? 'animate-pulse' : ''}>
              <line x1="40" y1="10" x2="40" y2="25" stroke="#38bdf8" strokeWidth="2" />
              <line x1="50" y1="10" x2="50" y2="25" stroke="#38bdf8" strokeWidth="2" />
              <line x1="60" y1="10" x2="60" y2="25" stroke="#38bdf8" strokeWidth="2" />
              <line x1="70" y1="10" x2="70" y2="25" stroke="#38bdf8" strokeWidth="2" />
              <line x1="80" y1="10" x2="80" y2="25" stroke="#38bdf8" strokeWidth="2" />
            </g>
            <text x="60" y="-12" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
              {systemCategory === 'chiller' ? 'CHILLED WATER BARREL' : 'EVAPORATOR & BLOWER'}
            </text>
            <text x="60" y="-1" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              Supply: {readings.supplyAirTemp}°F (ΔT: {readings.evaporatorDeltaT}°F)
            </text>
          </g>

          {/* Freezing Warning */}
          {readings.freezingCoilRisk && (
            <g transform="translate(140, 220)">
              <rect x="-10" y="-14" width="130" height="24" rx="4" fill="#0284c7" stroke="#e0f2fe" strokeWidth="1.5" />
              <text x="55" y="2" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                ❄️ FROST / COIL FREEZE RISK
              </text>
            </g>
          )}

          {/* Safety Open Warning */}
          {readings.compressorStatus === 'safety_open' && (
            <g transform="translate(560, 290)">
              <rect x="0" y="0" width="160" height="26" rx="4" fill="#991b1b" stroke="#fecaca" strokeWidth="1.5" />
              <text x="80" y="16" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                ⚠️ SAFETY OPEN (0V CONTROL)
              </text>
            </g>
          )}

          {/* ================= INTERACTIVE INSTRUMENT PROBES ================= */}
          <g
            className="cursor-pointer group"
            onClick={() => onSelectProbe('suction_port')}
            transform="translate(610, 180)"
          >
            <circle
              cx="0"
              cy="0"
              r="12"
              fill={selectedProbe === 'suction_port' ? '#38bdf8' : '#0284c7'}
              stroke="#ffffff"
              strokeWidth="2"
              filter={selectedProbe === 'suction_port' ? 'url(#probeGlow)' : undefined}
            />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
              LP
            </text>
            <text x="20" y="4" fill="#38bdf8" fontSize="9" fontWeight="bold" className="group-hover:underline">
              Vapor Port ({readings.suctionPressure.toFixed(1)} psig)
            </text>
          </g>

          <g
            className="cursor-pointer group"
            onClick={() => onSelectProbe('liquid_port')}
            transform="translate(870, 360)"
          >
            <circle
              cx="0"
              cy="0"
              r="12"
              fill={selectedProbe === 'liquid_port' ? '#f43f5e' : '#be123c'}
              stroke="#ffffff"
              strokeWidth="2"
              filter={selectedProbe === 'liquid_port' ? 'url(#probeGlow)' : undefined}
            />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
              HP
            </text>
            <text x="-160" y="4" fill="#fb7185" fontSize="9" fontWeight="bold" className="group-hover:underline">
              Liquid Port ({readings.headPressure.toFixed(1)} psig)
            </text>
          </g>

          <g
            className="cursor-pointer group"
            onClick={() => onSelectProbe('suction_temp')}
            transform="translate(420, 100)"
          >
            <rect
              x="-10"
              y="-10"
              width="20"
              height="20"
              rx="4"
              fill={selectedProbe === 'suction_temp' ? '#38bdf8' : '#1e3a8a'}
              stroke="#93c5fd"
              strokeWidth="1.5"
            />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
              T₁
            </text>
            <text x="0" y="-15" textAnchor="middle" fill="#93c5fd" fontSize="8" fontWeight="bold">
              Suction Pipe: {readings.suctionLineTemp}°F
            </text>
          </g>

          <g
            className="cursor-pointer group"
            onClick={() => onSelectProbe('liquid_temp')}
            transform="translate(680, 450)"
          >
            <rect
              x="-10"
              y="-10"
              width="20"
              height="20"
              rx="4"
              fill={selectedProbe === 'liquid_temp' ? '#f59e0b' : '#78350f'}
              stroke="#fcd34d"
              strokeWidth="1.5"
            />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
              T₂
            </text>
            <text x="0" y="24" textAnchor="middle" fill="#fcd34d" fontSize="8" fontWeight="bold">
              Liquid Pipe: {readings.liquidLineTemp}°F
            </text>
          </g>

          <g
            className="cursor-pointer group"
            onClick={() => onSelectProbe('discharge_temp')}
            transform="translate(680, 240)"
          >
            <rect
              x="-10"
              y="-10"
              width="20"
              height="20"
              rx="4"
              fill={selectedProbe === 'discharge_temp' ? '#ef4444' : '#991b1b'}
              stroke="#fca5a5"
              strokeWidth="1.5"
            />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
              Td
            </text>
            <text x="35" y="4" fill="#fca5a5" fontSize="8" fontWeight="bold">
              Discharge: {readings.dischargeLineTemp}°F
            </text>
          </g>
        </svg>
      </div>

      {/* Quick Probe Dock Bar */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-400">Click schematic test points to isolate instrument probes:</span>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'suction_port', label: 'Vapor Service Port (LP)' },
            { id: 'liquid_port', label: 'Liquid Service Port (HP)' },
            { id: 'suction_temp', label: 'Suction Line Clamp (T₁)' },
            { id: 'liquid_temp', label: 'Liquid Line Clamp (T₂)' },
            { id: 'discharge_temp', label: 'Discharge Clamp (Td)' },
          ].map((probe) => (
            <button
              key={probe.id}
              onClick={() => onSelectProbe(probe.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                selectedProbe === probe.id
                  ? 'bg-sky-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {probe.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
