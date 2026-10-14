import React, { useState } from 'react';
import { RefrigerantType } from '../types';
import { PT_TABLE, tempToPressure, pressureToTemp } from '../lib/thermo';

export const StudyGuides: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pt_chart' | 'diagnostic_matrix' | 'system_guides' | 'epa_rules' | 'mnemonics'>('pt_chart');

  // Interactive P-T Calculator State
  const [calcRef, setCalcRef] = useState<RefrigerantType>('R-410A');
  const [inputTemp, setInputTemp] = useState<string>('40');
  const [inputPress, setInputPress] = useState<string>('118');

  const calculatedPress = tempToPressure(Number(inputTemp) || 0, calcRef);
  const calculatedTemp = pressureToTemp(Number(inputPress) || 0, calcRef);

  const handleDownloadFieldManual = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HVAC CycleSim - Offline Field Reference Manual</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; color: #0f172a; line-height: 1.5; background: #fff; }
    h1 { color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; font-size: 22px; }
    h2 { color: #1e293b; margin-top: 1.5rem; font-size: 16px; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 12px; font-family: monospace; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; }
    th { background: #f1f5f9; color: #334155; }
    .pro-tip { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; border-radius: 6px; margin: 10px 0; font-size: 12px; }
  </style>
</head>
<body>
  <h1>HVAC CycleSim - Offline Field Quick Reference & Cheat Sheet</h1>
  <p>Essential field diagnostics, P-T benchmarks, and EPA 608 compliance reference for HVAC/R technicians.</p>
  
  <h2>1. The 7-System Refrigeration Diagnostic Matrix</h2>
  <table>
    <thead>
      <tr>
        <th>Fault Condition</th><th>Suction P</th><th>Head P</th><th>Superheat</th><th>Subcooling</th><th>Amps</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Nominal Baseline</td><td>Normal</td><td>Normal</td><td>8 - 12°F</td><td>10 - 12°F</td><td>Normal</td></tr>
      <tr><td>Undercharged (Leak)</td><td>Low</td><td>Low</td><td>High</td><td>Low</td><td>Low</td></tr>
      <tr><td>Overcharged</td><td>High</td><td>Very High</td><td>Normal/Low</td><td>High</td><td>High</td></tr>
      <tr><td>Restricted Airflow / Dirty Filter</td><td>Very Low</td><td>Low</td><td>Low</td><td>Normal</td><td>Low</td></tr>
      <tr><td>Dirty Outdoor Condenser</td><td>High</td><td>Very High</td><td>Normal/Low</td><td>Normal/High</td><td>High</td></tr>
      <tr><td>Restricted TXV / Starved Coil</td><td>Very Low</td><td>Low/Normal</td><td>Very High</td><td>High</td><td>Low</td></tr>
      <tr><td>Reversing Valve Blow-By</td><td>High</td><td>Low</td><td>High</td><td>Low</td><td>Low</td></tr>
      <tr><td>Walk-In Solenoid Leaking Past</td><td>Creeps Up</td><td>Normal</td><td>Normal</td><td>Normal</td><td>Normal</td></tr>
      <tr><td>RTU Economizer Stuck Open</td><td>High</td><td>Very High</td><td>Normal</td><td>Normal</td><td>High</td></tr>
    </tbody>
  </table>

  <h2>2. EPA 608 Mandatory Evacuation Standards (40 CFR § 82.156)</h2>
  <table>
    <thead><tr><th>Appliance Category</th><th>Required Vacuum Level</th></tr></thead>
    <tbody>
      <tr><td>Small Appliances (&le; 5 lbs)</td><td>90% of charge or 4 inches of Hg vacuum</td></tr>
      <tr><td>High-Pressure &lt; 200 lbs (R-22, R-410A)</td><td>10 inches of Hg vacuum</td></tr>
      <tr><td>High-Pressure &ge; 200 lbs</td><td>15 inches of Hg vacuum</td></tr>
      <tr><td>Low-Pressure Chillers (R-123)</td><td>25 mm of Hg absolute (~29" Hg vacuum)</td></tr>
    </tbody>
  </table>

  <h2>3. Annual Leak Rate Thresholds (50+ lbs)</h2>
  <ul>
    <li><strong>Comfort Cooling:</strong> 10% annual leak rate</li>
    <li><strong>Commercial Refrigeration:</strong> 20% annual leak rate</li>
    <li><strong>Industrial Process:</strong> 30% annual leak rate</li>
  </ul>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HVAC-CycleSim-Offline-Field-Reference.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-sky-400">Master HVAC/R Reference Library</span>
          <h2 className="text-lg font-bold text-white">Technician Study Guides & System Manuals</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete theoretical and field guides for residential, commercial, and industrial refrigeration systems.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadFieldManual}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-semibold transition-colors"
            title="Download offline HTML field guide to your device storage"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Offline Cheat Sheet</span>
          </button>
        </div>

        {/* Tab Buttons (Spacious) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('pt_chart')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'pt_chart' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            P-T Calculator
          </button>
          <button
            onClick={() => setActiveTab('diagnostic_matrix')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'diagnostic_matrix' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Diagnostic Matrix
          </button>
          <button
            onClick={() => setActiveTab('system_guides')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'system_guides' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All-System Field Guides
          </button>
          <button
            onClick={() => setActiveTab('epa_rules')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'epa_rules' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            EPA 608 Quick Reference
          </button>
          <button
            onClick={() => setActiveTab('mnemonics')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'mnemonics' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Field Pro-Tips
          </button>
        </div>
      </div>

      {/* ================= TAB 1: INTERACTIVE P-T CHART ================= */}
      {activeTab === 'pt_chart' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Pressure-Temperature Saturation Calculator
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Refrigerant:</span>
                <select
                  value={calcRef}
                  onChange={(e) => setCalcRef(e.target.value as RefrigerantType)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-sky-300 font-mono"
                >
                  <option value="R-410A">R-410A</option>
                  <option value="R-22">R-22</option>
                  <option value="R-404A">R-404A (Commercial)</option>
                  <option value="R-448A">R-448A (Solstice N40)</option>
                  <option value="R-134a">R-134a</option>
                  <option value="R-454B">R-454B (A2L)</option>
                  <option value="R-32">R-32 (A2L)</option>
                  <option value="R-123">R-123 (Chiller)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block font-mono mb-2">
                  Input Saturation Temp (°F) → Output Saturation Pressure (psig)
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={inputTemp}
                      onChange={(e) => setInputTemp(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-mono text-base"
                      placeholder="e.g. 40"
                    />
                  </div>
                  <span className="text-slate-500 font-mono font-bold">➔</span>
                  <div className="flex-1 bg-slate-900 border border-sky-900/60 rounded-lg p-3 text-sky-400 font-mono font-bold text-lg text-right">
                    {calculatedPress} psig
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block font-mono mb-2">
                  Input Gauge Pressure (psig) → Output Saturation Temp (°F)
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={inputPress}
                      onChange={(e) => setInputPress(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-mono text-base"
                      placeholder="e.g. 118"
                    />
                  </div>
                  <span className="text-slate-500 font-mono font-bold">➔</span>
                  <div className="flex-1 bg-slate-900 border border-sky-900/60 rounded-lg p-3 text-sky-400 font-mono font-bold text-lg text-right">
                    {calculatedTemp}°F
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Master P-T Tabular Reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-xs font-mono uppercase text-sky-400 pb-3 border-b border-slate-800 mb-4">
              Multi-Refrigerant Saturation Pressure Table (psig)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Temp (°F)</th>
                    <th className="p-2.5 text-rose-400">R-410A</th>
                    <th className="p-2.5 text-emerald-400">R-22</th>
                    <th className="p-2.5 text-amber-400">R-404A</th>
                    <th className="p-2.5 text-sky-400">R-134a</th>
                    <th className="p-2.5 text-purple-400">R-454B</th>
                    <th className="p-2.5 text-teal-400">R-32</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {PT_TABLE.map((row) => (
                    <tr
                      key={row.temp}
                      className={row.temp === 40 || row.temp === 110 || row.temp === -10 ? 'bg-sky-950/30 font-bold' : 'hover:bg-slate-850/50'}
                    >
                      <td className="p-2.5 text-slate-200">{row.temp}°F</td>
                      <td className="p-2.5 text-rose-300">{row.r410a}</td>
                      <td className="p-2.5 text-emerald-300">{row.r22}</td>
                      <td className="p-2.5 text-amber-300">{row.r404a}</td>
                      <td className="p-2.5 text-sky-300">{row.r134a}</td>
                      <td className="p-2.5 text-purple-300">{row.r454b}</td>
                      <td className="p-2.5 text-teal-300">{row.r32}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: DIAGNOSTIC MATRIX ================= */}
      {activeTab === 'diagnostic_matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="pb-3 border-b border-slate-800 mb-4">
            <span className="text-xs font-mono uppercase text-sky-400">Trade School Reference Standard</span>
            <h3 className="text-base font-bold text-white">The HVAC/R Comprehensive Field Diagnostic Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Includes split systems, heat pumps, walk-in commercial refrigeration, and rooftop economizers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-950 font-mono text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="p-3">Fault Condition</th>
                  <th className="p-3">Suction P</th>
                  <th className="p-3">Head P</th>
                  <th className="p-3 text-sky-400">Superheat</th>
                  <th className="p-3 text-amber-400">Subcooling</th>
                  <th className="p-3">Amps</th>
                  <th className="p-3">Diagnostic Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                <tr className="bg-emerald-950/20">
                  <td className="p-3 font-bold text-emerald-300">Nominal Operation</td>
                  <td className="p-3 text-emerald-400">NORMAL</td>
                  <td className="p-3 text-emerald-400">NORMAL</td>
                  <td className="p-3 text-emerald-400 font-bold">8 - 12°F</td>
                  <td className="p-3 text-emerald-400 font-bold">10 - 12°F</td>
                  <td className="p-3 text-emerald-400">NORMAL</td>
                  <td className="p-3 text-emerald-400">Split 18-22°F</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-100">Undercharge (Leak)</td>
                  <td className="p-3 text-sky-400">LOW ↓</td>
                  <td className="p-3 text-sky-400">LOW ↓</td>
                  <td className="p-3 text-rose-400 font-bold">HIGH ↑↑</td>
                  <td className="p-3 text-rose-400 font-bold">LOW ↓↓</td>
                  <td className="p-3 text-sky-400">LOW ↓</td>
                  <td className="p-3 text-slate-300">Bubbles in glass, low mass flow</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-100">Overcharge</td>
                  <td className="p-3 text-rose-400">NORMAL/HIGH ↑</td>
                  <td className="p-3 text-rose-400 font-bold">VERY HIGH ↑↑</td>
                  <td className="p-3 text-sky-400">NORMAL/LOW</td>
                  <td className="p-3 text-rose-400 font-bold">HIGH ↑↑ (Stacked)</td>
                  <td className="p-3 text-rose-400 font-bold">HIGH ↑↑</td>
                  <td className="p-3 text-slate-300">Excess liquid in condenser</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-100">Restricted Air Filter / Low CFM</td>
                  <td className="p-3 text-sky-400 font-bold">VERY LOW ↓↓</td>
                  <td className="p-3 text-sky-400">LOW ↓</td>
                  <td className="p-3 text-sky-400 font-bold">LOW ↓↓</td>
                  <td className="p-3 text-slate-300">NORMAL</td>
                  <td className="p-3 text-sky-400">LOW ↓</td>
                  <td className="p-3 text-rose-400">Coil freeze / frost below 32°F</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-100">Dirty Outdoor Condenser</td>
                  <td className="p-3 text-rose-400">HIGH ↑</td>
                  <td className="p-3 text-rose-400 font-bold">VERY HIGH ↑↑</td>
                  <td className="p-3 text-slate-300">NORMAL/LOW</td>
                  <td className="p-3 text-slate-300">NORMAL/HIGH</td>
                  <td className="p-3 text-rose-400 font-bold">HIGH ↑↑</td>
                  <td className="p-3 text-slate-300">Coil airflow starved, hot shell</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-100">Restricted TXV / EEV Jammed</td>
                  <td className="p-3 text-sky-400 font-bold">VERY LOW ↓↓</td>
                  <td className="p-3 text-sky-400">LOW/NORMAL</td>
                  <td className="p-3 text-rose-400 font-bold">VERY HIGH ↑↑</td>
                  <td className="p-3 text-rose-400 font-bold">HIGH ↑</td>
                  <td className="p-3 text-sky-400">LOW ↓</td>
                  <td className="p-3 text-slate-300">Starved coil, liquid backed up</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-100">Heat Pump Reversing Valve Blow-By</td>
                  <td className="p-3 text-rose-400 font-bold">HIGH ↑↑</td>
                  <td className="p-3 text-sky-400 font-bold">LOW ↓↓</td>
                  <td className="p-3 text-rose-400">HIGH ↑</td>
                  <td className="p-3 text-sky-400">LOW ↓</td>
                  <td className="p-3 text-sky-400">LOW ↓</td>
                  <td className="p-3 text-amber-400 font-bold">Valve body ΔT &gt; 5°F (4-pipe touch test)</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-100">Walk-In Solenoid (LLSV) Leaking</td>
                  <td className="p-3 text-rose-400 font-bold">CREEPS UP ↑</td>
                  <td className="p-3 text-slate-300">NORMAL</td>
                  <td className="p-3 text-slate-300">NORMAL</td>
                  <td className="p-3 text-slate-300">NORMAL</td>
                  <td className="p-3 text-slate-300">NORMAL</td>
                  <td className="p-3 text-rose-400 font-bold">Short-cycling on LPC cut-in (35 psig)</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-100">RTU Economizer Stuck 100% Open</td>
                  <td className="p-3 text-rose-400 font-bold">HIGH ↑↑</td>
                  <td className="p-3 text-rose-400 font-bold">VERY HIGH ↑↑</td>
                  <td className="p-3 text-slate-300">NORMAL</td>
                  <td className="p-3 text-slate-300">NORMAL</td>
                  <td className="p-3 text-rose-400 font-bold">HIGH ↑↑</td>
                  <td className="p-3 text-purple-400 font-bold">Mixed air temp = outdoor ambient (95°F+)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ALL-SYSTEM FIELD GUIDES ================= */}
      {activeTab === 'system_guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Heat Pump Guide */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-amber-400 mb-2">
              Air-Source Heat Pump Diagnostic Protocol
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>4-Pipe Touch Test:</strong> Feel the top single pipe (discharge from compressor). Then feel the bottom three pipes. The center bottom pipe is suction back to accumulator. The left and right bottom pipes lead to indoor and outdoor coils. If the bottom center suction pipe is warm, the internal Teflon slide has failed.
              </p>
              <p>
                <strong>O vs B Terminal:</strong> O energizes reversing valve in Cooling (standard on Rheem/Ruud uses B for heating). If heat pump blows cold air during winter call for heat, verify 24V on O/B terminal.
              </p>
            </div>
          </div>

          {/* Walk-In Refrigeration Guide */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-emerald-400 mb-2">
              Commercial Walk-In Pumpdown & Defrost Cycles
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>Pumpdown Cycle:</strong> Thermostat only operates the Liquid Line Solenoid Valve (LLSV). It does NOT directly cycle the compressor. When LLSV closes, the compressor evacuates the evaporator until the Low Pressure Control (LPC) cuts out at 10-15 psig.
              </p>
              <p>
                <strong>Defrost Termination (DTFD):</strong> Klixon bimetal switch on coil terminates heaters at 55°F and delays evaporator fans until the coil freezes down to 25°F to prevent blowing hot fog into the walk-in.
              </p>
            </div>
          </div>

          {/* Ductless Inverter Guide */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-sky-400 mb-2">
              Inverter Mini-Split & EEV Stepper Troubleshooting
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>EEV Resistance:</strong> Stepper motors feature 5 or 6 wires with two coils center-tapped. Resistance from common to each phase is typically 46Ω ±5%. Unbalanced resistance indicates a shorted stepper coil.
              </p>
              <p>
                <strong>Inverter IPM Check:</strong> With power off, set multimeter to diode test. Test between DC+ / DC- bus and U, V, W compressor terminals. Voltage drop should measure ~0.4V to 0.6V across all 6 internal IGBT diodes.
              </p>
            </div>
          </div>

          {/* Commercial RTU Economizer Guide */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-purple-400 mb-2">
              Packaged RTU Economizers & Title 24 Standards
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>Mixed Air Calculation:</strong> T_mix = (%OA &times; T_outdoor) + (%RA &times; T_return).
                On a 95°F day with 15% minimum position, mixed air entering the coil should be around 78°F. If mixed air is 92°F+, the economizer damper is stuck open!
              </p>
              <p>
                <strong>Belt Tension:</strong> 1/2&quot; deflection per 12&quot; span. Glazed belts cause severe CFM loss and freeze evaporator coils without reducing motor RPM.
              </p>
            </div>
          </div>

          {/* Commercial Ice Machine Guide */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-cyan-400 mb-2">
              Commercial Ice Machine Harvesting & Controls
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>Harvest Bypass Diagnostics:</strong> During the freeze cycle, the hot gas harvest solenoid valve must be 100% closed. If the copper bypass tube is warm or hot during freeze, hot gas is leaking past the seat, causing thin slabs or infinite freeze cycles.
              </p>
              <p>
                <strong>Water Curtain Proximity Sensor:</strong> When ice slab drops, the magnetic curtain swings open and closes. If the magnetic reed switch sticks open, the board assumes the storage bin is full and halts operation.
              </p>
            </div>
          </div>

          {/* Geothermal & Water-Source Heat Pumps */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-teal-400 mb-2">
              Geothermal & Water-Source Coaxial Heat Exchangers
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>Water Loop Flow Rate:</strong> Standard flow is 3.0 GPM per nominal ton. Measure water pressure drop (PSI) across the coaxial barrel with a digital gauge and cross-reference against manufacturer submittal curve.
              </p>
              <p>
                <strong>Water Delta-T:</strong> Normal temperature rise in cooling is 8°F to 10°F. A delta-T above 18°F indicates severely restricted loop flow, mineral scaling, or a dead circulating pump.
              </p>
            </div>
          </div>

          {/* VRF Heat Recovery Multi-Split */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-indigo-400 mb-2">
              VRF Heat Recovery & Branch Selector Boxes
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>3-Pipe Heat Recovery:</strong> Uses high-pressure discharge vapor, high-pressure liquid, and low-pressure suction vapor lines. Branch Selector boxes allow one zone to heat while an adjacent zone cools simultaneously.
              </p>
              <p>
                <strong>EEV Stepper Testing:</strong> Stepper motors operate from 0 to 480 pulses. Disconnect the 5/6 pin harness and test resistance between Common and each phase (typically 46Ω ±5%).
              </p>
            </div>
          </div>

          {/* Hydrocarbon Refrigerants (R-290 / R-600a) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-rose-400 mb-2">
              Hydrocarbon (R-290 / R-600a) A3 Safety Rules
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>Maximum Charge Limits:</strong> Domestic household refrigerators (R-600a) are strictly limited to 57 grams (2.0 oz). Commercial self-contained reach-ins (R-290) are limited to 150 grams under standard EPA SNAP rules.
              </p>
              <p>
                <strong>No Open Flames:</strong> Never braze with a torch until system is recovered and thoroughly swept with oxygen-free nitrogen. Use Lokring press mechanical fittings.
              </p>
            </div>
          </div>

          {/* Supermarket Parallel Multiplex Racks */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-yellow-400 mb-2">
              Supermarket Racks & EPR Valve Diagnostics
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>Evaporator Pressure Regulators (EPR):</strong> Maintain individual case lineup pressures above common suction header pressure to prevent freezing products (e.g. keeping dairy at 45 psig while rack suction is at 25 psig).
              </p>
              <p>
                <strong>Liquid Subcoolers:</strong> Parallel racks utilize brazed-plate liquid subcoolers to subcool liquid down to 40°F, eliminating flashing across long store pipe runs.
              </p>
            </div>
          </div>

          {/* Precision CRAC / Data Center Cooling */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-blue-400 mb-2">
              Precision CRAC Data Center Units
            </h4>
            <div className="space-y-2 text-slate-300 font-sans leading-relaxed">
              <p>
                <strong>Sensible Heat Ratio (SHR):</strong> Data centers have high sensible loads (computers generate heat without moisture). CRAC units are designed with SHR &gt; 0.90 to 0.95.
              </p>
              <p>
                <strong>Steam Humidifier Canisters:</strong> Disposable electrode steam boilers maintain strict 45-55% relative humidity to prevent electrostatic discharge. Mineral scale insulates electrodes, dropping amp draw to 0A and halting steam production.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: EPA 608 QUICK REFERENCE ================= */}
      {activeTab === 'epa_rules' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3">
              EPA Mandatory Evacuation Levels (40 CFR § 82.156 Table 1)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Appliance Category</th>
                    <th className="p-2.5">Pre-Nov 15, 1993 Equipment</th>
                    <th className="p-2.5 text-sky-400">Post-Nov 15, 1993 Equipment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-2.5 text-slate-200">Small Appliance (Compressor Running)</td>
                    <td className="p-2.5">80% of charge</td>
                    <td className="p-2.5 text-sky-300">90% of charge or 4&quot; Hg vacuum</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-200">High-Pressure &lt; 200 lbs (R-22, R-410A)</td>
                    <td className="p-2.5">0 psig</td>
                    <td className="p-2.5 text-sky-300 font-bold">10 inches of Hg vacuum</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-200">High-Pressure &ge; 200 lbs</td>
                    <td className="p-2.5">4 inches of Hg vacuum</td>
                    <td className="p-2.5 text-sky-300 font-bold">15 inches of Hg vacuum</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-200">Low-Pressure Chillers (R-11, R-123)</td>
                    <td className="p-2.5">25 inches of Hg vacuum</td>
                    <td className="p-2.5 text-sky-300 font-bold">25 mm of Hg absolute (~29&quot; Hg)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: TECHNICIAN MNEMONICS ================= */}
      {activeTab === 'mnemonics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-sky-400 mb-2">
              Rule of Thumb: Subcooling & Superheat
            </h4>
            <p className="text-slate-300 font-sans leading-relaxed mb-3">
              <strong>Superheat (SH)</strong> reflects evaporator load and refrigerant feed. High SH = starved evaporator. Low SH = flooding evaporator.
            </p>
            <p className="text-slate-300 font-sans leading-relaxed">
              <strong>Subcooling (SC)</strong> reflects condenser liquid stacking. Low SC = undercharged. High SC = overcharged or line restriction.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-amber-400 mb-2">
              The 80% Recovery Cylinder Rule
            </h4>
            <p className="text-slate-300 font-sans leading-relaxed">
              Never fill a recovery cylinder over 80% by weight at 70°F. Hydrostatic liquid expansion can cause tank rupture.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
