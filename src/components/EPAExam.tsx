import React, { useState, useMemo, useEffect } from 'react';
import { generateDynamicEPAExam } from '../lib/epaGenerator';
import { EPAQuestion } from '../types';

type ExamMode = 'universal' | 'core' | 'type1' | 'type2' | 'type3' | 'quick15';

export const EPAExam: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<ExamMode>('universal');
  const [isStudyMode, setIsStudyMode] = useState<boolean>(true); // Immediate feedback vs Test mode
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [examCompleted, setExamCompleted] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600); // 60-120 min timer for test mode
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [navFilter, setNavFilter] = useState<'all' | 'flagged' | 'unanswered' | 'incorrect'>('all');
  const [generationSeed, setGenerationSeed] = useState<number>(1);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  // Active question set dynamically generated
  const [activeQuestions, setActiveQuestions] = useState<EPAQuestion[]>(() =>
    generateDynamicEPAExam('universal')
  );

  // Re-generate dynamic questions when mode changes or explicitly regenerated
  const handleStartExam = (mode: ExamMode) => {
    setSelectedMode(mode);
    setIsRegenerating(true);
    setTimeout(() => {
      const freshQuestions = generateDynamicEPAExam(mode);
      setActiveQuestions(freshQuestions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setExamCompleted(false);
      setNavFilter('all');
      setSecondsRemaining(mode === 'universal' ? 7200 : mode === 'quick15' ? 900 : 3600);
      setTimerActive(!isStudyMode);
      setIsRegenerating(false);
    }, 150);
  };

  const handleRegenerateWording = () => {
    setIsRegenerating(true);
    setGenerationSeed((prev) => prev + 1);
    setTimeout(() => {
      const freshQuestions = generateDynamicEPAExam(selectedMode);
      setActiveQuestions(freshQuestions);
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setCurrentIndex(0);
      setExamCompleted(false);
      setNavFilter('all');
      setSecondsRemaining(selectedMode === 'universal' ? 7200 : selectedMode === 'quick15' ? 900 : 3600);
      setTimerActive(!isStudyMode);
      setIsRegenerating(false);
    }, 200);
  };

  // Timer countdown in test mode
  useEffect(() => {
    if (!timerActive || examCompleted || isStudyMode) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExamCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, examCompleted, isStudyMode]);

  const currentQ = activeQuestions[currentIndex];
  const currentAnswer = currentQ ? selectedAnswers[currentQ.id] : undefined;
  const isAnswered = currentAnswer !== undefined;

  // Answer selection handler
  const handleSelectAnswer = (optionIdx: number) => {
    if (examCompleted && isStudyMode) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const toggleFlag = (qId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Calculate scores and section passing rates
  const scoreStats = useMemo(() => {
    let totalCorrect = 0;
    const sectionTotals: Record<string, { total: number; correct: number }> = {
      core: { total: 0, correct: 0 },
      type1: { total: 0, correct: 0 },
      type2: { total: 0, correct: 0 },
      type3: { total: 0, correct: 0 },
    };

    activeQuestions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      const isRight = userAns === q.correctAnswer;
      if (isRight) totalCorrect++;

      if (sectionTotals[q.section]) {
        sectionTotals[q.section].total++;
        if (isRight) sectionTotals[q.section].correct++;
      }
    });

    const percent = activeQuestions.length > 0 ? (totalCorrect / activeQuestions.length) * 100 : 0;

    // Check individual section passes (70% requirement = 18/25)
    const corePass = sectionTotals.core.total > 0 && (sectionTotals.core.correct / sectionTotals.core.total) >= 0.7;
    const type1Pass = sectionTotals.type1.total > 0 && (sectionTotals.type1.correct / sectionTotals.type1.total) >= 0.7;
    const type2Pass = sectionTotals.type2.total > 0 && (sectionTotals.type2.correct / sectionTotals.type2.total) >= 0.7;
    const type3Pass = sectionTotals.type3.total > 0 && (sectionTotals.type3.correct / sectionTotals.type3.total) >= 0.7;

    const isUniversalCertified = corePass && type1Pass && type2Pass && type3Pass;

    return {
      totalCorrect,
      totalQuestions: activeQuestions.length,
      overallPercent: Math.round(percent),
      sectionTotals,
      corePass,
      type1Pass,
      type2Pass,
      type3Pass,
      isUniversalCertified,
    };
  }, [activeQuestions, selectedAnswers]);

  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hours > 0) {
      return `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Filtered navigator indices
  const filteredIndices = useMemo(() => {
    return activeQuestions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => {
        if (navFilter === 'flagged') return !!flaggedQuestions[q.id];
        if (navFilter === 'unanswered') return selectedAnswers[q.id] === undefined;
        if (navFilter === 'incorrect') {
          const ans = selectedAnswers[q.id];
          return ans !== undefined && ans !== q.correctAnswer;
        }
        return true;
      });
  }, [activeQuestions, navFilter, flaggedQuestions, selectedAnswers]);

  const handleDownloadScorecard = () => {
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const reportHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>EPA Section 608 Practice Examination Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
    h1 { color: #0369a1; border-bottom: 2px solid #0284c7; padding-bottom: 8px; font-size: 24px; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 13px; margin: 10px 0; }
    .pass { background: #dcfce7; color: #15803d; }
    .fail { background: #fee2e2; color: #b91c1c; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
    th { background: #f8fafc; font-size: 13px; }
    td { font-size: 14px; }
    .footer { margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  </style>
</head>
<body>
  <h1>EPA Section 608 Universal Examination Report</h1>
  <p><strong>Examinee:</strong> HVAC Technician Candidate · <strong>Date:</strong> ${dateStr}</p>
  <p><strong>Overall Score:</strong> ${scoreStats.totalCorrect} / ${scoreStats.totalQuestions} (${scoreStats.overallPercent}%)</p>
  
  <div class="badge ${scoreStats.isUniversalCertified ? 'pass' : scoreStats.overallPercent >= 70 ? 'pass' : 'fail'}">
    ${scoreStats.isUniversalCertified ? 'OFFICIAL RESULT: UNIVERSAL CERTIFIED' : scoreStats.overallPercent >= 70 ? 'OFFICIAL RESULT: SECTION PASSING' : 'OFFICIAL RESULT: RETEST REQUIRED'}
  </div>

  <h2>Section Breakdown (70% Mandatory Threshold)</h2>
  <table>
    <thead>
      <tr><th>Section Category</th><th>Score</th><th>Percentage</th><th>Certification Status</th></tr>
    </thead>
    <tbody>
      <tr><td>Core (Title VI Clean Air Act)</td><td>${scoreStats.sectionTotals.core.correct} / ${scoreStats.sectionTotals.core.total}</td><td>${Math.round((scoreStats.sectionTotals.core.correct / Math.max(1, scoreStats.sectionTotals.core.total)) * 100)}%</td><td>${scoreStats.corePass ? 'PASSED (≥ 70%)' : 'RETEST'}</td></tr>
      <tr><td>Type I (Small Appliances ≤ 5 lbs)</td><td>${scoreStats.sectionTotals.type1.correct} / ${scoreStats.sectionTotals.type1.total}</td><td>${Math.round((scoreStats.sectionTotals.type1.correct / Math.max(1, scoreStats.sectionTotals.type1.total)) * 100)}%</td><td>${scoreStats.type1Pass ? 'PASSED (≥ 70%)' : 'RETEST'}</td></tr>
      <tr><td>Type II (High-Pressure Systems)</td><td>${scoreStats.sectionTotals.type2.correct} / ${scoreStats.sectionTotals.type2.total}</td><td>${Math.round((scoreStats.sectionTotals.type2.correct / Math.max(1, scoreStats.sectionTotals.type2.total)) * 100)}%</td><td>${scoreStats.type2Pass ? 'PASSED (≥ 70%)' : 'RETEST'}</td></tr>
      <tr><td>Type III (Low-Pressure Chillers)</td><td>${scoreStats.sectionTotals.type3.correct} / ${scoreStats.sectionTotals.type3.total}</td><td>${Math.round((scoreStats.sectionTotals.type3.correct / Math.max(1, scoreStats.sectionTotals.type3.total)) * 100)}%</td><td>${scoreStats.type3Pass ? 'PASSED (≥ 70%)' : 'RETEST'}</td></tr>
    </tbody>
  </table>

  <div class="footer">
    Generated by HVAC CycleSim Certification Exam Lab · Validated against 40 CFR Part 82 Subpart F
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EPA_608_Scorecard_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Exam Header & Mode Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase text-sky-400 font-bold tracking-wider">
                EPA Clean Air Act Section 608 Certification Lab
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                Randomized Wording Engine v3.8
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              EPA 608 Practice Exam & Study Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulates the authentic 100-question Universal Examination and individual sections with randomized phrasing and realistic distractors. 70% per section required to pass.
            </p>
          </div>

          {/* Quick Exam Actions & Generator Trigger */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRegenerateWording}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
              title="Re-word and shuffle the question bank with different situational phrasing"
            >
              <span className={isRegenerating ? 'animate-spin' : ''}>🎲</span>
              <span>Re-Word & Shuffle Exam</span>
            </button>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setIsStudyMode(true);
                  setTimerActive(false);
                }}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                  isStudyMode ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Study Mode (Instant Feedback)
              </button>
              <button
                onClick={() => {
                  setIsStudyMode(false);
                  setTimerActive(true);
                }}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                  !isStudyMode ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Timed Exam Mode
              </button>
            </div>

            {!isStudyMode && !examCompleted && (
              <div className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                <span>⏱</span>
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4 text-xs font-medium">
          {[
            { id: 'universal', label: 'Universal Exam', sub: '100 Questions (All Types)', icon: '🏛️' },
            { id: 'core', label: 'Core Section', sub: '25 Qs · Ozone & Clean Air', icon: '🌍' },
            { id: 'type1', label: 'Type I', sub: '25 Qs · Small Appliances (≤5 lbs)', icon: '🧊' },
            { id: 'type2', label: 'Type II', sub: '25 Qs · High-Pressure Split & RTU', icon: '⚙️' },
            { id: 'type3', label: 'Type III', sub: '25 Qs · Low-Pressure Chillers', icon: '🏭' },
            { id: 'quick15', label: 'Quick Sprint', sub: '15 Qs · Rapid Knowledge Drill', icon: '⚡' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleStartExam(item.id as ExamMode)}
              className={`p-3 rounded-xl text-left transition-all border ${
                selectedMode === item.id
                  ? 'bg-sky-950/60 border-sky-500 text-sky-200 shadow-md ring-1 ring-sky-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span>{item.icon}</span>
                <span className="font-bold">{item.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 block">{item.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {!examCompleted ? (
        /* ================= QUESTION VIEW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Card (3 Cols) */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            {currentQ && (
              <div>
                {/* Question Metadata Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800 mb-5 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 font-mono text-sky-400 font-bold uppercase">
                      {currentQ.section.toUpperCase()} SECTION
                    </span>
                    {currentQ.wordingStyle && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {currentQ.wordingStyle === 'scenario'
                          ? 'Field Scenario'
                          : currentQ.wordingStyle === 'inverted'
                          ? 'Inverted Exception'
                          : currentQ.wordingStyle === 'equipment'
                          ? 'Equipment Application'
                          : currentQ.wordingStyle === 'regulatory'
                          ? 'Regulatory Standard'
                          : 'Direct Recall'}
                      </span>
                    )}
                    {currentQ.conceptTag && (
                      <span className="hidden sm:inline-block text-slate-400 font-mono text-[11px]">
                        [{currentQ.conceptTag}]
                      </span>
                    )}
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 font-mono">
                      Question {currentIndex + 1} of {activeQuestions.length}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFlag(currentQ.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                      flaggedQuestions[currentQ.id]
                        ? 'bg-amber-950/60 border-amber-600 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{flaggedQuestions[currentQ.id] ? '🚩' : '⚐'}</span>
                    <span>{flaggedQuestions[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
                  </button>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed mb-6 font-sans">
                  {currentQ.question}
                </h3>

                {/* Multiple Choice Options */}
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = currentAnswer === idx;
                    const showCorrectness = isStudyMode && isAnswered;
                    const isCorrect = idx === currentQ.correctAnswer;

                    let btnClass = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
                    if (showCorrectness) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-950/70 border-emerald-500 text-emerald-100 font-semibold ring-1 ring-emerald-500';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-950/70 border-rose-500 text-rose-100 ring-1 ring-rose-500';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-sky-950/70 border-sky-500 text-sky-100 font-semibold ring-1 ring-sky-500';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 text-xs sm:text-sm ${btnClass}`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Study Mode Immediate Explanation Box */}
                {isStudyMode && isAnswered && (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 mb-6 text-xs shadow-inner">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <span className={`font-bold font-mono text-sm flex items-center gap-1.5 ${
                        currentAnswer === currentQ.correctAnswer ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        <span>{currentAnswer === currentQ.correctAnswer ? '✓' : '✗'}</span>
                        <span>{currentAnswer === currentQ.correctAnswer ? 'Correct Answer' : 'Incorrect Response'}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-700">
                        {currentQ.regulationCitation}
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans leading-relaxed text-sm">
                      {currentQ.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Question Navigation Footer */}
            <div className="pt-5 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-3">
                {currentIndex === activeQuestions.length - 1 ? (
                  <button
                    onClick={() => setExamCompleted(true)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md active:scale-95"
                  >
                    Finish & Grade Exam →
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
                  >
                    Next Question →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Grid Navigator Drawer (1 Col) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Question Navigator
                </h4>
                <span className="text-xs font-mono text-sky-400 font-bold">
                  {Object.keys(selectedAnswers).length}/{activeQuestions.length}
                </span>
              </div>

              {/* Navigator Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 mb-3 text-[11px] font-mono">
                {(['all', 'flagged', 'unanswered'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setNavFilter(tab)}
                    className={`flex-1 py-1 rounded text-center transition-colors ${
                      navFilter === tab ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-5 gap-1.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredIndices.map(({ q, idx }) => {
                  const isAns = selectedAnswers[q.id] !== undefined;
                  const isFlag = !!flaggedQuestions[q.id];
                  const isCurr = currentIndex === idx;

                  let color = 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700';
                  if (isCurr) {
                    color = 'bg-sky-600 text-white font-bold ring-2 ring-sky-400 border-sky-400';
                  } else if (isFlag) {
                    color = 'bg-amber-950/80 text-amber-300 border-amber-600';
                  } else if (isAns) {
                    color = 'bg-slate-800 text-slate-200 border-slate-700';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg font-mono text-xs border transition-colors relative flex items-center justify-center ${color}`}
                    >
                      {idx + 1}
                      {isFlag && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredIndices.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-500 font-mono">
                  No questions match this filter.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={() => setExamCompleted(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-md active:scale-95"
              >
                Submit Exam for Official Scoring
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= RESULTS & CERTIFICATE BREAKDOWN ================= */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="text-center pb-6 border-b border-slate-800">
            <span className="text-5xl mb-3 block">
              {scoreStats.isUniversalCertified ? '🎖️' : scoreStats.overallPercent >= 70 ? '🏆' : '📚'}
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {scoreStats.isUniversalCertified
                ? 'Official EPA Section 608 Universal Certification Passed!'
                : scoreStats.overallPercent >= 70
                ? 'EPA Section Examination Passed!'
                : 'Practice Examination Completed — Review Required'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Final Composite Score: <span className="font-bold text-white font-mono">{scoreStats.totalCorrect} / {scoreStats.totalQuestions}</span> ({scoreStats.overallPercent}%)
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider border ${
                scoreStats.isUniversalCertified
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                  : scoreStats.overallPercent >= 70
                  ? 'bg-sky-950/80 text-sky-300 border-sky-600'
                  : 'bg-rose-950/80 text-rose-300 border-rose-600'
              }`}>
                {scoreStats.isUniversalCertified
                  ? 'UNIVERSAL CERTIFIED · All 4 Sections ≥ 70%'
                  : scoreStats.overallPercent >= 70
                  ? 'PARTIAL CERTIFICATION EARNED'
                  : 'RETEST RECOMMENDED · Minimum 70% Required'}
              </span>
            </div>
          </div>

          {/* Section by Section Breakdown */}
          <div className="my-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
              Section Performance Breakdown (70% Mandatory Threshold)
            </h4>

            {Object.entries(scoreStats.sectionTotals)
              .filter(([_, data]) => data.total > 0)
              .map(([sectionKey, data]) => {
                const secPercent = Math.round((data.correct / data.total) * 100);
                const secPassed = secPercent >= 70;

                return (
                  <div key={sectionKey} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-100 uppercase font-mono block">
                        {sectionKey === 'core'
                          ? 'Core Section (Ozone & Title VI Clean Air Act)'
                          : sectionKey === 'type1'
                          ? 'Type I (Small Appliances ≤ 5 lbs)'
                          : sectionKey === 'type2'
                          ? 'Type II (High & Very High-Pressure Equipment)'
                          : 'Type III (Low-Pressure Water Chillers)'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                        {data.correct} of {data.total} correct (Required: {Math.ceil(data.total * 0.7)})
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-lg font-bold font-mono ${secPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {secPercent}%
                      </span>
                      <span className={`text-xs block font-mono font-medium ${secPassed ? 'text-emerald-500' : 'text-rose-400'}`}>
                        {secPassed ? '✓ Passed' : '✗ Retest Needed'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Official Verification Certificate Footer / Actions */}
          <div className="pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setExamCompleted(false);
                  setIsStudyMode(true);
                  setCurrentIndex(0);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
              >
                Review All Questions & Explanations
              </button>

              <button
                onClick={handleDownloadScorecard}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-sky-400 font-medium text-xs transition-colors"
              >
                📄 Download Official Scorecard Report
              </button>
            </div>

            <button
              onClick={() => handleStartExam(selectedMode)}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
            >
              Retake Exam ↺
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
