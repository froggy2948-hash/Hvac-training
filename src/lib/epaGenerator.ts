import { EPAQuestion } from '../types';

export type QuestionWordingStyle = 'direct' | 'scenario' | 'inverted' | 'equipment' | 'regulatory';

export interface QuestionBlueprint {
  conceptId: string;
  section: 'core' | 'type1' | 'type2' | 'type3';
  topic: string;
  regulationCitation: string;
  templates: {
    style: QuestionWordingStyle;
    stem: string | ((ctx: Record<string, string | number>) => string);
  }[];
  correctAnswerText: string | ((ctx: Record<string, string | number>) => string);
  distractorPool: (string | ((ctx: Record<string, string | number>) => string))[];
  explanation: string;
  generateContext?: () => Record<string, string | number>;
}

const TECH_NAMES = ['Tech Alex', 'Technician Miller', 'Field Tech Jordan', 'Inspector Hayes', 'HVAC Journeyman Torres', 'Tech Chen'];
const LOCATIONS = ['a residential home', 'a commercial high-rise', 'a regional supermarket', 'a cold storage warehouse', 'a hospital medical center'];

export const QUESTION_BLUEPRINTS: QuestionBlueprint[] = [
  // =========================================================================
  // ======================== CORE SECTION BLUEPRINTS ========================
  // =========================================================================
  {
    conceptId: 'core_ozone_chlorine_destruction',
    section: 'core',
    topic: 'Ozone Depletion Chemistry',
    regulationCitation: 'Clean Air Act Title VI / Stratospheric Ozone Protection',
    templates: [
      {
        style: 'direct',
        stem: 'According to the EPA, approximately how many ozone molecules can a single chlorine atom destroy in the stratosphere before being removed?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} is asked during an EPA compliance audit about the environmental impact of venting CFCs. How many stratospheric ozone molecules does a single chlorine radical destroy over its multi-year atmospheric lifespan?`,
      },
      {
        style: 'inverted',
        stem: 'Which of the following statements regarding the stratospheric catalytic cycle of chlorine is TRUE?',
      },
      {
        style: 'regulatory',
        stem: 'In EPA educational publications regarding Clean Air Act Title VI, what is the established scientific benchmark for the catalytic ozone depletion capability of one chlorine atom?',
      },
    ],
    correctAnswerText: 'Up to 100,000 ozone molecules',
    distractorPool: [
      'Up to 1,000 ozone molecules',
      'Up to 10,000 ozone molecules',
      'Exactly 1 ozone molecule per reaction',
      'An infinite number without chemical decay',
      'Up to 500 ozone molecules',
    ],
    explanation: 'A chlorine atom acts as a catalytic agent: it strips an oxygen atom from ozone (O3) to form chlorine monoxide (ClO) and diatomic oxygen (O2). When ClO collides with a free oxygen atom, chlorine is freed to destroy another ozone molecule—repeating up to 100,000 times before being bound or rained out.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'core_montreal_protocol',
    section: 'core',
    topic: 'International Treaty & Phaseout',
    regulationCitation: 'Montreal Protocol on Substances that Deplete the Ozone Layer',
    templates: [
      {
        style: 'direct',
        stem: 'Which international treaty established the global phaseout timeline for chlorofluorocarbons (CFCs) and hydrochlorofluorocarbons (HCFCs)?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} is preparing documentation for a client explaining why virgin R-22 is no longer produced in the United States. Which international agreement originally mandated this global phaseout?`,
      },
      {
        style: 'regulatory',
        stem: 'Under what international treaty, finalized in 1987 and signed by the United States, were production caps and phaseouts placed on Class I and Class II ozone-depleting substances?',
      },
    ],
    correctAnswerText: 'The Montreal Protocol',
    distractorPool: [
      'The Kyoto Protocol',
      'The Paris Climate Agreement',
      'The Geneva Convention on Air Quality',
      'The Copenhagen Accord',
      'The Basel Convention',
    ],
    explanation: 'The Montreal Protocol on Substances that Deplete the Ozone Layer (finalized September 1987) is the landmark international treaty that controls the production and consumption of ozone-depleting substances such as CFCs and HCFCs.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'core_venting_prohibition',
    section: 'core',
    topic: 'Venting Prohibition Scope',
    regulationCitation: 'Clean Air Act Section 608 (40 CFR § 82.154)',
    templates: [
      {
        style: 'direct',
        stem: 'Under Section 608 of the Clean Air Act, which of the following is considered an illegal venting violation?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `While servicing equipment at ${ctx.location}, a technician releases refrigerant to the atmosphere. Which of the following acts violates the federal venting prohibition?`,
      },
      {
        style: 'inverted',
        stem: 'The Clean Air Act Section 608 venting prohibition applies to all of the following EXCEPT:',
      },
      {
        style: 'regulatory',
        stem: 'Which statement accurately describes the EPA venting prohibition under 40 CFR § 82.154 regarding HFC and HFO refrigerants?',
      },
    ],
    correctAnswerText: 'Intentionally venting HFCs such as R-410A or R-134a because they contain zero chlorine',
    distractorPool: [
      'De minimis releases occurring during the hookup and disconnect of low-loss service gauge hoses',
      'Releasing pure nitrogen used to pressurize an empty system for leak detection',
      'Releasing exempt natural refrigerants like carbon dioxide (R-744) or nitrogen (R-728)',
      'Venting unadulterated water vapor from a cooling tower loop',
      'De minimis releases during certified recovery machine purging',
    ],
    explanation: 'The Clean Air Act Section 608 venting prohibition applies to ALL substitute refrigerants (including HFCs like R-410A and R-134a) unless explicitly exempted (such as CO2, nitrogen, ammonia, or pure hydrocarbons under specific EPA approvals). Having zero ozone depletion does not exempt HFCs from the venting ban.',
    generateContext: () => ({
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    }),
  },
  {
    conceptId: 'core_reclaim_definition',
    section: 'core',
    topic: 'Recover vs Recycle vs Reclaim',
    regulationCitation: 'EPA Section 608 / AHRI Standard 700',
    templates: [
      {
        style: 'direct',
        stem: 'What is the definition of "Reclaiming" refrigerant according to EPA Section 608 regulations?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} recovers 50 lbs of R-410A from a job site. The contractor wants to sell this used refrigerant to a different business. To do so legally, what standard must the refrigerant meet?`,
      },
      {
        style: 'regulatory',
        stem: 'Which processing standard must used refrigerant meet before it can legally be resold to a new owner under EPA regulations?',
      },
    ],
    correctAnswerText: 'Reprocessing used refrigerant to verified virgin specifications (AHRI Standard 700) using chemical analysis',
    distractorPool: [
      'Filtering oil and passing refrigerant through single or multiple replaceable filter-driers on site',
      'Removing refrigerant from an appliance and storing it in an external cylinder for re-use in the same owner’s equipment',
      'Blending 50% recovered gas with 50% virgin refrigerant in the field',
      'Distilling refrigerant on a service truck using an oil separator only',
    ],
    explanation: 'Reclaim means processing used refrigerant to all of the purity specifications of AHRI Standard 700 and verifying that purity with laboratory chemical analysis. Only reclaimed refrigerant can be legally resold to a different owner.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'core_cylinder_safety_fill',
    section: 'core',
    topic: 'Recovery Cylinder Fill Limit',
    regulationCitation: 'DOT 4BA / EPA 608 Safety Standards',
    templates: [
      {
        style: 'direct',
        stem: 'What is the maximum allowable liquid fill capacity by weight for a refillable recovery cylinder according to DOT and EPA safety standards?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} is filling a 50 lb recovery cylinder on a hot summer afternoon. To prevent hydrostatic rupture caused by thermal liquid expansion, what is the maximum fill percentage?`,
      },
      {
        style: 'equipment',
        stem: 'Recovery cylinders must never be filled beyond what percentage of their water capacity by weight at 70°F?',
      },
    ],
    correctAnswerText: '80% of capacity by weight',
    distractorPool: [
      '60% of capacity by weight',
      '90% of capacity by weight',
      '95% of capacity by weight',
      '100% capacity if kept in a cool shade',
      '70% of capacity by volume',
    ],
    explanation: 'Recovery cylinders must NEVER be filled beyond 80% of their rated capacity by weight (or water weight capacity multiplied by the specific gravity of the refrigerant). Liquid refrigerant expands drastically with rising ambient temperature; leaving 20% vapor space prevents hydrostatic cylinder rupture.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'core_cylinder_colors',
    section: 'core',
    topic: 'DOT Cylinder Identification',
    regulationCitation: 'DOT Guidelines / EPA Safety Standards',
    templates: [
      {
        style: 'direct',
        stem: 'According to Department of Transportation (DOT) standards, what are the official colors of an approved refrigerant recovery cylinder?',
      },
      {
        style: 'equipment',
        stem: 'A technician inspecting recovery cylinders in the shop must verify they display the DOT-approved color code, which is:',
      },
      {
        style: 'scenario',
        stem: (ctx) => `Before starting a recovery job, ${ctx.tech} checks the truck inventory. An approved refrigerant recovery cylinder must have which color combination?`,
      },
    ],
    correctAnswerText: 'Gray body with a yellow shoulder/top',
    distractorPool: [
      'Yellow body with a gray shoulder/top',
      'Solid green body with white lettering',
      'Solid safety blue body with red collar',
      'White body with green valve handwheels',
      'Rose/pink body matching R-410A factory containers',
    ],
    explanation: 'DOT-approved refillable recovery cylinders are manufactured with a gray body and a yellow top (shoulder and neck). Disposable virgin refrigerant cylinders are painted specific uniform colors (or light gray under AHRI guidelines) and must NEVER be refilled.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'core_ashrae_safety_class',
    section: 'core',
    topic: 'ASHRAE Standard 34 Classification',
    regulationCitation: 'ASHRAE Standard 34 / EPA SNAP Program',
    templates: [
      {
        style: 'direct',
        stem: 'Under ASHRAE Standard 34 safety designations, what does a refrigerant classified as "A2L" indicate?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `The industry is transitioning to low-GWP refrigerants like R-454B and R-32 for residential split systems. Under ASHRAE Standard 34, what does their safety rating indicate?`,
      },
      {
        style: 'regulatory',
        stem: 'Which safety classification represents lower toxicity and lower flammability with a mild burning velocity (< 10 cm/s)?',
      },
    ],
    correctAnswerText: 'Lower toxicity (A) and lower flammability with mild burning velocity (2L)',
    distractorPool: [
      'Higher toxicity (B) and non-flammable (1)',
      'Lower toxicity (A) and high explosive flammability (3)',
      'Higher toxicity (B) and lower flammability (2)',
      'Non-toxic and non-flammable under all room conditions',
    ],
    explanation: 'ASHRAE Standard 34 designates Toxicity with letters (A = Lower Toxicity, B = Higher Toxicity) and Flammability with numbers (1 = No flame propagation, 2L = Lower flammability with burning velocity <= 10 cm/s, 2 = Lower flammability, 3 = Higher flammability).',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'core_zeotropic_charging',
    section: 'core',
    topic: 'Fractionation & Blend Charging',
    regulationCitation: 'EPA Technical Standards & Refrigerant Management',
    templates: [
      {
        style: 'direct',
        stem: 'How must zeotropic refrigerant blends (such as R-407C or R-410A near-azeotropes) be charged into a system to prevent fractionation?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} is charging a 400-series zeotropic refrigerant blend from a cylinder. To ensure the proper chemical composition enters the system, how must the refrigerant be withdrawn?`,
      },
      {
        style: 'equipment',
        stem: 'When charging a zeotropic blend into the suction line of an operating refrigeration unit, the technician should:',
      },
    ],
    correctAnswerText: 'Charge as a liquid (throttling through a manifold or restrictor into the low side)',
    distractorPool: [
      'Charge strictly as a high-pressure vapor from the top of an upright cylinder',
      'Heat the cylinder with an open acetylene torch flame to vaporize all components equally',
      'Vent 10% of the vapor headspace before connecting service hoses',
      'Charge as vapor directly into the compressor discharge line while running',
    ],
    explanation: 'Zeotropic blends (400-series) have different boiling points for their component refrigerants (temperature glide). If charged as a vapor, the more volatile constituent boils off first, changing the blend ratio (fractionation). Blends must always be removed from the cylinder as a LIQUID and throttled into the low side as vapor to protect the compressor.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'core_deep_vacuum_microns',
    section: 'core',
    topic: 'Evacuation & Dehydration Target',
    regulationCitation: 'EPA Industry Standard Evacuation Practices',
    templates: [
      {
        style: 'direct',
        stem: 'What is the industry-standard deep vacuum level recommended to ensure atmospheric air and moisture are thoroughly dehydrated from an HVAC/R system?',
      },
      {
        style: 'equipment',
        stem: 'When using a digital micron gauge during system evacuation, what micron reading confirms adequate dehydration before performing a decay test?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `After repairing a leak, ${ctx.tech} connects a two-stage vacuum pump. What level of vacuum should be achieved to vaporize moisture at room temperature?`,
      },
    ],
    correctAnswerText: '500 microns (0.5 mm Hg) or below',
    distractorPool: [
      '5,000 microns (5 mm Hg)',
      '29.92 inches of mercury on an analog compound gauge',
      '1,000 microns with pump running continuously',
      '10,000 microns',
      '50 microns (achieved only with cryogenic traps)',
    ],
    explanation: 'A deep vacuum of 500 microns (0.5 mm Hg) lowers the boiling point of water well below room temperature, vaporizing moisture into steam so the vacuum pump can remove it. Analog gauges cannot accurately measure microns.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'core_clean_air_act_penalties',
    section: 'core',
    topic: 'EPA Enforcement Penalties',
    regulationCitation: 'Clean Air Act Section 113 / 608 Enforcement',
    templates: [
      {
        style: 'direct',
        stem: 'Under Section 608 of the Clean Air Act, what consequences can a technician or company face for intentionally venting regulated refrigerants?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `An EPA enforcement officer investigates intentional venting of R-22 at a job site. What statutory penalties can be levied under federal law?`,
      },
      {
        style: 'regulatory',
        stem: 'Which enforcement actions can the federal court and the EPA execute against violators of Clean Air Act Title VI?',
      },
    ],
    correctAnswerText: 'Substantial civil fines per day per violation, revocation of technician certification, and potential criminal penalties',
    distractorPool: [
      'A mandatory $100 administrative warning with no civil liability',
      'A temporary 14-day suspension of service van registration only',
      'A verbal reprimand from the local utility provider',
      'Fines capped at a maximum of $500 for the entire contracting firm',
    ],
    explanation: 'Violating Clean Air Act Section 608 can result in civil fines exceeding $44,000+ per day per violation (adjusted annually for inflation), loss of EPA certification, mandatory court appearances, and criminal prosecution for willful violations. The EPA also offers bounties up to $10,000 for verified tips.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },

  // =========================================================================
  // ======================= TYPE I (SMALL APPLIANCES) =======================
  // =========================================================================
  {
    conceptId: 'type1_definition',
    section: 'type1',
    topic: 'Small Appliance Definition',
    regulationCitation: '40 CFR § 82.152 (Small Appliance Definition)',
    templates: [
      {
        style: 'direct',
        stem: 'What is the EPA regulatory definition of a Type I "Small Appliance"?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} is inspecting a self-contained reach-in cooler. To be classified as a Type I Small Appliance, what is the maximum factory refrigerant charge limit?`,
      },
      {
        style: 'regulatory',
        stem: 'Under 40 CFR § 82.152, an appliance manufactured, charged, and hermetically sealed at a factory is classified as Type I only if its factory charge does not exceed:',
      },
    ],
    correctAnswerText: '5 pounds or less of refrigerant',
    distractorPool: [
      '10 pounds or less of refrigerant',
      '3 pounds or less of refrigerant',
      '15 pounds or less of refrigerant',
      '50 pounds or less of refrigerant',
      '1 pound or less of refrigerant',
    ],
    explanation: 'A Type I Small Appliance is defined under 40 CFR § 82.152 as any appliance that is fully manufactured, charged, and hermetically sealed in a factory with 5 pounds or less of refrigerant (e.g. household refrigerators, drinking fountains, room AC units).',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type1_recovery_running_compressor',
    section: 'type1',
    topic: 'Recovery Standard with Operating Compressor',
    regulationCitation: '40 CFR § 82.156 / 40 CFR § 82.158',
    templates: [
      {
        style: 'direct',
        stem: 'When using self-contained (active) recovery equipment on a small appliance with an OPERATING compressor, what recovery efficiency must be achieved?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} is servicing a residential refrigerator whose hermetic compressor runs normally. What percentage of the nameplate charge must the recovery machine capture?`,
      },
      {
        style: 'equipment',
        stem: 'Certified recovery equipment manufactured after November 15, 1993 must recover what percentage of refrigerant from a small appliance when its compressor is running?',
      },
    ],
    correctAnswerText: '90% of the refrigerant charge or 4 inches of Hg vacuum',
    distractorPool: [
      '80% of the refrigerant charge or 4 inches of Hg vacuum',
      '95% of the refrigerant charge or 10 inches of Hg vacuum',
      '100% of the charge down to 0 psig with no exceptions',
      '70% of the refrigerant charge',
      '85% of the refrigerant charge or 0 inches of Hg vacuum',
    ],
    explanation: 'When using self-contained recovery equipment on a small appliance with a WORKING compressor, the equipment must be capable of recovering 90% of the refrigerant charge or achieving 4 inches of Hg vacuum (40 CFR § 82.156).',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type1_recovery_dead_compressor',
    section: 'type1',
    topic: 'Recovery Standard with Inoperative Compressor',
    regulationCitation: '40 CFR § 82.156 / 40 CFR § 82.158',
    templates: [
      {
        style: 'direct',
        stem: 'When using self-contained recovery equipment on a small appliance with an INOPERATIVE (non-running) compressor, what recovery level is required?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `A chest freezer has a burned-out hermetic compressor. ${ctx.tech} connects certified recovery gear. What percentage of the charge must be recovered?`,
      },
      {
        style: 'inverted',
        stem: 'Which statement accurately describes the recovery requirement for a small appliance whose compressor cannot be energized?',
      },
    ],
    correctAnswerText: '80% of the refrigerant charge or 4 inches of Hg vacuum',
    distractorPool: [
      '90% of the refrigerant charge or 4 inches of Hg vacuum',
      '70% of the refrigerant charge or 0 psig',
      '50% of the refrigerant charge provided oil is drained',
      '100% of the charge down to 500 microns',
    ],
    explanation: 'When the small appliance compressor is NON-OPERATING, the recovery equipment must recover 80% of the refrigerant charge or achieve 4 inches of Hg vacuum.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type1_passive_both_sides',
    section: 'type1',
    topic: 'System-Dependent Recovery Access',
    regulationCitation: 'EPA Type I Rules (System-Dependent Recovery)',
    templates: [
      {
        style: 'direct',
        stem: 'When using a system-dependent (passive) recovery process on a small appliance with an INOPERATIVE compressor, how must access fittings be connected?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `The compressor on a domestic refrigerator is mechanically locked. ${ctx.tech} wants to use system-dependent recovery. Why must both the high and low process tubes be accessed?`,
      },
      {
        style: 'equipment',
        stem: 'To recover 80% of refrigerant using a non-pressurized recovery bag on a dead-compressor appliance, the technician must connect to:',
      },
    ],
    correctAnswerText: 'Both the high side and the low side of the system to release trapped refrigerant',
    distractorPool: [
      'Only the low-side process stub near the compressor suction dome',
      'Only the high-side liquid line filter drier tap',
      'Directly to the compressor oil drain port with a mechanical siphon',
      'The evaporator defrost line only',
    ],
    explanation: 'When the compressor does not run, capillary tubes and closed valves prevent refrigerant from migrating freely across the circuit. Accessing BOTH high and low sides is mandatory to evacuate trapped refrigerant and achieve the required 80% recovery.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type1_piercing_valves',
    section: 'type1',
    topic: 'Piercing Valve Regulations',
    regulationCitation: 'EPA Section 608 Field Service Standards',
    templates: [
      {
        style: 'direct',
        stem: 'What is the EPA regulation regarding clamp-on saddle piercing valves used during the servicing of small appliances?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} installs a temporary piercing valve on the process tube of a water cooler to evacuate the system. What must be done before completing the service call?`,
      },
      {
        style: 'equipment',
        stem: 'Why can clamp-on piercing valves NOT be left permanently on small appliances after repairs are completed?',
      },
    ],
    correctAnswerText: 'They tend to leak over time and must not be left on the appliance permanently; permanent access stubs should be brazed in',
    distractorPool: [
      'They must be left permanently on every small appliance for future warranty inspections',
      'They can remain permanently as long as high-temperature silicone is wrapped around the clamp',
      'They are illegal to use even for temporary diagnostics under any circumstances',
      'They may remain permanently only if installed on steel tubing',
    ],
    explanation: 'Clamp-on piercing valves seal via neoprene or rubber gaskets which degrade, harden, and leak over time due to vibration and temperature cycling. They must never be left as permanent service valves; permanent access fittings must be brazed or swaged onto the process stub.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type1_hydrocarbon_charge_limit',
    section: 'type1',
    topic: 'Hydrocarbon Safety & Charge Limits',
    regulationCitation: 'EPA SNAP Program / UL 60335-2-89',
    templates: [
      {
        style: 'direct',
        stem: 'Under EPA SNAP regulations and safety standards, what is the maximum charge limit of R-600a (isobutane) permitted in a domestic household refrigerator?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} is servicing a modern residential refrigerator charged with R-600a. What is the maximum allowable refrigerant charge to avoid explosive hazards in a domestic kitchen?`,
      },
      {
        style: 'regulatory',
        stem: 'What is the maximum charge of flammable A3 hydrocarbon refrigerant (R-600a / R-290) allowed in new household refrigerators and freezers?',
      },
    ],
    correctAnswerText: '57 grams (approximately 2.0 ounces)',
    distractorPool: [
      '150 grams (approximately 5.3 ounces)',
      '500 grams (approximately 1.1 pounds)',
      '1 pound (16 ounces)',
      '5 pounds (maximum Type I limit)',
      '300 grams (approximately 10.6 ounces)',
    ],
    explanation: 'Under EPA SNAP regulations and safety standards (UL 60335-2-24), domestic household refrigerators and freezers using flammable hydrocarbon refrigerants (R-600a) are strictly capped at 57 grams (2.0 ounces) to ensure a full leak cannot reach the lower flammability limit (LFL) in a standard kitchen.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },

  // =========================================================================
  // ================= TYPE II (HIGH & VERY HIGH PRESSURE) ===================
  // =========================================================================
  {
    conceptId: 'type2_major_repair_definition',
    section: 'type2',
    topic: 'Definition of Major Repair',
    regulationCitation: '40 CFR § 82.152 (Major Maintenance Definition)',
    templates: [
      {
        style: 'direct',
        stem: 'Under Section 608 of the Clean Air Act, which of the following maintenance procedures is classified as a "Major Repair"?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `A contractor bids a service job on a 15-ton rooftop unit. Replacing which of the following components constitutes a "major repair" under EPA regulations?`,
      },
      {
        style: 'inverted',
        stem: 'All of the following components constitute a "major repair" under EPA 608 when removed or replaced EXCEPT:',
      },
      {
        style: 'regulatory',
        stem: 'According to 40 CFR § 82.152, removal of which four key components automatically triggers the definition of a "major maintenance, service, or repair"?',
      },
    ],
    correctAnswerText: 'Compressor, condenser coil, evaporator coil, or auxiliary heat exchanger coil',
    distractorPool: [
      'Liquid line filter drier, contactor, or thermostatic expansion valve',
      'Dual-run capacitor, outdoor fan motor, or crankcase heater',
      'Thermostat wire harness, sight glass, or schrader core',
      'Blower belt, economizer actuator, or condensate float switch',
    ],
    explanation: 'Under 40 CFR § 82.152, a "Major repair" is defined as any maintenance, service, or repair that involves the removal of the appliance compressor, condenser, evaporator, or auxiliary heat exchanger coil.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type2_evacuation_standards_under200',
    section: 'type2',
    topic: 'Type II Evacuation Level (< 200 lbs)',
    regulationCitation: '40 CFR § 82.156 Table 1',
    templates: [
      {
        style: 'direct',
        stem: 'What level of evacuation is required when servicing a non-leaking Type II appliance containing LESS THAN 200 pounds of R-410A using equipment manufactured AFTER November 15, 1993?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} is recovering refrigerant from a 5-ton split system containing 14 lbs of R-22 before replacing a burned-out compressor. Using modern certified recovery equipment, to what level must the system be evacuated?`,
      },
      {
        style: 'equipment',
        stem: 'When using recovery equipment manufactured after November 15, 1993 on a very high-pressure or high-pressure appliance with under 200 lbs of charge, the required vacuum is:',
      },
    ],
    correctAnswerText: '10 inches of Hg vacuum',
    distractorPool: [
      '0 psig (atmospheric pressure)',
      '4 inches of Hg vacuum',
      '15 inches of Hg vacuum',
      '25 inches of Hg vacuum',
      '500 microns',
    ],
    explanation: 'Under 40 CFR § 82.156 Table 1, for high-pressure appliances containing less than 200 pounds of refrigerant using recovery equipment manufactured on or after November 15, 1993, the required evacuation level is 10 inches of Hg vacuum.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type2_evacuation_standards_over200',
    section: 'type2',
    topic: 'Type II Evacuation Level (>= 200 lbs)',
    regulationCitation: '40 CFR § 82.156 Table 1',
    templates: [
      {
        style: 'direct',
        stem: 'What is the required evacuation level for a non-leaking Type II appliance containing 200 POUNDS OR MORE of refrigerant using equipment manufactured AFTER November 15, 1993?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `A 40-ton packaged rooftop unit containing 240 lbs of R-410A is being opened for an evaporator coil replacement. The technician must evacuate the system to what vacuum level?`,
      },
      {
        style: 'regulatory',
        stem: 'Under EPA Section 608, appliances containing 200 lbs or more of high-pressure refrigerant require what vacuum level before opening if no leaks are present?',
      },
    ],
    correctAnswerText: '15 inches of Hg vacuum',
    distractorPool: [
      '10 inches of Hg vacuum',
      '4 inches of Hg vacuum',
      '20 inches of Hg vacuum',
      '0 psig (atmospheric)',
      '25 mm Hg absolute',
    ],
    explanation: 'For high-pressure appliances containing 200 pounds or more of refrigerant using recovery equipment manufactured after November 15, 1993, the required evacuation level is 15 inches of Hg vacuum (40 CFR § 82.156 Table 1).',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type2_leaking_system_evacuation',
    section: 'type2',
    topic: 'Evacuation of Leaking Appliances',
    regulationCitation: '40 CFR § 82.156 (Exception for Leaks)',
    templates: [
      {
        style: 'direct',
        stem: 'If an appliance has an active leak that makes reaching the mandatory vacuum level impossible without drawing atmospheric air into the recovery cylinder, what procedure is required?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} arrives at a split system with a cracked copper return bend. Attempting to pull a 10-inch vacuum draws ambient air through the rupture. How far must the technician evacuate the unit?`,
      },
      {
        style: 'regulatory',
        stem: 'Under 40 CFR § 82.156, what is the mandatory evacuation level for an appliance when leaks make pulling a deep vacuum impractical?',
      },
    ],
    correctAnswerText: 'Evacuate to 0 psig (atmospheric pressure) to prevent drawing non-condensable air into the recovery cylinder',
    distractorPool: [
      'Pull to 10 inches of Hg vacuum regardless of how much ambient air enters the recovery cylinder',
      'Vent the remaining charge since the system is already leaking to the atmosphere',
      'Pressurize with oxygen to force liquid out of the crack',
      'Pressurize to 150 psig with R-410A to locate the leak before recovering',
    ],
    explanation: 'If reaching the required evacuation level would draw air into the recovery cylinder through a leak, the technician must evacuate the appliance to 0 psig (atmospheric pressure) only, to avoid contaminating the recovered refrigerant with air and moisture.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type2_leak_rate_comfort_cooling',
    section: 'type2',
    topic: 'Comfort Cooling Leak Rate Threshold',
    regulationCitation: '40 CFR § 82.157 (Applicable Leak Rates)',
    templates: [
      {
        style: 'direct',
        stem: 'Under current EPA Section 608 regulations, what is the mandatory leak repair threshold for COMFORT COOLING appliances containing 50 or more pounds of refrigerant?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `An office building chiller containing 120 pounds of R-410A provides air conditioning for human comfort. What annualized leak rate triggers mandatory leak repair under federal rules?`,
      },
      {
        style: 'regulatory',
        stem: 'Effective January 1, 2019, the EPA reduced the mandatory leak repair trigger for comfort cooling appliances holding 50+ pounds to:',
      },
    ],
    correctAnswerText: '10% annualized leak rate',
    distractorPool: [
      '15% annualized leak rate',
      '20% annualized leak rate',
      '30% annualized leak rate',
      '5% annualized leak rate',
      '35% annualized leak rate',
    ],
    explanation: 'Under EPA 40 CFR § 82.157, the mandatory leak rate threshold for Comfort Cooling appliances holding 50 or more pounds of refrigerant is 10% (lowered from the legacy 15% in 2019).',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type2_leak_rate_commercial_refrig',
    section: 'type2',
    topic: 'Commercial Refrigeration Leak Threshold',
    regulationCitation: '40 CFR § 82.157 (Applicable Leak Rates)',
    templates: [
      {
        style: 'direct',
        stem: 'Under EPA Section 608 regulations, what is the mandatory leak repair rate threshold for COMMERCIAL REFRIGERATION appliances holding 50 or more pounds of refrigerant?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `A supermarket parallel compressor rack containing 1,200 pounds of R-404A cools meat and dairy cases. What annualized leak rate triggers mandatory repair under federal regulations?`,
      },
      {
        style: 'regulatory',
        stem: 'Under 40 CFR § 82.157, owners of commercial refrigeration systems containing 50+ pounds of refrigerant must repair leaks if the annualized rate exceeds:',
      },
    ],
    correctAnswerText: '20% annualized leak rate',
    distractorPool: [
      '10% annualized leak rate',
      '30% annualized leak rate',
      '35% annualized leak rate',
      '15% annualized leak rate',
      '25% annualized leak rate',
    ],
    explanation: 'The mandatory leak repair threshold for Commercial Refrigeration (supermarket racks, cold storage warehouses, refrigerated transport) containing 50 or more pounds of refrigerant is 20% (lowered from legacy 35%).',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type2_leak_rate_industrial_process',
    section: 'type2',
    topic: 'Industrial Process Refrigeration Leak Threshold',
    regulationCitation: '40 CFR § 82.157 (Applicable Leak Rates)',
    templates: [
      {
        style: 'direct',
        stem: 'Under EPA Section 608 regulations, what is the mandatory leak repair threshold for INDUSTRIAL PROCESS REFRIGERATION (IPR) systems holding 50 or more pounds of refrigerant?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `A chemical manufacturing plant utilizes a complex DX refrigeration circuit with 800 lbs of R-507 to cool an exothermic reactor. What annual leak rate mandates repair under EPA rules?`,
      },
      {
        style: 'regulatory',
        stem: 'Under 40 CFR § 82.157, industrial process refrigeration (IPR) equipment containing 50+ pounds of refrigerant triggers mandatory repair at which annualized leak rate?',
      },
    ],
    correctAnswerText: '30% annualized leak rate',
    distractorPool: [
      '20% annualized leak rate',
      '35% annualized leak rate',
      '10% annualized leak rate',
      '25% annualized leak rate',
      '50% annualized leak rate',
    ],
    explanation: 'The mandatory leak repair threshold for Industrial Process Refrigeration (IPR) equipment holding 50 or more pounds of refrigerant is 30% (lowered from legacy 35%).',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type2_leak_repair_timeframe',
    section: 'type2',
    topic: 'Mandatory Leak Repair Timelines',
    regulationCitation: '40 CFR § 82.157 (Repair Timelines & Verification)',
    templates: [
      {
        style: 'direct',
        stem: 'Once an appliance containing 50 or more pounds of refrigerant exceeds the applicable leak rate threshold, within how many days must the leak be repaired and verified?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `A 200-lb commercial refrigeration system is found to have an annual leak rate of 28%. How many days does the system owner have to repair the leak and conduct an initial verification test?`,
      },
      {
        style: 'regulatory',
        stem: 'Under 40 CFR § 82.157, what is the standard statutory timeframe to repair a leak that exceeds the threshold unless an extension is granted?',
      },
    ],
    correctAnswerText: '30 days',
    distractorPool: [
      '10 days',
      '14 days',
      '60 days',
      '90 days',
      '45 days',
    ],
    explanation: 'Under EPA regulations, once an appliance with 50+ pounds of refrigerant exceeds the leak rate threshold, the owner has 30 days to have the leak repaired and an initial verification test conducted. A follow-up verification test must be conducted within 30 days of returning the unit to normal operating conditions.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },

  // =========================================================================
  // ==================== TYPE III (LOW-PRESSURE CHILLERS) ===================
  // =========================================================================
  {
    conceptId: 'type3_rupture_disk',
    section: 'type3',
    topic: 'Low-Pressure Pressure Relief Standards',
    regulationCitation: 'ASHRAE Standard 15 / EPA Type III Guidelines',
    templates: [
      {
        style: 'direct',
        stem: 'At what pressure is the pressure relief rupture disk set on a low-pressure centrifugal chiller using R-123 or R-11?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} is inspecting safety devices on a 300-ton R-123 chiller barrel. What is the rated burst pressure of the evaporator rupture disk?`,
      },
      {
        style: 'equipment',
        stem: 'Low-pressure chillers are equipped with a fragile rupture disk piped to an outdoor discharge header. What is the burst pressure of this relief device?',
      },
    ],
    correctAnswerText: '15 psig',
    distractorPool: [
      '10 psig',
      '30 psig',
      '50 psig',
      '150 psig',
      '5 psig',
    ],
    explanation: 'Low-pressure centrifugal chillers (operating on R-11 or R-123) have a pressure relief rupture disk set to burst at 15 psig. The discharge from the rupture disk must be piped outdoors to a safe location.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type3_max_leak_check_pressure',
    section: 'type3',
    topic: 'Maximum Leak Checking Pressure',
    regulationCitation: 'EPA Type III Best Practices / 40 CFR § 82.156',
    templates: [
      {
        style: 'direct',
        stem: 'When leak-checking a low-pressure chiller with dry nitrogen, what is the MAXIMUM allowable test pressure?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} connects a cylinder of dry nitrogen to pressure test an R-123 chiller for leaks. Why must the nitrogen regulator NEVER be set above 10 psig?`,
      },
      {
        style: 'regulatory',
        stem: 'To avoid blowing the 15 psig rupture disk during nitrogen leak-testing of a low-pressure chiller, the maximum pressure applied must not exceed:',
      },
    ],
    correctAnswerText: '10 psig',
    distractorPool: [
      '15 psig',
      '25 psig',
      '50 psig',
      '150 psig',
      '5 psig',
    ],
    explanation: 'Because the chiller rupture disk bursts at 15 psig, leak-checking with nitrogen must NEVER exceed 10 psig. Exceeding 10 psig risks blowing the rupture disk and discharging the entire holding charge.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type3_evacuation_level',
    section: 'type3',
    topic: 'Type III Mandatory Evacuation Level',
    regulationCitation: '40 CFR § 82.156 Table 1 (Type III Recovery)',
    templates: [
      {
        style: 'direct',
        stem: 'What is the required evacuation level when servicing a low-pressure appliance using recovery equipment manufactured AFTER November 15, 1993?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `Before opening a 500-ton R-123 chiller for major maintenance, ${ctx.tech} runs certified low-pressure recovery equipment. To what absolute pressure must the chiller be evacuated?`,
      },
      {
        style: 'equipment',
        stem: 'Under 40 CFR § 82.156, recovery equipment made after November 15, 1993 used on low-pressure chillers must evacuate the system to:',
      },
    ],
    correctAnswerText: '25 mm of Hg absolute',
    distractorPool: [
      '25 inches of Hg vacuum',
      '10 inches of Hg vacuum',
      '15 inches of Hg vacuum',
      '0 psig',
      '500 microns',
    ],
    explanation: 'Under 40 CFR § 82.156 Table 1, low-pressure recovery equipment manufactured on or after November 15, 1993 must pull the appliance down to 25 mm of Hg absolute (equivalent to approximately 29.0 inches of Hg vacuum). Older equipment was required to reach 25 inches of Hg vacuum.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type3_water_freeze_prevention',
    section: 'type3',
    topic: 'Chiller Tube Freeze Prevention',
    regulationCitation: 'EPA Type III Operating Standards',
    templates: [
      {
        style: 'direct',
        stem: 'During refrigerant recovery or evacuation from a low-pressure water chiller, why must the chilled water and condenser water circulating pumps be kept RUNNING?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `${ctx.tech} begins liquid recovery on a centrifugal chiller. Why must the plant operator ensure building chilled water circulation pumps remain energized throughout the recovery process?`,
      },
      {
        style: 'equipment',
        stem: 'What catastrophic failure occurs if water flow through chiller bundle tubes is turned off while rapidly recovering liquid refrigerant?',
      },
    ],
    correctAnswerText: 'To prevent water inside the evaporator and condenser copper tubes from freezing and bursting the tubes',
    distractorPool: [
      'To prevent the recovery machine compressor motor from drawing excessive amperage',
      'To ensure the purge unit does not vent refrigerant vapor to the mechanical room',
      'To lubricate the centrifugal impeller hydrodynamic bearings',
      'To maintain oil temperature above 130°F in the sump',
    ],
    explanation: 'Rapid recovery of liquid refrigerant boils off liquid at low saturation temperatures well below 32°F. If water is stagnant inside the copper tubes, it rapidly freezes into ice, expands, and bursts the tubes, causing catastrophic water flooding into the refrigerant barrel.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type3_liquid_first_charging_vapor',
    section: 'type3',
    topic: 'Low-Pressure Charging Protocol',
    regulationCitation: 'EPA Type III Charging Procedures',
    templates: [
      {
        style: 'direct',
        stem: 'When recharging an evacuated low-pressure chiller from a deep vacuum, why MUST refrigerant vapor be introduced first before liquid refrigerant?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `After an overhaul, an R-123 chiller is in a 25 mm Hg vacuum. What happens if ${ctx.tech} charges liquid refrigerant directly into the evaporator barrel from deep vacuum?`,
      },
      {
        style: 'equipment',
        stem: 'Refrigerant vapor must be charged into an evacuated low-pressure chiller until system saturation temperature rises above what benchmark before introducing liquid?',
      },
    ],
    correctAnswerText: 'Until saturation temperature reaches 36°F (above 32°F freezing point of water) to prevent freezing tube water',
    distractorPool: [
      'Until the high-pressure head reaches 150 psig',
      'Until the purge unit exhausts all nitrogen from the condenser shell',
      'Until the oil heater turns off automatically at 130°F',
      'Until line voltage drops below 208V',
    ],
    explanation: 'Charging liquid refrigerant into a deep vacuum causes the liquid to flash into vapor instantaneously at temperatures far below 32°F (e.g. 0°F to -20°F). Stagnant or flowing tube water will freeze and rupture the tubes. Vapor must be charged first until pressure corresponds to at least 36°F saturation (approx 16-18 inches Hg vacuum for R-123).',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
  {
    conceptId: 'type3_purge_unit_operation',
    section: 'type3',
    topic: 'Low-Pressure Chiller Purge Unit',
    regulationCitation: 'EPA Type III Equipment Maintenance',
    templates: [
      {
        style: 'direct',
        stem: 'What is the primary function of a high-efficiency purge unit on a low-pressure centrifugal chiller?',
      },
      {
        style: 'scenario',
        stem: (ctx) => `A hospital facilities director notes the purge unit on Chiller #1 ran for 75 minutes today (normally < 5 minutes). What does excessive purge unit run time signify?`,
      },
      {
        style: 'equipment',
        stem: 'From which location on a low-pressure chiller does the purge unit suction pipe draw vapor to separate non-condensables?',
      },
    ],
    correctAnswerText: 'To remove air and moisture (non-condensables) that leak inward into the sub-atmospheric chiller and vent them while condensing and returning refrigerant',
    distractorPool: [
      'To pump oil from the evaporator back into the compressor sump',
      'To vent excess refrigerant pressure above 15 psig to the outdoor atmosphere',
      'To circulate chilled water through the cooling tower loop',
      'To filter out solid metal shavings from the centrifugal impeller',
    ],
    explanation: 'Because low-pressure chillers operate in a vacuum in the evaporator, any leaky gasket or shaft seal draws air and moisture inward. Non-condensable air collects at the top of the condenser. The purge unit pulls this mixture, condenses the refrigerant back into the chiller, and vents the non-condensable air outside.',
    generateContext: () => ({
      tech: TECH_NAMES[Math.floor(Math.random() * TECH_NAMES.length)],
    }),
  },
];

/**
 * Helper to shuffle array in-place
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a randomized EPA Question from a blueprint
 */
export function generateQuestionFromBlueprint(blueprint: QuestionBlueprint, id: number): EPAQuestion {
  const ctx = blueprint.generateContext ? blueprint.generateContext() : {};

  // Pick random phrasing template
  const template = blueprint.templates[Math.floor(Math.random() * blueprint.templates.length)];
  const questionStem = typeof template.stem === 'function' ? template.stem(ctx) : template.stem;

  // Resolve correct answer
  const correctAnswerText = typeof blueprint.correctAnswerText === 'function'
    ? blueprint.correctAnswerText(ctx)
    : blueprint.correctAnswerText;

  // Pick 3 random distractors from the pool
  const shuffledDistractors = shuffleArray(blueprint.distractorPool).slice(0, 3);
  const distractorTexts = shuffledDistractors.map((d) => typeof d === 'function' ? d(ctx) : d);

  // Combine and shuffle options
  const allOptions = shuffleArray([correctAnswerText, ...distractorTexts]);
  const correctIndex = allOptions.indexOf(correctAnswerText);

  return {
    id,
    section: blueprint.section,
    question: questionStem,
    options: allOptions,
    correctAnswer: correctIndex,
    explanation: blueprint.explanation,
    regulationCitation: blueprint.regulationCitation,
    wordingStyle: template.style,
    conceptTag: blueprint.topic,
  };
}

/**
 * Generate a dynamic randomized EPA exam set of any size and section mix
 */
export function generateDynamicEPAExam(mode: 'universal' | 'core' | 'type1' | 'type2' | 'type3' | 'quick15'): EPAQuestion[] {
  let blueprintsToUse: QuestionBlueprint[] = [];

  if (mode === 'universal') {
    // Exactly 25 Core, 25 Type I, 25 Type II, 25 Type III to mirror the official 100-question Universal exam!
    const corePool = QUESTION_BLUEPRINTS.filter((b) => b.section === 'core');
    const type1Pool = QUESTION_BLUEPRINTS.filter((b) => b.section === 'type1');
    const type2Pool = QUESTION_BLUEPRINTS.filter((b) => b.section === 'type2');
    const type3Pool = QUESTION_BLUEPRINTS.filter((b) => b.section === 'type3');

    const selectPool = (pool: QuestionBlueprint[], count: number) => {
      const selected: QuestionBlueprint[] = [];
      while (selected.length < count) {
        selected.push(...shuffleArray(pool));
      }
      return selected.slice(0, count);
    };

    blueprintsToUse = [
      ...selectPool(corePool, 25),
      ...selectPool(type1Pool, 25),
      ...selectPool(type2Pool, 25),
      ...selectPool(type3Pool, 25),
    ];
  } else if (mode === 'quick15') {
    blueprintsToUse = shuffleArray(QUESTION_BLUEPRINTS).slice(0, 15);
  } else {
    // Specific section: 25 questions
    const pool = QUESTION_BLUEPRINTS.filter((b) => b.section === mode);
    const selected: QuestionBlueprint[] = [];
    while (selected.length < 25) {
      selected.push(...shuffleArray(pool));
    }
    blueprintsToUse = selected.slice(0, 25);
  }

  return blueprintsToUse.map((bp, index) => generateQuestionFromBlueprint(bp, index + 1));
}
