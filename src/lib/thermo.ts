import { RefrigerantType, SystemParameters, CycleReadings } from '../types';

// Tabulated P-T saturation points (°F to psig)
// Accurate benchmark data for standard and commercial HVAC/R refrigerants
interface PTDataPoint {
  temp: number; // °F
  r410a: number; // psig
  r22: number;
  r134a: number;
  r454b: number;
  r404a: number;
  r448a: number;
  r32: number;
  r123: number; // psig (or inches Hg vacuum when negative)
  r290: number; // Propane (Hydrocarbon A3)
  r600a: number; // Isobutane (Hydrocarbon A3)
}

export const PT_TABLE: PTDataPoint[] = [
  { temp: -40, r410a: 10.7, r22: 0.5, r134a: -14.6, r454b: 9.8, r404a: 4.3, r448a: 2.8, r32: 12.1, r123: -27.5, r290: 2.9, r600a: -24.8 },
  { temp: -30, r410a: 17.2, r22: 4.9, r134a: -9.8, r454b: 15.6, r404a: 9.8, r448a: 7.9, r32: 19.3, r123: -26.1, r290: 6.3, r600a: -22.9 },
  { temp: -20, r410a: 25.1, r22: 10.1, r134a: -3.8, r454b: 23.0, r404a: 16.3, r448a: 14.1, r32: 27.9, r123: -24.2, r290: 10.4, r600a: -20.6 },
  { temp: -10, r410a: 34.6, r22: 16.5, r134a: -0.2, r454b: 32.1, r404a: 23.9, r448a: 21.4, r32: 38.3, r123: -21.8, r290: 15.3, r600a: -17.8 },
  { temp: 0, r410a: 46.2, r22: 24.0, r134a: 6.5, r454b: 43.1, r404a: 32.8, r448a: 30.0, r32: 50.7, r123: -18.8, r290: 23.5, r600a: -14.2 },
  { temp: 10, r410a: 60.1, r22: 32.8, r134a: 12.1, r454b: 56.5, r404a: 43.3, r448a: 40.2, r32: 65.5, r123: -15.1, r290: 31.4, r600a: -10.0 },
  { temp: 20, r410a: 76.7, r22: 43.0, r134a: 18.5, r454b: 72.4, r404a: 55.4, r448a: 52.1, r32: 83.0, r123: -10.7, r290: 40.8, r600a: -5.0 },
  { temp: 25, r410a: 86.0, r22: 48.8, r134a: 22.2, r454b: 81.3, r404a: 62.1, r448a: 58.7, r32: 92.8, r123: -8.1, r290: 46.9, r600a: -2.1 },
  { temp: 30, r410a: 96.0, r22: 54.9, r134a: 26.1, r454b: 91.0, r404a: 69.3, r448a: 65.8, r32: 103.4, r123: -5.3, r290: 53.4, r600a: 0.9 },
  { temp: 32, r410a: 100.2, r22: 57.5, r134a: 27.8, r454b: 95.1, r404a: 72.3, r448a: 68.8, r32: 107.8, r123: -4.1, r290: 56.1, r600a: 2.4 },
  { temp: 35, r410a: 106.8, r22: 61.5, r134a: 30.4, r454b: 101.4, r404a: 77.0, r448a: 73.5, r32: 114.7, r123: -2.2, r290: 60.4, r600a: 4.3 },
  { temp: 40, r410a: 118.4, r22: 68.5, r134a: 35.1, r454b: 112.5, r404a: 85.3, r448a: 81.7, r32: 126.9, r123: 1.0, r290: 68.0, r600a: 7.8 },
  { temp: 45, r410a: 130.7, r22: 76.0, r134a: 40.1, r454b: 124.3, r404a: 94.2, r448a: 90.5, r32: 139.8, r123: 3.5, r290: 76.1, r600a: 11.6 },
  { temp: 50, r410a: 143.9, r22: 84.0, r134a: 45.5, r454b: 137.0, r404a: 103.7, r448a: 100.0, r32: 153.6, r123: 6.3, r290: 84.8, r600a: 15.8 },
  { temp: 55, r410a: 158.0, r22: 92.6, r134a: 51.3, r454b: 150.5, r404a: 114.0, r448a: 110.2, r32: 168.3, r123: 9.3, r290: 94.1, r600a: 20.4 },
  { temp: 60, r410a: 173.0, r22: 101.6, r134a: 57.5, r454b: 164.9, r404a: 124.9, r448a: 121.2, r32: 184.0, r123: 12.6, r290: 104.0, r600a: 25.5 },
  { temp: 70, r410a: 205.8, r22: 121.4, r134a: 71.3, r454b: 196.5, r404a: 148.9, r448a: 145.4, r32: 218.1, r123: 20.0, r290: 125.8, r600a: 36.9 },
  { temp: 80, r410a: 242.9, r22: 143.6, r134a: 86.7, r454b: 232.0, r404a: 175.7, r448a: 172.6, r32: 256.7, r123: 28.7, r290: 150.4, r600a: 50.1 },
  { temp: 90, r410a: 284.6, r22: 168.4, r134a: 104.3, r454b: 272.1, r404a: 205.6, r448a: 203.2, r32: 300.0, r123: 38.8, r290: 178.1, r600a: 65.3 },
  { temp: 100, r410a: 331.3, r22: 195.9, r134a: 124.2, r454b: 317.0, r404a: 238.9, r448a: 237.4, r32: 348.6, r123: 50.6, r290: 209.0, r600a: 82.7 },
  { temp: 105, r410a: 356.5, r22: 210.8, r134a: 135.0, r454b: 341.2, r404a: 256.7, r448a: 255.8, r32: 374.8, r123: 57.0, r290: 225.8, r600a: 92.2 },
  { temp: 110, r410a: 383.1, r22: 226.4, r134a: 146.5, r454b: 366.8, r404a: 275.5, r448a: 275.2, r32: 402.2, r123: 63.8, r290: 243.6, r600a: 102.3 },
  { temp: 115, r410a: 411.3, r22: 242.8, r134a: 158.7, r454b: 393.9, r404a: 295.3, r448a: 295.7, r32: 431.1, r123: 71.0, r290: 262.3, r600a: 113.1 },
  { temp: 120, r410a: 441.0, r22: 259.9, r134a: 171.6, r454b: 422.5, r404a: 316.1, r448a: 317.2, r32: 461.4, r123: 78.8, r290: 282.1, r600a: 124.6 },
  { temp: 125, r410a: 472.4, r22: 277.9, r134a: 185.3, r454b: 452.7, r404a: 338.1, r448a: 340.0, r32: 493.2, r123: 87.1, r290: 302.9, r600a: 136.9 },
  { temp: 130, r410a: 505.5, r22: 296.8, r134a: 199.7, r454b: 484.5, r404a: 361.2, r448a: 363.9, r32: 526.6, r123: 96.0, r290: 324.9, r600a: 149.9 },
  { temp: 140, r410a: 577.1, r22: 337.4, r134a: 231.0, r454b: 553.4, r404a: 411.0, r448a: 415.8, r32: 598.5, r123: 115.3, r290: 372.4, r600a: 178.6 },
  { temp: 150, r410a: 656.6, r22: 381.9, r134a: 265.8, r454b: 630.0, r404a: 466.1, r448a: 473.0, r32: 678.0, r123: 137.2, r290: 425.0, r600a: 211.3 },
];

function getRefKey(ref: RefrigerantType): keyof Omit<PTDataPoint, 'temp'> {
  switch (ref) {
    case 'R-410A': return 'r410a';
    case 'R-22': return 'r22';
    case 'R-134a': return 'r134a';
    case 'R-454B': return 'r454b';
    case 'R-404A': return 'r404a';
    case 'R-448A': return 'r448a';
    case 'R-32': return 'r32';
    case 'R-123': return 'r123';
    case 'R-290': return 'r290';
    case 'R-600a': return 'r600a';
  }
}


/**
 * Get Saturation Pressure (psig) for a given temperature (°F) and refrigerant
 */
export function tempToPressure(temp: number, ref: RefrigerantType): number {
  const key = getRefKey(ref);
  if (temp <= PT_TABLE[0].temp) {
    return PT_TABLE[0][key];
  }
  const last = PT_TABLE[PT_TABLE.length - 1];
  if (temp >= last.temp) {
    return last[key];
  }

  for (let i = 0; i < PT_TABLE.length - 1; i++) {
    const p1 = PT_TABLE[i];
    const p2 = PT_TABLE[i + 1];
    if (temp >= p1.temp && temp <= p2.temp) {
      const ratio = (temp - p1.temp) / (p2.temp - p1.temp);
      return Number((p1[key] + ratio * (p2[key] - p1[key])).toFixed(1));
    }
  }
  return 100;
}

/**
 * Get Saturation Temperature (°F) for a given gauge pressure (psig) and refrigerant
 */
export function pressureToTemp(pressure: number, ref: RefrigerantType): number {
  const key = getRefKey(ref);
  if (pressure <= PT_TABLE[0][key]) {
    return PT_TABLE[0].temp;
  }
  const last = PT_TABLE[PT_TABLE.length - 1];
  if (pressure >= last[key]) {
    return last.temp;
  }

  for (let i = 0; i < PT_TABLE.length - 1; i++) {
    const p1 = PT_TABLE[i];
    const p2 = PT_TABLE[i + 1];
    if (pressure >= p1[key] && pressure <= p2[key]) {
      const ratio = (pressure - p1[key]) / (p2[key] - p1[key]);
      return Number((p1.temp + ratio * (p2.temp - p1.temp)).toFixed(1));
    }
  }
  return 40;
}

/**
 * Calculate target superheat for fixed orifice systems based on indoor wet bulb & outdoor ambient
 */
export function calculateTargetSuperheat(
  indoorWetBulb: number,
  outdoorDryBulb: number,
  meteringDevice: 'TXV' | 'Fixed Orifice' | 'Capillary Tube' | 'EEV (Electronic)'
): number {
  if (meteringDevice === 'TXV' || meteringDevice === 'EEV (Electronic)') {
    return 10.0; // Modulating valves target design superheat ~8-12°F
  }
  const target = (3 * indoorWetBulb - outdoorDryBulb - 80) / 2;
  return Math.max(5, Math.min(30, Math.round(target)));
}

/**
 * Calculate comprehensive refrigeration cycle physics and instrument telemetry
 */
export function calculateCycleReadings(params: SystemParameters): CycleReadings {
  const {
    systemCategory,
    refrigerant,
    meteringDevice,
    operationMode = 'cooling',
    ambientTemp,
    returnAirTemp,
    returnAirWetBulb,
    chargePercent,
    condenserAirflowFactor,
    evaporatorAirflowFactor,
    txvOpeningFactor,
    compressorEfficiency,
    nonCondensables,
    liquidLineRestriction,
    runCapacitorHealth,
    condenserFanOperational,
    evaporatorBlowerOperational,
    nominalTons,
    reversingValveState = 'cooling',
    solenoidValveState = 'open',
    condensateFloatTripped = false,
    economizerDamperPercent = 0,
    eevStepPosition = 240,
    inverterSpeedHz = 60,
  } = params;

  const ratedLoadAmps = nominalTons * 4.6; // ~13.8A for 3 ton
  let compressorRunning = true;
  let compressorStatus: CycleReadings['compressorStatus'] = 'normal';
  let controlCircuitVoltage = 24.0;
  const lineVoltage = 240.0;

  // 1. Safety cutouts & start checks
  if (condensateFloatTripped) {
    // Float switch broke 24V control circuit
    controlCircuitVoltage = 0.0;
    compressorRunning = false;
    compressorStatus = 'safety_open';
  } else if (solenoidValveState === 'closed') {
    // Walk-in pumpdown: solenoid closed -> low pressure switch cuts compressor off
    compressorRunning = false;
    compressorStatus = 'safety_open';
  } else if (runCapacitorHealth < 0.45 && systemCategory !== 'mini_split') {
    // Single-phase start winding stall
    compressorRunning = false;
    compressorStatus = 'locked_rotor';
  } else if (!condenserFanOperational && ambientTemp > 75) {
    compressorStatus = 'overload';
  }

  // 2. Air mixing (RTU Economizer)
  let effectiveReturnAir = returnAirTemp;
  let economizerAirMixTemp = returnAirTemp;
  if (systemCategory === 'rtu' && economizerDamperPercent > 0) {
    // Mixed air formula: T_mix = (%OA * T_OA) + (%RA * T_RA)
    const oaFraction = economizerDamperPercent / 100;
    economizerAirMixTemp = Number((oaFraction * ambientTemp + (1 - oaFraction) * returnAirTemp).toFixed(1));
    effectiveReturnAir = economizerAirMixTemp;
  }

  // 3. Heat Pump Reversing Valve Logic
  const isHeatingMode = systemCategory === 'heat_pump' && operationMode === 'heating';
  const isValveLeaking = reversingValveState === 'leaking_by';
  const isValveStuckMidway = reversingValveState === 'stuck_midway';

  // 4. CONDENSER / HIGH SIDE PHYSICS
  let nominalCtd = systemCategory === 'walk_in' ? 22 :
                   systemCategory === 'supermarket_rack' ? 25 :
                   systemCategory === 'hydrocarbon_r290' ? 20 :
                   systemCategory === 'ice_machine' ? 24 :
                   systemCategory === 'geothermal' ? 12 : 18;

  // Geothermal water flow check
  if (systemCategory === 'geothermal') {
    const gpm = params.waterLoopFlowGpm ?? 3.0; // 3.0 GPM/ton nominal
    if (gpm < 1.5) nominalCtd += 35; // Severe water loop restriction / fouled coaxial coil
    else if (gpm < 2.2) nominalCtd += 18;
  }

  if (!condenserFanOperational) nominalCtd = 65;
  else if (condenserAirflowFactor < 0.6) nominalCtd = nominalCtd + (1 - condenserAirflowFactor) * 45;

  const chargeDelta = (chargePercent - 100) / 100;
  const chargeCtdOffset = chargeDelta > 0 ? chargeDelta * 22 : chargeDelta * 14;
  const pumpLossCtd = (1 - compressorEfficiency) * -16;
  const nonCondensableOffset = nonCondensables ? 28 : 0;

  let highSideBaseTemp = isHeatingMode ? effectiveReturnAir : ambientTemp;
  if (systemCategory === 'geothermal' && params.waterLoopEwtTemp) {
    highSideBaseTemp = params.waterLoopEwtTemp;
  }

  let calculatedCst = highSideBaseTemp + nominalCtd + chargeCtdOffset + pumpLossCtd + nonCondensableOffset;

  if (isValveLeaking || isValveStuckMidway) {
    calculatedCst -= 18; // Discharge gas shorts into suction line
  }

  if (params.hotGasHarvestActive || params.iceMachineHarvestValveLeaking) {
    calculatedCst -= 15; // Hot gas bypassed to evaporator reduces condensing load
  }

  if (!compressorRunning) {
    calculatedCst = ambientTemp; // Equalized
  }

  // Subcooling
  let subcooling = 11.0;
  if (chargePercent < 75) {
    subcooling = Math.max(0.5, 11 + chargeDelta * 25);
  } else if (chargePercent > 105) {
    subcooling = 11 + chargeDelta * 28;
  }
  if (liquidLineRestriction) {
    subcooling += 8.5; // Backed up liquid in condenser
  }
  if (compressorEfficiency < 0.8 || isValveLeaking) {
    subcooling = Math.max(1.5, subcooling - 6);
  }

  subcooling = Math.max(0, Number(subcooling.toFixed(1)));
  const liquidLineTemp = Number((calculatedCst - subcooling).toFixed(1));
  const headPressure = Number(tempToPressure(calculatedCst, refrigerant).toFixed(1));

  // 5. EVAPORATOR / LOW SIDE PHYSICS
  let nominalEvapSplit = systemCategory === 'walk_in' ? 15 :
                         systemCategory === 'ice_machine' ? 28 :
                         systemCategory === 'supermarket_rack' ? 14 :
                         systemCategory === 'crac_datacenter' ? 18 : 35;
  let lowSideBaseTemp = isHeatingMode ? ambientTemp : effectiveReturnAir;
  let baseSst = lowSideBaseTemp - nominalEvapSplit;

  if (!evaporatorBlowerOperational) {
    baseSst -= 24;
  } else if (evaporatorAirflowFactor < 0.8) {
    baseSst -= (1 - evaporatorAirflowFactor) * 22;
  }

  baseSst += chargeDelta * 16;

  if (liquidLineRestriction) {
    baseSst -= 18;
  }

  // Metering & EEV factors
  let effectiveMeteringFactor = txvOpeningFactor;
  if (meteringDevice === 'EEV (Electronic)') {
    effectiveMeteringFactor = eevStepPosition / 240; // 240 is nominal midpoint
  }

  if (effectiveMeteringFactor < 0.7) {
    baseSst -= (1 - effectiveMeteringFactor) * 28;
  } else if (effectiveMeteringFactor > 1.3) {
    baseSst += (effectiveMeteringFactor - 1) * 14;
  }

  if (compressorEfficiency < 0.85 || isValveLeaking) {
    baseSst += 24; // Discharge gas leak raises suction pressure
    compressorStatus = 'inefficient';
  }

  // Walk-in pumpdown solenoid closed with leak past
  if (solenoidValveState === 'leaking_past') {
    baseSst += 12; // Creeps suction up, causing short cycle
  }

  // Ice machine hot gas bypass leak during freeze cycle
  if (params.iceMachineHarvestValveLeaking) {
    baseSst += 22; // Hot gas bleeding into evaporator prevents ice freeze
  } else if (params.hotGasHarvestActive) {
    baseSst += 35; // Active harvest thaw
  }

  let calculatedSst = Math.max(systemCategory === 'walk_in' ? -35 : 10, Math.min(65, baseSst));
  if (!compressorRunning) {
    calculatedSst = ambientTemp; // Equalized
  }

  const suctionPressure = Number(tempToPressure(calculatedSst, refrigerant).toFixed(1));

  // 6. SUPERHEAT CALCULATION
  const targetSuperheat = calculateTargetSuperheat(returnAirWetBulb, ambientTemp, meteringDevice);
  let superheat = targetSuperheat;

  if (effectiveMeteringFactor < 0.8) {
    superheat += (1 - effectiveMeteringFactor) * 35;
  } else if (effectiveMeteringFactor > 1.2) {
    superheat = Math.max(1.5, targetSuperheat - (effectiveMeteringFactor - 1) * 15);
  }

  if (chargePercent < 85) {
    superheat += (85 - chargePercent) * 0.8;
  } else if (chargePercent > 120) {
    superheat = Math.max(2.5, targetSuperheat - 4);
  }

  if (liquidLineRestriction) {
    superheat += 22;
  }

  if (evaporatorAirflowFactor < 0.6 || !evaporatorBlowerOperational) {
    superheat = Math.max(2, superheat - 10);
  }

  if (isValveLeaking) {
    superheat += 20; // Superheated discharge vapor entering suction tube
  }

  superheat = Math.max(1.0, Number(superheat.toFixed(1)));
  const suctionLineTemp = Number((calculatedSst + superheat).toFixed(1));

  // 7. COMPRESSOR & DISCHARGE TELEMETRY
  const compressionRatio = Number(((headPressure + 14.7) / (Math.max(1, suctionPressure) + 14.7)).toFixed(2));
  let dischargeLineTemp = calculatedCst + superheat * 1.1 + compressionRatio * 8;
  if (nonCondensables) dischargeLineTemp += 25;
  if (compressorEfficiency < 0.85 || isValveLeaking) dischargeLineTemp += 32;
  dischargeLineTemp = Math.round(dischargeLineTemp);

  // Amperage
  let ampRatio = (headPressure / tempToPressure(ambientTemp + 18, refrigerant)) * 0.6 +
                 (suctionPressure / tempToPressure(40, refrigerant)) * 0.4;

  if (systemCategory === 'mini_split') {
    ampRatio *= (inverterSpeedHz / 60); // Inverter frequency scaling
  }

  if (compressorEfficiency < 0.85 || isValveLeaking) {
    ampRatio *= 0.72; // Doing less pumping work
  }
  if (chargePercent < 80) ampRatio *= 0.78;
  if (!condenserFanOperational || condenserAirflowFactor < 0.5) ampRatio *= 1.35;

  let compressorAmps = Number((ratedLoadAmps * Math.max(0.3, ampRatio)).toFixed(1));
  if (!compressorRunning) {
    compressorAmps = compressorStatus === 'locked_rotor' ? ratedLoadAmps * 4.5 : 0;
  }

  // 8. AIR TEMPERATURES & DELTA T
  let evaporatorDeltaT = systemCategory === 'walk_in' ? 10 : 20;
  if (isHeatingMode) evaporatorDeltaT = 25; // Heat pump heating split
  if (evaporatorAirflowFactor < 0.7) evaporatorDeltaT = 26;
  if (chargePercent < 80) evaporatorDeltaT = Math.max(4, 20 - (80 - chargePercent) * 0.5);
  if (liquidLineRestriction || isValveLeaking) evaporatorDeltaT = 5;
  if (!compressorRunning) evaporatorDeltaT = 0;

  const supplyAirTemp = Number((isHeatingMode ? effectiveReturnAir + evaporatorDeltaT : effectiveReturnAir - evaporatorDeltaT).toFixed(1));
  const condenserDeltaT = Number((calculatedCst - ambientTemp + 4).toFixed(1));
  const condenserDischargeTemp = Number((ambientTemp + condenserDeltaT).toFixed(1));

  // 9. SIGHT GLASS & ACCESSORIES
  let sightGlass: CycleReadings['sightGlass'] = 'clear';
  if (!compressorRunning) sightGlass = 'empty';
  else if (subcooling < 3.5 || chargePercent < 82) sightGlass = 'bubbles';
  else if (chargePercent < 60) sightGlass = 'flashing';

  const moistureIndicator: CycleReadings['moistureIndicator'] = nonCondensables ? 'caution' : 'dry';
  const filterDrierDeltaT = liquidLineRestriction ? 7.5 : 0.8;
  const reversingValveDeltaT = isValveLeaking ? 18.5 : 2.0;

  return {
    suctionPressure,
    evapSatTemp: calculatedSst,
    suctionLineTemp,
    superheat,
    targetSuperheat,

    headPressure,
    condSatTemp: calculatedCst,
    liquidLineTemp,
    subcooling,
    targetSubcooling: 11.0,

    dischargeLineTemp,
    supplyAirTemp,
    condenserDischargeTemp,
    evaporatorDeltaT,
    condenserDeltaT,
    compressorAmps,
    ratedLoadAmps,
    compressionRatio,

    reversingValveDeltaT,
    eevPulseCount: eevStepPosition,
    inverterOutputHz: inverterSpeedHz,
    economizerAirMixTemp,
    controlCircuitVoltage,
    lineVoltage,

    sightGlass,
    moistureIndicator,
    filterDrierDeltaT,
    compressorRunning,
    compressorStatus,
    freezingCoilRisk: calculatedSst < 32 && compressorRunning && systemCategory !== 'walk_in',
    liquidSlugRisk: superheat < 3.5 && compressorRunning,
  };
}
