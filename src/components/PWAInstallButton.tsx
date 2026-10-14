import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shadow-sm border ${
          isInstalled
            ? 'bg-slate-900 border-slate-800 text-emerald-400 cursor-default'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
        }`}
        title="Download and install HVAC CycleSim onto your phone, tablet, or laptop"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>{isInstalled ? 'App Installed' : 'Install to Device'}</span>
      </button>

      {/* Installation Instruction Modal for iOS Safari, Desktop, and Manual Android */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow">
                  ❄️
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Install HVAC CycleSim</h3>
                  <span className="text-[11px] text-slate-400">Offline PWA for Field Technicians</span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Download and install HVAC CycleSim directly onto your phone, tablet, or laptop. Once installed, it runs as a fast standalone app and works <strong>100% offline</strong> in basements, crawlspaces, and equipment rooms without internet.
            </p>

            {/* Platform Guides */}
            <div className="space-y-3 text-xs">
              {/* iPhone / iPad */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-sky-400 flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm">📱</span> Apple iPhone & iPad (Safari)
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-sans">
                  <li>Tap the <strong>Share</strong> button (box with upward arrow) in Safari.</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top-right corner.</li>
                </ol>
              </div>

              {/* Android */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm">🤖</span> Android (Google Chrome)
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-sans">
                  <li>Tap the <strong>three dots menu (⋮)</strong> in Chrome.</li>
                  <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                  <li>Confirm by tapping <strong>Install</strong>.</li>
                </ol>
              </div>

              {/* Windows / Mac / Chromebook */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-purple-400 flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm">💻</span> Windows PC / Mac / Chromebook (Chrome or Edge)
                </span>
                <p className="text-slate-300 font-sans leading-relaxed">
                  Look for the <strong>Install App icon (⊕ or computer monitor)</strong> on the right side of the browser URL address bar, then click <strong>Install</strong> to add it to your desktop taskbar/dock.
                </p>
              </div>
            </div>

            {/* If browser supports 1-click install prompt */}
            {isInstallable && (
              <button
                onClick={async () => {
                  const success = await install();
                  if (success) setShowModal(false);
                }}
                className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-md transition-colors"
              >
                Click to Install Now
              </button>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-xs text-slate-300 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
