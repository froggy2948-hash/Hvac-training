import React, { useState } from 'react';
import { CycleReadings, SystemParameters } from '../types';

interface MultimeterProps {
  readings: CycleReadings;
  params: SystemParameters;
  ratedRla: number;
  ratedCapacitorUf: number;
}

type MeterMode = 'amps_compressor' | 'amps_fan' | 'cap_herm' | 'cap_fan' | 'voltage_line' | 'voltage_control' | 'windings_ohms';

export const MultimeterTool: React.FC<MultimeterProps> = ({
  readings,
  params,
  ratedRla,
  ratedCapacitorUf,
}) => {
  const [mode, setMode] = useState<MeterMode>('amps_compressor');

  // Compute realistic electrical readings based on system state
  const actualCapacitorUf = Number((ratedCapacitorUf * params.runCapacitorHealth).toFixed(1));
  const isCapacitorBad = params.runCapacitorHealth < 0.94; // > 6% drop
  const fanAmps = params.condenserFanOperational ? 0.9 : 0.0;
  
  let displayValue = '0.0';
  let unit = '';
  let descriptor = '';
  let statusNote = '';

  switch (mode) {
    case 'amps_compressor':
      displayValue = readings.compressorAmps.toFixed(1);
      unit = 'A AC';
      descriptor = 'Compressor Run Current (Amp Clamp)';
      statusNote = readings.compressorAmps > ratedRla * 1.15
        ? `⚠️ High Current (> Nameplate RLA ${ratedRla}A)`
        : readings.compressorStatus === 'locked_rotor'
        ? '⚠️ Locked Rotor Spikes / Tripping Overload'
        : `Nominal RLA: ${ratedRla}A`;
      break;

    case 'amps_fan':
      displayValue = fanAmps.toFixed(2);
      unit = 'A AC';
      descriptor = 'Condenser Fan Motor Current';
      statusNote = params.condenserFanOperational ? 'Normal Motor Draw (0.8 - 1.2A)' : '⚠️ 0.0A - Motor De-energized or Open';
      break;

    case 'cap_herm':
      displayValue = actualCapacitorUf.toFixed(1);
      unit = 'µF';
      descriptor = 'Dual-Run Capacitor (HERM to C)';
      statusNote = isCapacitorBad
        ? `⚠️ Out of Spec: Nameplate ${ratedCapacitorUf}µF ±6% (Min ${(ratedCapacitorUf * 0.94).toFixed(1)}µF)`
        : `Within Spec (${ratedCapacitorUf}µF ±6%)`;
      break;

    case 'cap_fan':
      displayValue = (5.0 * (params.condenserFanOperational ? 1.0 : 0.2)).toFixed(1);
      unit = 'µF';
      descriptor = 'Dual-Run Capacitor (FAN to C)';
      statusNote = params.condenserFanOperational ? '5.0 µF Rated (Nominal)' : '⚠️ Open / Degraded';
      break;

    case 'voltage_line':
      displayValue = '242.4';
      unit = 'V AC';
      descriptor = 'Line Voltage (L1 to L2 at Contactor)';
      statusNote = 'Nominal 240V Supply Available';
      break;

    case 'voltage_control':
      displayValue = '26.2';
      unit = 'V AC';
      descriptor = '24V Control Circuit (R to C)';
      statusNote = 'Transformer Providing 24V Call for Cool';
      break;

    case 'windings_ohms':
      displayValue = params.compressorEfficiency < 0.5 ? '1.8' : '2.1';
      unit = 'Ω';
      descriptor = 'Compressor Start-to-Run Windings';
      statusNote = 'R_Common-Run (0.8Ω) + R_Common-Start (1.3Ω)';
      break;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Electrical Diagnostics</span>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            True-RMS HVAC Clamp Multimeter
          </h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-900/50">
          CAT III 600V
        </span>
      </div>

      {/* Multimeter Digital LCD Screen */}
      <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-lg p-4 font-mono mb-4 shadow-inner">
        <div className="flex items-center justify-between text-xs text-emerald-500/80 mb-1">
          <span>AUTO-RANGE</span>
          <span>HOLD: OFF</span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 tracking-wider">
            {displayValue}
          </div>
          <div className="text-xl md:text-2xl font-bold text-emerald-300">
            {unit}
          </div>
        </div>
        <div className="mt-2 text-xs text-emerald-200/90 font-sans font-medium flex items-center justify-between border-t border-emerald-900/50 pt-2">
          <span>{descriptor}</span>
        </div>
      </div>

      {/* Status Warning or Diagnostic Callout */}
      <div className="text-xs font-mono mb-4 px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
        {statusNote}
      </div>

      {/* Rotary Selector Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-medium">
        <button
          onClick={() => setMode('amps_compressor')}
          className={`p-2 rounded text-left transition-colors border ${
            mode === 'amps_compressor'
              ? 'bg-sky-900/50 text-sky-200 border-sky-500'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="block font-bold text-[11px]">Comp Amps (A)</span>
          <span className="text-[10px] opacity-75">Clamp on Run lead</span>
        </button>

        <button
          onClick={() => setMode('amps_fan')}
          className={`p-2 rounded text-left transition-colors border ${
            mode === 'amps_fan'
              ? 'bg-sky-900/50 text-sky-200 border-sky-500'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="block font-bold text-[11px]">Fan Amps (A)</span>
          <span className="text-[10px] opacity-75">Outdoor fan lead</span>
        </button>

        <button
          onClick={() => setMode('cap_herm')}
          className={`p-2 rounded text-left transition-colors border ${
            mode === 'cap_herm'
              ? 'bg-amber-900/50 text-amber-200 border-amber-500'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="block font-bold text-[11px]">Capacitor HERM</span>
          <span className="text-[10px] opacity-75">{ratedCapacitorUf}µF nameplate</span>
        </button>

        <button
          onClick={() => setMode('cap_fan')}
          className={`p-2 rounded text-left transition-colors border ${
            mode === 'cap_fan'
              ? 'bg-amber-900/50 text-amber-200 border-amber-500'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="block font-bold text-[11px]">Capacitor FAN</span>
          <span className="text-[10px] opacity-75">5.0µF nameplate</span>
        </button>

        <button
          onClick={() => setMode('voltage_line')}
          className={`p-2 rounded text-left transition-colors border ${
            mode === 'voltage_line'
              ? 'bg-indigo-900/50 text-indigo-200 border-indigo-500'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="block font-bold text-[11px]">Line 240V</span>
          <span className="text-[10px] opacity-75">L1 to L2 test</span>
        </button>

        <button
          onClick={() => setMode('voltage_control')}
          className={`p-2 rounded text-left transition-colors border ${
            mode === 'voltage_control'
              ? 'bg-indigo-900/50 text-indigo-200 border-indigo-500'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="block font-bold text-[11px]">Control 24V</span>
          <span className="text-[10px] opacity-75">R to C circuit</span>
        </button>

        <button
          onClick={() => setMode('windings_ohms')}
          className={`p-2 rounded text-left transition-colors border col-span-2 ${
            mode === 'windings_ohms'
              ? 'bg-emerald-900/50 text-emerald-200 border-emerald-500'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="block font-bold text-[11px]">Motor Windings (Ω)</span>
          <span className="text-[10px] opacity-75">Resistance across Start/Run/Common pins</span>
        </button>
      </div>
    </div>
  );
};
