import React, { useState } from 'react';
import { ReviewChecklistItem, StudentData } from '../../types/copybook';
import { 
  AlertTriangle, 
  Check, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Send, 
  ExternalLink,
  Award,
  Eye
} from 'lucide-react';
import { ParentReportCardModal } from '../ParentReportCardModal';

interface Step4ApproveNotifyProps {
  checklistItems: ReviewChecklistItem[];
  students: StudentData[];
  onResolveItem: (itemId: string) => void;
  onGoToStudent: (studentId: string) => void;
  onGoToRegister: () => void;
}

export const Step4ApproveNotify: React.FC<Step4ApproveNotifyProps> = ({
  checklistItems,
  students,
  onResolveItem,
  onGoToStudent,
  onGoToRegister,
}) => {
  const [autoSendParents, setAutoSendParents] = useState<boolean>(true);
  const [batchApproved, setBatchApproved] = useState<boolean>(false);
  const [teacherApproved, setTeacherApproved] = useState<boolean>(false);
  const [principalApproved, setPrincipalApproved] = useState<boolean>(false);
  const [previewStudent, setPreviewStudent] = useState<StudentData | null>(null);

  const unresolvedCount = checklistItems.filter((i) => !i.resolved).length;

  const handleApproveBatch = () => {
    setBatchApproved(true);
    setTeacherApproved(true);
  };

  const handleResolveAction = (item: ReviewChecklistItem) => {
    if (item.studentId === 'ishaan') {
      onGoToStudent('ishaan');
    } else if (item.studentId === 'rohan') {
      onGoToRegister();
    } else {
      onResolveItem(item.id);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div>
        <div className="text-[11px] font-mono tracking-widest text-indigo-400 font-semibold uppercase mb-1">
          APPROVAL &amp; NOTIFICATION
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          Approve &amp; notify — Mid-Term Examination
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Class 8-A · Science · 8 students
        </p>
      </div>

      {/* Top 2 Columns: Needs-Review Checklist + Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: NEEDS-REVIEW CHECKLIST */}
        <div className="lg:col-span-6 bg-[#121826] border border-[#20293d] rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
            NEEDS-REVIEW CHECKLIST
          </div>

          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.resolved
                    ? 'bg-[#151f30]/40 border-emerald-800/40 text-slate-400'
                    : 'bg-[#182133] border-[#293650] space-y-2.5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      item.resolved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {item.resolved ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="text-[11px] font-bold">!</span>
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="text-xs font-semibold text-white">
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {!item.resolved ? (
                  <div className="pl-8 pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleResolveAction(item)}
                      className="px-3 py-1.5 bg-[#202d46] hover:bg-[#283857] text-blue-300 text-xs font-medium rounded-lg border border-[#374970] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{item.actionText}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onResolveItem(item.id)}
                      className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                      title="Quick mark as resolved"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <div className="pl-8 text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Item reviewed &amp; verified</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Box */}
          <div className="p-4 bg-[#192235] border border-amber-800/40 rounded-xl space-y-3">
            <div className="text-xs text-amber-300 font-medium">
              {unresolvedCount > 0
                ? `${unresolvedCount} items still need review before this batch can be approved.`
                : 'All checklist items have been resolved. The batch is ready for final approval.'}
            </div>

            <button
              type="button"
              onClick={handleApproveBatch}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer ${
                batchApproved
                  ? 'bg-emerald-600 text-white'
                  : unresolvedCount === 0
                  ? 'bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold'
                  : 'bg-[#222f48] hover:bg-[#293a5a] text-slate-200 border border-[#3b4e78]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{batchApproved ? 'Batch Approved ✓' : 'Approve batch ✓'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: SCORE DISTRIBUTION */}
        <div className="lg:col-span-6 bg-[#121826] border border-[#20293d] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
            SCORE DISTRIBUTION
          </div>

          {/* Simple Chart */}
          <div className="h-52 flex items-end justify-between gap-4 px-4 pt-4 pb-2 border-b border-[#20293d]">
            {/* 0-14 marks FLAGGED */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-mono font-bold text-red-400">1</span>
              <div className="w-full bg-[#f87171] rounded-t-md transition-all duration-500" style={{ height: '25%' }} />
              <div className="text-center pt-2">
                <span className="block text-[10px] font-mono text-slate-300">0–14 marks</span>
                <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider">
                  FLAGGED
                </span>
              </div>
            </div>

            {/* 15-20 marks */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-mono font-bold text-slate-500">0</span>
              <div className="w-full bg-slate-800 rounded-t-md" style={{ height: '4px' }} />
              <div className="text-center pt-2">
                <span className="block text-[10px] font-mono text-slate-400">15–20 marks</span>
              </div>
            </div>

            {/* 21-25 marks */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-mono font-bold text-blue-300">2</span>
              <div className="w-full bg-[#60a5fa] rounded-t-md transition-all duration-500" style={{ height: '50%' }} />
              <div className="text-center pt-2">
                <span className="block text-[10px] font-mono text-slate-300">21–25 marks</span>
              </div>
            </div>

            {/* 26-30 marks */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-mono font-bold text-blue-300">4</span>
              <div className="w-full bg-[#60a5fa] rounded-t-md transition-all duration-500" style={{ height: '90%' }} />
              <div className="text-center pt-2">
                <span className="block text-[10px] font-mono text-slate-300">26–30 marks</span>
              </div>
            </div>
          </div>

          {/* FLAGGED LOW SCORERS Section */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
              FLAGGED LOW SCORERS
            </div>

            <div
              className="bg-[#182133] hover:bg-[#1f2b42] border border-[#2a3750] rounded-xl p-3.5 flex items-center justify-between transition-colors"
            >
              <div 
                onClick={() => onGoToStudent('sanya')}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="text-sm font-semibold text-white hover:text-blue-300 transition-colors">
                  Sanya Iyer
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Roll 6
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const s = students.find((item) => item.id === 'sanya');
                    if (s) setPreviewStudent(s);
                  }}
                  className="px-2.5 py-1 bg-[#23314d] hover:bg-[#2b3c5e] text-blue-300 rounded text-xs border border-[#3b4e78] inline-flex items-center gap-1 cursor-pointer"
                  title="Preview Sanya's Parent Report Card"
                >
                  <Award className="w-3 h-3 text-emerald-400" />
                  <span>Report Card</span>
                </button>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-red-950/60 border border-red-800 text-red-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  14 / 30
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Section: APPROVAL CHAIN */}
      <div className="bg-[#121826] border border-[#20293d] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
          APPROVAL CHAIN
        </div>

        {/* 3 Step Vertical Timeline */}
        <div className="space-y-6 max-w-3xl">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                teacherApproved || batchApproved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#1e2a42] text-slate-300 border border-[#32456e]'
              }`}
            >
              {teacherApproved || batchApproved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
            </div>

            <div className="space-y-1 flex-1">
              <div className="text-sm font-semibold text-white">
                Teacher confirmation
              </div>
              <p className="text-xs text-slate-400">
                Batch summary and report links sent to Ms. Anjali Rao.
              </p>
              <div className="text-xs font-medium pt-0.5">
                {teacherApproved || batchApproved ? (
                  <span className="text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved by Ms. Anjali Rao on 12 Sep 2026
                  </span>
                ) : (
                  <button
                    onClick={() => setTeacherApproved(true)}
                    className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" /> Waiting on approval · Click to approve as Teacher
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                principalApproved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#1e2a42] text-slate-300 border border-[#32456e]'
              }`}
            >
              {principalApproved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
            </div>

            <div className="space-y-1 flex-1">
              <div className="text-sm font-semibold text-white">
                Principal / correspondent summary
              </div>
              <p className="text-xs text-slate-400">
                Class average, distribution, and flagged low scorers — drill-down only, no PDFs inline.
              </p>
              <div className="text-xs font-medium pt-0.5">
                {principalApproved ? (
                  <span className="text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved by Principal
                  </span>
                ) : (
                  <button
                    onClick={() => setPrincipalApproved(true)}
                    className="text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" /> Waiting on approval · Click to sign off as Principal
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-7 h-7 rounded-full bg-[#1e2a42] text-slate-300 border border-[#32456e] flex items-center justify-center text-xs font-mono font-bold shrink-0">
              3
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">
                  Parent report cards (8)
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewStudent(students[0])}
                  className="px-2.5 py-0.5 text-[11px] font-medium bg-[#1d2940] hover:bg-[#253554] text-blue-300 rounded border border-[#34486f] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview Sample Card</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Individual grade sheet PDF sent to each parent on the roster.
              </p>
              <div className="text-xs text-slate-400 font-medium pt-0.5">
                {autoSendParents && (teacherApproved || batchApproved) ? (
                  <span className="text-blue-300 inline-flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Scheduled for automatic email dispatch upon approval
                  </span>
                ) : (
                  <span>Waiting on approval</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Toggle: Auto-send report to parents */}
        <div className="pt-6 border-t border-[#1f283d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-white">
              Auto-send report to parents
            </div>
            <p className="text-xs text-slate-400">
              School-level roster setting for Greenwood Public School · currently {autoSendParents ? 'on' : 'off'}
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSendParents}
              onChange={(e) => setAutoSendParents(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#1f2b42] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Parent Report Card Modal */}
      {previewStudent && (
        <ParentReportCardModal
          isOpen={Boolean(previewStudent)}
          onClose={() => setPreviewStudent(null)}
          student={previewStudent}
        />
      )}
    </div>
  );
};

