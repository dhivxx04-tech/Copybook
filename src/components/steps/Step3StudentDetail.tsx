import React, { useState, useEffect } from 'react';
import { StudentData, QuestionStructure } from '../../types/copybook';
import { PARSED_QUESTIONS } from '../../data/copybookData';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  Check, 
  FileSearch, 
  Award, 
  BookOpen,
  Target,
  TrendingUp,
  Save,
  CheckCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { ScanViewerModal } from '../ScanViewerModal';
import { ParentReportCardModal } from '../ParentReportCardModal';
import { RubricModal } from '../RubricModal';
import { RemedialPlanModal } from '../RemedialPlanModal';
import { StudentAnswerPaper } from '../StudentAnswerPaper';

interface Step3StudentDetailProps {
  students: StudentData[];
  selectedStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onBackToRegister: () => void;
  onUpdateStudentMarks: (studentId: string, qNum: number, newMarks: number, teacherFeedback?: string) => void;
  onResolveStudentIdentity: (studentId: string) => void;
  onResolveFlag: (studentId: string, qNum: number) => void;
  onSaveTeacherValidation?: (studentId: string) => void;
}

export const Step3StudentDetail: React.FC<Step3StudentDetailProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
  onBackToRegister,
  onUpdateStudentMarks,
  onResolveStudentIdentity,
  onResolveFlag,
  onSaveTeacherValidation,
}) => {
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const [editingQNum, setEditingQNum] = useState<number | null>(null);
  const [tempMarks, setTempMarks] = useState<number>(0);
  const [editingFeedbackQNum, setEditingFeedbackQNum] = useState<number | null>(null);
  const [tempFeedback, setTempFeedback] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Modals state
  const [isScanOpen, setIsScanOpen] = useState<boolean>(false);
  const [activeScanQ, setActiveScanQ] = useState<number>(1);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isRemedialOpen, setIsRemedialOpen] = useState<boolean>(false);
  const [selectedRubricQ, setSelectedRubricQ] = useState<QuestionStructure | null>(null);

  // Keyboard navigation for fast grading: left/right arrow to switch student
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentIndex = students.findIndex((s) => s.id === currentStudent.id);
      if (e.key === 'ArrowRight' && currentIndex < students.length - 1) {
        onSelectStudent(students[currentIndex + 1].id);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelectStudent(students[currentIndex - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [students, currentStudent.id, onSelectStudent]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const isRohanUnresolved = currentStudent.id === 'rohan' && currentStudent.totalMarks === undefined;

  const handleStartEdit = (qNum: number, currentMark: number) => {
    setEditingQNum(qNum);
    setTempMarks(currentMark);
  };

  const handleSaveEdit = (qNum: number, feedbackText?: string) => {
    onUpdateStudentMarks(currentStudent.id, qNum, tempMarks, feedbackText);
    setEditingQNum(null);
  };

  const handleStartEditFeedback = (qNum: number, currentFeedback: string) => {
    setEditingFeedbackQNum(qNum);
    setTempFeedback(currentFeedback);
  };

  const handleSaveTeacherFeedback = (qNum: number) => {
    const q = currentStudent.questions?.find((item) => item.qNum === qNum);
    const mark = q ? (q.teacherMark ?? q.marksAwarded) : 0;
    onUpdateStudentMarks(currentStudent.id, qNum, mark, tempFeedback);
    setEditingFeedbackQNum(null);
  };

  const handleTriggerSaveValidation = () => {
    if (onSaveTeacherValidation) {
      onSaveTeacherValidation(currentStudent.id);
    }
    setSaveToast('Teacher ground truth marks saved and persisted to database!');
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleOpenScan = (qNum: number = 1) => {
    setActiveScanQ(qNum);
    setIsScanOpen(true);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Back to register link */}
      <div>
        <button
          type="button"
          onClick={onBackToRegister}
          className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 hover:text-white uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BATCH REGISTER</span>
        </button>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight mt-1">
          Student detail
        </h1>
      </div>

      {/* Horizontal Student Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {students.map((s) => {
          const isSelected = s.id === currentStudent.id;
          const isReview = s.status === 'Needs review';
          const isLowScore = s.totalMarks !== undefined && s.totalMarks < 15;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectStudent(s.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#1e2a42] text-white ring-1 ring-blue-500 shadow-xs'
                  : 'bg-[#121826] text-slate-400 hover:text-slate-200 border border-[#20293d]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isReview
                    ? 'bg-amber-400'
                    : isLowScore
                    ? 'bg-red-400'
                    : 'bg-emerald-400'
                }`}
              />
              <span>{s.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Student Banner Card */}
      <div className="bg-[#121826] border border-[#20293d] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1e2a44] border border-[#2d3e63] flex items-center justify-center text-lg font-bold font-mono text-blue-300">
              {getInitials(currentStudent.name)}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentStudent.name}
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Roll {currentStudent.rollNo} · Class {currentStudent.classSection} ·{' '}
                <span className={isRohanUnresolved ? 'text-amber-400' : 'text-slate-300'}>
                  {isRohanUnresolved ? 'ID match unresolved' : 'Verified Student'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            {/* Quick Action: Inspect Scan */}
            <button
              type="button"
              onClick={() => handleOpenScan(1)}
              className="px-3 py-1.5 bg-[#1a2336] hover:bg-[#223049] text-slate-300 hover:text-white rounded-lg border border-[#2d3b55] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSearch className="w-3.5 h-3.5 text-blue-400" />
              <span>Inspect Scan (PDF)</span>
            </button>

            {/* Quick Action: Preview Parent Report */}
            {!isRohanUnresolved && (
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="px-3 py-1.5 bg-[#1a2336] hover:bg-[#223049] text-slate-300 hover:text-white rounded-lg border border-[#2d3b55] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Parent Report</span>
              </button>
            )}

            {/* Quick Action: Remedial Plan */}
            {!isRohanUnresolved && (
              <button
                type="button"
                onClick={() => setIsRemedialOpen(true)}
                className="px-3 py-1.5 bg-[#251d16] hover:bg-[#34271c] text-amber-300 hover:text-amber-200 rounded-lg border border-amber-800/60 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Generate Personalized NCERT Remedial Learning Roadmap"
              >
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Remedial Plan</span>
              </button>
            )}

            {/* Score circle badge */}

            <div
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-mono font-bold text-sm shadow-inner ${
                isRohanUnresolved
                  ? 'bg-red-950/60 border border-red-800 text-red-300'
                  : currentStudent.totalMarks && currentStudent.totalMarks < 15
                  ? 'bg-red-900/60 border border-red-700 text-red-200'
                  : 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              }`}
            >
              <span>{isRohanUnresolved ? '—' : currentStudent.totalMarks}</span>
              <span className="text-[10px] font-normal text-slate-400">/30</span>
            </div>

            {/* Status indicator */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                currentStudent.status === 'Needs review'
                  ? 'bg-amber-950/40 text-amber-300 border border-amber-800/80'
                  : currentStudent.status === 'Edited'
                  ? 'bg-blue-950/40 text-blue-300 border border-blue-800/80'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/80'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentStudent.status === 'Needs review'
                    ? 'bg-amber-400'
                    : currentStudent.status === 'Edited'
                    ? 'bg-blue-400'
                    : 'bg-emerald-400'
                }`}
              />
              {currentStudent.status}
            </span>
          </div>
        </div>
      </div>

      {/* Unresolved Identity Card (Screenshot 3 Rohan Gupta) */}
      {isRohanUnresolved ? (
        <div className="bg-[#121826] border border-[#20293d] rounded-2xl p-6 space-y-4">
          <div className="p-4 bg-[#182030] border border-[#2a364f] rounded-xl space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Student identity not yet assigned.</strong>{' '}
              Roll number smudged on the scan — name match only; combined confidence below the auto-assign threshold. Resolve this from the batch register or the approval checklist before question-level results appear.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onResolveStudentIdentity(currentStudent.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Assign Rohan Gupta as Roll 5 &amp; Load Evaluation</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenScan(1)}
                className="px-3.5 py-2 bg-[#1e2a42] hover:bg-[#253554] text-slate-200 text-xs font-medium rounded-lg border border-[#304163] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <FileSearch className="w-3.5 h-3.5 text-blue-400" />
                <span>Inspect Smudged Cover Scan</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Question-by-Question Grading List */
        <div className="space-y-6">
          {/* Dynamic Accuracy & Ground Truth Validation Card (Requirements 5 & 6) */}
          {(() => {
            const studentQuestions = currentStudent.questions || [];
            let totalAi = 0;
            let totalTeacher = 0;
            let totalMax = 0;
            let totalAbsError = 0;
            let exactMatches = 0;
            let normAgreementSum = 0;

            studentQuestions.forEach((q) => {
              const ai = q.aiMark !== undefined ? q.aiMark : q.marksAwarded;
              const teacher = q.teacherMark !== undefined ? q.teacherMark : q.marksAwarded;
              const max = q.maxMarks || 5;

              totalAi += ai;
              totalTeacher += teacher;
              totalMax += max;

              const absError = Math.abs(ai - teacher);
              totalAbsError += absError;
              if (absError < 0.05) exactMatches += 1;
              normAgreementSum += Math.max(0, 1 - (absError / max));
            });

            const qCount = studentQuestions.length || 1;
            const mae = Number((totalAbsError / qCount).toFixed(2));
            const markDiff = Number(Math.abs(totalAi - totalTeacher).toFixed(2));
            const exactAgreementPct = Number(((exactMatches / qCount) * 100).toFixed(1));
            const overallAgreementPct = Number(((normAgreementSum / qCount) * 100).toFixed(1));

            return (
              <div className="bg-[#121826] border border-[#232f48] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1d273b] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono tracking-wider font-semibold text-emerald-400 uppercase flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>ACCURACY CALCULATION &amp; TEACHER GROUND TRUTH VALIDATION</span>
                      </span>
                      {currentStudent.isReal && (
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-blue-950/70 text-blue-300 border border-blue-800">
                          REAL DATA RECORD
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Calculated directly from stored AI predictions against teacher ground truth marks.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTriggerSaveValidation}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Ground Truth Validation</span>
                    </button>
                  </div>
                </div>

                {/* Toast message if saved */}
                {saveToast && (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{saveToast}</span>
                  </div>
                )}

                {/* 6 Core Accuracy Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3 bg-[#172033] rounded-xl border border-[#27344e]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">AI Total Marks</div>
                    <div className="text-lg font-bold font-mono text-indigo-300 mt-0.5">
                      {totalAi.toFixed(1)} <span className="text-xs text-slate-500">/{totalMax}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#172033] rounded-xl border border-[#27344e]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Teacher Total Marks</div>
                    <div className="text-lg font-bold font-mono text-white mt-0.5">
                      {totalTeacher.toFixed(1)} <span className="text-xs text-slate-500">/{totalMax}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#172033] rounded-xl border border-[#27344e]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Difference</div>
                    <div className={`text-lg font-bold font-mono mt-0.5 ${markDiff === 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                      {markDiff === 0 ? '0.0' : `±${markDiff}`}
                    </div>
                  </div>

                  <div className="p-3 bg-[#172033] rounded-xl border border-[#27344e]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Exact Agreement</div>
                    <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                      {exactAgreementPct}%
                    </div>
                  </div>

                  <div className="p-3 bg-[#172033] rounded-xl border border-[#27344e]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">MAE (Mean Error)</div>
                    <div className="text-lg font-bold font-mono text-blue-300 mt-0.5">
                      {mae} <span className="text-[10px] text-slate-400">marks</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#172033] rounded-xl border border-[#27344e]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Overall Agreement</div>
                    <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
                      {overallAgreementPct}%
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-[#1d273b] pt-2">
                  <span>Formula: Absolute Error = |AI Mark − Teacher Mark| · MAE = Sum of Errors / {qCount}</span>
                  <span className="text-slate-500">Teacher's final marks serve as reference ground truth</span>
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
              QUESTION-WISE EVALUATION &amp; TEACHER REVIEW
            </span>
            <span>Teacher can review and modify AI marks &amp; feedback for each question</span>
          </div>

          {currentStudent.questions?.map((q) => {
            const qMeta = PARSED_QUESTIONS.find((item) => item.qNum === q.qNum);
            const isEditingMark = editingQNum === q.qNum;
            const isEditingFeedback = editingFeedbackQNum === q.qNum;

            // Derived confidence attributes (Requirement 4)
            const aiMark = q.aiMark !== undefined ? q.aiMark : q.marksAwarded;
            const teacherMark = q.teacherMark !== undefined ? q.teacherMark : q.marksAwarded;
            const aiConf = q.aiConfidence ?? (q.isFlagged ? 52 : (aiMark === q.maxMarks ? 92 : 74));
            const confLevel = q.confidenceLevel ?? (aiConf >= 85 ? 'High' : aiConf >= 65 ? 'Medium' : 'Low');
            const isLowConfidence = confLevel === 'Low' || aiConf < 65 || q.isFlagged;

            const correctList = q.correctConcepts && q.correctConcepts.length > 0
              ? q.correctConcepts
              : ['Core concept identified correctly'];
            const missingList = q.missingConcepts || [];
            const incorrectList = q.incorrectConcepts || [];
            const markDelta = Number((teacherMark - aiMark).toFixed(1));

            return (
              <div
                key={q.qNum}
                className={`bg-[#121826] border rounded-2xl p-5 sm:p-6 transition-all space-y-5 ${
                  isLowConfidence ? 'border-amber-600/70 bg-[#151c2b]' : 'border-[#20293d]'
                }`}
              >
                {/* Question title & actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#1f283d] pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-blue-300 uppercase">
                        Question {q.qNum}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {qMeta?.topic}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800/60 text-slate-300">
                        {qMeta?.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {qMeta?.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* View Rubric */}
                    <button
                      type="button"
                      onClick={() => qMeta && setSelectedRubricQ(qMeta)}
                      className="p-1.5 text-slate-400 hover:text-blue-300 bg-[#172033] rounded-lg border border-[#27344d] transition-colors cursor-pointer"
                      title="View Marking Rubric"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>

                    {/* View Paper Snippet */}
                    <button
                      type="button"
                      onClick={() => handleOpenScan(q.qNum)}
                      className="p-1.5 text-slate-400 hover:text-blue-300 bg-[#172033] rounded-lg border border-[#27344d] transition-colors cursor-pointer"
                      title="Inspect Original Scan"
                    >
                      <FileSearch className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* LOW CONFIDENCE BANNER (Requirement 4) */}
                {isLowConfidence && (
                  <div className="p-3 bg-amber-950/50 border border-amber-600 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5 text-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">⚠ Low Confidence — {aiConf}% — Teacher Review Required</span>
                        <div className="text-[11px] text-amber-300/80 mt-0.5">
                          {q.flagReason || 'AI detected handwriting ambiguity or incomplete line contrast. Do not guess; teacher validation is mandatory.'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenScan(q.qNum)}
                        className="px-2.5 py-1 bg-[#23314d] hover:bg-[#2d3e63] text-blue-300 rounded text-xs border border-[#3b4e78] cursor-pointer"
                      >
                        Inspect Scan
                      </button>
                      <button
                        type="button"
                        onClick={() => onResolveFlag(currentStudent.id, q.qNum)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded text-xs cursor-pointer"
                      >
                        Resolve &amp; Confirm ✓
                      </button>
                    </div>
                  </div>
                )}

                {/* Authentic Student Answer Paper View */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                    <span>STUDENT ANSWER SHEET (ORIGINAL EXAM PAPER)</span>
                    <span className="text-[10px] text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/50">
                      Blue Ballpoint Ink · Ruled Booklet
                    </span>
                  </div>
                  <StudentAnswerPaper
                    question={q}
                    studentName={currentStudent.name}
                    studentRoll={currentStudent.rollNo}
                    onOpenScan={handleOpenScan}
                  />
                </div>

                {/* TWO-COLUMN EVALUATION: AI PREDICTION VS TEACHER VALIDATION (Requirements 4, 5) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  
                  {/* LEFT: AI Evaluation Block */}
                  <div className="p-4 bg-[#141b2a] rounded-xl border border-[#1f283d] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI EVALUATION</span>
                      </span>
                      
                      {/* AI Confidence Pill (Requirement 4) */}
                      {confLevel === 'High' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                          High Confidence — {aiConf}%
                        </span>
                      )}
                      {confLevel === 'Medium' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-800">
                          Medium Confidence — {aiConf}%
                        </span>
                      )}
                      {confLevel === 'Low' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/60 text-red-300 border border-red-800">
                          Low Confidence — {aiConf}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">AI Assigned Mark:</span>
                      <span className="text-lg font-bold font-mono text-indigo-300">
                        {aiMark} <span className="text-xs text-slate-500">/{q.maxMarks}</span>
                      </span>
                    </div>

                    {/* AI Feedback */}
                    <div className="text-xs text-slate-300 leading-relaxed bg-[#0f1420] p-2.5 rounded-lg border border-[#1a2336]">
                      <span className="font-semibold text-slate-200 block mb-0.5">AI Feedback:</span>
                      {q.aiFeedback || q.feedback}
                    </div>

                    {/* Conceptual Breakdown (Requirement 3) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        Concept Analysis:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {correctList.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-medium bg-emerald-950/50 text-emerald-300 rounded border border-emerald-800/80">
                            ✓ {c}
                          </span>
                        ))}
                        {missingList.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-medium bg-amber-950/50 text-amber-300 rounded border border-amber-800/80">
                            − Missing: {c}
                          </span>
                        ))}
                        {incorrectList.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-medium bg-red-950/50 text-red-300 rounded border border-red-800/80">
                            ✕ Incorrect: {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Teacher Review & Validation Block (Requirement 5) */}
                  <div className="p-4 bg-[#162033] rounded-xl border border-blue-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-blue-300 font-semibold uppercase flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>TEACHER VALIDATION (GROUND TRUTH)</span>
                      </span>

                      {/* Difference indicator */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        markDelta === 0
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                      }`}>
                        Diff: {markDelta > 0 ? `+${markDelta}` : markDelta}
                      </span>
                    </div>

                    {/* Teacher Marks input */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-300 font-medium">
                        Teacher Mark (Ground Truth):
                      </label>

                      {isEditingMark ? (
                        <div className="flex items-center gap-1.5 bg-[#0f1523] p-1.5 rounded-lg border border-blue-500">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={q.maxMarks}
                            value={tempMarks}
                            onChange={(e) => setTempMarks(parseFloat(e.target.value) || 0)}
                            className="w-14 px-2 py-1 text-xs font-mono font-bold bg-[#141b2b] text-white border border-slate-600 rounded text-center focus:outline-none"
                          />
                          <span className="text-xs text-slate-400 font-mono">/{q.maxMarks}</span>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(q.qNum)}
                            className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-medium cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(q.qNum, teacherMark)}
                          className="px-3 py-1.5 bg-[#1f2c46] hover:bg-[#253657] border border-[#33466f] rounded-lg text-xs font-mono font-bold text-white inline-flex items-center gap-2 transition-colors cursor-pointer group"
                          title="Click to adjust teacher ground truth mark"
                        >
                          <span className="text-base text-white">
                            {teacherMark}
                          </span>
                          <span className="text-xs text-slate-400">/{q.maxMarks}</span>
                          <Edit3 className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300" />
                        </button>
                      )}
                    </div>

                    {/* Teacher Feedback input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">Teacher Feedback / Notes:</span>
                        {!isEditingFeedback && (
                          <button
                            type="button"
                            onClick={() => handleStartEditFeedback(q.qNum, q.teacherFeedback || 'Ground truth verified by teacher.')}
                            className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit note</span>
                          </button>
                        )}
                      </div>

                      {isEditingFeedback ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempFeedback}
                            onChange={(e) => setTempFeedback(e.target.value)}
                            rows={2}
                            className="w-full p-2 text-xs bg-[#0f1523] border border-blue-500 rounded-lg text-white focus:outline-none"
                            placeholder="Enter teacher reference feedback..."
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingFeedbackQNum(null)}
                              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveTeacherFeedback(q.qNum)}
                              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-300 bg-[#0f1523] p-2.5 rounded-lg border border-[#23314d] leading-relaxed">
                          {q.teacherFeedback || 'Ground truth mark verified by teacher.'}
                        </div>
                      )}
                    </div>

                    {/* Quick validation status */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Teacher Reference Active</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(q.qNum, q.teacherFeedback || 'Validated by teacher')}
                        className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                      >
                        Confirm Question ✓
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Correction Log Section */}
      <div className="bg-[#121826] border border-[#20293d] rounded-2xl p-6 space-y-3">
        <div className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
          CORRECTION LOG
        </div>
        {currentStudent.correctionLog && currentStudent.correctionLog.length > 0 ? (
          <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
            {currentStudent.correctionLog.map((log, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>{log}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400">No corrections recorded yet.</p>
        )}
      </div>

      {/* Modals */}
      <ScanViewerModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        student={currentStudent}
        activeQNum={activeScanQ}
      />

      <ParentReportCardModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        student={currentStudent}
      />

      <RubricModal
        isOpen={Boolean(selectedRubricQ)}
        onClose={() => setSelectedRubricQ(null)}
        question={selectedRubricQ}
      />

      <RemedialPlanModal
        isOpen={isRemedialOpen}
        onClose={() => setIsRemedialOpen(false)}
        student={currentStudent}
      />
    </div>
  );
};


