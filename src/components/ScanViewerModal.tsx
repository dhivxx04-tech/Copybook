import React, { useState } from 'react';
import { StudentData, QuestionStructure } from '../types/copybook';
import { PARSED_QUESTIONS } from '../data/copybookData';
import { X, ZoomIn, ZoomOut, Check, AlertCircle, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

interface ScanViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentData;
  activeQNum?: number;
}

export const ScanViewerModal: React.FC<ScanViewerModalProps> = ({
  isOpen,
  onClose,
  student,
  activeQNum = 1,
}) => {
  const [selectedQ, setSelectedQ] = useState<number>(activeQNum);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!isOpen) return null;

  const currentQ = student.questions?.find((q) => q.qNum === selectedQ);
  const qMeta = PARSED_QUESTIONS.find((q) => q.qNum === selectedQ);

  const getSimulatedScanContent = (studentId: string, qNum: number) => {
    if (studentId === 'ishaan' && qNum === 4) {
      return {
        isSpecial: true,
        type: 'diagram',
        title: 'Ishaan Verma — Question 4 Plant Cell Diagram Scan',
        note: 'AI flagged label boundary: Tonoplast vs Inner Cell Membrane.',
      };
    }
    if (studentId === 'rohan') {
      return {
        isSpecial: true,
        type: 'smudge',
        title: 'Rohan Gupta — Cover Page Scan Snippet',
        note: 'Ink smudge across Roll No field (detected "Ro... G...").',
      };
    }
    if (studentId === 'vihaan' && (qNum === 5 || qNum === 6)) {
      return {
        isSpecial: true,
        type: 'low-res',
        title: `Vihaan Reddy — Page 3 (Questions 5–6) Low Resolution Scan`,
        note: 'DPI below 150 threshold. Transcribed via enhanced contrast pass.',
      };
    }
    return {
      isSpecial: false,
      type: 'standard',
      title: `${student.name} — Question ${qNum} Response`,
      note: 'Verified AI document understanding with high confidence (98.4%).',
    };
  };

  const scanInfo = getSimulatedScanContent(student.id, selectedQ);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#121826] border border-[#25324c] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#1f283d] flex items-center justify-between bg-[#151c2c]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1f2a42] border border-[#2f4066] flex items-center justify-center text-blue-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Original Scan Inspector
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {student.name} · Roll {student.rollNo}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                8A_AnswerSheet_0{student.rollNo}.pdf · Page {selectedQ <= 2 ? 1 : selectedQ <= 4 ? 2 : selectedQ <= 6 ? 3 : 4} of 4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="p-1.5 text-slate-400 hover:text-white bg-[#192235] rounded-lg border border-[#293650] transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 min-w-12 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="p-1.5 text-slate-400 hover:text-white bg-[#192235] rounded-lg border border-[#293650] transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a2336] transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Selector Tabs */}
        <div className="px-6 py-2.5 bg-[#101522] border-b border-[#1f283d] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-mono uppercase text-slate-500 mr-2 shrink-0">
            Select Question:
          </span>
          {PARSED_QUESTIONS.map((q) => (
            <button
              key={q.qNum}
              type="button"
              onClick={() => setSelectedQ(q.qNum)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                selectedQ === q.qNum
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-[#182133] text-slate-400 hover:text-slate-200 border border-[#27344e]'
              }`}
            >
              Q{q.qNum} ({q.marks}m)
            </button>
          ))}
        </div>

        {/* Scan Viewer & Analysis Split Screen */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#1f283d]">
          {/* Left Column: Simulated High-Resolution Scan Paper */}
          <div className="md:col-span-7 p-6 bg-[#0a0d14] flex flex-col items-center justify-center overflow-hidden">
            <div
              className="w-full max-w-lg bg-[#fbfbf8] text-slate-900 rounded-lg shadow-xl p-6 sm:p-8 space-y-4 border border-slate-300 relative transition-transform duration-200 select-none"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Paper Header / Watermark */}
              <div className="flex items-center justify-between border-b-2 border-slate-300 pb-2 text-[10px] font-mono text-slate-500">
                <span>GREENWOOD PUBLIC SCHOOL · MID-TERM 2026</span>
                <span>PAGE {selectedQ <= 2 ? 1 : selectedQ <= 4 ? 2 : selectedQ <= 6 ? 3 : 4}</span>
              </div>

              {/* Cover page smudge visualization for Rohan */}
              {student.id === 'rohan' && selectedQ === 1 && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded mb-2 text-xs">
                  <div className="text-[11px] font-mono uppercase text-slate-500 mb-1">
                    Student Details Box:
                  </div>
                  <div className="flex items-center gap-4">
                    <div>Name: <span className="font-serif italic font-bold">Rohan Gupta</span></div>
                    <div className="relative">
                      Roll No: <span className="inline-block w-12 h-5 bg-slate-800/80 rounded blur-[1.5px] opacity-80" />
                      <span className="absolute -top-3.5 right-0 text-[9px] font-mono text-red-600 font-bold">
                        SMUDGED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Heading on paper */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">
                  Q{selectedQ}. {qMeta?.question}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  [{qMeta?.marks} Marks]
                </div>
              </div>

              {/* Simulated Handwriting / Diagram */}
              {selectedQ === 4 ? (
                /* Diagram Mock */
                <div className="border border-dashed border-slate-400 p-4 rounded bg-white text-center space-y-3 relative">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    [Scanned Diagram Sheet]
                  </div>
                  <svg className="w-48 h-36 mx-auto stroke-slate-800 fill-none" viewBox="0 0 200 140">
                    <rect x="25" y="15" width="150" height="110" rx="20" strokeWidth="2.5" stroke="#1e293b" />
                    <rect x="33" y="23" width="134" height="94" rx="14" strokeWidth="1.5" stroke="#475569" strokeDasharray="3 3" />
                    <circle cx="65" cy="55" r="18" strokeWidth="2" stroke="#0f172a" fill="#e2e8f0" />
                    <ellipse cx="120" cy="70" rx="35" ry="25" strokeWidth="1.5" stroke="#334155" />
                    {/* Bounding box on question marker */}
                    <rect x="18" y="8" width="165" height="124" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
                  </svg>
                  <div className="text-[11px] font-serif text-slate-700 italic space-y-0.5">
                    <div>1. Cell wall ✓ &nbsp; 2. Chloroplast ✓</div>
                    <div>3. Nucleus ✓ &nbsp; 4. Vacuole membrane (?)</div>
                  </div>
                  {student.id === 'ishaan' && (
                    <div className="absolute top-2 right-2 bg-amber-100 text-amber-900 border border-amber-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                      FLAGGED REGION
                    </div>
                  )}
                </div>
              ) : (
                /* Handwriting text simulation */
                <div className="p-4 ruled-paper rounded-lg border border-slate-300 min-h-36 text-slate-800 space-y-2">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Candidate Handwriting (Blue Ink):
                  </div>
                  <p className="font-handwriting text-xl leading-8 text-[#102a5c] select-text">
                    &ldquo;{currentQ?.studentAnswer}&rdquo;
                  </p>
                  {scanInfo.type === 'low-res' && (
                    <div className="text-[10px] font-mono text-amber-700 bg-amber-50 p-2 rounded border border-amber-300">
                      AI confidence: 64% (low resolution scan artifact on line 3 · Teacher Review Required).
                    </div>
                  )}
                </div>
              )}

              {/* Rubber stamp watermark */}
              <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-200">
                <span>Greenwood Examination Hall 02</span>
                <span className="text-emerald-700 font-bold">VERIFIED EXAM SCAN</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Extraction & Teacher Verification */}
          <div className="md:col-span-5 p-6 bg-[#121826] space-y-5">
            <div>
              <div className="text-[11px] font-mono uppercase text-indigo-400 font-semibold mb-1">
                AI DOCUMENT UNDERSTANDING &amp; DIAGNOSTICS
              </div>
              <h4 className="text-sm font-bold text-white">
                {scanInfo.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {scanInfo.note}
              </p>
            </div>

            {/* Score & Match pill */}
            <div className="p-3.5 bg-[#172033] border border-[#27344e] rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Current Awarded:</span>
              <span className="text-base font-bold font-mono text-white">
                {currentQ?.marksAwarded} / {qMeta?.marks} Marks
              </span>
            </div>

            {/* Transcription comparison */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                AI Cleaned Transcription:
              </span>
              <div className="p-3 bg-[#182133] rounded-lg border border-[#2b3952] text-xs text-slate-200 leading-relaxed font-sans">
                {currentQ?.studentAnswer}
              </div>
            </div>

            {/* AI Rubric Feedback */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                AI Evaluator Remarks:
              </span>
              <div className="p-3 bg-[#182133] rounded-lg border border-[#2b3952] text-xs text-slate-300 leading-relaxed">
                {currentQ?.feedback}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-[#1f283d] flex items-center justify-between">
              <span className="text-xs text-emerald-400 inline-flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Scan integrity verified
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
