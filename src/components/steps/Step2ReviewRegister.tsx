import React, { useState } from 'react';
import { StudentData, CorrectionMode } from '../../types/copybook';
import { EXAM_META, PARSED_QUESTIONS } from '../../data/copybookData';
import { ArrowRight, ChevronRight, Check, Search, Download, Printer, BarChart2 } from 'lucide-react';
import { ItemAnalysisModal } from '../ItemAnalysisModal';

interface Step2ReviewRegisterProps {
  students: StudentData[];
  onSelectStudent: (studentId: string) => void;
  onContinueToApproval: () => void;
  onAssignCandidate: (studentId: string, candidateName: string) => void;
  correctionMode: CorrectionMode;
}

type FilterType = 'All students' | 'Needs review' | 'Edited' | 'Auto-graded';

export const Step2ReviewRegister: React.FC<Step2ReviewRegisterProps> = ({
  students,
  onSelectStudent,
  onContinueToApproval,
  onAssignCandidate,
  correctionMode,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Needs review');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isItemAnalysisOpen, setIsItemAnalysisOpen] = useState<boolean>(false);

  const autoGradedCount = students.filter((s) => s.status === 'Auto-graded').length;
  const needsReviewCount = students.filter((s) => s.status === 'Needs review').length;
  const editedCount = students.filter((s) => s.status === 'Edited').length;

  const filteredStudents = students.filter((s) => {
    const matchesFilter = activeFilter === 'All students' ? true : s.status === activeFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toString().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Roll No', 'Student Name', 'Class', 'Total Marks', 'Max Marks', 'Percentage', 'Status'];
    const rows = students.map((s) => {
      const marks = s.totalMarks !== undefined ? s.totalMarks : 'Pending';
      const pct = s.totalMarks !== undefined ? Math.round((s.totalMarks / s.maxMarks) * 100) + '%' : 'Pending';
      return [s.rollNo, `"${s.name}"`, s.classSection, marks, s.maxMarks, pct, s.status];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Batch_Register_Class_8A_Science_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintLedger = () => {
    window.print();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Top Banner: Batch Register Title + Continue CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-indigo-400 font-semibold uppercase mb-1">
            BATCH REGISTER
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Mid-Term Examination · Class {EXAM_META.classSection}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Graded {EXAM_META.gradedDate} · Correction mode:{' '}
            <strong className="text-white font-medium">{correctionMode}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsItemAnalysisOpen(true)}
            className="px-3.5 py-2 bg-[#182236] hover:bg-[#202d46] text-blue-300 hover:text-white border border-[#2b3a56] text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            title="Inspect Question Difficulty & Class Mastery"
          >
            <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Item Analysis</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#182236] hover:bg-[#202d46] text-slate-300 hover:text-white border border-[#2b3a56] text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            title="Download CSV Marks Ledger"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onContinueToApproval}
            className="self-start sm:self-auto px-5 py-2.5 bg-[#93c5fd] hover:bg-blue-300 text-slate-950 font-semibold text-sm rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Continue to approval</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>


      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Students */}
        <div className="bg-[#121826] border border-[#20293d] rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            STUDENTS
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {students.length}
          </div>
        </div>

        {/* Batch Average */}
        <div className="bg-[#121826] border border-[#20293d] rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            BATCH AVERAGE
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {EXAM_META.batchAverage} <span className="text-sm font-normal text-slate-400">/ 30</span>
          </div>
        </div>

        {/* Auto-Graded */}
        <div className="bg-[#121826] border border-[#20293d] rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            AUTO-GRADED
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {autoGradedCount}
          </div>
        </div>

        {/* Needs Review */}
        <div className="bg-[#121826] border border-[#20293d] rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            NEEDS REVIEW
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {needsReviewCount}
          </div>
        </div>

        {/* Edited */}
        <div className="bg-[#121826] border border-[#20293d] rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            EDITED
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">
            {editedCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['All students', 'Needs review', 'Edited', 'Auto-graded'] as FilterType[]).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1e2a42] text-white border border-[#3b4e78] shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 bg-[#121826]/70 border border-transparent'
                }`}
              >
                {filter}
                {filter === 'Needs review' && needsReviewCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {needsReviewCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student or roll..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#162033] border border-[#27344d] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Students Table / Register Cards */}
      <div className="bg-[#121826] border border-[#20293d] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#20293d] bg-[#162033] text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3 px-6">STUDENT</th>
                <th className="py-3 px-4">ID MATCH</th>
                <th className="py-3 px-4 text-center">TOTAL</th>
                <th className="py-3 px-6 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2438]">
              {filteredStudents.map((s) => {
                const isNeedsReview = s.status === 'Needs review';
                const isEdited = s.status === 'Edited';

                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s.id)}
                    className="hover:bg-[#172033] transition-colors cursor-pointer group"
                  >
                    {/* Student Name & Roll */}
                    <td className="py-4 px-6 align-top max-w-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {s.name}
                          </div>
                          {s.isReal ? (
                            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-blue-950/70 text-blue-300 border border-blue-800 animate-pulse">
                              REAL DATA
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-purple-950/70 text-purple-300 border border-purple-800">
                              DEMO
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          Roll {s.rollNo}
                        </div>

                        {/* Special note for Rohan Gupta / smudged ID */}
                        {s.idMatchNote && (
                          <div className="pt-2 space-y-2">
                            <div className="text-xs text-[#f87171] leading-relaxed">
                              {s.idMatchNote}
                            </div>

                            {s.candidateMatches && (
                              <div
                                className="flex flex-wrap items-center gap-2 pt-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {s.candidateMatches.map((cand, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => onAssignCandidate(s.id, cand.name)}
                                    className={`px-3 py-1 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                                      cand.selected
                                        ? 'bg-[#1d2b47] text-blue-300 border border-blue-500 shadow-xs'
                                        : 'bg-[#182133] text-slate-400 hover:text-white border border-[#283550]'
                                    }`}
                                  >
                                    <span>{cand.name}</span>
                                    <span className="text-[10px] text-slate-500">· {cand.confidence}%</span>
                                    {cand.selected && <Check className="w-3 h-3 text-blue-400" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Special note for Vihaan Reddy / low document resolution */}
                        {s.id === 'vihaan' && (
                          <div className="pt-1.5 text-xs text-[#f87171] leading-relaxed">
                            Pages for questions 5–6 were scanned with light ink; AI understanding confidence fell below the auto-accept threshold (Teacher Review Required).
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ID Match */}
                    <td className="py-4 px-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          s.idMatchConfidence === 'High'
                            ? 'text-emerald-400'
                            : s.idMatchConfidence === 'Medium'
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            s.idMatchConfidence === 'High'
                              ? 'bg-emerald-400'
                              : s.idMatchConfidence === 'Medium'
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                          }`}
                        ></span>
                        {s.idMatchConfidence}
                      </span>
                    </td>

                    {/* Total Marks */}
                    <td className="py-4 px-4 text-center align-top font-mono">
                      {s.totalMarks !== undefined ? (
                        <div className="space-y-0.5">
                          <span className="text-base font-bold text-white">
                            {s.totalMarks}
                          </span>
                          <span className="text-slate-400 text-xs"> / {s.maxMarks}</span>
                          {s.pendingMarks && (
                            <div className="text-[11px] font-sans text-amber-400 font-medium">
                              {s.pendingMarks} mark pending
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-base font-bold text-slate-500">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-right align-top">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            isNeedsReview
                              ? 'text-amber-400'
                              : isEdited
                              ? 'text-blue-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isNeedsReview
                                ? 'bg-amber-400'
                                : isEdited
                                ? 'bg-blue-400'
                                : 'bg-emerald-400'
                            }`}
                          ></span>
                          {s.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Analysis Modal */}
      <ItemAnalysisModal
        isOpen={isItemAnalysisOpen}
        onClose={() => setIsItemAnalysisOpen(false)}
      />
    </div>
  );
};


