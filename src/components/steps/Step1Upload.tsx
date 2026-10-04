import React, { useState } from 'react';
import { CorrectionMode, QuestionStructure } from '../../types/copybook';
import { 
  EXAM_META, 
  PARSED_QUESTIONS, 
  ANSWER_SHEET_FILES 
} from '../../data/copybookData';
import { 
  FileText, 
  ArrowRight, 
  BookOpen,
  UploadCloud,
  FileUp,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Check
} from 'lucide-react';
import { RubricModal } from '../RubricModal';
import { uploadAndEvaluateAnswerSheet } from '../../services/evaluationApi';
import { StoredEvaluationRecord } from '../../types/evaluationRecord';

interface Step1UploadProps {
  onStartGrading: () => void;
  correctionMode: CorrectionMode;
  onSetCorrectionMode: (mode: CorrectionMode) => void;
  onRealEvaluationComplete?: (evaluation: StoredEvaluationRecord) => void;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({
  onStartGrading,
  correctionMode,
  onSetCorrectionMode,
  onRealEvaluationComplete,
}) => {
  const [school, setSchool] = useState(EXAM_META.school);
  const [classSection, setClassSection] = useState(EXAM_META.classSection);
  const [subject, setSubject] = useState(EXAM_META.subject);
  const [examName, setExamName] = useState(EXAM_META.examName);
  const [selectedRubricQ, setSelectedRubricQ] = useState<QuestionStructure | null>(null);

  // Real Answer Sheet Upload State (Requirements 1, 2, 3, 9)
  const [uploadMode, setUploadMode] = useState<'real' | 'demo'>('real');
  const [studentName, setStudentName] = useState('Maya Raghavan');
  const [rollNo, setRollNo] = useState(9);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalProgressStep, setEvalProgressStep] = useState<string>('');
  const [evalError, setEvalError] = useState<string | null>(null);
  const [recentEvaluated, setRecentEvaluated] = useState<StoredEvaluationRecord | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setEvalError(null);

    // Auto extract potential student name from filename if plausible
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    if (nameWithoutExt.length > 3 && !nameWithoutExt.toLowerCase().includes('sample')) {
      // capitalize words
      const prettyName = nameWithoutExt
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      setStudentName(prettyName);
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEvaluateRealSheet = async () => {
    if (!selectedFile) {
      setEvalError('Please choose a student answer-sheet PDF or scanned image first.');
      return;
    }

    setIsEvaluating(true);
    setEvalError(null);
    setEvalProgressStep('Processing uploaded answer-sheet PDF...');

    try {
      setTimeout(() => setEvalProgressStep('AI understanding handwritten answers (cursive, slanted, crossed-out)...'), 700);
      setTimeout(() => setEvalProgressStep('Evaluating answers against CBSE syllabus context...'), 1600);
      setTimeout(() => setEvalProgressStep('Computing confidence scores & saving to database...'), 2400);

      const result = await uploadAndEvaluateAnswerSheet({
        studentName,
        rollNo: Number(rollNo) || 9,
        classSection,
        subject,
        examTitle: examName,
        fileName: selectedFile.name,
        fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: selectedFile.type || 'application/pdf',
        fileBase64,
        customQuestions: PARSED_QUESTIONS,
      });

      setRecentEvaluated(result);
      setIsEvaluating(false);

      if (onRealEvaluationComplete) {
        onRealEvaluationComplete(result);
      }
    } catch (err: any) {
      console.error('Real evaluation error:', err);
      setEvalError(err.message || 'Failed to evaluate answer sheet.');
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Top Banner: Set up exam title + Start grading CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-indigo-400 font-semibold uppercase mb-1">
            SET UP EXAM
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            {EXAM_META.examTitle}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {school} · Class {classSection} · {EXAM_META.board}
          </p>
        </div>

        <button
          type="button"
          onClick={onStartGrading}
          className="self-start sm:self-auto px-5 py-2.5 bg-[#93c5fd] hover:bg-blue-300 text-slate-950 font-semibold text-sm rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>Start grading</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Exam Details, Correction Mode, Roster, Answer Sheets */}
        <div className="lg:col-span-5 bg-[#121826] border border-[#20293d] rounded-2xl p-6 space-y-6 shadow-sm">
          {/* Section: EXAM DETAILS */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
              EXAM DETAILS
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                  SCHOOL
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#182133] border border-[#2c3852] rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                  CLASS &amp; SECTION
                </label>
                <input
                  type="text"
                  value={classSection}
                  onChange={(e) => setClassSection(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#182133] border border-[#2c3852] rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                  SUBJECT
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#182133] border border-[#2c3852] rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                  EXAM
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#182133] border border-[#2c3852] rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Section: CORRECTION MODE */}
          <div className="space-y-2 pt-2 border-t border-[#1c2438]">
            <div className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
              CORRECTION MODE
            </div>

            <div className="flex items-center gap-1.5 bg-[#172033] p-1 rounded-lg border border-[#283550] w-fit">
              {(['Easy', 'Medium', 'Strict'] as CorrectionMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onSetCorrectionMode(mode)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    correctionMode === mode
                      ? 'bg-[#22314e] text-blue-300 shadow-sm border border-[#3b4e78]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Flexible-match rubric units are scored with a moderate tolerance for phrasing and partial concepts.
            </p>
          </div>

          {/* Section: ROSTER */}
          <div className="space-y-2 pt-2 border-t border-[#1c2438]">
            <div className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
              ROSTER
            </div>

            <div className="bg-[#172033] border border-dashed border-[#2d3a54] rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#202c44] border border-[#303f5e] flex items-center justify-center text-blue-300">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {EXAM_META.rosterFileName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    8 students · name, roll no, section, parent email
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Parsed
              </span>
            </div>
          </div>

          {/* Section: ANSWER SHEETS (Real Upload vs Demo Mode) */}
          <div className="space-y-4 pt-2 border-t border-[#1c2438]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-wider font-semibold text-slate-400 uppercase">
                STUDENT ANSWER SHEETS
              </span>

              {/* Mode switch */}
              <div className="flex items-center bg-[#172033] p-0.5 rounded-lg border border-[#27344e] text-[11px]">
                <button
                  type="button"
                  onClick={() => setUploadMode('real')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    uploadMode === 'real'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload Real PDF
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('demo')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    uploadMode === 'demo'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Demo Mode (8)
                </button>
              </div>
            </div>

            {/* REAL ANSWER SHEET UPLOAD (Requirement 1, 2, 3) */}
            {uploadMode === 'real' ? (
              <div className="space-y-4 bg-[#151d2e] border border-blue-900/60 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Real Answer-Sheet Input</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 rounded border border-emerald-800">
                    Real-Time AI
                  </span>
                </div>

                {/* Drag-and-drop / Browse input */}
                <label className="block border-2 border-dashed border-[#2d3f66] hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#111726]/60 group">
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#1b263d] group-hover:bg-[#203050] mx-auto flex items-center justify-center text-blue-400 transition-colors">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    {selectedFile ? (
                      <div>
                        <p className="text-xs font-semibold text-white font-mono">{selectedFile.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type || 'Document'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-medium text-slate-200">
                          <span className="text-blue-400 font-semibold underline">Click to upload</span> or drag and drop real answer sheet
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Multi-page PDF or high-res scan image
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                {/* Handwriting tolerance badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Handwriting Processing Capabilities:
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                    <span className="px-2 py-0.5 bg-[#1a2336] rounded border border-[#2b3954]">✓ Cursive script</span>
                    <span className="px-2 py-0.5 bg-[#1a2336] rounded border border-[#2b3954]">✓ Slanted handwriting</span>
                    <span className="px-2 py-0.5 bg-[#1a2336] rounded border border-[#2b3954]">✓ Uneven spacing</span>
                    <span className="px-2 py-0.5 bg-[#1a2336] rounded border border-[#2b3954]">✓ Crossed-out edits</span>
                    <span className="px-2 py-0.5 bg-[#1a2336] rounded border border-[#2b3954]">✓ Multi-page sheets</span>
                  </div>
                </div>

                {/* Student Details input */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Maya Raghavan"
                      className="w-full px-3 py-1.5 text-xs bg-[#121826] border border-[#2c3852] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Roll Number
                    </label>
                    <input
                      type="number"
                      value={rollNo}
                      onChange={(e) => setRollNo(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3 py-1.5 text-xs bg-[#121826] border border-[#2c3852] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-400 font-medium"
                    />
                  </div>
                </div>

                {/* Progress / Status during evaluation */}
                {isEvaluating && (
                  <div className="p-3 bg-[#111827] border border-blue-800/80 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span>AI Answer-Sheet Evaluation in Progress...</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {evalProgressStep}
                    </p>
                    <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {evalError && (
                  <div className="p-2.5 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{evalError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {recentEvaluated && !isEvaluating && (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        AI Evaluation Completed!
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        {recentEvaluated.accuracyMetrics?.totalAiMarks} / {recentEvaluated.accuracyMetrics?.totalMaxMarks} Marks
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Saved to persistent database. Teacher review is ready.
                    </p>
                  </div>
                )}

                {/* Evaluate CTA Button */}
                <button
                  type="button"
                  onClick={handleEvaluateRealSheet}
                  disabled={isEvaluating}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Evaluating Answer Sheet...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate Real Answer Sheet with AI</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* DEMO BATCH LIST (Requirement 9: Demo Data separated) */
              <div className="space-y-3">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>
                    <strong className="text-white">8 Demo Student Answer Sheets</strong> · 31 pages
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono text-purple-300 bg-purple-950/60 rounded border border-purple-800">
                    Demo Mode
                  </span>
                </div>

                <div className="relative bg-[#172033] border border-[#283550] rounded-xl p-2 space-y-1 max-h-52 overflow-y-auto scrollbar-thin">
                  {ANSWER_SHEET_FILES.map((sheet, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-[#121826]/70 hover:bg-[#121826] rounded-lg text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-200 truncate">
                          {sheet.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-slate-400 text-[11px]">
                          {sheet.pages}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                          <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                          Loaded
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-500 leading-normal">
                  Demo data provides standard benchmark answer sheets. Real uploaded sheets are kept separate in the database.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Question Paper · Parsed Structure */}
        <div className="lg:col-span-7 bg-[#121826] border border-[#20293d] rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
              QUESTION PAPER · PARSED STRUCTURE
            </div>
            <span className="text-[11px] text-blue-300 font-mono">
              Click any question to view marking rubric
            </span>
          </div>

          {/* QP file box */}
          <div className="bg-[#172033] border border-dashed border-[#2d3a54] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#202c44] border border-[#303f5e] flex items-center justify-center text-blue-300">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">
                  {EXAM_META.qpFileName}
                </div>
                <div className="text-[11px] text-slate-400">
                  7 questions detected · 30 marks total
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Parsed
            </span>
          </div>

          {/* Parsed questions table with interactive rubric trigger */}
          <div className="overflow-x-auto rounded-xl border border-[#232e44]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#232e44] bg-[#172033] text-[11px] font-mono uppercase text-slate-400">
                  <th className="py-2.5 px-3 w-10">Q#</th>
                  <th className="py-2.5 px-3">QUESTION</th>
                  <th className="py-2.5 px-3">TOPIC</th>
                  <th className="py-2.5 px-3 w-24">TYPE</th>
                  <th className="py-2.5 px-3 w-16 text-right">MARKS</th>
                  <th className="py-2.5 px-3 w-20 text-center">RUBRIC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e273b]">
                {PARSED_QUESTIONS.map((q) => (
                  <tr 
                    key={q.qNum} 
                    onClick={() => setSelectedRubricQ(q)}
                    className="hover:bg-[#182133] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-mono text-slate-400 font-semibold align-top">
                      {q.qNum}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200 leading-snug group-hover:text-blue-300 transition-colors">
                      {q.question}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-normal leading-snug">
                      {q.topic}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700 bg-slate-800/60 text-slate-300">
                        {q.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {q.marks}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRubricQ(q);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-300 rounded hover:bg-[#1f2b42] transition-colors cursor-pointer"
                        title="View NCERT Rubric"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-[#1c2438] pt-3">
            Rubric units for each question were generated against the NCERT Class 8 Science textbook and CBSE syllabus in the setup stage, and will be applied during grading.
          </p>
        </div>
      </div>

      {/* Rubric Detail Modal */}
      <RubricModal
        isOpen={Boolean(selectedRubricQ)}
        onClose={() => setSelectedRubricQ(null)}
        question={selectedRubricQ}
      />
    </div>
  );
};

