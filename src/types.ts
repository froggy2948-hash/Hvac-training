export type RefrigerantType = 'R-410A' | 'R-22' | 'R-134a' | 'R-454B' | 'R-404A' | 'R-448A' | 'R-32' | 'R-123' | 'R-290' | 'R-600a';

export type MeteringDeviceType = 'TXV' | 'Fixed Orifice' | 'Capillary Tube' | 'EEV (Electronic)';

export type SystemCategory =
  | 'split_ac'
  | 'heat_pump'
  | 'mini_split'
  | 'walk_in'
  | 'rtu'
  | 'chiller'
  | 'ice_machine'
  | 'geothermal'
  | 'vrf'
  | 'hydrocarbon_r290'
  | 'supermarket_rack'
  | 'transport_reefer'
  | 'crac_datacenter';

export interface SystemParameters {
  systemCategory: SystemCategory;
  refrigerant: RefrigerantType;
  meteringDevice: MeteringDeviceType;
  operationMode?: 'cooling' | 'heating' | 'defrost'; // For heat pumps
  ambientTemp: number; // Outdoor dry bulb °F
  returnAirTemp: number; // Indoor dry bulb or walk-in box temp °F
  returnAirWetBulb: number; // Indoor wet bulb °F
  chargePercent: number; // 100% is nominal
  airflowCfm: number; // Nominal CFM
  condenserAirflowFactor: number; // 0.2 to 1.0 (dirty coil / fan)
  evaporatorAirflowFactor: number; // 0.2 to 1.0 (filter / blower)
  txvOpeningFactor: number; // 0.2 to 1.8 (or EEV pulse factor)
  compressorEfficiency: number; // 0.3 to 1.0 (valves / inverter)
  nonCondensables: boolean; // Air/moisture trapped
  liquidLineRestriction: boolean; // Clogged drier / kinked line
  runCapacitorHealth: number; // 0.2 to 1.0 (for single phase)
  condenserFanOperational: boolean;
  evaporatorBlowerOperational: boolean;
  nominalTons: number;

  // System-specific specialized components
  reversingValveState?: 'cooling' | 'heating' | 'stuck_midway' | 'leaking_by';
  solenoidValveState?: 'open' | 'closed' | 'leaking_past'; // For walk-in pumpdown
  condensateFloatTripped?: boolean; // Tripped float switch breaking 24V Y
  economizerDamperPercent?: number; // 0 to 100% open (for RTUs)
  defrostHeaterStatus?: 'off' | 'on' | 'element_burned' | 'term_stuck_closed';
  eevStepPosition?: number; // 0 to 480 pulses (for mini-splits & VRF)
  inverterSpeedHz?: number; // 15 to 90 Hz (for mini-splits)
  hotGasHarvestActive?: boolean; // For ice machines
  iceMachineHarvestValveLeaking?: boolean; // Leaking hot gas valve during freeze
  waterLoopFlowGpm?: number; // For geothermal / water-source heat pumps
  waterLoopEwtTemp?: number; // Entering water temp °F
  eprValveSettingPsig?: number; // For supermarket rack evaporator pressure regulator
  hotGasDefrostActive?: boolean; // For rack & walk-in hot gas defrost
  suctionThrottlingValveOpen?: boolean; // For transport reefer pulldown
  humidifierActive?: boolean; // For CRAC data center humidity control
  hydrocarbonSafetyVentingDetected?: boolean; // R-290 flammable alert
}

export interface CycleReadings {
  // Low side
  suctionPressure: number; // psig
  evapSatTemp: number; // °F (SST)
  suctionLineTemp: number; // °F
  superheat: number; // °F
  targetSuperheat: number; // °F

  // High side
  headPressure: number; // psig
  condSatTemp: number; // °F (CST)
  liquidLineTemp: number; // °F
  subcooling: number; // °F
  targetSubcooling: number; // °F

  // Air & compressor telemetry
  dischargeLineTemp: number; // °F
  supplyAirTemp: number; // °F
  condenserDischargeTemp: number; // °F
  evaporatorDeltaT: number; // Return - Supply (°F)
  condenserDeltaT: number; // Condenser exit - Ambient (°F)
  compressorAmps: number; // Actual current draw
  ratedLoadAmps: number; // Nameplate RLA
  compressionRatio: number; // (Head + 14.7) / (Suction + 14.7)

  // System-specific specialized readings
  reversingValveDeltaT?: number; // Temp drop across reversing valve body
  eevPulseCount?: number; // Current stepper steps
  inverterOutputHz?: number; // Compressor inverter frequency
  economizerAirMixTemp?: number; // Mixed air temp entering coil (°F)
  controlCircuitVoltage: number; // 24V AC or 0V if safety open
  lineVoltage: number; // 240V / 208V AC

  // Status visualizers
  sightGlass: 'clear' | 'bubbles' | 'flashing' | 'empty';
  moistureIndicator: 'dry' | 'caution' | 'wet';
  filterDrierDeltaT: number; // Temp drop across filter drier in °F
  compressorRunning: boolean;
  compressorStatus: 'normal' | 'overload' | 'locked_rotor' | 'inefficient' | 'safety_open';
  freezingCoilRisk: boolean;
  liquidSlugRisk: boolean;
}

export type DifficultyTier = 'Apprentice' | 'Journeyman' | 'Master Tech' | 'Forensic Specialist';

export type TechnicianRank = 'Apprentice Tech' | 'Journeyman Tech' | 'Senior Lead' | 'Master HVAC/R Specialist';

export interface CareerProgress {
  rank: TechnicianRank;
  level: number;
  solvedCount: number;
  currentStreak: number;
  points: number;
}

export interface Scenario {
  id: string;
  category: SystemCategory;
  categoryLabel: string;
  title: string;
  difficulty: DifficultyTier;
  systemType: string;
  equipmentSpecs: {
    nominalTons: number;
    refrigerant: RefrigerantType;
    meteringDevice: MeteringDeviceType;
    ratedRla: number;
    ratedCapacitorUf: number;
    targetSubcooling: number;
    targetSuperheat: number;
    hasEconomizer?: boolean;
    hasReversingValve?: boolean;
    hasDefrostClock?: boolean;
    isInverter?: boolean;
  };
  customerTicket: {
    customerName: string;
    location: string;
    reportedIssue: string;
    ambientConditions: {
      outdoorTemp: number;
      indoorTemp: number;
      indoorWetBulb: number;
    };
  };
  initialState: SystemParameters;
  rootCauseId: string;
  rootCauseOptions: {
    id: string;
    label: string;
    description: string;
  }[];
  explanation: {
    summary: string;
    whyLowSide: string;
    whyHighSide: string;
    superheatSubcoolingLogic: string;
    proFieldTip: string;
  };
}

export interface EPAQuestion {
  id: number;
  section: 'core' | 'type1' | 'type2' | 'type3';
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  regulationCitation: string;
  wordingStyle?: 'direct' | 'scenario' | 'inverted' | 'regulatory' | 'equipment';
  conceptTag?: string;
}
