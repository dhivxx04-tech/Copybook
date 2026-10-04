import React from 'react';
import { AnswerSheetData, SyllabusData, calculateAccuracy } from '../types/evaluation';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  syllabus: SyllabusData;
  answerSheet: AnswerSheetData;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  syllabus,
  answerSheet,
}) => {
  if (!isOpen) return null;

  const metrics = calculateAccuracy(answerSheet.questions);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const reportContent = `
================================================================================
AI EXAMINATION ANSWER SHEET EVALUATION SYSTEM - R&D RESEARCH REPORT
================================================================================
Generated: ${new Date().toLocaleString()}
Research Premise: Syllabus-Context-Based AI Evaluation of Descriptive Answers
Ground Truth: Teacher Assigned Marks
System Prediction: AI Model Evaluation

--------------------------------------------------------------------------------
1. METADATA & CONTEXT
--------------------------------------------------------------------------------
Student Name:     ${answerSheet.studentName}
Subject:          ${answerSheet.subject}
Syllabus File:    ${syllabus.fileName}
Units Evaluated:  ${syllabus.units.join(', ')}
Key Concepts:     ${syllabus.importantConcepts.join(', ')}

--------------------------------------------------------------------------------
2. OVERALL MARKS COMPARISON
--------------------------------------------------------------------------------
AI Total Marks:       ${metrics.totalAiMarks} / ${metrics.totalMaxMarks}
Teacher Ground Truth: ${metrics.totalTeacherMarks} / ${metrics.totalMaxMarks}

--------------------------------------------------------------------------------
3. ACCURACY METRICS (Sample / Demo Data)
--------------------------------------------------------------------------------
Mark Agreement:                 ${metrics.markAgreement}%
Mean Absolute Error (MAE):      ${metrics.mae} marks
Exact Agreement:                ${metrics.exactAgreement}%
Concept Identification Accuracy: ${metrics.conceptIdentificationAccuracy}%
Teacher Feedback Relevance:     ${metrics.feedbackRelevance} / 5.0

--------------------------------------------------------------------------------
4. QUESTION-BY-QUESTION BREAKDOWN
--------------------------------------------------------------------------------
${answerSheet.questions
  .map(
    (q) => `
Question ${q.questionNumber}: ${q.questionText}
Max Marks: ${q.maxMarks}
AI Mark: ${q.aiMark}  |  Teacher Mark: ${q.teacherMark}  |  Diff: |${Math.abs(q.teacherMark - q.aiMark).toFixed(1)}|
Student Answer: "${q.studentAnswer}"
Correct Concepts: ${q.correctConcepts.join('; ')}
Missing Concepts: ${q.missingConcepts.join('; ') || 'None'}
AI Feedback: "${q.aiFeedback}"
`
  )
  .join('\n')}

================================================================================
RESEARCH FLOW: SYLLABUS -> CONTEXT -> AI EVALUATION -> TEACHER GROUND TRUTH -> ACCURACY
From Syllabus Context to Accurate AI Evaluation
Measure. Compare. Improve.
================================================================================
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Evaluation_Report_${answerSheet.studentName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-xl border border-slate-200 overflow-hidden print:border-none print:shadow-none">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Evaluation Research Report
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Text</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-4 text-center space-y-1">
            <div className="text-xs uppercase font-mono tracking-widest text-indigo-700 font-semibold">
              Research Prototype Benchmark
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Descriptive Answer Sheet Evaluation Report
            </h2>
            <p className="text-xs text-slate-500">
              Syllabus-Context-Based AI Scoring vs. Teacher Ground Truth Reference
            </p>
          </div>

          {/* Student & Syllabus Context */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Student:</span>
              <span className="font-semibold text-slate-900">{answerSheet.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Subject:</span>
              <span className="font-semibold text-slate-900">{answerSheet.subject}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Syllabus Context:</span>
              <span className="font-semibold text-slate-900">{syllabus.units.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Evaluation Mode:</span>
              <span className="font-semibold text-slate-900">Descriptive Concepts</span>
            </div>
          </div>

          {/* Summary Score Comparison */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-600 block">Teacher Ground Truth</span>
              <span className="text-2xl font-extrabold font-mono text-slate-900">
                {metrics.totalTeacherMarks} / {metrics.totalMaxMarks}
              </span>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <span className="text-xs text-indigo-700 block">AI System Prediction</span>
              <span className="text-2xl font-extrabold font-mono text-indigo-900">
                {metrics.totalAiMarks} / {metrics.totalMaxMarks}
              </span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-xs text-emerald-800 block">Mark Agreement</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-900">
                {metrics.markAgreement}%
              </span>
            </div>
          </div>

          {/* Accuracy Metrics Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Empirical Accuracy Metrics (Sample Data)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded">
                <span className="text-slate-500 block text-[11px]">Mean Abs Error (MAE)</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{metrics.mae} marks</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded">
                <span className="text-slate-500 block text-[11px]">Exact Agreement</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{metrics.exactAgreement}%</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded">
                <span className="text-slate-500 block text-[11px]">Concept Accuracy</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{metrics.conceptIdentificationAccuracy}%</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded">
                <span className="text-slate-500 block text-[11px]">Feedback Relevance</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{metrics.feedbackRelevance} / 5</span>
              </div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Question-wise Findings
            </h4>
            <div className="space-y-3 text-xs">
              {answerSheet.questions.map((q) => (
                <div key={q.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Q{q.questionNumber}: {q.questionText}</span>
                    <span className="font-mono text-slate-700 font-semibold">
                      Teacher: {q.teacherMark} | AI: {q.aiMark} (Max {q.maxMarks})
                    </span>
                  </div>
                  <div className="text-slate-600 italic text-[11px]">
                    &ldquo;{q.studentAnswer}&rdquo;
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <strong className="text-indigo-900">AI Feedback:</strong> &ldquo;{q.aiFeedback}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Signoff Footer */}
          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
            <div className="font-semibold text-slate-800">
              From Syllabus Context to Accurate AI Evaluation
            </div>
            <div>Measure. Compare. Improve.</div>
            <div className="text-[10px] text-slate-400 font-mono">
              SYLLABUS → CONTEXT → AI EVALUATION → TEACHER GROUND TRUTH → ACCURACY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
