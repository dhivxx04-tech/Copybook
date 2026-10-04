import React, { useState, useEffect } from 'react';
import { AnswerSheetData, SyllabusData } from '../../types/evaluation';
import { EVALUATION_CRITERIA_GUIDELINES } from '../../data/demoDatasets';
import { CheckCircle2, ArrowRight, BookOpen, AlertCircle, Info, Cpu, Check, Loader2 } from 'lucide-react';
import { ResearchPrincipleBanner } from '../ResearchPrincipleBanner';

interface AiEvaluationPageProps {
  syllabus: SyllabusData;
  answerSheet: AnswerSheetData;
  onProceedToTeacherRef: () => void;
}

const PROCESSING_STEPS = [
  'Understanding syllabus context',
  'Evaluating student answers',
  'Checking conceptual understanding',
  'Checking completeness',
  'Assigning marks',
  'Generating feedback',
];

export const AiEvaluationPage: React.FC<AiEvaluationPageProps> = ({
  syllabus,
  answerSheet,
  onProceedToTeacherRef,
}) => {
  const [completedSequence, setCompletedSequence] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'questions' | 'criteria'>('questions');

  useEffect(() => {
    // Step-by-step processing animation for realism
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCompletedSequence(current);
      if (current >= PROCESSING_STEPS.length) {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const totalAiMarks = answerSheet.questions.reduce((acc, q) => acc + q.aiMark, 0);
  const totalMaxMarks = answerSheet.questions.reduce((acc, q) => acc + q.maxMarks, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1.5 border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          Stage 04 — Predictive Inference
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              3. AI Evaluation
            </h1>
            <p className="text-sm text-slate-600">
              AI evaluates answers using syllabus context, assessing conceptual meaning rather than rigid keyword matching.
            </p>
          </div>
          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
            <span className="text-xs text-slate-500 block">AI Total Marks</span>
            <span className="text-xl font-bold font-mono text-indigo-900">
              {totalAiMarks} / {totalMaxMarks}
            </span>
          </div>
        </div>
      </div>

      {/* Processing Sequence Component */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            AI Processing Pipeline Sequence
          </span>
          {isProcessing ? (
            <span className="text-xs text-indigo-600 font-medium inline-flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Evaluating answers against syllabus...
            </span>
          ) : (
            <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              All 6 evaluation phases complete
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {PROCESSING_STEPS.map((step, idx) => {
            const isDone = idx < completedSequence;
            const isCurrent = idx === completedSequence && isProcessing;

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                    : isCurrent
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-mono shrink-0">
                    {idx + 1}
                  </span>
                )}
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs: Question-wise vs Evaluation Criteria */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'questions'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Question-wise Evaluation ({answerSheet.questions.length})
          </button>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'criteria'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Evaluation Criteria &amp; Rules
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Context: <span className="font-semibold text-slate-700">{syllabus.subject}</span>
        </div>
      </div>

      {activeTab === 'questions' ? (
        <div className="space-y-6">
          {answerSheet.questions.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Question Header & AI Mark */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                      Question {q.questionNumber}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Max: {q.maxMarks} marks
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    {q.questionText}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1.5 shrink-0 bg-indigo-50/80 border border-indigo-100 px-3 py-1.5 rounded-lg text-indigo-950">
                  <span className="text-xs font-medium text-indigo-700">AI Mark:</span>
                  <span className="text-base font-bold font-mono text-indigo-900">
                    {q.aiMark} / {q.maxMarks}
                  </span>
                </div>
              </div>

              {/* Student Descriptive Answer */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
                  Student&apos;s Submitted Answer
                </span>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{q.studentAnswer}&rdquo;
                </p>
              </div>

              {/* Concept Evaluation Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Correct Concepts */}
                <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Correct Concepts Identified</span>
                  </div>
                  {q.correctConcepts && q.correctConcepts.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                      {q.correctConcepts.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">None identified</p>
                  )}
                </div>

                {/* Missing / Incorrect Concepts */}
                <div className="bg-amber-50/40 border border-amber-100/80 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Missing / Incomplete Concepts</span>
                  </div>
                  {q.missingConcepts && q.missingConcepts.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                      {q.missingConcepts.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-700 font-medium">
                      ✓ No missing concepts; explanation is complete.
                    </p>
                  )}
                </div>
              </div>

              {/* AI Feedback */}
              <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 block">
                  AI Feedback
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  &ldquo;{q.aiFeedback}&rdquo;
                </p>
              </div>

              {q.partialUnderstandingNotes && (
                <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pl-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{q.partialUnderstandingNotes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Evaluation Criteria Reference Card */
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Prescribed Evaluation Criteria
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The AI evaluation framework adheres to these pedagogical standards:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EVALUATION_CRITERIA_GUIDELINES.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1"
              >
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span>{item.criterion}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Semantic Understanding Notice */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-950 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Semantic Meaning Over Exact Keyword Matching</span>
            </div>
            <p className="text-amber-900/90 leading-relaxed">
              Students frequently use diverse phrasing or synonyms to express correct scientific mechanisms. The AI model evaluates underlying conceptual coherence and logical completeness rather than punishing vocabulary variations.
            </p>
          </div>
        </div>
      )}

      {/* Ground Truth Principle Reminder */}
      <ResearchPrincipleBanner compact />

      {/* Action to Next Step */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onProceedToTeacherRef}
          className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <span>Proceed to Teacher Ground Truth Entry</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
