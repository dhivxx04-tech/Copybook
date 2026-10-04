import React from 'react';
import { WorkflowStep } from '../types/evaluation';
import { Sparkles, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentStep: WorkflowStep;
  onNavigate: (step: WorkflowStep) => void;
  onReset: () => void;
  onLoadDemo: () => void;
  isDemoActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigate,
  onReset,
  onLoadDemo,
  isDemoActive,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  AI Examination Evaluator
                </span>
              </div>
              <span className="block text-xs text-slate-500 font-normal">
                Syllabus-Context Evaluation Research Prototype
              </span>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors hover:text-slate-900 ${
                currentStep === 'home' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('syllabus')}
              className={`transition-colors hover:text-slate-900 ${
                currentStep === 'syllabus' || currentStep === 'syllabus-understanding'
                  ? 'text-indigo-600 font-semibold'
                  : ''
              }`}
            >
              Syllabus
            </button>
            <button
              onClick={() => onNavigate('answer-sheet')}
              className={`transition-colors hover:text-slate-900 ${
                currentStep === 'answer-sheet' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Answer Sheet
            </button>
            <button
              onClick={() => onNavigate('ai-evaluation')}
              className={`transition-colors hover:text-slate-900 ${
                currentStep === 'ai-evaluation' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              AI Evaluation
            </button>
            <button
              onClick={() => onNavigate('teacher-reference')}
              className={`transition-colors hover:text-slate-900 ${
                currentStep === 'teacher-reference' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Ground Truth
            </button>
            <button
              onClick={() => onNavigate('accuracy-analysis')}
              className={`transition-colors hover:text-slate-900 ${
                currentStep === 'accuracy-analysis' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Accuracy Analysis
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onLoadDemo}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 border whitespace-nowrap ${
                isDemoActive
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              title="Load standard Biology & Photosynthesis demo evaluation dataset"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isDemoActive ? 'Demo Active' : 'Try Demo'}</span>
            </button>
            <button
              onClick={onReset}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
              title="Reset workflow to start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
