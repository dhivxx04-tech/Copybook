import React, { useState } from 'react';
import { AnswerSheetData, SyllabusData } from '../../types/evaluation';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Sparkles, BookOpen, User, Layers } from 'lucide-react';

interface AnswerSheetPageProps {
  syllabus: SyllabusData;
  answerSheet: AnswerSheetData;
  onUpdateAnswerSheet: (data: AnswerSheetData) => void;
  onStartEvaluation: () => void;
  onLoadDemo: () => void;
}

export const AnswerSheetPage: React.FC<AnswerSheetPageProps> = ({
  syllabus,
  answerSheet,
  onUpdateAnswerSheet,
  onStartEvaluation,
  onLoadDemo,
}) => {
  const [studentName, setStudentName] = useState(answerSheet.studentName || 'Demo Student');
  const [subject, setSubject] = useState(answerSheet.subject || syllabus.subject || 'Biology');
  const [fileName, setFileName] = useState(answerSheet.fileName || 'Student_AnswerSheet_Roll_104.pdf');
  const [fileSize, setFileSize] = useState(answerSheet.fileSize || '2.1 MB');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAnswerPreview, setShowAnswerPreview] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleProceed = () => {
    onUpdateAnswerSheet({
      ...answerSheet,
      studentName: studentName || 'Student',
      subject: subject || syllabus.subject || 'Biology',
      fileName,
      fileSize,
    });
    onStartEvaluation();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div className="space-y-1.5 border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          Stage 03 — Submission Intake
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          2. Student Answer Sheet
        </h1>
        <p className="text-sm text-slate-600">
          Upload the student&apos;s answer sheet for AI-based evaluation.
        </p>
      </div>

      {/* Mandatory contextual syllabus note */}
      <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 space-y-1">
          <div className="font-semibold text-indigo-900">
            Active Contextual Knowledge Base
          </div>
          <p className="leading-relaxed">
            Evaluation will use the uploaded syllabus as contextual knowledge: <span className="font-semibold text-indigo-900">{syllabus.subject}</span> ({syllabus.units.join(', ')}).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form and Upload Fields */}
        <div className="md:col-span-6 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            {/* Field 1: Student Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name or roll ID"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Field 2: Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Biology"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white font-medium"
                />
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Field 3: Answer Sheet PDF Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Answer Sheet PDF
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  isDragOver
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                  <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-indigo-600">Upload Answer Sheet</span> or drop file
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Single student descriptive script (PDF)
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded File display */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="truncate">
                  <div className="font-medium text-slate-800 truncate">
                    {fileName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {fileSize} · Ready for conceptual evaluation
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Attached
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Evaluate Answer Sheet</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onLoadDemo}
                className="w-full py-1.5 px-3 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Try Demo with Sample Biology Answer Sheet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Script Content / Questions Preview */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Descriptive Answer Sheet Content
                </h3>
              </div>
              <button
                onClick={() => setShowAnswerPreview(!showAnswerPreview)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {showAnswerPreview ? 'Collapse' : 'Expand'}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {answerSheet.questions.length} descriptive questions identified from student submission:
            </p>

            {showAnswerPreview && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {answerSheet.questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900">
                        Question {q.questionNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Max Marks: {q.maxMarks}
                      </span>
                    </div>

                    <p className="font-medium text-slate-800 leading-snug">
                      {q.questionText}
                    </p>

                    <div className="pt-1 border-t border-slate-200/60">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                        Student Descriptive Response:
                      </span>
                      <p className="text-slate-600 italic bg-white p-2.5 rounded border border-slate-200 text-[11px] leading-relaxed">
                        &ldquo;{q.studentAnswer}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700">Evaluation Ready: </span>
              AI will evaluate conceptual understanding against the syllabus concepts rather than simple keyword matches.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
