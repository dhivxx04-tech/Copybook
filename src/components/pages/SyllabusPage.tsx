import React, { useState } from 'react';
import { SyllabusData } from '../../types/evaluation';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface SyllabusPageProps {
  syllabus: SyllabusData;
  onUpdateSyllabus: (syllabus: SyllabusData) => void;
  onProceedToAnswerSheet: () => void;
  onLoadDemo: () => void;
}

export const SyllabusPage: React.FC<SyllabusPageProps> = ({
  syllabus,
  onUpdateSyllabus,
  onProceedToAnswerSheet,
  onLoadDemo,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(syllabus.contextReady);
  const [customSubject, setCustomSubject] = useState(syllabus.subject);
  const [selectedFileName, setSelectedFileName] = useState(syllabus.fileName);
  const [fileSizeText, setFileSizeText] = useState(syllabus.fileSize || '1.4 MB');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
      onUpdateSyllabus({
        ...syllabus,
        subject: customSubject,
        fileName: selectedFileName,
        contextReady: true,
      });
    }, 900);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      setFileSizeText(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setAnalyzed(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      setFileSizeText(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setAnalyzed(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div className="space-y-1.5 border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
          Stage 01 &amp; 02 — Knowledge Base
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          1. Provide Syllabus
        </h1>
        <p className="text-sm text-slate-600">
          Upload the prescribed syllabus used as the contextual basis for AI evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Upload & Controls column */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Subject
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g. Biology, Physics, Computer Science"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* PDF Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Syllabus PDF Document
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
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
                  id="syllabus-file-input"
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
                    <UploadCloud className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-[11px] text-slate-400">
                    PDF syllabus documents up to 25MB
                  </div>
                </div>
              </div>
            </div>

            {/* File Name Display & Status */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="truncate">
                  <div className="font-medium text-slate-800 truncate">
                    {selectedFileName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {fileSizeText} · Prescribed Curriculum Document
                  </div>
                </div>
              </div>
              <div className="shrink-0 pl-2">
                {analyzed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Uploaded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Ready to analyze
                  </span>
                )}
              </div>
            </div>

            {/* Analyze Action */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Syllabus Concepts...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>{analyzed ? 'Re-Analyze Syllabus' : 'Analyze Syllabus'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onLoadDemo}
                className="w-full py-1.5 px-3 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Load Biology (Photosynthesis) Sample Syllabus</span>
              </button>
            </div>
          </div>

          {/* Research note */}
          <div className="text-xs text-slate-500 bg-slate-100/70 p-3.5 rounded-lg border border-slate-200/80 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Context Grounding Principle:</strong> The syllabus defines the authoritative conceptual boundary. Questions and student descriptive answers are evaluated strictly against these concepts.
            </p>
          </div>
        </div>

        {/* Syllabus Understanding Output Column */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Syllabus Understanding
                </h3>
                <p className="text-xs text-slate-500">
                  AI-extracted structural units and important concepts
                </p>
              </div>

              {analyzed && (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Syllabus context ready</span>
                </div>
              )}
            </div>

            {analyzed ? (
              <div className="space-y-5">
                {/* Subject */}
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Subject
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {customSubject || syllabus.subject}
                  </div>
                </div>

                {/* Units / Topics */}
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Units / Topics
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                    {syllabus.units.map((unit, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-md border border-slate-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                        <span>{unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important Concepts */}
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Important Concepts
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                    {syllabus.importantConcepts.map((concept, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 p-2 bg-indigo-50/50 rounded-md border border-indigo-100/60"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confirmation Box */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-emerald-950 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ Syllabus context ready for answer sheet evaluation</span>
                  </div>
                </div>

                {/* Next Step Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onProceedToAnswerSheet}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Proceed to Answer Sheet Upload</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 px-4 text-center space-y-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-medium text-slate-700">
                  No syllabus context analyzed yet
                </div>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Click &ldquo;Analyze Syllabus&rdquo; to extract curriculum units and authoritative concepts for answer evaluation.
                </p>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  Analyze Standard Biology Syllabus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
