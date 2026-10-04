import React, { useState } from 'react';
import { AnswerSheetData } from '../../types/evaluation';
import { Scale, ArrowRight, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { ResearchPrincipleBanner } from '../ResearchPrincipleBanner';

interface TeacherReferencePageProps {
  answerSheet: AnswerSheetData;
  onUpdateAnswerSheet: (updated: AnswerSheetData) => void;
  onProceedToAccuracy: () => void;
}

export const TeacherReferencePage: React.FC<TeacherReferencePageProps> = ({
  answerSheet,
  onUpdateAnswerSheet,
  onProceedToAccuracy,
}) => {
  const [marks, setMarks] = useState<{ [id: string]: number }>(() => {
    const initial: { [id: string]: number } = {};
    answerSheet.questions.forEach((q) => {
      initial[q.id] = q.teacherMark;
    });
    return initial;
  });

  const handleMarkChange = (id: string, value: string, maxMarks: number) => {
    const num = parseFloat(value);
    const clamped = isNaN(num) ? 0 : Math.min(Math.max(0, num), maxMarks);
    setMarks((prev) => ({ ...prev, [id]: clamped }));
  };

  const handleSaveAndCompare = () => {
    const updatedQuestions = answerSheet.questions.map((q) => ({
      ...q,
      teacherMark: marks[q.id] !== undefined ? marks[q.id] : q.teacherMark,
    }));

    onUpdateAnswerSheet({
      ...answerSheet,
      questions: updatedQuestions,
    });

    onProceedToAccuracy();
  };

  const handleResetToExactDemo = () => {
    const reset: { [id: string]: number } = {};
    answerSheet.questions.forEach((q) => {
      // Biology demo values: Q1: 4, Q2: 3, Q3: 5
      reset[q.id] = q.aiMark;
    });
    setMarks(reset);
  };

  const handleAddSlightVariance = () => {
    const varied: { [id: string]: number } = {};
    answerSheet.questions.forEach((q, idx) => {
      if (idx === 0) varied[q.id] = 4;
      else if (idx === 1) varied[q.id] = 3.5;
      else varied[q.id] = 5;
    });
    setMarks(varied);
  };

  const totalAi = answerSheet.questions.reduce((acc, q) => acc + q.aiMark, 0);
  const totalTeacher = answerSheet.questions.reduce(
    (acc, q) => acc + (marks[q.id] !== undefined ? marks[q.id] : q.teacherMark),
    0
  );
  const totalMax = answerSheet.questions.reduce((acc, q) => acc + q.maxMarks, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div className="space-y-1.5 border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          Stage 05 — Ground Truth Establishment
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              4. Teacher Evaluation — Ground Truth
            </h1>
            <p className="text-sm text-slate-600">
              Enter the marks assigned by the teacher for comparison with AI evaluation.
            </p>
          </div>
          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
            <span className="text-xs text-slate-500 block">Total Comparison</span>
            <span className="text-base font-bold font-mono text-slate-900">
              Teacher: <span className="text-indigo-900">{totalTeacher.toFixed(1)}</span> / {totalMax}
              {' '}
              <span className="text-slate-400 font-normal">vs AI: {totalAi}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Principle Banner */}
      <ResearchPrincipleBanner />

      {/* Ground Truth Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Question-wise Ground Truth Entry
            </h3>
            <p className="text-xs text-slate-500">
              Teacher marks represent empirical reference data against which model accuracy is measured.
            </p>
          </div>

          {/* Quick preset buttons for research tests */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToExactDemo}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Set teacher marks equal to AI predictions"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Exact Match (Demo)</span>
            </button>
            <button
              type="button"
              onClick={handleAddSlightVariance}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Add slight variance to simulate human grading subjectivity"
            >
              <Scale className="w-3 h-3 text-indigo-600" />
              <span>Slight Variance (MAE 0.17)</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Question</th>
                <th className="py-3 px-4 text-center">Max Marks</th>
                <th className="py-3 px-4 text-center">
                  <span className="text-indigo-900">AI Mark (Prediction)</span>
                </th>
                <th className="py-3 px-4 sm:px-6 text-center">
                  <span className="text-slate-900 font-bold">Teacher Mark (Ground Truth)</span>
                </th>
                <th className="py-3 px-4 text-center">Difference |Δ|</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {answerSheet.questions.map((q) => {
                const currentTeacherMark = marks[q.id] !== undefined ? marks[q.id] : q.teacherMark;
                const diff = Math.abs(currentTeacherMark - q.aiMark);
                const isExact = diff === 0;

                return (
                  <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Question details */}
                    <td className="py-4 px-4 sm:px-6 max-w-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            Q{q.questionNumber}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500 font-normal truncate">
                            {q.questionText}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic line-clamp-1">
                          &ldquo;{q.studentAnswer}&rdquo;
                        </p>
                      </div>
                    </td>

                    {/* Max marks */}
                    <td className="py-4 px-4 text-center font-mono text-slate-600">
                      {q.maxMarks}
                    </td>

                    {/* AI Mark */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-3 py-1 font-mono font-semibold text-indigo-900 bg-indigo-50 border border-indigo-100 rounded">
                        {q.aiMark} / {q.maxMarks}
                      </span>
                    </td>

                    {/* Teacher Mark (Editable input) */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="inline-flex items-center gap-2">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={q.maxMarks}
                          value={currentTeacherMark}
                          onChange={(e) => handleMarkChange(q.id, e.target.value, q.maxMarks)}
                          className="w-16 px-2.5 py-1.5 text-center font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm shadow-2xs"
                        />
                        <span className="text-slate-400 font-mono text-xs">/ {q.maxMarks}</span>
                      </div>
                    </td>

                    {/* Difference */}
                    <td className="py-4 px-4 text-center">
                      {isExact ? (
                        <span className="inline-flex items-center gap-1 font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          0 (Exact)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          {diff.toFixed(1)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-2">
          <div>
            Teacher marks are directly saved as the <strong>authoritative ground truth benchmark</strong>.
          </div>
          <div className="text-slate-500 font-mono">
            {answerSheet.questions.length} questions registered
          </div>
        </div>
      </div>

      {/* Action: Compare Evaluations */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-500">
          Next step: Calculate Mean Absolute Error (MAE), exact agreement, and mark difference distributions.
        </p>
        <button
          type="button"
          onClick={handleSaveAndCompare}
          className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Compare Evaluations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
