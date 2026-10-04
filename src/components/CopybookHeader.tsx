import React from 'react';
import { CopybookStep } from '../types/copybook';
import { Check, Menu, TrendingUp, History } from 'lucide-react';

interface CopybookHeaderProps {
  currentStep: CopybookStep;
  onNavigate: (step: CopybookStep) => void;
  onOpenRecords: () => void;
  onOpenBenchmark: () => void;
  onOpenHistory: () => void;
  needsReviewCount: number;
}

const STEPS: { id: CopybookStep; stepNum: number; label: string }[] = [
  { id: 'upload', stepNum: 1, label: 'Upload' },
  { id: 'register', stepNum: 2, label: 'Review register' },
  { id: 'student-detail', stepNum: 3, label: 'Student detail' },
  { id: 'approve', stepNum: 4, label: 'Approve & notify' },
];

export const CopybookHeader: React.FC<CopybookHeaderProps> = ({
  currentStep,
  onNavigate,
  onOpenRecords,
  onOpenBenchmark,
  onOpenHistory,
  needsReviewCount,
}) => {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <header className="sticky top-0 z-30 bg-[#0d121f] border-b border-[#1f283d] px-4 sm:px-8 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand + Prototype pill */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <span className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight group-hover:text-indigo-200 transition-colors">
              Copybook
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest text-slate-300 bg-[#1a2336] rounded-full border border-slate-700/80 font-medium">
              PROTOTYPE
            </span>
          </button>
        </div>

        {/* Center: 4-Step Stepper */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-xs">
          {STEPS.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = idx < currentIdx;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <div
                    className={`w-6 lg:w-8 h-[1px] transition-colors ${
                      isCompleted ? 'bg-emerald-500/80' : 'bg-slate-700'
                    }`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => onNavigate(step.id)}
                  className={`flex items-center gap-2 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1b253b] text-white ring-1 ring-slate-700 shadow-sm'
                      : isCompleted
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      step.stepNum
                    )}
                  </span>
                  <span className={`font-medium ${isActive ? 'text-white' : ''}`}>
                    {step.label}
                  </span>
                  {step.id === 'register' && needsReviewCount > 0 && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Right: History + Accuracy Benchmark + Records button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-300 bg-[#131e33] hover:bg-[#1a2b4a] hover:text-white rounded-lg border border-blue-900/60 transition-colors cursor-pointer"
            title="Answer-Sheet Evaluation History (Persistent Database)"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            type="button"
            onClick={onOpenBenchmark}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-[#122325] hover:bg-[#182f32] rounded-lg border border-emerald-800/60 transition-colors cursor-pointer"
            title="View AI vs Teacher Ground Truth Benchmark"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Accuracy</span>
            <span className="font-mono text-[11px] text-emerald-400 font-bold">r=0.98</span>
          </button>

          <button
            type="button"
            onClick={onOpenRecords}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#161f31] hover:bg-[#1f2b44] hover:text-white rounded-lg border border-[#2b3954] transition-colors cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Records</span>
          </button>
        </div>
      </div>

      {/* Mobile Stepper Bar */}
      <div className="flex md:hidden items-center justify-between gap-1 pt-2 border-t border-[#1a2337] mt-2 overflow-x-auto text-[11px]">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          return (
            <button
              key={step.id}
              onClick={() => onNavigate(step.id)}
              className={`px-2 py-1 rounded text-center whitespace-nowrap ${
                isActive ? 'bg-[#1b253b] text-blue-400 font-semibold' : 'text-slate-400'
              }`}
            >
              {step.stepNum}. {step.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

