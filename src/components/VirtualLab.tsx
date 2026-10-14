import React, { useState, useMemo } from 'react';
import { RefrigerantType, MeteringDeviceType, SystemCategory, SystemParameters } from '../types';
import { calculateCycleReadings } from '../lib/thermo';
import { RefrigerationSchematic } from './RefrigerationSchematic';
import { ManifoldGauges } from './ManifoldGauges';

export const VirtualLab: React.FC = () => {
  const [params, setParams] = useState<SystemParameters>({
    systemCategory: 'split_ac',
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    operationMode: 'cooling',
    ambientTemp: 90,
    returnAirTemp: 76,
    returnAirWetBulb: 63,
    chargePercent: 100,
    airflowCfm: 1200,
    condenserAirflowFactor: 1.0,
    evaporatorAirflowFactor: 1.0,
    txvOpeningFactor: 1.0,
    compressorEfficiency: 1.0,
    nonCondensables: false,
    liquidLineRestriction: false,
    runCapacitorHealth: 1.0,
    condenserFanOperational: true,
    evaporatorBlowerOperational: true,
    nominalTons: 3.0,
    reversingValveState: 'cooling',
    solenoidValveState: 'open',
    condensateFloatTripped: false,
    economizerDamperPercent: 0,
    eevStepPosition: 240,
    inverterSpeedHz: 60,
  });

  const [selectedProbe, setSelectedProbe] = useState<string | null>('suction_port');

  const cycleReadings = useMemo(() => {
    return calculateCycleReadings(params);
  }, [params]);

  // Handle system category change
  const handleCategoryChange = (cat: SystemCategory) => {
    switch (cat) {
      case 'heat_pump':
        setParams((p) => ({
          ...p,
          systemCategory: 'heat_pump',
          refrigerant: 'R-410A',
          meteringDevice: 'TXV',
          operationMode: 'heating',
          ambientTemp: 40,
          returnAirTemp: 68,
          returnAirWetBulb: 56,
          reversingValveState: 'heating',
        }));
        break;

      case 'mini_split':
        setParams((p) => ({
          ...p,
          systemCategory: 'mini_split',
          refrigerant: 'R-410A',
          meteringDevice: 'EEV (Electronic)',
          operationMode: 'cooling',
          nominalTons: 1.5,
          eevStepPosition: 240,
          inverterSpeedHz: 60,
          ambientTemp: 90,
          returnAirTemp: 76,
        }));
        break;

      case 'walk_in':
        setParams((p) => ({
          ...p,
          systemCategory: 'walk_in',
          refrigerant: 'R-404A',
          meteringDevice: 'TXV',
          operationMode: 'cooling',
          ambientTemp: 82,
          returnAirTemp: 35,
          returnAirWetBulb: 32,
          nominalTons: 2.0,
          solenoidValveState: 'open',
        }));
        break;

      case 'rtu':
        setParams((p) => ({
          ...p,
          systemCategory: 'rtu',
          refrigerant: 'R-410A',
          meteringDevice: 'TXV',
          operationMode: 'cooling',
          nominalTons: 7.5,
          ambientTemp: 92,
          returnAirTemp: 78,
          economizerDamperPercent: 15,
        }));
        break;

      case 'chiller':
        setParams((p) => ({
          ...p,
          systemCategory: 'chiller',
          refrigerant: 'R-123',
          meteringDevice: 'Fixed Orifice',
          operationMode: 'cooling',
          nominalTons: 150.0,
          ambientTemp: 85,
          returnAirTemp: 54,
        }));
        break;

      case 'ice_machine':
        setParams((p) => ({
          ...p,
          systemCategory: 'ice_machine',
          refrigerant: 'R-404A',
          meteringDevice: 'TXV',
          operationMode: 'cooling',
          nominalTons: 1.0,
          ambientTemp: 78,
          returnAirTemp: 70,
          iceMachineHarvestValveLeaking: false,
          hotGasHarvestActive: false,
        }));
        break;

      case 'geothermal':
        setParams((p) => ({
          ...p,
          systemCategory: 'geothermal',
          refrigerant: 'R-410A',
          meteringDevice: 'TXV',
          operationMode: 'cooling',
          nominalTons: 4.0,
          ambientTemp: 88,
          returnAirTemp: 75,
          waterLoopFlowGpm: 3.0,
          waterLoopEwtTemp: 65,
        }));
        break;

      case 'vrf':
        setParams((p) => ({
          ...p,
          systemCategory: 'vrf',
          refrigerant: 'R-410A',
          meteringDevice: 'EEV (Electronic)',
          operationMode: 'cooling',
          nominalTons: 10.0,
          ambientTemp: 92,
          returnAirTemp: 76,
          eevStepPosition: 240,
        }));
        break;

      case 'hydrocarbon_r290':
        setParams((p) => ({
          ...p,
          systemCategory: 'hydrocarbon_r290',
          refrigerant: 'R-290',
          meteringDevice: 'Capillary Tube',
          operationMode: 'cooling',
          nominalTons: 0.5,
          ambientTemp: 75,
          returnAirTemp: 38,
        }));
        break;

      case 'supermarket_rack':
        setParams((p) => ({
          ...p,
          systemCategory: 'supermarket_rack',
          refrigerant: 'R-404A',
          meteringDevice: 'TXV',
          operationMode: 'cooling',
          nominalTons: 25.0,
          ambientTemp: 85,
          returnAirTemp: 36,
          eprValveSettingPsig: 42,
        }));
        break;

      case 'crac_datacenter':
        setParams((p) => ({
          ...p,
          systemCategory: 'crac_datacenter',
          refrigerant: 'R-410A',
          meteringDevice: 'EEV (Electronic)',
          operationMode: 'cooling',
          nominalTons: 15.0,
          ambientTemp: 82,
          returnAirTemp: 68,
          returnAirWetBulb: 54,
          humidifierActive: true,
        }));
        break;

      case 'split_ac':
      default:
        setParams((p) => ({
          ...p,
          systemCategory: 'split_ac',
          refrigerant: 'R-410A',
          meteringDevice: 'TXV',
          operationMode: 'cooling',
          ambientTemp: 90,
          returnAirTemp: 76,
          nominalTons: 3.0,
        }));
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and System Type Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase text-sky-400 font-bold tracking-wider">
              Thermodynamic Physics Sandbox
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Multi-System Virtual Laboratory (12 HVAC/R Architectures)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any system architecture and freely manipulate physics, charges, component restrictions, and sensors.
            </p>
          </div>

          {/* System Architecture Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-medium">
            {[
              { id: 'split_ac', label: 'Split AC' },
              { id: 'heat_pump', label: 'Heat Pump' },
              { id: 'mini_split', label: 'Mini-Split' },
              { id: 'walk_in', label: 'Walk-In' },
              { id: 'rtu', label: 'RTU' },
              { id: 'chiller', label: 'Chiller' },
              { id: 'ice_machine', label: 'Ice Machine' },
              { id: 'geothermal', label: 'Geothermal' },
              { id: 'vrf', label: 'VRF Multi-Split' },
              { id: 'hydrocarbon_r290', label: 'R-290 Reach-In' },
              { id: 'supermarket_rack', label: 'Supermarket Rack' },
              { id: 'crac_datacenter', label: 'Data Center CRAC' },
            ].map((sys) => (
              <button
                key={sys.id}
                onClick={() => handleCategoryChange(sys.id as SystemCategory)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  params.systemCategory === sys.id
                    ? 'bg-sky-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sys.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Controls Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs font-mono">
          <div>
            <label className="text-slate-400 block text-[11px] mb-1">Refrigerant Selection</label>
            <select
              value={params.refrigerant}
              onChange={(e) => setParams({ ...params, refrigerant: e.target.value as RefrigerantType })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-sky-500"
            >
              <option value="R-410A">R-410A (Puron / HFC)</option>
              <option value="R-22">R-22 (Freon / HCFC)</option>
              <option value="R-404A">R-404A (Commercial Low/Med Temp)</option>
              <option value="R-448A">R-448A (Solstice N40)</option>
              <option value="R-134a">R-134a (Medium Pressure)</option>
              <option value="R-454B">R-454B (Opteon XL41 / A2L)</option>
              <option value="R-32">R-32 (A2L Pure)</option>
              <option value="R-123">R-123 (Low-Pressure Chiller)</option>
              <option value="R-290">R-290 (Propane / A3 Natural)</option>
              <option value="R-600a">R-600a (Isobutane / A3)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block text-[11px] mb-1">Expansion Device</label>
            <select
              value={params.meteringDevice}
              onChange={(e) => setParams({ ...params, meteringDevice: e.target.value as MeteringDeviceType })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-sky-500"
            >
              <option value="TXV">Thermostatic Expansion Valve (TXV)</option>
              <option value="Fixed Orifice">Fixed Orifice (Piston)</option>
              <option value="Capillary Tube">Capillary Tube</option>
              <option value="EEV (Electronic)">Electronic Expansion Valve (EEV)</option>
            </select>
          </div>


          {/* Mode for Heat Pump */}
          {params.systemCategory === 'heat_pump' ? (
            <div>
              <label className="text-slate-400 block text-[11px] mb-1">Reversing Valve Mode</label>
              <select
                value={params.operationMode || 'cooling'}
                onChange={(e) => {
                  const m = e.target.value as 'cooling' | 'heating';
                  setParams({
                    ...params,
                    operationMode: m,
                    reversingValveState: m,
                    ambientTemp: m === 'heating' ? 40 : 90,
                  });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-amber-300 font-mono text-xs focus:ring-1 focus:ring-sky-500"
              >
                <option value="cooling">Cooling Mode (Outdoor Condenser)</option>
                <option value="heating">Heating Mode (Indoor Condenser)</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="text-slate-400 block text-[11px] mb-1">Outdoor Ambient: {params.ambientTemp}°F</label>
              <input
                type="range"
                min="50"
                max="115"
                value={params.ambientTemp}
                onChange={(e) => setParams({ ...params, ambientTemp: Number(e.target.value) })}
                className="w-full accent-sky-500 mt-2"
              />
            </div>
          )}

          <div>
            <label className="text-slate-400 block text-[11px] mb-1">
              {params.systemCategory === 'walk_in' ? 'Box Temp' : 'Indoor Return'}: {params.returnAirTemp}°F
            </label>
            <input
              type="range"
              min={params.systemCategory === 'walk_in' ? '-15' : '60'}
              max="90"
              value={params.returnAirTemp}
              onChange={(e) => setParams({ ...params, returnAirTemp: Number(e.target.value) })}
              className="w-full accent-sky-500 mt-2"
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Live Schematic */}
      <RefrigerationSchematic
        readings={cycleReadings}
        refrigerant={params.refrigerant}
        meteringDevice={params.meteringDevice}
        systemCategory={params.systemCategory}
        operationMode={params.operationMode}
        selectedProbe={selectedProbe}
        onSelectProbe={(p) => setSelectedProbe(p)}
        showProbes={true}
      />

      {/* Gauges */}
      <ManifoldGauges
        readings={cycleReadings}
        refrigerant={params.refrigerant}
        meteringDevice={params.meteringDevice}
      />

      {/* Physics & Component Tuning Sliders */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-xs font-mono uppercase text-sky-400 pb-3 border-b border-slate-800 mb-4">
          Detailed Cycle Tuning & Fault Injection
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-mono">
          {/* Charge Percent */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 mb-2">
              <span>Refrigerant Charge</span>
              <span className="font-bold text-sky-400">{params.chargePercent}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="140"
              value={params.chargePercent}
              onChange={(e) => setParams({ ...params, chargePercent: Number(e.target.value) })}
              className="w-full accent-sky-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              {params.chargePercent < 85 ? 'Starved / Low Subcooling' : params.chargePercent > 115 ? 'Flooded / High Subcooling' : 'Nominal Charge'}
            </span>
          </div>

          {/* Evaporator Airflow */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 mb-2">
              <span>Indoor Airflow (Filter / CFM)</span>
              <span className="font-bold text-sky-400">{Math.round(params.evaporatorAirflowFactor * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.2"
              step="0.05"
              value={params.evaporatorAirflowFactor}
              onChange={(e) => setParams({ ...params, evaporatorAirflowFactor: Number(e.target.value) })}
              className="w-full accent-sky-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              {params.evaporatorAirflowFactor < 0.6 ? 'Coil Frost Risk (<32°F SST)' : 'Good airflow volume'}
            </span>
          </div>

          {/* Condenser Cleanliness */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 mb-2">
              <span>Condenser Cleanliness</span>
              <span className="font-bold text-sky-400">{Math.round(params.condenserAirflowFactor * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={params.condenserAirflowFactor}
              onChange={(e) => setParams({ ...params, condenserAirflowFactor: Number(e.target.value) })}
              className="w-full accent-sky-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              {params.condenserAirflowFactor < 0.6 ? 'High Head Pressure Spikes' : 'Clean heat rejection'}
            </span>
          </div>

          {/* Compressor Valves */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-300 mb-2">
              <span>Compressor Valve Health</span>
              <span className="font-bold text-sky-400">{Math.round(params.compressorEfficiency * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={params.compressorEfficiency}
              onChange={(e) => setParams({ ...params, compressorEfficiency: Number(e.target.value) })}
              className="w-full accent-sky-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              {params.compressorEfficiency < 0.8 ? 'Internal valve blow-by' : 'Tight compression'}
            </span>
          </div>

          {/* System-Specific Sliders: RTU Economizer or Mini-Split EEV */}
          {params.systemCategory === 'rtu' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-slate-300 mb-2">
                <span>Economizer Outdoor Damper</span>
                <span className="font-bold text-purple-400">{params.economizerDamperPercent || 0}% Open</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.economizerDamperPercent || 0}
                onChange={(e) => setParams({ ...params, economizerDamperPercent: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                {params.economizerDamperPercent && params.economizerDamperPercent > 50 ? 'Excessive outdoor air load' : 'Standard economizing'}
              </span>
            </div>
          )}

          {params.systemCategory === 'mini_split' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-slate-300 mb-2">
                <span>EEV Stepper Pulses</span>
                <span className="font-bold text-sky-400">{params.eevStepPosition || 240} pulses</span>
              </div>
              <input
                type="range"
                min="30"
                max="480"
                value={params.eevStepPosition || 240}
                onChange={(e) => setParams({ ...params, eevStepPosition: Number(e.target.value) })}
                className="w-full accent-sky-500"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                {params.eevStepPosition && params.eevStepPosition < 100 ? 'Severe EEV starvation' : 'Nominal modulation'}
              </span>
            </div>
          )}

          {/* Binary Fault Toggles */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-300 block mb-2 font-bold">Safety & Contaminant Toggles</span>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={params.nonCondensables}
                  onChange={(e) => setParams({ ...params, nonCondensables: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-sky-500"
                />
                <span>Air in System (Non-Condensables)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={params.liquidLineRestriction}
                  onChange={(e) => setParams({ ...params, liquidLineRestriction: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-sky-500"
                />
                <span>Liquid Line Filter Drier Clogged</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={params.condensateFloatTripped}
                  onChange={(e) => setParams({ ...params, condensateFloatTripped: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-rose-500"
                />
                <span>Trip Condensate Safety Float Switch</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
