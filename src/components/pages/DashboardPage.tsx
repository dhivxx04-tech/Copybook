import React from 'react';
import { BookOpen, Cpu, Target, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResearchPrincipleBanner } from '../ResearchPrincipleBanner';

interface DashboardPageProps {
  onStartEvaluation: () => void;
  onTryDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartEvaluation,
  onTryDemo,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-md text-xs font-medium text-indigo-800">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
          <span>R&D Research Prototype</span>
          <span className="text-indigo-400">·</span>
          <span>Descriptive Answer Assessment</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          AI Examination Evaluator
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Syllabus-context-based AI evaluation of descriptive student answers
        </p>

        {/* Primary & Secondary Call to Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartEvaluation}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors inline-flex items-center justify-center gap-2"
          >
            <span>Start Evaluation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Try Demo</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 pt-1">
          Demo loads standard Biology (Photosynthesis) syllabus & sample descriptive answers with teacher ground truth.
        </p>
      </div>

      {/* Core Research Idea Callout */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <span className="text-xs font-semibold tracking-wider text-indigo-700 uppercase">
            Core Research Question
          </span>
          <blockquote className="text-lg sm:text-xl font-medium text-slate-900 italic">
            &ldquo;Can AI accurately evaluate descriptive student answers when the prescribed syllabus is provided as contextual knowledge?&rdquo;
          </blockquote>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            Rather than relying solely on surface keyword-matching, the system contextualizes descriptive student explanations against unit concepts, measuring marking agreement and mean absolute error relative to qualified teacher judgment.
          </p>
        </div>
      </div>

      {/* Three Simple Research Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Three Research Pillars
          </h2>
          <span className="text-xs text-slate-500">Evaluation Accuracy Focus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Syllabus Context
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The prescribed syllabus provides the knowledge context for evaluation.
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Contextual concept grounding</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                AI Evaluation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI evaluates student answers based on correctness, concepts and completeness.
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Semantic & partial understanding</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Accuracy Measurement
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI evaluation is compared against teacher evaluation.
              </p>
            </div>
            <div className="pt-5 mt-5 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mean Absolute Error & Agreement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Research Principle Ground Truth Banner */}
      <ResearchPrincipleBanner />

      {/* Strict Research Scope Note */}
      <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Evaluation Pipeline:</span>
          <span>Syllabus → Context → AI Evaluation → Teacher Ground Truth → Accuracy</span>
        </div>
        <div className="font-mono text-slate-400">
          Target Domain: Descriptive Academic Answers
        </div>
      </div>
    </div>
  );
};
