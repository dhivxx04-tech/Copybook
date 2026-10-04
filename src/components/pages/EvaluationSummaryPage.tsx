import React, { useState } from 'react';
import { AnswerSheetData, SyllabusData, calculateAccuracy, WorkflowStep } from '../../types/evaluation';
import { 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  Award, 
  Scale, 
  ArrowLeft, 
  Info,
  BookOpen
} from 'lucide-react';
import { ReportModal } from '../ReportModal';
import { ResearchPrincipleBanner } from '../ResearchPrincipleBanner';

interface EvaluationSummaryPageProps {
  syllabus: SyllabusData;
  answerSheet: AnswerSheetData;
  onReviewEvaluation: () => void;
  onStartNewEvaluation: () => void;
  onNavigateStep: (step: WorkflowStep) => void;
}

export const EvaluationSummaryPage: React.FC<EvaluationSummaryPageProps> = ({
  syllabus,
  answerSheet,
  onReviewEvaluation,
  onStartNewEvaluation,
  onNavigateStep,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const metrics = calculateAccuracy(answerSheet.questions);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">
      {/* Header section */}
      <div className="space-y-1.5 border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          Stage 07 — Final Synthesis
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Evaluation Summary
        </h1>
        <p className="text-sm text-slate-600">
          Synthesized performance outcomes and empirical accuracy metrics benchmarked against teacher ground truth.
        </p>
      </div>

      {/* Student & Subject Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student
            </span>
            <div className="text-base font-bold text-slate-900">
              {answerSheet.studentName}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Script: {answerSheet.fileName}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Subject
            </span>
            <div className="text-base font-bold text-slate-900">
              {answerSheet.subject}
            </div>
            <span className="text-[11px] text-slate-400">
              Context: {syllabus.topic || syllabus.subject}
            </span>
          </div>

          <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Knowledge Context
            </span>
            <div className="text-xs font-medium text-slate-800 line-clamp-2">
              {syllabus.units.join(' · ')}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Prescribed syllabus verified
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Marks & Accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marks Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Marks Comparison
            </h3>
            <span className="text-xs font-mono text-slate-400">Total Score</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* AI Total */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-lg space-y-1">
              <span className="text-xs font-semibold text-indigo-900">
                AI Total
              </span>
              <div className="text-2xl font-extrabold font-mono text-indigo-900">
                {metrics.totalAiMarks} / {metrics.totalMaxMarks}
              </div>
              <span className="text-[10px] text-indigo-700 block">
                Model Prediction
              </span>
            </div>

            {/* Teacher Total */}
            <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-lg space-y-1">
              <span className="text-xs font-semibold text-slate-900">
                Teacher Total
              </span>
              <div className="text-2xl font-extrabold font-mono text-slate-900">
                {metrics.totalTeacherMarks} / {metrics.totalMaxMarks}
              </div>
              <span className="text-[10px] text-slate-600 block">
                Ground Truth Reference
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 pt-1 flex items-center justify-between">
            <span>Overall Score Differential:</span>
            <span className="font-mono font-bold text-slate-800">
              |{metrics.totalTeacherMarks} - {metrics.totalAiMarks}| = {Math.abs(metrics.totalTeacherMarks - metrics.totalAiMarks).toFixed(1)} marks
            </span>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              Accuracy Benchmark
            </h3>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Demo / Sample Result
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <span className="font-medium text-slate-700">Mark Agreement:</span>
              <span className="font-mono font-bold text-indigo-900 text-sm">
                {metrics.markAgreement}%
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <span className="font-medium text-slate-700">Average Absolute Error (MAE):</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {metrics.mae} marks
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <span className="font-medium text-slate-700">Exact Agreement:</span>
              <span className="font-mono font-bold text-emerald-800 text-sm">
                {metrics.exactAgreement}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall AI Feedback */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Overall AI Feedback
        </h3>
        <blockquote className="p-4 bg-indigo-50/50 border-l-4 border-indigo-600 rounded-r-lg text-slate-800 text-sm leading-relaxed italic">
          &ldquo;The student demonstrates a good understanding of the major concepts. Some answers can be improved by including the missing concepts identified during evaluation.&rdquo;
        </blockquote>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReviewEvaluation}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Review Evaluation</span>
        </button>

        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Download Evaluation Report</span>
        </button>

        <button
          type="button"
          onClick={onStartNewEvaluation}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start New Evaluation</span>
        </button>
      </div>

      {/* Research Principle Ground Truth Reminder */}
      <ResearchPrincipleBanner compact />

      {/* FINAL UI MESSAGE (Required in Section 17) */}
      <div className="border-t border-slate-200 pt-10 text-center space-y-4">
        {/* Research flow banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md text-[11px] font-mono text-slate-700 font-medium">
          <span>SYLLABUS</span>
          <span className="text-slate-400">→</span>
          <span>CONTEXT</span>
          <span className="text-slate-400">→</span>
          <span className="text-indigo-700 font-bold">AI EVALUATION</span>
          <span className="text-slate-400">→</span>
          <span className="text-slate-900 font-bold">TEACHER GROUND TRUTH</span>
          <span className="text-slate-400">→</span>
          <span className="text-emerald-700 font-bold">ACCURACY</span>
        </div>

        {/* Required Message */}
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            From Syllabus Context to Accurate AI Evaluation
          </h2>
          <p className="text-sm font-semibold tracking-wide text-indigo-700 uppercase">
            Measure. Compare. Improve.
          </p>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        syllabus={syllabus}
        answerSheet={answerSheet}
      />
    </div>
  );
};
