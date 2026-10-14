/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TroubleshootingGame } from './components/TroubleshootingGame';
import { VirtualLab } from './components/VirtualLab';
import { EPAExam } from './components/EPAExam';
import { StudyGuides } from './components/StudyGuides';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

type MainView = 'troubleshoot' | 'lab' | 'epa' | 'study';

export default function App() {
  const [currentView, setCurrentView] = useState<MainView>('troubleshoot');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => setCurrentView('troubleshoot')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-sky-400 transition-colors"
        >
          HVAC CycleSim
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentView('troubleshoot')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'troubleshoot'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1'
                : 'hover:text-white'
            }`}
          >
            Troubleshooting Scenarios
          </button>
          <button
            onClick={() => setCurrentView('lab')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'lab'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1'
                : 'hover:text-white'
            }`}
          >
            Virtual Lab
          </button>
          <button
            onClick={() => setCurrentView('epa')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'epa'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1'
                : 'hover:text-white'
            }`}
          >
            EPA 608 Exams
          </button>
          <button
            onClick={() => setCurrentView('study')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'study'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-1'
                : 'hover:text-white'
            }`}
          >
            Study Guides & P-T
          </button>
        </nav>

        {/* Zone 3: Install/Download App + primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <PWAInstallButton />
          <button
            onClick={() => setCurrentView('epa')}
            className="hidden sm:inline-block px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Take EPA Exam
          </button>
        </div>
      </header>

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Mobile Secondary Navigation Row (below header) */}
      <div className="md:hidden flex items-center justify-around p-2 bg-slate-900 border-b border-slate-800 text-xs font-medium">
        <button
          onClick={() => setCurrentView('troubleshoot')}
          className={`px-3 py-1.5 rounded-md ${currentView === 'troubleshoot' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
        >
          Scenarios
        </button>
        <button
          onClick={() => setCurrentView('lab')}
          className={`px-3 py-1.5 rounded-md ${currentView === 'lab' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
        >
          Virtual Lab
        </button>
        <button
          onClick={() => setCurrentView('epa')}
          className={`px-3 py-1.5 rounded-md ${currentView === 'epa' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
        >
          EPA 608
        </button>
        <button
          onClick={() => setCurrentView('study')}
          className={`px-3 py-1.5 rounded-md ${currentView === 'study' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
        >
          Guides
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'troubleshoot' && <TroubleshootingGame />}
        {currentView === 'lab' && <VirtualLab />}
        {currentView === 'epa' && <EPAExam />}
        {currentView === 'study' && <StudyGuides />}
      </main>

      {/* Clean Unboxed Footer */}
      <footer className="border-t border-slate-900 py-6 px-6 text-center text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span>HVAC CycleSim</span>
          <span aria-hidden="true">·</span>
          <span>Refrigeration Cycle Troubleshooting Simulator</span>
          <span aria-hidden="true">·</span>
          <span>EPA Section 608 Certification Prep</span>
          <span aria-hidden="true">·</span>
          <span>Clean Air Act Title VI Compliance</span>
        </div>
      </footer>
    </div>
  );
}
