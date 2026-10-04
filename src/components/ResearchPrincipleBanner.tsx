import React from 'react';
import { Scale } from 'lucide-react';

interface ResearchPrincipleBannerProps {
  compact?: boolean;
}

export const ResearchPrincipleBanner: React.FC<ResearchPrincipleBannerProps> = ({
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-950 flex items-start gap-2.5">
        <Scale className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-indigo-900">Research Ground Truth: </span>
          <span>Teacher evaluation is the reference ground truth; AI evaluation is the system prediction under investigation.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 mt-0.5">
            <Scale className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Fundamental Research Premise
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              <strong className="text-indigo-200">Teacher Evaluation</strong> serves as the validated Reference / Ground Truth.
              {' '}
              <strong className="text-indigo-200">AI Evaluation</strong> operates as the System Prediction.
              {' '}
              The research purpose is to measure algorithmic accuracy and consistency when guided by syllabus knowledge.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono shrink-0 px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700 text-slate-300">
          <span>Teacher (Ground Truth)</span>
          <span className="text-slate-500">↔</span>
          <span className="text-indigo-300">AI (Prediction)</span>
        </div>
      </div>
    </div>
  );
};
