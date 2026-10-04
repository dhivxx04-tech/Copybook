import React, { useState } from 'react';
import { AnswerSheetData, calculateAccuracy } from '../../types/evaluation';
import { 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Star, 
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { ResearchPrincipleBanner } from '../ResearchPrincipleBanner';

interface AccuracyAnalysisPageProps {
  answerSheet: AnswerSheetData;
  onProceedToSummary: () => void;
  onBackToTeacherRef: () => void;
}

export const AccuracyAnalysisPage: React.FC<AccuracyAnalysisPageProps> = ({
  answerSheet,
  onProceedToSummary,
  onBackToTeacherRef,
}) => {
  const [feedbackRating, setFeedbackRating] = useState<number>(4.5);
  const [conceptAccuracy] = useState<number>(92.5);

  const metrics = calculateAccuracy(
    answerSheet.questions,
    feedbackRating,
    conceptAccuracy
  );

  // Math formula string representation
  const formulaSteps = answerSheet.questions.map((q) => {
    const diff = Math.abs(q.teacherMark - q.aiMark);
    return `|${q.teacherMark} - ${q.aiMark}|`;
  });
  const sumDiff = answerSheet.questions.reduce(
    (acc, q) => acc + Math.abs(q.teacherMark - q.aiMark),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">
      {/* Header section */}
      <div className="space-y-1.5 border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          <span>Stage 06 — Empirical Benchmarking (Primary Research Focus)</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              5. Evaluation Accuracy
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Comparison between AI-generated marks and teacher-assigned marks
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg shrink-0">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium">Demo / Sample Result — Not Actual Research Results</span>
          </div>
        </div>
      </div>

      {/* Prominent Principle Banner */}
      <ResearchPrincipleBanner />

      {/* 5 Prominently Displayed Research Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Evaluation Accuracy Metrics
          </h2>
          <span className="text-[11px] text-slate-500">
            Computed against N = {answerSheet.questions.length} descriptive questions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Metric 1: Mark Agreement */}
          <div className="bg-white border-2 border-indigo-600/30 rounded-xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Mark Agreement
                </span>
                <span className="text-[10px] font-mono text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
                  Normalized
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-indigo-900 tracking-tight">
                {metrics.markAgreement}%
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Degree of alignment between AI and teacher mark scores.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold text-amber-700 bg-amber-50 px-1 py-0.5 rounded">
                Demo / Sample Result
              </span>
            </div>
          </div>

          {/* Metric 2: Average Absolute Error (MAE) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Mean Abs Error (MAE)
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  Error Metric
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {metrics.mae} <span className="text-sm font-normal text-slate-500">marks</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight font-mono">
                MAE = Σ|Teacher - AI| / N
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold text-amber-700 bg-amber-50 px-1 py-0.5 rounded">
                Demo / Sample Result
              </span>
            </div>
          </div>

          {/* Metric 3: Exact Agreement */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Exact Agreement
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  Direct Match
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {metrics.exactAgreement}%
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Exact matches / Total descriptive answers.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold text-amber-700 bg-amber-50 px-1 py-0.5 rounded">
                Demo / Sample Result
              </span>
            </div>
          </div>

          {/* Metric 4: Concept Identification Accuracy */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Concept Accuracy
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  Classification
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {metrics.conceptIdentificationAccuracy}%
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Concepts correctly classified as present, missing, or incorrect.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold text-amber-700 bg-amber-50 px-1 py-0.5 rounded">
                Demo / Sample Result
              </span>
            </div>
          </div>

          {/* Metric 5: Feedback Relevance */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Feedback Relevance
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  Qualitative
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {metrics.feedbackRelevance} <span className="text-sm font-normal text-slate-500">/ 5</span>
              </div>

              {/* Interactive rating adjuster */}
              <div className="flex items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="focus:outline-none"
                    title={`Rate feedback relevance as ${star}/5`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 cursor-pointer transition-colors ${
                        star <= Math.round(feedbackRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold text-amber-700 bg-amber-50 px-1 py-0.5 rounded">
                Demo / Sample Result
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Visualization: Teacher Marks vs AI Marks Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Evaluation Comparison: Teacher Marks vs AI Marks
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical side-by-side comparison per descriptive question
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-900 inline-block"></span>
              <span className="text-slate-700">Teacher (Ground Truth)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block"></span>
              <span className="text-indigo-900">AI (Prediction)</span>
            </div>
          </div>
        </div>

        {/* Comparison Bars */}
        <div className="space-y-6 pt-2">
          {answerSheet.questions.map((q) => {
            const diff = Math.abs(q.teacherMark - q.aiMark);
            const teacherPercent = (q.teacherMark / q.maxMarks) * 100;
            const aiPercent = (q.aiMark / q.maxMarks) * 100;
            const hasDifference = diff > 0;

            return (
              <div key={q.id} className="space-y-2 bg-slate-50/70 p-4 rounded-lg border border-slate-200/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Question {q.questionNumber}:</span>
                    <span className="text-slate-600 font-medium truncate max-w-md">
                      {q.questionText}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono shrink-0">
                    <span className="text-slate-900 font-semibold">
                      Teacher: {q.teacherMark}/{q.maxMarks}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-indigo-900 font-semibold">
                      AI: {q.aiMark}/{q.maxMarks}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        hasDifference
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      Δ = {diff.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Progress bars comparing the two */}
                <div className="space-y-1.5 pt-1">
                  {/* Teacher bar */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Teacher Ground Truth</span>
                      <span>{q.teacherMark} marks ({Math.round(teacherPercent)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-500"
                        style={{ width: `${teacherPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* AI bar */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>AI Model Prediction</span>
                      <span>{q.aiMark} marks ({Math.round(aiPercent)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${aiPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MAE Calculation Breakdown Card */}
        <div className="bg-slate-100/70 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-800">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              Mathematical Derivation of Mean Absolute Error (MAE)
            </span>
            <span className="font-mono text-indigo-900">
              MAE = {metrics.mae} marks
            </span>
          </div>
          <div className="font-mono text-slate-600 bg-white p-2.5 rounded border border-slate-200 text-[11px] overflow-x-auto">
            MAE = ({formulaSteps.join(' + ')}) / {answerSheet.questions.length} = ({sumDiff}) / {answerSheet.questions.length} = {metrics.mae}
          </div>
        </div>
      </div>

      {/* Mark Difference Breakdown Table with Highlighting */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Question-wise Mark Difference Analysis
          </h3>
          <p className="text-xs text-slate-500">
            Difference = |Teacher Mark − AI Mark|. Questions where the difference is higher are flagged for diagnostic inspection.
          </p>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Question</th>
              <th className="py-3 px-4 text-center">AI Mark</th>
              <th className="py-3 px-4 text-center">Teacher Mark</th>
              <th className="py-3 px-4 text-center">Mark Difference |Δ|</th>
              <th className="py-3 px-4 sm:px-6">Accuracy Diagnosis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {answerSheet.questions.map((q) => {
              const diff = Math.abs(q.teacherMark - q.aiMark);
              const isExact = diff === 0;

              return (
                <tr
                  key={q.id}
                  className={`transition-colors ${
                    diff > 0 ? 'bg-amber-50/30 hover:bg-amber-50/50' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="font-bold text-slate-900">Q{q.questionNumber}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-indigo-900">
                    {q.aiMark} / {q.maxMarks}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-900">
                    {q.teacherMark} / {q.maxMarks}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        isExact
                          ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                          : 'text-amber-800 bg-amber-100 border border-amber-300'
                      }`}
                    >
                      {diff === 0 ? '0' : diff.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600">
                    {isExact ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Complete agreement with teacher judgment
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-900 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Minor variance ({diff.toFixed(1)} marks) in conceptual weighting
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={onBackToTeacherRef}
          className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
        >
          ← Adjust Teacher Ground Truth Marks
        </button>

        <button
          type="button"
          onClick={onProceedToSummary}
          className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Final Evaluation Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
