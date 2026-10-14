import { Scenario, DifficultyTier, SystemCategory, RefrigerantType, MeteringDeviceType } from '../types';

interface FaultArchetype {
  id: string;
  category: SystemCategory;
  categoryLabel: string;
  difficulty: DifficultyTier;
  titleTemplates: string[];
  complaintTemplates: string[];
  refrigerant: RefrigerantType;
  meteringDevice: MeteringDeviceType;
  nominalTons: number;
  setupParams: (ambient: number, returnAir: number) => Record<string, unknown>;
  rootCauseLabel: string;
  rootCauseDescription: string;
  distractors: { id: string; label: string; description: string }[];
  explanation: {
    summary: string;
    whyLowSide: string;
    whyHighSide: string;
    superheatSubcoolingLogic: string;
    proFieldTip: string;
  };
}

const FAULT_ARCHETYPES: FaultArchetype[] = [
  // ================= LEVEL 1: APPRENTICE =================
  {
    id: 'undercharge_leak',
    category: 'split_ac',
    categoryLabel: 'Residential Split AC',
    difficulty: 'Apprentice',
    titleTemplates: [
      'The Slow Flare Nut Refrigerant Leak',
      'Leaking Service Port Schrader Core',
      'Pinhole Copper Rubout in Liquid Line',
    ],
    complaintTemplates: [
      'AC runs non-stop all day. Supply air feels lukewarm, and house temperature crept up to 78°F while set to 70°F.',
      'Unit used to cool well last month, but now takes 6 hours to drop 2 degrees. Electric bill doubled.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 3.0,
    setupParams: () => ({
      chargePercent: 68,
      condenserAirflowFactor: 1.0,
      evaporatorAirflowFactor: 1.0,
      txvOpeningFactor: 1.0,
      compressorEfficiency: 1.0,
    }),
    rootCauseLabel: 'Refrigerant Undercharge (Active Leak)',
    rootCauseDescription: 'Low suction, low head pressure, elevated superheat, near-zero subcooling.',
    distractors: [
      { id: 'dirty_filter', label: 'Restricted Air Filter', description: 'Low airflow across evaporator coil.' },
      { id: 'txv_stuck_open', label: 'TXV Stuck Open / Flooding', description: 'Overfeeding refrigerant into evaporator.' },
      { id: 'bad_compressor_valves', label: 'Inefficient Compressor Valves', description: 'Internal discharge reed bypass.' },
    ],
    explanation: {
      summary: 'The system has lost substantial refrigerant mass through a slow mechanical flare nut or schrader core leak.',
      whyLowSide: 'With lower refrigerant density, the evaporator coil is starved. Liquid boils off in the first passes, resulting in low suction pressure and HIGH SUPERHEAT as vapor sensible heat increases.',
      whyHighSide: 'Insufficient liquid backs up in the condenser tubes to create a liquid seal, dropping head pressure and reducing SUBCOOLING to near 0°F.',
      superheatSubcoolingLogic: 'Low Suction + Low Head + High Superheat + Low Subcooling is the diagnostic signature of an UNDERCHARGED circuit.',
      proFieldTip: 'Always sweep with an electronic halogen sniffer or ultrasonic leak detector before charging gas. The EPA requires leak repair for significant charges!',
    },
  },
  {
    id: 'dirty_air_filter',
    category: 'split_ac',
    categoryLabel: 'Residential Split AC',
    difficulty: 'Apprentice',
    titleTemplates: [
      'The Matted 1-Inch Pleated Filter Freeze',
      'Pet Dander Choked Return Grille',
      'Collapsed High-MERV Filter Starvation',
    ],
    complaintTemplates: [
      'Airflow out of registers is a mere trickle. Ice is coating the copper suction line outside, and water is overflowing the indoor drip pan.',
      'Customer came home to a frozen copper pipe near the air handler. Air coming out of vents is barely blowing.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 3.0,
    setupParams: () => ({
      chargePercent: 100,
      evaporatorAirflowFactor: 0.35,
      airflowCfm: 450,
      condenserAirflowFactor: 1.0,
    }),
    rootCauseLabel: 'Severe Indoor Airflow Restriction (Dirty Filter)',
    rootCauseDescription: 'Airflow choked across evaporator, dropping saturation temperature below 32°F and icing coil.',
    distractors: [
      { id: 'undercharge', label: 'Refrigerant Undercharge', description: 'Low refrigerant charge.' },
      { id: 'overcharge', label: 'Refrigerant Overcharge', description: 'Excess liquid in condenser.' },
      { id: 'blown_capacitor', label: 'Blown Dual-Run Capacitor', description: 'Motor run winding phase shift lost.' },
    ],
    explanation: {
      summary: 'Heavily clogged filter media reduced CFM airflow by over 60%, removing the indoor heat load needed to vaporize refrigerant.',
      whyLowSide: 'Without sensible heat from indoor air, refrigerant cannot boil. Evaporator saturation temperature (SST) plummets below 32°F, freezing moisture onto the fins.',
      whyHighSide: 'Less total heat is absorbed indoors, so less heat is rejected outside; head pressure drops below nominal.',
      superheatSubcoolingLogic: 'Low Suction + Low Superheat + Low Head Pressure is the classic signature of LOW EVAPORATOR AIRFLOW.',
      proFieldTip: 'Never add refrigerant to a system with a frozen coil! Completely defrost the coil and verify static pressure with a clean filter first.',
    },
  },
  {
    id: 'cottonwood_condenser',
    category: 'split_ac',
    categoryLabel: 'Residential Split AC',
    difficulty: 'Apprentice',
    titleTemplates: [
      'The Cottonwood Seed Blanket on Condenser',
      'Grass Clipping Impacted Outdoor Coil',
      'Dryer Vent Lint Suffocated Condenser',
    ],
    complaintTemplates: [
      'Outdoor unit is screaming loudly and cycling off every 10 minutes. Air blown out top of fan feels lukewarm rather than hot.',
      'AC tripped the outdoor 30A circuit breaker on a hot afternoon. Outdoor condenser fins are gray and furred.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 3.5,
    setupParams: () => ({
      chargePercent: 100,
      condenserAirflowFactor: 0.35,
      evaporatorAirflowFactor: 1.0,
    }),
    rootCauseLabel: 'Severely Fouled Outdoor Condenser Coil',
    rootCauseDescription: 'Debris blocking outdoor heat rejection, driving head pressure into thermal overload limits.',
    distractors: [
      { id: 'overcharge', label: 'Overcharged Refrigerant', description: 'Excess refrigerant stacked in condenser.' },
      { id: 'bad_expansion_valve', label: 'Restricted Expansion Valve', description: 'Orifice plugged.' },
      { id: 'undercharge', label: 'Refrigerant Leak', description: 'Low mass in circuit.' },
    ],
    explanation: {
      summary: 'Cottonwood or grass clippings blanketed the coil fins, preventing outdoor airflow from absorbing the heat of compression and indoor load.',
      whyLowSide: 'High head pressure forces excess refrigerant through the metering device, raising suction pressure slightly above nominal.',
      whyHighSide: 'The condenser cannot reject heat. Condensing temperature difference (CTD) spikes to 45°F+ above ambient, driving head pressure through the roof and causing high amp draw.',
      superheatSubcoolingLogic: 'Very High Head Pressure + High Suction Pressure + High Amps indicates a DIRTY CONDENSER COIL.',
      proFieldTip: 'Always wash the condenser from the inside out with an approved foaming coil cleaner so dirt is pushed out of the fins rather than deeper into the coil!',
    },
  },
  {
    id: 'blown_run_capacitor',
    category: 'split_ac',
    categoryLabel: 'Residential Split AC',
    difficulty: 'Apprentice',
    titleTemplates: [
      'The Bulged Dual-Run Capacitor Can',
      'Degraded Run Capacitor (15µF on 45µF Rating)',
      'Blown Compressor Start Winding Phase Cap',
    ],
    complaintTemplates: [
      'Thermostat is calling for cool. Outdoor fan spins, but compressor makes a deep 5-second electric hum followed by a metallic click and stays dead.',
      'Unit hums loudly every 2 minutes outdoors. No cooling inside.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 3.0,
    setupParams: () => ({
      chargePercent: 100,
      runCapacitorHealth: 0.35, // 16µF on 45µF
    }),
    rootCauseLabel: 'Degraded Dual-Run Capacitor (Below ±6% Spec)',
    rootCauseDescription: 'Capacitance dropped below starting torque requirement; compressor stalls and trips on internal overload.',
    distractors: [
      { id: 'locked_compressor', label: 'Mechanically Seized Compressor', description: 'Internal mechanical seizure.' },
      { id: 'burned_contactor', label: 'Burned Contactor Points', description: 'Contactor failing to pass 240V.' },
      { id: 'low_charge', label: 'Low Pressure Cutout Open', description: 'Safety switch tripped.' },
    ],
    explanation: {
      summary: 'The hermetic capacitor dielectric broke down, dropping capacitance from 45µF down to 16µF, failing to create the necessary phase shift on the auxiliary start winding.',
      whyLowSide: 'Because the compressor cannot rotate, pressures remain completely equalized at resting ambient saturation.',
      whyHighSide: 'Compressor pulls locked-rotor amps (LRA ~65A) for a few seconds until the internal thermal overload disk clicks open.',
      superheatSubcoolingLogic: 'Zero pressure differential + compressor humming and pulling LRA + capacitor measuring below nameplate confirms a FAILED RUN CAPACITOR.',
      proFieldTip: 'Always discharge capacitors with a bleeder resistor before testing with a meter set to µF/MFD. Test both HERM-to-C and FAN-to-C terminals.',
    },
  },

  // ================= LEVEL 2: JOURNEYMAN =================
  {
    id: 'txv_stuck_closed',
    category: 'split_ac',
    categoryLabel: 'Residential Split AC',
    difficulty: 'Journeyman',
    titleTemplates: [
      'TXV Sensing Bulb Lost Charge / Starved Evaporator',
      'Cracked Capillary Tube on TXV Power Element',
      'Loose Sensing Bulb Hanging in Return Air',
    ],
    complaintTemplates: [
      'AC is blowing 75°F air. Outdoor liquid line is cool, suction line at compressor is warm, and indoor evaporator is starved of cold gas.',
      'Office unit running constantly. Technician reports low suction pressure and warm suction line.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 3.5,
    setupParams: () => ({
      chargePercent: 100,
      txvOpeningFactor: 0.28,
    }),
    rootCauseLabel: 'TXV Sensing Bulb Lost Charge / Metering Device Stuck Closed',
    rootCauseDescription: 'Metering orifice throttled shut, severely starving evaporator while backing up liquid in condenser.',
    distractors: [
      { id: 'undercharge', label: 'Refrigerant Undercharge', description: 'System low on gas.' },
      { id: 'dirty_condenser', label: 'Dirty Condenser Coil', description: 'Poor outdoor heat rejection.' },
      { id: 'inefficient_compressor', label: 'Worn Compressor Reeds', description: 'Internal cylinder bypass.' },
    ],
    explanation: {
      summary: 'The TXV power element capillary tube cracked and lost its internal gas charge, allowing internal spring pressure to push the pin shut.',
      whyLowSide: 'With the metering orifice nearly closed, barely any refrigerant enters the coil. Suction pressure drops drastically and the trickle of vapor superheats rapidly to ambient temperature, yielding VERY HIGH SUPERHEAT.',
      whyHighSide: 'Liquid backs up upstream in the condenser coils, shedding heat to ambient air and yielding HIGH SUBCOOLING (16°F+) despite low or normal head pressure.',
      superheatSubcoolingLogic: 'Low Suction Pressure + High Superheat + High Subcooling separates a RESTRICTED TXV from an undercharge (which has low subcooling).',
      proFieldTip: 'Hold the sensing bulb in your warm palm or in hot water. If suction pressure does not immediately climb, the power head charge is lost and the TXV must be replaced.',
    },
  },
  {
    id: 'restricted_filter_drier',
    category: 'split_ac',
    categoryLabel: 'Residential Split AC',
    difficulty: 'Journeyman',
    titleTemplates: [
      'Clogged Liquid Line Filter Drier Restriction',
      'Sweating Liquid Line Filter Drier Body',
      'Desiccant Breakdown & Line Flashing',
    ],
    complaintTemplates: [
      'Weak cooling after a compressor replacement. The copper liquid line after the filter drier is cold to the touch and covered in condensation.',
      'Technician noticed the filter drier feels warm on the inlet side and noticeably cold on the outlet side.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 3.0,
    setupParams: () => ({
      chargePercent: 100,
      liquidLineRestriction: true,
    }),
    rootCauseLabel: 'Restricted Liquid Line Filter Drier',
    rootCauseDescription: 'Debris or flux clogged the desiccant block, causing an unplanned pressure drop and premature refrigerant flashing.',
    distractors: [
      { id: 'undercharge', label: 'Refrigerant Undercharge', description: 'Low refrigerant charge.' },
      { id: 'dirty_filter', label: 'Dirty Air Filter', description: 'Restricted indoor airflow.' },
      { id: 'bad_capacitor', label: 'Weak Run Capacitor', description: 'Capacitance out of spec.' },
    ],
    explanation: {
      summary: 'Brazing oxides or desiccant particles clogged the filter drier core, creating a severe pressure drop across the body that acts like a secondary expansion valve.',
      whyLowSide: 'The restriction starves the TXV of a solid column of liquid, causing low suction pressure and high superheat.',
      whyHighSide: 'Refrigerant backs up upstream in the condenser, raising subcooling ahead of the drier. Measuring inlet vs outlet reveals a 7.5°F temperature drop (nominal is < 1°F)!',
      superheatSubcoolingLogic: 'Temperature drop across filter drier > 3°F + High Superheat confirms a LIQUID LINE RESTRICTION.',
      proFieldTip: 'Always clamp thermocouples across the filter drier! Any drop over 2-3°F indicates the drier is restricted and must be cut out and replaced.',
    },
  },
  {
    id: 'reversing_valve_leak',
    category: 'heat_pump',
    categoryLabel: 'Air-Source Heat Pump',
    difficulty: 'Journeyman',
    titleTemplates: [
      '4-Way Reversing Valve Internal Blow-By Bypass',
      'Heat Pump Stuck in Lukewarm Output',
      'Worn Reversing Valve Slider Seal',
    ],
    complaintTemplates: [
      'Heat pump runs in heating mode, but supply register air is only 76°F on a 42°F morning. Electric heat strips had to turn on to keep house warm.',
      'Customer states heat pump blows lukewarm air in heating and barely cools in summer.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 3.5,
    setupParams: () => ({
      chargePercent: 100,
      operationMode: 'heating',
      reversingValveState: 'leaking_by',
    }),
    rootCauseLabel: '4-Way Reversing Valve Internal Blow-By',
    rootCauseDescription: 'Internal Teflon slider failed to seat, leaking hot discharge vapor directly into suction return.',
    distractors: [
      { id: 'low_charge', label: 'Undercharged Heat Pump', description: 'Low refrigerant charge.' },
      { id: 'bad_outdoor_txv', label: 'Outdoor Heating TXV Restricted', description: 'Heating expansion device starved.' },
      { id: 'burned_aux_heat', label: 'Burned Aux Electric Heat Strips', description: 'Open heater elements.' },
    ],
    explanation: {
      summary: 'The 4-way reversing valve internal slide mechanism failed to seat tightly. Hot discharge vapor bypasses directly into the suction return pipe.',
      whyLowSide: 'Hot discharge vapor shorts into the low side, driving suction pressure higher than normal and elevating suction line temperature.',
      whyHighSide: 'The compressor cannot build high condensing pressure in the indoor coil, severely degrading heating capacity.',
      superheatSubcoolingLogic: 'High Suction P + Low Head P + Reversing valve body temperature delta > 5°F confirms REVERSING VALVE INTERNAL BLOW-BY.',
      proFieldTip: 'Perform the 4-pipe touch test! Feel the top discharge tube (hot) and bottom center suction tube (should be cold). If the bottom suction tube heats up near discharge temperature, the valve is bypassing.',
    },
  },
  {
    id: 'walk_in_defrost_termination',
    category: 'walk_in',
    categoryLabel: 'Commercial Walk-In Refrigeration',
    difficulty: 'Journeyman',
    titleTemplates: [
      'Defrost Termination Klixon Stuck Closed',
      'Freezer Steaming Up After Defrost Cycle',
      'Failed Bimetal DTFD Thermostat',
    ],
    complaintTemplates: [
      'Ice crystals and white fog covering all boxes in walk-in freezer. Water dripping from ceiling after defrost cycle.',
      'Evaporator casing is scalding hot after defrost and temperature took 2 hours to recover.',
    ],
    refrigerant: 'R-404A',
    meteringDevice: 'TXV',
    nominalTons: 2.5,
    setupParams: () => ({
      chargePercent: 100,
      defrostHeaterStatus: 'term_stuck_closed',
    }),
    rootCauseLabel: 'Defrost Termination / Fan Delay Switch Failed Closed',
    rootCauseDescription: 'Bimetal Klixon failed to terminate heaters at 55°F, baking evaporator until timer failsafe.',
    distractors: [
      { id: 'burned_heaters', label: 'Burned Electric Heaters', description: 'Open heater element.' },
      { id: 'bad_txv', label: 'TXV Sensing Bulb Failure', description: 'Starved evaporator.' },
      { id: 'low_charge', label: 'Low Refrigerant Charge', description: 'Refrigerant leak.' },
    ],
    explanation: {
      summary: 'The Defrost Termination Thermostat (Klixon mounted on evaporator coil return bend) failed closed, allowing 8kW electric heaters to run for the full 45-minute failsafe timer, boiling meltwater into steam.',
      whyLowSide: 'The evaporator coil heats up excessively, heating the entire cold room.',
      whyHighSide: 'When cooling resumes, the compressor faces extreme thermal suction load.',
      superheatSubcoolingLogic: 'Electric heaters remaining energized past 55°F coil temperature confirms DEFECTIVE DEFROST TERMINATION THERMOSTAT.',
      proFieldTip: 'Test the DTFD switch: it should open on temperature rise at 55°F to de-energize the X terminal on the time clock, and close on temperature fall (25°F) for fan delay.',
    },
  },

  // ================= LEVEL 3: MASTER TECH =================
  {
    id: 'inefficient_compressor',
    category: 'split_ac',
    categoryLabel: 'Residential Split AC',
    difficulty: 'Master Tech',
    titleTemplates: [
      'Blown Compressor Discharge Reeds / Blow-By',
      'Worn Internal Compressor Cylinder Valves',
      'Internal High-to-Low Pressure Bypass',
    ],
    complaintTemplates: [
      'AC runs non-stop. Compressor is hot to the touch, but temperature split across evaporator is only 4°F. A prior tech added refrigerant with zero improvement.',
      'Older rooftop compressor runs continuously with low amp draw and poor temperature differential.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 4.0,
    setupParams: () => ({
      chargePercent: 100,
      compressorEfficiency: 0.45,
    }),
    rootCauseLabel: 'Inefficient Compressor (Blown Discharge Valves)',
    rootCauseDescription: 'Internal valve bypass; compressor cannot build pressure differential between high and low sides.',
    distractors: [
      { id: 'undercharge', label: 'Refrigerant Undercharge', description: 'Insufficient refrigerant mass.' },
      { id: 'txv_stuck_open', label: 'TXV Stuck Open', description: 'Overfeeding liquid into evaporator.' },
      { id: 'dirty_evaporator', label: 'Plugged Evaporator Coil', description: 'Airflow restriction.' },
    ],
    explanation: {
      summary: 'The compressor internal discharge reed valves or scroll wraps are damaged, allowing hot discharge vapor to leak backward into the suction chamber during each compression stroke.',
      whyLowSide: 'Discharge vapor leaking back into suction keeps suction pressure abnormally high.',
      whyHighSide: 'The compressor cannot pump gas effectively into the high side, so head pressure is abnormally low. Compression ratio collapses.',
      superheatSubcoolingLogic: 'High Suction P + Low Head P + Very Low Compressor Amp Draw + Low Delta-T is the textbook fingerprint of INEFFICIENT COMPRESSOR VALVES.',
      proFieldTip: 'Perform a pump-down test by front-seating the liquid service valve. If the compressor cannot pull the low side into a deep vacuum or suction quickly climbs after shutoff, valves have failed.',
    },
  },
  {
    id: 'non_condensables',
    category: 'split_ac',
    categoryLabel: 'Residential Split AC',
    difficulty: 'Master Tech',
    titleTemplates: [
      'Non-Condensables Trapped in High Side (Air & Moisture)',
      'Unpurged Service Hoses Contamination',
      'Dalton\'s Law Partial Pressure Infiltration',
    ],
    complaintTemplates: [
      'High head pressure alarms sounding. High-side gauge needle is fluttering erratically, and sight glass moisture indicator has turned yellow.',
      'Unit was serviced yesterday by another company. Now compressor runs extremely hot and discharge pressure is dangerously elevated.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 3.5,
    setupParams: () => ({
      chargePercent: 100,
      nonCondensables: true,
    }),
    rootCauseLabel: 'Non-Condensables (Air and Moisture Trapped in Circuit)',
    rootCauseDescription: 'Air trapped in condenser elevates total pressure via Dalton\'s Law, causing needle flutter and high discharge temp.',
    distractors: [
      { id: 'overcharge', label: 'Refrigerant Overcharge', description: 'Excess liquid refrigerant.' },
      { id: 'dirty_condenser', label: 'Dirty Condenser Coil', description: 'Restricted outdoor heat rejection.' },
      { id: 'bad_txv', label: 'Defective TXV', description: 'Stuck metering valve.' },
    ],
    explanation: {
      summary: 'Air and atmospheric moisture entered the system when hoses were connected without purging. According to Dalton\'s Law, total head pressure is refrigerant saturation pressure PLUS the air pressure.',
      whyLowSide: 'Low-side suction pressure is relatively normal, but superheat is slightly elevated due to high compression heat.',
      whyHighSide: 'Air cannot condense at normal refrigeration pressures; it blankets the condenser top, skyrocketing head pressure and fluttering the gauge needle.',
      superheatSubcoolingLogic: 'Very High Head Pressure + Fluttering Gauge Needles + Normal/High Subcooling + Yellow Moisture Indicator confirms NON-CONDENSABLES.',
      proFieldTip: 'Equalization Test: Turn the unit off and let it equalize with outdoor temperature. If gauge pressure reads higher than P-T saturation for the ambient temperature, air is present! Must recover, evacuate to 500 microns, and recharge.',
    },
  },
  {
    id: 'rtu_economizer_stuck_open',
    category: 'rtu',
    categoryLabel: 'Packaged Rooftop Unit (RTU)',
    difficulty: 'Master Tech',
    titleTemplates: [
      'Economizer Outdoor Damper Stuck 100% Open',
      'Stripped Economizer Actuator Gear Drive',
      'Seized Outdoor Air Damper Linkage',
    ],
    complaintTemplates: [
      'Retail store is 82°F on a sweltering 96°F afternoon. Both rooftop compressors are running non-stop, but supply air temperature off diffusers is 78°F.',
      'High indoor temperature and humidity in commercial space. Mixed air entering coil is blazing hot.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 7.5,
    setupParams: () => ({
      chargePercent: 100,
      economizerDamperPercent: 100,
    }),
    rootCauseLabel: 'Economizer Outdoor Air Damper Stuck 100% Open',
    rootCauseDescription: 'Actuator stripped gears, pulling 96°F outdoor air straight into the evaporator and overwhelming cooling capacity.',
    distractors: [
      { id: 'dual_undercharge', label: 'Dual Refrigeration Circuits Low on Gas', description: 'Loss of charge.' },
      { id: 'dirty_condenser', label: 'Dirty Condenser Coils', description: 'Outdoor fin restriction.' },
      { id: 'broken_blower_belt', label: 'Broken Blower Belt', description: 'No airflow across coil.' },
    ],
    explanation: {
      summary: 'The economizer outdoor damper actuator stripped its gears and jammed 100% open, pulling in 96°F outdoor air instead of 76°F return air, completely overwhelming the 7.5-ton system.',
      whyLowSide: 'Entering mixed air temperature is 96°F instead of 76°F, spiking suction pressure and evaporator saturation temp.',
      whyHighSide: 'Extreme heat load elevates head pressure and compressor amperage.',
      superheatSubcoolingLogic: 'High Suction P + High Head P + Mixed air temperature equal to outdoor ambient confirms an ECONOMIZER DAMPER STUCK OPEN.',
      proFieldTip: 'Inspect the Honeywell/Belimo actuator! Check 0-10V DC control signal and verify damper returns to minimum position (typically 10-15% for code ventilation).',
    },
  },

  // ================= LEVEL 4: FORENSIC SPECIALIST =================
  {
    id: 'compound_dirty_and_undercharged',
    category: 'split_ac',
    categoryLabel: 'Residential Split AC',
    difficulty: 'Forensic Specialist',
    titleTemplates: [
      'Compound Double-Fault: Dirty Condenser Masking an Undercharge',
      'The Deceptive Head Pressure Trap (Leak + Dirty Coil)',
      'Dual-Failure Diagnostic: High Load Masking Gas Loss',
    ],
    complaintTemplates: [
      'Technician was called out because AC stopped cooling. Outdoor coil is packed with dirt, but previous technician added refrigerant blindly. House remains 80°F.',
      'Complex field issue: Head pressure seems normal at first glance, but cooling is totally inadequate and compressor is overheating.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 3.0,
    setupParams: () => ({
      chargePercent: 72, // undercharge
      condenserAirflowFactor: 0.45, // dirty coil elevates head to look "normal"
    }),
    rootCauseLabel: 'Compound Fault: Undercharged System Masked by Dirty Condenser',
    rootCauseDescription: 'Dirty coil artificially props up head pressure, but high superheat and low subcooling reveal severe refrigerant loss.',
    distractors: [
      { id: 'bad_compressor', label: 'Inefficient Compressor', description: 'Blown internal valves.' },
      { id: 'simple_dirty_condenser', label: 'Dirty Condenser Coil Only', description: 'Heat rejection issue only.' },
      { id: 'txv_flooding', label: 'TXV Flooding / Hunting', description: 'Overfeeding evaporator.' },
    ],
    explanation: {
      summary: 'A classic master tech trap: The dirty condenser coil elevates condensing temperature, which deceptively props up head pressure into a seemingly "normal" range. However, measuring superheat and subcooling reveals the underlying truth: superheat is high (starved evaporator) and subcooling is low (no liquid reserve in condenser).',
      whyLowSide: 'Low refrigerant charge causes low suction pressure and high superheat despite high outdoor head pressure.',
      whyHighSide: 'Head pressure appears normal only because the fouled condenser artificially elevates condensing temperature difference.',
      superheatSubcoolingLogic: 'High Superheat + Low Subcooling with "Normal" Head Pressure exposes a DIRTY CONDENSER MASKING AN UNDERCHARGE. If the coil is cleaned first, head pressure immediately plummets!',
      proFieldTip: 'Always clean coils BEFORE evaluating refrigerant charge! Charging a system with a dirty coil leads to severe overcharge once the coil is eventually washed.',
    },
  },
  {
    id: 'mini_split_thermistor_drift',
    category: 'mini_split',
    categoryLabel: 'Ductless Inverter Mini-Split',
    difficulty: 'Forensic Specialist',
    titleTemplates: [
      'Discharge Pipe Thermistor Calibration Drift',
      'Inverter Throttled to 20Hz by False Overheat Sensor',
      'Negative Temperature Coefficient (NTC) Sensor Fault',
    ],
    complaintTemplates: [
      'High-end ductless inverter runs at a quiet crawl and refuses to ramp up compressor speed. Suction pressure is high and cooling is feeble. No error codes on remote.',
      'Inverter compressor is running at minimum frequency (20 Hz) despite 82°F indoor call. Board displays discharge temp at 255°F while physical pipe is only 130°F.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'EEV (Electronic)',
    nominalTons: 1.5,
    setupParams: () => ({
      chargePercent: 100,
      inverterSpeedHz: 20, // Throttled due to false high temp protection
      eevStepPosition: 180,
    }),
    rootCauseLabel: 'Discharge Pipe Thermistor Calibration Drift (Inverter Throttling)',
    rootCauseDescription: 'Thermistor resistance drifted, sending false 255°F reading to mainboard, forcing inverter to clamp compressor at 20Hz.',
    distractors: [
      { id: 'blown_ipm_module', label: 'Blown Intelligent Power Module (IPM)', description: 'Inverter output stage failure.' },
      { id: 'stuck_eev', label: 'EEV Stepper Motor Stuck Closed', description: 'Starved evaporator.' },
      { id: 'undercharge', label: 'Refrigerant Leak', description: 'Loss of factory charge.' },
    ],
    explanation: {
      summary: 'The negative temperature coefficient (NTC) discharge pipe thermistor sensor drifted down in resistance. The inverter mainboard micro-controller calculates a false 255°F discharge temp and clamps compressor frequency to 20Hz to prevent motor burn.',
      whyLowSide: 'With compressor speed clamped at minimum 20Hz, mass flow is low, leaving suction pressure elevated and cooling split negligible.',
      whyHighSide: 'Head pressure is low because minimal heat is being compressed.',
      superheatSubcoolingLogic: 'Low Inverter Hz + Normal charge + Low Delta-T with thermocouple measuring 130°F on pipe while board reads 255°F confirms a DRIFTED THERMISTOR.',
      proFieldTip: 'Unplug the thermistor harness from the PCB. Measure resistance with an ohmmeter and compare with the manufacturer 20kΩ / 50kΩ P-T temperature-resistance curve.',
    },
  },

  // ================= 5. COMMERCIAL ICE MACHINES =================
  {
    id: 'ice_machine_harvest_leak',
    category: 'ice_machine',
    categoryLabel: 'Commercial Ice Machine',
    difficulty: 'Journeyman',
    titleTemplates: [
      'Hot Gas Harvest Valve Seating Leak',
      'Ice Machine Never Freezes Solid (Harvest Blow-By)',
      'Sluggish Freeze Cycle & Thin Slab Fault',
    ],
    complaintTemplates: [
      'Bar ice machine has been running for 45 minutes on freeze cycle without dropping ice. Cubes in the evaporator grid are thin, hollow wafers.',
      'Restaurant manager reports ice bin is nearly empty. The compressor runs continuously, but water running over plate never freezes into a solid slab.',
    ],
    refrigerant: 'R-404A',
    meteringDevice: 'TXV',
    nominalTons: 1.0,
    setupParams: () => ({
      chargePercent: 100,
      iceMachineHarvestValveLeaking: true,
    }),
    rootCauseLabel: 'Hot Gas Harvest Solenoid Valve Leaking Past Seat',
    rootCauseDescription: 'Solenoid valve failing to seat tightly, bleeding hot discharge vapor into evaporator plate during freeze cycle.',
    distractors: [
      { id: 'undercharge', label: 'Refrigerant Undercharge', description: 'Refrigerant leak.' },
      { id: 'water_pump_failure', label: 'Water Distribution Pump Failure', description: 'No water flow over evaporator grid.' },
      { id: 'dirty_condenser', label: 'Fouled Condenser Air Filter', description: 'Restricted airflow.' },
    ],
    explanation: {
      summary: 'The hot gas harvest solenoid valve plunger failed to seat tightly due to scale or mechanical wear, continuously bleeding hot discharge vapor into the evaporator during the freeze cycle.',
      whyLowSide: 'The hot gas bleeding into the low side prevents suction pressure from dropping to its normal 28 psig freeze target, keeping the evaporator plate warm.',
      whyHighSide: 'Bypassed vapor reduces the condensing heat load, lowering head pressure slightly below nominal.',
      superheatSubcoolingLogic: 'Elevated Suction Pressure during freeze cycle + hot harvest bypass copper line hot to the touch confirms a LEAKING HARVEST VALVE.',
      proFieldTip: 'Feel the hot gas bypass line right after the solenoid valve 5 minutes into the freeze cycle. It should be cold to the touch. If it is scorching hot, the valve seat is leaking!',
    },
  },
  {
    id: 'ice_machine_curtain_switch',
    category: 'ice_machine',
    categoryLabel: 'Commercial Ice Machine',
    difficulty: 'Apprentice',
    titleTemplates: [
      'Water Curtain Magnetic Reed Switch Stuck Open',
      'Ice Bin False Full Shutoff Alarm',
      'Misaligned Curtain Magnet on Drop Chute',
    ],
    complaintTemplates: [
      'Ice machine is completely silent with bin only 10% full. Board diagnostic LED displays code 2 (Bin Full / Curtain Open).',
      'After the last harvest drop, the machine never restarted the freeze cycle. The curtain swung shut, but unit thinks curtain is open.',
    ],
    refrigerant: 'R-404A',
    meteringDevice: 'TXV',
    nominalTons: 1.0,
    setupParams: () => ({
      chargePercent: 100,
      compressorRunning: false,
      controlCircuitVoltage: 0,
    }),
    rootCauseLabel: 'Water Curtain Magnetic Reed Switch Stuck Open (False Bin Full)',
    rootCauseDescription: 'Magnetic sensor failed open, signaling to the micro-controller that the ice storage bin is full.',
    distractors: [
      { id: 'blown_fuse', label: 'Blown High Voltage Control Fuse', description: 'Loss of 208V power.' },
      { id: 'seized_compressor', label: 'Mechanically Seized Compressor', description: 'Locked rotor.' },
      { id: 'low_pressure_cutout', label: 'Tripped Low Pressure Safety Switch', description: 'Loss of charge cutout.' },
    ],
    explanation: {
      summary: 'The magnetic reed proximity switch on the evaporator plastic water curtain failed internally open. The control board interprets this as ice holding the curtain ajar, indicating the storage bin is full.',
      whyLowSide: 'Unit is off; low and high side pressures are fully equalized at room temperature.',
      whyHighSide: 'Zero compressor work; high side is at ambient saturation.',
      superheatSubcoolingLogic: 'Zero motor operation + Bin empty + Board LED "Bin Full / Curtain" lit confirms a FAULTY WATER CURTAIN SENSOR.',
      proFieldTip: 'Test with a multimeter set to ohms across the curtain sensor leads while manually swinging a magnet near the switch. If it does not close to 0 ohms, replace the reed switch.',
    },
  },

  // ================= 6. GEOTHERMAL / WATER-SOURCE HEAT PUMPS =================
  {
    id: 'geothermal_fouled_coaxial',
    category: 'geothermal',
    categoryLabel: 'Geothermal / Water-Source Heat Pump',
    difficulty: 'Journeyman',
    titleTemplates: [
      'Fouled Coaxial Water-to-Refrigerant Heat Exchanger',
      'Restricted Ground Loop Water Flow (Low GPM)',
      'Mineral Scale Buildup on Water-Cooled Condenser',
    ],
    complaintTemplates: [
      'Ground-source heat pump trips on High Pressure Lockout (Code 3) after 8 minutes of cooling. Ground loop pump is energized.',
      'Cooling performance in luxury home is severely degraded. Water temperature entering coaxial coil is 65°F, but exiting is 88°F with very high water pressure drop.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'TXV',
    nominalTons: 4.0,
    setupParams: () => ({
      chargePercent: 100,
      waterLoopFlowGpm: 1.2, // Normal is 3.0 GPM/ton (12 GPM total)
      waterLoopEwtTemp: 65,
    }),
    rootCauseLabel: 'Fouled Coaxial Water Heat Exchanger / Low Loop GPM Restriction',
    rootCauseDescription: 'Scale or sediment choked water passages, dropping flow from 12 GPM to 4.8 GPM, driving head pressure into high-limit lockout.',
    distractors: [
      { id: 'refrigerant_overcharge', label: 'Refrigerant Overcharge', description: 'Excess liquid in condenser.' },
      { id: 'bad_txv', label: 'TXV Stuck Closed', description: 'Restricted metering device.' },
      { id: 'reversing_valve_leak', label: 'Reversing Valve Blow-By', description: 'Internal slider leak.' },
    ],
    explanation: {
      summary: 'Mineral scaling or debris in the coaxial tube-in-tube heat exchanger restricted water flow from 12 GPM down to 4.8 GPM. The coaxial coil cannot absorb the heat of condensation, causing head pressure to spike.',
      whyLowSide: 'Suction pressure is slightly higher than normal due to high liquid line pressure forcing excess gas into evaporator.',
      whyHighSide: 'Low water flow causes a huge water delta T (23°F vs normal 8-10°F) and spikes head pressure to 580 psig, tripping the 600 psig manual reset HP cutout.',
      superheatSubcoolingLogic: 'Very High Head Pressure + High Water Delta-T + Low Water Pressure Differential confirms LOW WATER LOOP FLOW / SCALED COAXIAL COIL.',
      proFieldTip: 'Measure pressure drop (PSI) across the coaxial barrel with a digital gauge. Compare against the manufacturer flow curve to calculate GPM. Flush coil with inhibited acid (descaler) if scaled.',
    },
  },

  // ================= 7. VRF / MULTI-SPLIT HEAT RECOVERY =================
  {
    id: 'vrf_branch_box_eev_stuck',
    category: 'vrf',
    categoryLabel: 'VRF Heat Recovery Multi-Split',
    difficulty: 'Master Tech',
    titleTemplates: [
      'Branch Selector Box EEV Stepper Motor Seizure',
      'VRF Zone 3 Evaporator Starvation (0 Pulses EEV)',
      'Electronic Expansion Valve Pulse Stator Open',
    ],
    complaintTemplates: [
      'In a 6-zone office VRF system, Zone 3 (Conference Room) is 81°F while other 5 zones are cooling perfectly. Indoor unit fan runs, but suction pipe is warm.',
      'Central VRF touchscreen shows Zone 3 error: "Liquid Pipe Temperature Abnormally High / Subcooling Fault".',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'EEV (Electronic)',
    nominalTons: 10.0,
    setupParams: () => ({
      chargePercent: 100,
      eevStepPosition: 20, // Stuck shut (nominal 240)
      txvOpeningFactor: 0.2,
    }),
    rootCauseLabel: 'Branch Selector Box Electronic Expansion Valve (EEV) Stuck Closed',
    rootCauseDescription: 'EEV stepper motor seized or stator winding open, starving Zone 3 evaporator of refrigerant flow.',
    distractors: [
      { id: 'undercharge', label: 'Main VRF Loop Refrigerant Undercharge', description: 'Loss of total system charge.' },
      { id: 'inverter_failure', label: 'Outdoor Inverter Board Failure', description: 'Inverter output dead.' },
      { id: 'communication_error', label: 'RS-485 Communication Bus Open', description: 'Broken transmission line.' },
    ],
    explanation: {
      summary: 'The stepper motor stator winding in the Branch Selector Box for Zone 3 failed or its needle pin jammed shut at 20 steps, starving the conference room coil while the remaining 5 zones continue operating.',
      whyLowSide: 'Zone 3 suction pipe temperature matches room ambient (78°F) with near-zero heat absorption.',
      whyHighSide: 'The master inverter compressor modulates frequency according to active load, maintaining overall head pressure.',
      superheatSubcoolingLogic: 'Single isolated zone starving while master outdoor unit and sibling zones operate normally points directly to that zone’s EEV or Branch Box.',
      proFieldTip: 'Test EEV coil resistance: disconnect the 5-pin or 6-pin connector. Normal resistance between Common and each phase coil is typically 46Ω ±3Ω. If any winding is open, replace the stator coil.',
    },
  },

  // ================= 8. HYDROCARBON REACH-IN REFRIGERATION (R-290) =================
  {
    id: 'hydrocarbon_r290_cap_tube_wax',
    category: 'hydrocarbon_r290',
    categoryLabel: 'Hydrocarbon R-290 Self-Contained Merchandiser',
    difficulty: 'Journeyman',
    titleTemplates: [
      'Capillary Tube Sludge / Wax Restriction (R-290 Merchandiser)',
      'Frosting Cap Tube Inlet on Commercial Reach-In Cooler',
      'Moisture Ice Plug in R-290 Expansion Capillary',
    ],
    complaintTemplates: [
      'Convenience store beverage cooler is 58°F inside. Compressor runs continuously with low amp draw. Frost line starts right at the capillary tube inlet.',
      'R-290 glass door merchandiser stopped cooling after 3 years of service. Suction side runs in a deep vacuum (-12 in Hg).',
    ],
    refrigerant: 'R-290',
    meteringDevice: 'Capillary Tube',
    nominalTons: 0.5,
    setupParams: () => ({
      chargePercent: 100,
      liquidLineRestriction: true,
      txvOpeningFactor: 0.25,
    }),
    rootCauseLabel: 'Capillary Tube Restriction / Waxing (Low Suction Vacuum)',
    rootCauseDescription: 'Oil breakdown residue plugged the tiny capillary tube bore, dropping low-side into vacuum while holding high-side normal.',
    distractors: [
      { id: 'undercharge', label: 'R-290 Refrigerant Leak', description: 'Loss of 120g charge.' },
      { id: 'dirty_condenser', label: 'Dirty Condenser Coil', description: 'Heat rejection failure.' },
      { id: 'bad_thermostat', label: 'Defective Electronic Controller', description: 'Open relay.' },
    ],
    explanation: {
      summary: 'Decomposed polyolester (POE) oil or paraffin wax plugged the small bore of the capillary tube. Because R-290 operates with a tiny factory charge (often < 150 grams), even microscopic contamination causes a total restriction.',
      whyLowSide: 'Refrigerant cannot enter the evaporator coil, pulling suction pressure down into a vacuum (-10 in Hg).',
      whyHighSide: 'All refrigerant stacks in the condenser; head pressure is normal to slightly low due to lack of heat load.',
      superheatSubcoolingLogic: 'Suction pressure in vacuum + frost at capillary tube inlet + high subcooling confirms a CAPILLARY TUBE RESTRICTION.',
      proFieldTip: 'Safety Warning! R-290 is flammable (A3). Never use open flames or a brazing torch on an R-290 system without thoroughly purging with nitrogen! Use Lokring mechanical press fittings or certified pinch-off tools.',
    },
  },

  // ================= 9. SUPERMARKET PARALLEL COMPRESSOR RACKS =================
  {
    id: 'supermarket_rack_epr_stuck',
    category: 'supermarket_rack',
    categoryLabel: 'Supermarket Parallel Compressor Rack',
    difficulty: 'Master Tech',
    titleTemplates: [
      'Evaporator Pressure Regulator (EPR) Valve Stuck Closed',
      'Frozen Dairy Case Display (EPR Pilot Port Plugged)',
      'EPR Mechanical Diaphragm Failure',
    ],
    complaintTemplates: [
      'Milk and yogurt in Case #4 are freezing solid at 22°F (target is 36°F). Other dairy cases on the same medium-temp suction header are running at normal 36°F.',
      'Supermarket dairy manager complains of ice buildup across the bottom coil of line-up #4. Suction pressure at case is 22 psig while main rack header is 32 psig.',
    ],
    refrigerant: 'R-404A',
    meteringDevice: 'TXV',
    nominalTons: 25.0,
    setupParams: () => ({
      chargePercent: 100,
      eprValveSettingPsig: 20, // Abnormally low due to stuck valve
    }),
    rootCauseLabel: 'Evaporator Pressure Regulator (EPR) Valve Failed / Set Too Low',
    rootCauseDescription: 'EPR valve pilot orifice restricted or set improperly, dropping coil pressure below freezing (22 psig = 12°F SST) and freezing product.',
    distractors: [
      { id: 'rack_overcharge', label: 'Main Parallel Rack Overcharged', description: 'Excess liquid in receiver.' },
      { id: 'compressor_valve_blowby', label: 'Rack Compressor #2 Blown Discharge Valve', description: 'Compressor inefficiency.' },
      { id: 'case_txv_hunting', label: 'Case TXV Hunting / Flooding', description: 'Overfeeding TXV.' },
    ],
    explanation: {
      summary: 'The Evaporator Pressure Regulator (EPR) valve on the dairy case suction line maintains evaporator coil pressure higher than the common suction header (to prevent freezing products that need 36°F air). Its pilot seat failed or was misadjusted, dropping coil pressure to 22 psig (12°F saturation), freezing the dairy products.',
      whyLowSide: 'The evaporator coil pressure dropped below 30 psig, causing the temperature split to plunge below 32°F.',
      whyHighSide: 'The multi-compressor rack maintains normal 220 psig condensing pressure via ambient fan cycling.',
      superheatSubcoolingLogic: 'Single case freezing up while entire suction header is normal points directly to the case’s EPR REGULATOR VALVE.',
      proFieldTip: 'Use a refrigeration manifold to check pressure upstream and downstream of the EPR valve. Turn the adjustment stem clockwise to increase evaporator setting to 42-45 psig for medium-temp dairy.',
    },
  },

  // ================= 10. TRANSPORT REFRIGERATION UNITS (REEFER) =================
  {
    id: 'transport_reefer_stv_fault',
    category: 'transport_reefer',
    categoryLabel: 'Transport Refrigeration Unit (Truck Reefer)',
    difficulty: 'Master Tech',
    titleTemplates: [
      'Suction Throttling Valve (STV) Stuck Wide Open',
      'Reefer Engine Stalling on High-Temp Box Pulldown',
      'Mechanical Throttling Valve Diaphragm Rupture',
    ],
    complaintTemplates: [
      'Trailer reefer unit dies and stalls its diesel engine 10 minutes into a warm box pulldown (starting at 90°F inside trailer). High engine load and compressor overload.',
      'Reefer compressor draws extreme amperage and engine black-smokes heavily whenever trailer temperature is warm.',
    ],
    refrigerant: 'R-404A',
    meteringDevice: 'TXV',
    nominalTons: 5.0,
    setupParams: () => ({
      chargePercent: 100,
      suctionThrottlingValveOpen: true,
      compressorEfficiency: 0.9,
    }),
    rootCauseLabel: 'Suction Throttling Valve (STV) Stuck Open During High-Load Pulldown',
    rootCauseDescription: 'STV failed to throttle suction pressure, flooding compressor with dense, high-pressure vapor, overloading the diesel engine.',
    distractors: [
      { id: 'diesel_fuel_filter', label: 'Clogged Diesel Fuel Filter', description: 'Engine starvation.' },
      { id: 'reefer_undercharge', label: 'Reefer Refrigerant Leak', description: 'Low system charge.' },
      { id: 'defrost_damper_open', label: 'Defrost Air Damper Jammed', description: 'Airflow restriction.' },
    ],
    explanation: {
      summary: 'The Suction Throttling Valve (or CPR - Crankcase Pressure Regulator) protects the engine/compressor from overload during warm-box pulldown by throttling high suction pressure down to a safe limit. It failed stuck wide open, causing dense vapor to enter the compressor, overloading the motor/engine.',
      whyLowSide: 'Suction pressure at compressor crankcase matches warm evaporator pressure (65+ psig), creating an enormous mass flow.',
      whyHighSide: 'Discharge pressure and compression horsepower spike to maximum capacity.',
      superheatSubcoolingLogic: 'Compressor stalling/overloading only during high box temperature pulldown confirms a FAILED SUCTION THROTTLING VALVE.',
      proFieldTip: 'Connect gauge to compressor crankcase service port. The STV should hold crankcase pressure at or below manufacturer limit (typically 32-35 psig for R-404A) regardless of box temp.',
    },
  },

  // ================= 11. PRECISION CRAC / DATA CENTER COOLING =================
  {
    id: 'crac_electrode_humidifier_scale',
    category: 'crac_datacenter',
    categoryLabel: 'Precision CRAC / Data Center Cooling',
    difficulty: 'Journeyman',
    titleTemplates: [
      'Steam Cylinder Electrode Humidifier Scaling Failure',
      'Data Center Low Relative Humidity Alarm (RH < 20%)',
      'CRAC Electrode Canister High Water Mineral Fouling',
    ],
    complaintTemplates: [
      'Server room facility monitoring system is sounding an acoustic alarm: Humidity dropped to 18% RH (standard is 45-50% RH). Static electricity risk on server racks.',
      'CRAC Unit #2 displays alarm: "Humidifier Cylinder Current Low / Replace Canister". Steam output is zero.',
    ],
    refrigerant: 'R-410A',
    meteringDevice: 'EEV (Electronic)',
    nominalTons: 15.0,
    setupParams: () => ({
      chargePercent: 100,
      humidifierActive: false,
    }),
    rootCauseLabel: 'Fouled / Scaled Electrode Steam Humidifier Canister',
    rootCauseDescription: 'Mineral deposits encrusted electrodes inside canister, preventing electric current from boiling water into steam.',
    distractors: [
      { id: 'chilled_water_flow', label: 'Loss of Chilled Water Flow', description: 'Cooling loop failure.' },
      { id: 'ec_fan_motor', label: 'EC Fan Motor Inverter Fault', description: 'Blower failure.' },
      { id: 'compressor_short_cycle', label: 'DX Compressor Short Cycling', description: 'Refrigeration circuit fault.' },
    ],
    explanation: {
      summary: 'Data center CRAC units maintain strict 45-55% relative humidity to prevent electrostatic discharge (ESD) that can fry computer servers. The disposable electrode boiler steam canister became heavily encrusted with calcium/magnesium scale, preventing electrical conductivity between electrodes.',
      whyLowSide: 'Refrigeration cycle runs normally to maintain 68°F server room temperature.',
      whyHighSide: 'Head pressure is normal.',
      superheatSubcoolingLogic: 'Server room temperature 68°F normal + Relative humidity plummeting below 25% + Humidifier amp draw 0A confirms a FOULED STEAM CYLINDER.',
      proFieldTip: 'Inspect the clear sight tube on the steam canister. If electrodes are coated in white/gray rock scale or cylinder has exceeded 2,000 run hours, replace the entire disposable canister and clean the drain solenoid valve.',
    },
  },
];

const CUSTOMER_NAMES = [
  'Marcus Vance', 'Sarah Jenkins', 'Arthur Pendelton', 'Elena Rostova',
  'Dr. Gregory House', 'Clara Oswald', 'Harold Miller', 'Brian Connelly',
  'Evelyn Reed', 'Liam O\'Connor', 'Doris Watson', 'Carlos Mendoza',
  'Rachel Green', 'David Sterling', 'Amina Al-Mansoor', 'Jonathan Hayes',
  'Chef Antoine Laurent', 'Data Center Manager Briggs', 'Cold Chain Director Novak',
];

const LOCATIONS = [
  'Oakridge Estates, Lot 4B', 'Northwood Heights, House 18', 'Briarwood Court #7',
  'Glenwood Park Medical Center', 'Pinecrest Luxury Condos #108', 'Maple Ridge Lane, House 5',
  'Riverbank Plaza Suite 200', 'Mountain Crest Lodge', 'Frost Hollow Road, Unit 12',
  'Downtown Loft Studio', 'Westfield Retail Plaza Store #14', 'Prime Cuts Butcher Shop',
  'St. Jude Regional Central Plant', 'Heritage Bank Branch RTU #1', 'Pacific Coast Cold Storage',
  'Server Farm Core Pod 4B', 'Metropolitan Grand Ballroom Ice Bank', 'Sysco Cross-Dock Logistics Bay 7',
];

/**
 * Generate a procedural scenario based on selected difficulty tier or random scale
 */
export function generateRandomScenario(difficultyFilter?: DifficultyTier, categoryFilter?: SystemCategory): Scenario {
  // Filter archetypes
  let availableArchetypes = FAULT_ARCHETYPES;
  if (categoryFilter) {
    const catFiltered = FAULT_ARCHETYPES.filter((a) => a.category === categoryFilter);
    if (catFiltered.length > 0) availableArchetypes = catFiltered;
  }
  if (difficultyFilter && difficultyFilter !== ('All' as unknown)) {
    const diffFiltered = availableArchetypes.filter((a) => a.difficulty === difficultyFilter);
    if (diffFiltered.length > 0) availableArchetypes = diffFiltered;
  }


  // Pick random archetype
  const archetype = availableArchetypes[Math.floor(Math.random() * availableArchetypes.length)];

  // Randomize ambient conditions within realistic ranges
  const isWinter = archetype.category === 'heat_pump';
  const outdoorTemp = isWinter
    ? Math.floor(Math.random() * 18) + 30 // 30°F to 48°F
    : Math.floor(Math.random() * 20) + 84; // 84°F to 104°F

  const indoorTemp = archetype.category === 'walk_in'
    ? Math.floor(Math.random() * 10) + 32 // 32°F to 42°F
    : isWinter
    ? Math.floor(Math.random() * 6) + 66 // 66°F to 72°F
    : Math.floor(Math.random() * 8) + 74; // 74°F to 82°F

  const indoorWetBulb = Math.max(50, indoorTemp - Math.floor(Math.random() * 6) - 10);

  // Random customer and location
  const customerName = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const title = archetype.titleTemplates[Math.floor(Math.random() * archetype.titleTemplates.length)];
  const reportedIssue = archetype.complaintTemplates[Math.floor(Math.random() * archetype.complaintTemplates.length)];

  // Generate dynamic system parameters
  const customParams = archetype.setupParams(outdoorTemp, indoorTemp);

  const scenarioId = `proc_${archetype.id}_${Date.now().toString(36)}`;

  const initialState = {
    systemCategory: archetype.category,
    refrigerant: archetype.refrigerant,
    meteringDevice: archetype.meteringDevice,
    operationMode: isWinter ? ('heating' as const) : ('cooling' as const),
    ambientTemp: outdoorTemp,
    returnAirTemp: indoorTemp,
    returnAirWetBulb: indoorWetBulb,
    chargePercent: 100,
    airflowCfm: archetype.nominalTons * 400,
    condenserAirflowFactor: 1.0,
    evaporatorAirflowFactor: 1.0,
    txvOpeningFactor: 1.0,
    compressorEfficiency: 1.0,
    nonCondensables: false,
    liquidLineRestriction: false,
    runCapacitorHealth: 1.0,
    condenserFanOperational: true,
    evaporatorBlowerOperational: true,
    nominalTons: archetype.nominalTons,
    ...customParams,
  };

  // Compile options (root cause + distractors shuffled)
  const options = [
    {
      id: archetype.id,
      label: archetype.rootCauseLabel,
      description: archetype.rootCauseDescription,
    },
    ...archetype.distractors,
  ].sort(() => Math.random() - 0.5);

  return {
    id: scenarioId,
    category: archetype.category,
    categoryLabel: archetype.categoryLabel,
    title,
    difficulty: archetype.difficulty,
    systemType: `${archetype.categoryLabel} (${archetype.nominalTons} Tons · ${archetype.refrigerant})`,
    equipmentSpecs: {
      nominalTons: archetype.nominalTons,
      refrigerant: archetype.refrigerant,
      meteringDevice: archetype.meteringDevice,
      ratedRla: Number((archetype.nominalTons * 4.6).toFixed(1)),
      ratedCapacitorUf: archetype.nominalTons <= 2 ? 35 : archetype.nominalTons <= 3.5 ? 45 : 60,
      targetSubcooling: 11.0,
      targetSuperheat: 10.0,
      hasReversingValve: archetype.category === 'heat_pump',
      hasEconomizer: archetype.category === 'rtu',
      hasDefrostClock: archetype.category === 'walk_in',
      isInverter: archetype.category === 'mini_split',
    },
    customerTicket: {
      customerName,
      location,
      reportedIssue,
      ambientConditions: {
        outdoorTemp,
        indoorTemp,
        indoorWetBulb,
      },
    },
    initialState,
    rootCauseId: archetype.id,
    rootCauseOptions: options,
    explanation: archetype.explanation,
  };
}
