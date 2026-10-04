import React from 'react';
import { X, FileText, Download, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { EXAM_META } from '../data/copybookData';

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCurrent: () => void;
}

export const RecordsModal: React.FC<RecordsModalProps> = ({
  isOpen,
  onClose,
  onSelectCurrent,
}) => {
  if (!isOpen) return null;

  const pastRecords = [
    {
      id: 'current',
      examTitle: 'Mid-Term Examination · Science',
      classSection: 'Class 8-A · CBSE',
      date: '12 Sep 2026',
      studentsCount: 8,
      avgScore: '23.9 / 30',
      status: 'In Review',
      isCurrent: true,
    },
    {
      id: 'rec-2',
      examTitle: 'Unit Test 1 · Mathematics',
      classSection: 'Class 8-A · CBSE',
      date: '18 Aug 2026',
      studentsCount: 8,
      avgScore: '26.4 / 30',
      status: 'Approved & Dispatched',
      isCurrent: false,
    },
    {
      id: 'rec-3',
      examTitle: 'Periodic Assessment 1 · English',
      classSection: 'Class 8-A · CBSE',
      date: '28 Jul 2026',
      studentsCount: 8,
      avgScore: '24.1 / 30',
      status: 'Approved & Dispatched',
      isCurrent: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#121826] border border-[#25324c] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f283d] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1b253b] border border-[#2b3b5e] flex items-center justify-center text-blue-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Examination Records</h3>
              <p className="text-xs text-slate-400">Greenwood Public School · Academic Year 2026–27</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a2336] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of past records */}
        <div className="space-y-3 pt-1">
          {pastRecords.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border transition-all ${
                rec.isCurrent
                  ? 'bg-[#182338] border-blue-500/50'
                  : 'bg-[#151c2c] border-[#222c42]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {rec.examTitle}
                    </span>
                    {rec.isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                        Current Batch
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>{rec.classSection}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {rec.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Users className="w-3 h-3 text-slate-500" />
                      {rec.studentsCount} students
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-white">
                      Avg {rec.avgScore}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {rec.status}
                    </div>
                  </div>

                  {rec.isCurrent ? (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCurrent();
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Open
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => alert(`Exporting archived grade report for ${rec.examTitle}`)}
                      className="px-3 py-1.5 text-xs font-medium bg-[#1e2a42] hover:bg-[#253554] text-slate-300 rounded-lg border border-[#2f4066] transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#1f283d] flex items-center justify-between text-xs text-slate-400">
          <span>Synced with school repository</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1b253b] hover:bg-[#22304d] text-white rounded-lg text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
