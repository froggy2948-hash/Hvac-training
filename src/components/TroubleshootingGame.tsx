import React, { useState, useMemo } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { generateRandomScenario } from '../lib/scenarioGenerator';
import { Scenario, SystemParameters, DifficultyTier, TechnicianRank, CareerProgress } from '../types';
import { calculateCycleReadings } from '../lib/thermo';
import { RefrigerationSchematic } from './RefrigerationSchematic';
import { ManifoldGauges } from './ManifoldGauges';
import { MultimeterTool } from './MultimeterTool';

export const TroubleshootingGame: React.FC = () => {
  // Current active scenario
  const [currentScenario, setCurrentScenario] = useState<Scenario>(() => SCENARIOS[0]);
  const [activeParams, setActiveParams] = useState<SystemParameters>(() => ({
    ...SCENARIOS[0].initialState,
  }));

  // Career Ladder / Progress state
  const [career, setCareer] = useState<CareerProgress>({
    rank: 'Apprentice Tech',
    level: 1,
    solvedCount: 0,
    currentStreak: 0,
    points: 0,
  });

  const [careerModeActive, setCareerModeActive] = useState<boolean>(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier | 'All'>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [showCatalogDrawer, setShowCatalogDrawer] = useState<boolean>(false);
  const [selectedProbe, setSelectedProbe] = useState<string | null>('suction_port');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'gauges' | 'multimeter' | 'inspection' | 'system_tools'>('gauges');
  const [submittedDiagnosis, setSubmittedDiagnosis] = useState<string | null>(null);
  const [showDebriefModal, setShowDebriefModal] = useState(false);
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  const [completedScenarios, setCompletedScenarios] = useState<Record<string, boolean>>({});

  // Live cycle physics
  const cycleReadings = useMemo(() => {
    return calculateCycleReadings(activeParams);
  }, [activeParams]);

  // Load a scenario (pre-curated or generated)
  const loadScenario = (newScenario: Scenario) => {
    setCurrentScenario(newScenario);
    setActiveParams({ ...newScenario.initialState });
    setSubmittedDiagnosis(null);
    setShowDebriefModal(false);
    setActionHistory([]);
    setSelectedProbe('suction_port');
  };

  // Generate a new random procedural scenario with difficulty scaling and category targeting
  const handleGenerateRandom = (tier?: DifficultyTier, targetCat?: string) => {
    const targetTier = tier || (
      career.level === 1 ? 'Apprentice' :
      career.level === 2 ? 'Journeyman' :
      career.level === 3 ? 'Master Tech' : 'Forensic Specialist'
    );
    const catToUse = (targetCat && targetCat !== 'All') ? targetCat as any : (selectedCategoryFilter !== 'All' ? selectedCategoryFilter as any : undefined);
    const procedural = generateRandomScenario(targetTier, catToUse);
    loadScenario(procedural);
  };

  // Advance career on successful resolution
  const handleDiagnosisSuccess = () => {
    setCareer((prev) => {
      const newStreak = prev.currentStreak + 1;
      const newSolved = prev.solvedCount + 1;
      const pointsEarned =
        currentScenario.difficulty === 'Apprentice' ? 100 :
        currentScenario.difficulty === 'Journeyman' ? 200 :
        currentScenario.difficulty === 'Master Tech' ? 350 : 500;
      const newPoints = prev.points + pointsEarned;

      // Determine rank and level
      let newLevel = 1;
      let newRank: TechnicianRank = 'Apprentice Tech';
      if (newSolved >= 12 || newPoints >= 2500) {
        newRank = 'Master HVAC/R Specialist';
        newLevel = 4;
      } else if (newSolved >= 7 || newPoints >= 1400) {
        newRank = 'Senior Lead';
        newLevel = 3;
      } else if (newSolved >= 3 || newPoints >= 500) {
        newRank = 'Journeyman Tech';
        newLevel = 2;
      }

      return {
        rank: newRank,
        level: newLevel,
        solvedCount: newSolved,
        currentStreak: newStreak,
        points: newPoints,
      };
    });
  };

  const handleResetScenario = () => {
    setActiveParams({ ...currentScenario.initialState });
    setSubmittedDiagnosis(null);
    setShowDebriefModal(false);
    setActionHistory([]);
  };

  const applyAction = (actionName: string, paramUpdate: Partial<SystemParameters>) => {
    setActiveParams((prev) => ({
      ...prev,
      ...paramUpdate,
    }));
    setActionHistory((prev) => [actionName, ...prev]);
  };

  const handleSubmitDiagnosis = (selectedOptionId: string) => {
    setSubmittedDiagnosis(selectedOptionId);
    setShowDebriefModal(true);
    if (selectedOptionId === currentScenario.rootCauseId) {
      setCompletedScenarios((prev) => ({ ...prev, [currentScenario.id]: true }));
      handleDiagnosisSuccess();
    }
  };

  const isCorrect = submittedDiagnosis === currentScenario.rootCauseId;

  return (
    <div className="space-y-6">
      {/* ================= ZONE 1: CAREER & DISPATCH CONTROL BAR ================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Career Stats & Rank */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xl text-sky-400 shadow-inner">
              {career.level === 1 ? '🔧' : career.level === 2 ? '⚡' : career.level === 3 ? '🏆' : '🔬'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  Level {career.level} · {career.rank}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-amber-400">
                  🔥 {career.currentStreak} Streak
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Field Troubleshooting Service Lab
              </h2>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleGenerateRandom()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>🎲</span>
              <span>Generate Random Scenario</span>
            </button>

            <button
              onClick={() => setShowCatalogDrawer(!showCatalogDrawer)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              {showCatalogDrawer ? 'Hide Scenario Catalog ▲' : 'Browse Catalog (20+ Systems) ▼'}
            </button>
          </div>
        </div>

        {/* Collapsible Curated Scenario Catalog (Keeps screen uncluttered unless requested!) */}
        {showCatalogDrawer && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
            {/* Filter Row 1: System Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="text-[11px] text-slate-500 uppercase mr-1">System:</span>
              {[
                { id: 'All', label: 'All Systems' },
                { id: 'split_ac', label: 'Split AC' },
                { id: 'heat_pump', label: 'Heat Pump' },
                { id: 'mini_split', label: 'Mini-Split' },
                { id: 'walk_in', label: 'Walk-In' },
                { id: 'rtu', label: 'RTU' },
                { id: 'chiller', label: 'Chiller' },
                { id: 'ice_machine', label: 'Ice Machine' },
                { id: 'geothermal', label: 'Geothermal' },
                { id: 'vrf', label: 'VRF' },
                { id: 'hydrocarbon_r290', label: 'R-290' },
                { id: 'supermarket_rack', label: 'Rack' },
                { id: 'crac_datacenter', label: 'CRAC' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-sky-950 text-sky-400 font-bold border border-sky-600'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Filter Row 2: Difficulty Tier Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-[11px] text-slate-500 uppercase mr-1">Tier:</span>
                {(['All', 'Apprentice', 'Journeyman', 'Master Tech'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedDifficulty(tier)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                      selectedDifficulty === tier
                        ? 'bg-slate-800 text-sky-400 font-bold border border-sky-500'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono text-slate-400">
                {SCENARIOS.filter((s) =>
                  (selectedDifficulty === 'All' || s.difficulty === selectedDifficulty) &&
                  (selectedCategoryFilter === 'All' || s.category === selectedCategoryFilter)
                ).length} Scenarios Available
              </span>
            </div>

            {/* Scenarios Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {SCENARIOS
                .filter((s) =>
                  (selectedDifficulty === 'All' || s.difficulty === selectedDifficulty) &&
                  (selectedCategoryFilter === 'All' || s.category === selectedCategoryFilter)
                )
                .map((sc) => {
                  const isSelected = sc.id === currentScenario.id;
                  const isSolved = !!completedScenarios[sc.id];

                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        loadScenario(sc);
                        setShowCatalogDrawer(false);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-slate-800 border-sky-500 shadow-sm ring-1 ring-sky-500'
                          : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                        <span>{sc.categoryLabel}</span>
                        {isSolved && <span className="text-emerald-400 font-bold">✓ SOLVED</span>}
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 truncate">{sc.title}</h4>
                      <span className="text-[10px] font-mono text-sky-300 mt-1 block">
                        {sc.difficulty} · {sc.equipmentSpecs.refrigerant}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}


        {/* Active Dispatch Ticket Banner */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-1">
              <span className="text-amber-400 font-bold uppercase">{currentScenario.categoryLabel}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">{currentScenario.systemType}</span>
              <span className="text-slate-600">·</span>
              <span className={`font-semibold ${
                currentScenario.difficulty === 'Apprentice' ? 'text-emerald-400' :
                currentScenario.difficulty === 'Journeyman' ? 'text-amber-400' :
                currentScenario.difficulty === 'Master Tech' ? 'text-rose-400' : 'text-purple-400'
              }`}>
                {currentScenario.difficulty}
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              {currentScenario.title} · Customer: {currentScenario.customerTicket.customerName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Location: {currentScenario.customerTicket.location}
            </p>
          </div>

          {/* Ambient Conditions Pill Strip */}
          <div className="flex items-center gap-3 text-xs font-mono bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <div>
              <span className="text-slate-500 block text-[10px]">Outdoor Ambient</span>
              <span className="text-amber-300 font-bold">{currentScenario.customerTicket.ambientConditions.outdoorTemp}°F DB</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">Indoor Return</span>
              <span className="text-sky-300 font-bold">{currentScenario.customerTicket.ambientConditions.indoorTemp}°F DB</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">Wet Bulb</span>
              <span className="text-blue-300 font-bold">{currentScenario.customerTicket.ambientConditions.indoorWetBulb}°F WB</span>
            </div>
          </div>
        </div>

        {/* Customer Reported Complaint */}
        <div className="mt-3 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-300">
          <span className="font-bold text-slate-200">Customer Complaint: </span>
          &ldquo;{currentScenario.customerTicket.reportedIssue}&rdquo;
        </div>
      </div>

      {/* ================= ZONE 2: MAIN WORK BAY (DIVIDED 2-COLUMN LAYOUT) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Refrigeration Schematic (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <RefrigerationSchematic
            readings={cycleReadings}
            refrigerant={currentScenario.equipmentSpecs.refrigerant}
            meteringDevice={currentScenario.equipmentSpecs.meteringDevice}
            systemCategory={currentScenario.category}
            operationMode={activeParams.operationMode}
            selectedProbe={selectedProbe}
            onSelectProbe={(p) => setSelectedProbe(p)}
            showProbes={true}
          />
        </div>

        {/* Right Column: Divided Diagnostic Instrument Console (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono uppercase text-sky-400 font-bold">Technician Console</span>
            <button
              onClick={handleResetScenario}
              className="text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors"
            >
              ↺ Reset System
            </button>
          </div>

          {/* Divided Instrument Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveConsoleTab('gauges')}
              className={`py-2 rounded-lg text-center transition-colors ${
                activeConsoleTab === 'gauges' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gauges
            </button>
            <button
              onClick={() => setActiveConsoleTab('multimeter')}
              className={`py-2 rounded-lg text-center transition-colors ${
                activeConsoleTab === 'multimeter' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Multimeter
            </button>
            <button
              onClick={() => setActiveConsoleTab('inspection')}
              className={`py-2 rounded-lg text-center transition-colors ${
                activeConsoleTab === 'inspection' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Line ΔT
            </button>
            <button
              onClick={() => setActiveConsoleTab('system_tools')}
              className={`py-2 rounded-lg text-center transition-colors ${
                activeConsoleTab === 'system_tools' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Controls
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="min-h-[340px]">
            {activeConsoleTab === 'gauges' && (
              <ManifoldGauges
                readings={cycleReadings}
                refrigerant={currentScenario.equipmentSpecs.refrigerant}
                meteringDevice={currentScenario.equipmentSpecs.meteringDevice}
              />
            )}

            {activeConsoleTab === 'multimeter' && (
              <MultimeterTool
                readings={cycleReadings}
                params={activeParams}
                ratedRla={currentScenario.equipmentSpecs.ratedRla}
                ratedCapacitorUf={currentScenario.equipmentSpecs.ratedCapacitorUf}
              />
            )}

            {activeConsoleTab === 'inspection' && (
              <div className="space-y-3 text-xs font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Liquid Line Sight Glass</span>
                  <div className="flex items-center gap-3 my-2">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-600 bg-slate-900 flex items-center justify-center relative">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          cycleReadings.moistureIndicator === 'wet' ? 'bg-amber-400' :
                          cycleReadings.moistureIndicator === 'caution' ? 'bg-amber-600' : 'bg-emerald-500'
                        }`}
                      />
                      {cycleReadings.sightGlass === 'bubbles' && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white">•••</span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-100 font-bold block capitalize text-sm">
                        {cycleReadings.sightGlass}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Moisture: {cycleReadings.moistureIndicator === 'dry' ? 'DRY (Green)' : 'WET/CAUTION (Yellow)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Filter Drier Temperature Drop</span>
                  <div className="my-1.5">
                    <span className={`text-2xl font-bold ${
                      cycleReadings.filterDrierDeltaT > 2 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {cycleReadings.filterDrierDeltaT.toFixed(1)}°F
                    </span>
                    <span className="text-slate-400 text-[10px] block mt-0.5">
                      Inlet: {cycleReadings.liquidLineTemp.toFixed(1)}°F · Outlet: {(cycleReadings.liquidLineTemp - cycleReadings.filterDrierDeltaT).toFixed(1)}°F
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-400">
                    A drop &gt; 3°F across the drier indicates internal obstruction.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Air Temperature Split (ΔT)</span>
                  <div className="my-1.5">
                    <span className="text-2xl font-bold text-sky-400">
                      {cycleReadings.evaporatorDeltaT.toFixed(1)}°F
                    </span>
                    <span className="text-slate-400 text-[10px] block mt-0.5">
                      Return: {activeParams.returnAirTemp}°F · Supply: {cycleReadings.supplyAirTemp}°F
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeConsoleTab === 'system_tools' && (
              <div className="space-y-3 text-xs font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">24V Control Circuit (R to C)</span>
                  <div className="my-1.5">
                    <span className={`text-2xl font-bold ${
                      cycleReadings.controlCircuitVoltage === 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {cycleReadings.controlCircuitVoltage.toFixed(1)} V AC
                    </span>
                    <span className="text-slate-400 text-[10px] block mt-0.5">
                      {activeParams.condensateFloatTripped ? '⚠️ Float switch open (drain backed up)' : 'All safety cutouts closed'}
                    </span>
                  </div>
                </div>

                {currentScenario.category === 'heat_pump' && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px] mb-1">4-Way Reversing Valve Body ΔT</span>
                    <div className="my-1.5">
                      <span className="text-2xl font-bold text-amber-400">
                        {cycleReadings.reversingValveDeltaT?.toFixed(1) || '1.8'}°F
                      </span>
                      <span className="text-slate-400 text-[10px] block mt-0.5">
                        {activeParams.reversingValveState === 'leaking_by' ? '⚠️ Internal Teflon slider blow-by' : 'Normal slide seal (< 3°F)'}
                      </span>
                    </div>
                  </div>
                )}

                {currentScenario.category === 'mini_split' && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px] mb-1">EEV Stepper Position</span>
                    <div className="my-1.5">
                      <span className="text-2xl font-bold text-sky-400">
                        {cycleReadings.eevPulseCount || 240} pulses
                      </span>
                      <span className="text-slate-400 text-[10px] block mt-0.5">
                        Range: 0 to 480 pulses · Inverter: {activeParams.inverterSpeedHz || 60} Hz
                      </span>
                    </div>
                  </div>
                )}

                {currentScenario.category === 'rtu' && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px] mb-1">Economizer Mixed Air Temp</span>
                    <div className="my-1.5">
                      <span className="text-2xl font-bold text-purple-400">
                        {cycleReadings.economizerAirMixTemp || 76}°F
                      </span>
                      <span className="text-slate-400 text-[10px] block mt-0.5">
                        Damper Position: {activeParams.economizerDamperPercent || 0}% Open
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= ZONE 3: FIELD REPAIRS & ACTIONS BENCH ================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Field Procedures</span>
            <h3 className="text-sm font-bold text-white">Technician Service Bench</h3>
          </div>
          <span className="text-xs text-slate-400">Apply repairs and observe live readings adjust</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => applyAction('Added Refrigerant (+15% charge)', { chargePercent: Math.min(150, activeParams.chargePercent + 15) })}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 hover:bg-slate-850 text-left transition-colors"
          >
            <span className="font-bold text-sky-400 block">+ Add Refrigerant</span>
            <span className="text-[10px] text-slate-400">Current Charge: {activeParams.chargePercent}%</span>
          </button>

          <button
            onClick={() => applyAction('Recovered Refrigerant (-15% charge)', { chargePercent: Math.max(40, activeParams.chargePercent - 15) })}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 hover:bg-slate-850 text-left transition-colors"
          >
            <span className="font-bold text-amber-400 block">- Recover Refrigerant</span>
            <span className="text-[10px] text-slate-400">Current Charge: {activeParams.chargePercent}%</span>
          </button>

          <button
            onClick={() => applyAction('Replaced Air Filter / Cleared Return', { evaporatorAirflowFactor: 1.0, airflowCfm: 1200 })}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-slate-850 text-left transition-colors"
          >
            <span className="font-bold text-emerald-400 block">Replace Filter / Clean Coil</span>
            <span className="text-[10px] text-slate-400">Restore indoor CFM</span>
          </button>

          <button
            onClick={() => applyAction('Cleaned Outdoor Condenser Coil', { condenserAirflowFactor: 1.0 })}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-slate-850 text-left transition-colors"
          >
            <span className="font-bold text-emerald-400 block">Chemical Wash Condenser</span>
            <span className="text-[10px] text-slate-400">Clear outdoor fins</span>
          </button>

          <button
            onClick={() => applyAction('Cleared Condensate Drain / Reset Float', { condensateFloatTripped: false })}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-slate-850 text-left transition-colors"
          >
            <span className="font-bold text-sky-400 block">Clear Drain & Float Switch</span>
            <span className="text-[10px] text-slate-400">Restore 24V circuit</span>
          </button>

          <button
            onClick={() => applyAction('Replaced Dual-Run Capacitor', { runCapacitorHealth: 1.0 })}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-slate-850 text-left transition-colors"
          >
            <span className="font-bold text-amber-400 block">Replace Run Capacitor</span>
            <span className="text-[10px] text-slate-400">Install fresh rated µF cap</span>
          </button>

          <button
            onClick={() => applyAction('Replaced TXV / Secured Sensing Bulb', { txvOpeningFactor: 1.0 })}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 hover:bg-slate-850 text-left transition-colors"
          >
            <span className="font-bold text-purple-400 block">Replace / Strap TXV</span>
            <span className="text-[10px] text-slate-400">Restore expansion rate</span>
          </button>

          <button
            onClick={() => applyAction('Replaced Liquid Line Filter Drier', { liquidLineRestriction: false })}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-slate-850 text-left transition-colors"
          >
            <span className="font-bold text-amber-400 block">Replace Filter Drier</span>
            <span className="text-[10px] text-slate-400">Clear line restriction</span>
          </button>
        </div>

        {actionHistory.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-2 overflow-x-auto">
            <span className="font-bold text-slate-300 shrink-0">Field Actions Performed:</span>
            {actionHistory.slice(0, 4).map((act, idx) => (
              <span key={idx} className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                {act}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ================= ZONE 4: WORK ORDER DIAGNOSIS SUBMISSION ================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="pb-4 border-b border-slate-800 mb-4">
          <span className="text-xs font-mono uppercase text-sky-400 font-bold">Official Work Order Resolution</span>
          <h3 className="text-base font-bold text-white">Select Your Verified Root Cause Diagnosis</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare instrument pressures, saturation temperatures, superheat, subcooling, and amperage to solve this call.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentScenario.rootCauseOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSubmitDiagnosis(opt.id)}
              className={`p-4 rounded-xl text-left transition-all border ${
                submittedDiagnosis === opt.id
                  ? opt.id === currentScenario.rootCauseId
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500'
                    : 'bg-rose-950/60 border-rose-500 text-rose-100 ring-1 ring-rose-500'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-850'
              }`}
            >
              <div className="font-bold text-sm flex items-center justify-between">
                <span>{opt.label}</span>
                {submittedDiagnosis === opt.id && (
                  <span className="text-xs font-mono">
                    {opt.id === currentScenario.rootCauseId ? '✓ CORRECT' : '✗ INCORRECT'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Technician Debrief Modal */}
      {showDebriefModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCorrect ? '✅' : '❌'}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isCorrect ? 'Diagnosis Verified: Problem Solved!' : 'Diagnostic Error: Review Instrumentation'}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {isCorrect ? '+ Points Awarded · Career Ladder Advanced' : 'Review thermodynamics below'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDebriefModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-sm text-sky-400 mb-1">Trade School Summary</h4>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {currentScenario.explanation.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-900/40">
                  <span className="font-bold text-blue-400 block mb-1">Low Side (Suction) Analysis</span>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    {currentScenario.explanation.whyLowSide}
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-900/40">
                  <span className="font-bold text-rose-400 block mb-1">High Side (Head) Analysis</span>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    {currentScenario.explanation.whyHighSide}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Superheat & Subcooling Diagnostic Rule</span>
                <p className="text-slate-200 font-sans font-medium">
                  {currentScenario.explanation.superheatSubcoolingLogic}
                </p>
              </div>

              <div className="bg-sky-950/40 border border-sky-900/60 p-3.5 rounded-xl text-sky-200 font-sans">
                <span className="font-bold text-sky-300 block mb-1">💡 Master Technician Field Pro-Tip:</span>
                <p className="leading-relaxed">{currentScenario.explanation.proFieldTip}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
              >
                Close Debrief
              </button>
              <button
                onClick={() => {
                  setShowDebriefModal(false);
                  handleGenerateRandom();
                }}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md"
              >
                Next Random Scenario ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
