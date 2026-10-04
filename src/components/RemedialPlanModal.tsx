import React from 'react';
import { StudentData } from '../types/copybook';
import { X, BookOpen, Target, Sparkles, Printer, Download, CheckCircle2 } from 'lucide-react';
import { EXAM_META, PARSED_QUESTIONS } from '../data/copybookData';

interface RemedialPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentData;
}

export const RemedialPlanModal: React.FC<RemedialPlanModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen) return null;

  const totalMarks = student.totalMarks ?? 20;

  // Derive weak questions (where marks < 70% of maxMarks)
  const weakQuestions = (student.questions || []).filter(
    (q) => q.marksAwarded / q.maxMarks < 0.7
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
================================================================================
GREENWOOD PUBLIC SCHOOL — DEPARTMENT OF SCIENCE
PERSONALIZED REMEDIAL STUDY & RECOVERY PLAN
================================================================================
Student: ${student.name} (Roll ${student.rollNo}, Class ${student.classSection})
Subject: Science | Exam: Mid-Term Examination 2026
Current Score: ${totalMarks} / 30 (${Math.round((totalMarks / 30) * 100)}%)

TARGET AREAS & MISCONCEPTIONS DETECTED:
${weakQuestions.map((q) => `- Q#${q.qNum}: Scored ${q.marksAwarded}/${q.maxMarks} Marks. Feedback: ${q.feedback}`).join('\n')}

RECOMMENDED NCERT READINGS:
1. Chapter 8: Cell — Structure and Functions (Pages 92–98, Plant vs Animal Cell organelle labelling).
2. Chapter 11: Force and Pressure (Pages 132–136, Action-Reaction pairs on distinct bodies).
3. Chapter 1: Crop Production (Pages 8–11, Nitrogen fixation cycle and crop rotation benefits).

ASSIGNED REMEDIAL PRACTICE QUESTIONS:
1. Draw a neat labelled diagram of a plant cell with tonoplast, cell wall, and plastids.
2. State Newton's Third Law of Motion and explain why action and reaction forces do not cancel each other.
3. List two differences between contact and non-contact forces with everyday examples.

Teacher Facilitator: Ms. Anjali Rao (Senior Science Faculty)
Parent Consultation Requested: Yes
================================================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Remedial_Plan_${student.name.replace(/\s+/g, '_')}_Class8A.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-[#121826] border border-[#25324c] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f283d] flex items-center justify-between bg-[#151c2c] print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1f2a42] border border-[#2f4066] flex items-center justify-center text-amber-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Personalized Remedial Action Plan
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                  {student.name} · Score {totalMarks}/30
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Targeted recovery roadmap generated from descriptive answer evaluation insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-[#1e2a42] hover:bg-[#283857] hover:text-white rounded-lg border border-[#304163] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Plan</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a2336] transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-[#0f1422] text-slate-100 print:bg-white print:text-slate-900">
          <div className="border-b border-[#222e47] pb-4 space-y-1 print:border-slate-300">
            <div className="text-[11px] font-mono uppercase text-blue-400 tracking-wider font-semibold print:text-slate-600">
              NCERT SYLLABUS ALIGNED REMEDIATION
            </div>
            <h2 className="font-serif text-2xl font-bold text-white print:text-slate-950">
              Academic Recovery Plan — {student.name}
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              Roll No {student.rollNo} · Class {student.classSection} · Greenwood Public School · Teacher: Ms. Anjali Rao
            </p>
          </div>

          {/* Identified Gap Areas */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5 print:text-slate-800 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 print:hidden" />
              <span>Identified Conceptual Gaps from Examination Paper</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {weakQuestions.length > 0 ? (
                weakQuestions.map((q) => {
                  const qMeta = PARSED_QUESTIONS.find((item) => item.qNum === q.qNum);
                  return (
                    <div
                      key={q.qNum}
                      className="p-3.5 bg-[#172033] rounded-xl border border-[#27344e] space-y-1 text-xs print:bg-slate-50 print:border-slate-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white print:text-slate-900">
                          Q{q.qNum}. {qMeta?.topic}
                        </span>
                        <span className="font-mono text-red-400 font-semibold print:text-red-700">
                          {q.marksAwarded} / {q.maxMarks} Marks
                        </span>
                      </div>
                      <p className="text-slate-300 italic text-[11px] print:text-slate-700">
                        Evaluation Diagnostic: {q.feedback}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 bg-[#172033] rounded-xl border border-[#27344e] text-xs text-slate-300">
                  Student demonstrated consistent conceptual understanding across all questions.
                </div>
              )}
            </div>
          </div>

          {/* Targeted Remedial Assignments */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-blue-300 font-bold print:text-slate-800">
              Assigned NCERT Re-learning Steps
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#141b2c] rounded-xl border border-[#222e47] flex items-start gap-3 print:bg-slate-50 print:border-slate-300">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold flex items-center justify-center shrink-0 print:bg-slate-200 print:text-slate-800">
                  1
                </span>
                <div>
                  <div className="font-semibold text-white print:text-slate-950">
                    NCERT Chapter 8 — Cell: Structure and Functions (Pages 92–98)
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 print:text-slate-600">
                    Practice redrawing the plant cell diagram 3 times. Focus on distinguishing tonoplast (vacuolar membrane) from the inner plasma membrane.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#141b2c] rounded-xl border border-[#222e47] flex items-start gap-3 print:bg-slate-50 print:border-slate-300">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold flex items-center justify-center shrink-0 print:bg-slate-200 print:text-slate-800">
                  2
                </span>
                <div>
                  <div className="font-semibold text-white print:text-slate-950">
                    NCERT Chapter 11 — Force and Pressure (Pages 132–136)
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 print:text-slate-600">
                    Review Newton's Third Law examples. Note that action and reaction forces act on two separate bodies, hence they do not balance or cancel out.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#141b2c] rounded-xl border border-[#222e47] flex items-start gap-3 print:bg-slate-50 print:border-slate-300">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold flex items-center justify-center shrink-0 print:bg-slate-200 print:text-slate-800">
                  3
                </span>
                <div>
                  <div className="font-semibold text-white print:text-slate-950">
                    1-on-1 Consultation Session with Science Faculty
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 print:text-slate-600">
                    Scheduled for Thursday, 17 Sep 2026 during zero period (8:15 AM — 8:45 AM).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher & Parent Signatures */}
          <div className="pt-4 border-t border-[#222e47] flex items-center justify-between text-xs text-slate-400 print:border-slate-300 print:text-slate-600">
            <div>
              <div className="font-serif italic font-bold text-slate-200 text-sm print:text-slate-900">
                Ms. Anjali Rao
              </div>
              <div className="text-[10px] font-mono">Assigned Science Mentor</div>
            </div>

            <div className="text-right">
              <div className="border-b border-dashed border-slate-600 w-40 pb-4 print:border-slate-400" />
              <div className="text-[10px] font-mono mt-1">Parent Acknowledgment Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
