import React from 'react';
import { X, BarChart2, BookOpen, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { PARSED_QUESTIONS, EXAM_META } from '../data/copybookData';

interface ItemAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ItemAnalysisModal: React.FC<ItemAnalysisModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const itemStats = [
    {
      qNum: 3,
      topic: 'Force and Pressure (Numerical)',
      maxMarks: 4,
      avgMarks: 3.88,
      masteryRate: 97,
      difficulty: 'Easy',
      commonIssue: 'Calculation was well executed by all students; minor unit omission in 1 paper.',
      chapter: 'NCERT Chapter 11 — Force & Pressure',
    },
    {
      qNum: 6,
      topic: 'Reproduction in Animals (Descriptive)',
      maxMarks: 4,
      avgMarks: 3.63,
      masteryRate: 91,
      difficulty: 'Easy',
      commonIssue: 'Sperm-ovum fusion understood; oviduct site correctly stated by 7/8 students.',
      chapter: 'NCERT Chapter 9 — Reproduction in Animals',
    },
    {
      qNum: 1,
      topic: 'Crop Production & Management',
      maxMarks: 3,
      avgMarks: 2.63,
      masteryRate: 88,
      difficulty: 'Moderate',
      commonIssue: 'Soil nutrient replenishment noted; leguminous nitrogen fixation omitted in 2 sheets.',
      chapter: 'NCERT Chapter 1 — Crop Production',
    },
    {
      qNum: 5,
      topic: 'Metals and Non-metals',
      maxMarks: 5,
      avgMarks: 4.25,
      masteryRate: 85,
      difficulty: 'Moderate',
      commonIssue: 'Malleability and ductility well contrasted; electrical conductivity table incomplete in 1 sheet.',
      chapter: 'NCERT Chapter 4 — Materials: Metals & Non-metals',
    },
    {
      qNum: 7,
      topic: 'Synthetic Fibres and Plastics',
      maxMarks: 4,
      avgMarks: 3.25,
      masteryRate: 81,
      difficulty: 'Moderate',
      commonIssue: 'Nylon advantage recalled; melting upon heating disadvantage partially elaborated.',
      chapter: 'NCERT Chapter 3 — Synthetic Fibres',
    },
    {
      qNum: 2,
      topic: "Newton's Third Law of Motion",
      maxMarks: 4,
      avgMarks: 3.13,
      masteryRate: 78,
      difficulty: 'Challenging',
      commonIssue: "Students stated 'action = -reaction' but failed to specify simultaneous action on two different bodies.",
      chapter: 'NCERT Chapter 11 — Force & Pressure',
    },
    {
      qNum: 4,
      topic: 'Plant Cell Diagram & Organelles',
      maxMarks: 6,
      avgMarks: 4.38,
      masteryRate: 73,
      difficulty: 'Most Challenging',
      commonIssue: 'Confusion between vacuolar membrane (tonoplast) and plasma membrane; chloroplast labels ambiguous.',
      chapter: 'NCERT Chapter 8 — Cell: Structure & Functions',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#121826] border border-[#25324c] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1f283d] flex items-center justify-between bg-[#151c2c]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1f2a42] border border-[#2f4066] flex items-center justify-center text-blue-300">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Class Question Analysis &amp; Concept Mastery Index
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Item Discrimination
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Class 8-A · 8 students · Diagnosis of difficult syllabus concepts for remedial teaching
              </p>
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto bg-[#0e1320]">
          {/* Quick Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#141b2c] border border-[#222e47] rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Class Highest Mastery</span>
              <div className="text-lg font-bold text-white mt-1">Q3. Pressure Calculation</div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">97% Class Mastery Rate</div>
            </div>

            <div className="p-4 bg-[#141b2c] border border-[#222e47] rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Needs Remedial Attention</span>
              <div className="text-lg font-bold text-white mt-1">Q4. Plant Cell Diagram</div>
              <div className="text-xs text-amber-400 font-mono mt-0.5">73% Class Mastery Rate</div>
            </div>

            <div className="p-4 bg-[#141b2c] border border-[#222e47] rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Syllabus Topic to Revisit</span>
              <div className="text-lg font-bold text-white mt-1">Cell Structure &amp; Organelles</div>
              <div className="text-xs text-blue-300 font-mono mt-0.5">NCERT Chapter 8</div>
            </div>
          </div>

          {/* Detailed Question Table sorted by mastery */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              QUESTION-BY-QUESTION MASTERY &amp; DIFFICULTY BREAKDOWN
            </div>

            <div className="rounded-xl border border-[#222e47] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#162033] border-b border-[#222e47] text-[11px] font-mono text-slate-400 uppercase">
                    <th className="py-2.5 px-4 w-10">Q#</th>
                    <th className="py-2.5 px-4">Question Topic</th>
                    <th className="py-2.5 px-4 text-center">Avg Score</th>
                    <th className="py-2.5 px-4 text-center">Mastery %</th>
                    <th className="py-2.5 px-4 text-center">Difficulty</th>
                    <th className="py-2.5 px-4">Diagnostic Insight for Teacher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e273b]">
                  {itemStats.map((item) => (
                    <tr key={item.qNum} className="hover:bg-[#151c2c]">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">Q{item.qNum}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{item.topic}</div>
                        <div className="text-[11px] text-slate-400">{item.chapter}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-200">
                        {item.avgMarks} <span className="text-slate-500 font-normal">/ {item.maxMarks}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          item.masteryRate >= 90
                            ? 'text-emerald-400 bg-emerald-950/40'
                            : item.masteryRate >= 80
                            ? 'text-blue-300 bg-blue-950/40'
                            : 'text-amber-300 bg-amber-950/40'
                        }`}>
                          {item.masteryRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          item.difficulty === 'Easy'
                            ? 'text-emerald-400 border border-emerald-800'
                            : item.difficulty === 'Moderate'
                            ? 'text-blue-300 border border-blue-800'
                            : 'text-amber-300 border border-amber-800'
                        }`}>
                          {item.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 text-xs leading-relaxed max-w-xs">
                        {item.commonIssue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1f283d] flex items-center justify-between bg-[#151c2c] text-xs text-slate-400">
          <span>Synced with CBSE Question Paper blueprint</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
