import React, { useState, useEffect } from 'react';
import { StoredEvaluationRecord } from '../types/evaluationRecord';
import { fetchEvaluations, deleteEvaluation } from '../services/evaluationApi';
import { 
  X, 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Check, 
  ArrowRight, 
  FileText, 
  Trash2, 
  Sparkles,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface EvaluationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvaluation: (evaluation: StoredEvaluationRecord) => void;
  currentEvaluationId?: string;
}

type FilterCategory = 'all' | 'real' | 'demo';

export const EvaluationHistoryModal: React.FC<EvaluationHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectEvaluation,
  currentEvaluationId,
}) => {
  const [evaluations, setEvaluations] = useState<StoredEvaluationRecord[]>([]);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [realCount, setRealCount] = useState(0);
  const [demoCount, setDemoCount] = useState(0);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEvaluations(filterCategory);
      setEvaluations(data.evaluations || []);
      setRealCount(data.realCount || 0);
      setDemoCount(data.demoCount || 0);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, filterCategory]);

  if (!isOpen) return null;

  const filteredList = evaluations.filter((e) => {
    const studentName = e.student?.name?.toLowerCase() || '';
    const roll = e.student?.rollNo?.toString() || '';
    const subject = e.syllabus?.subject?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return studentName.includes(q) || roll.includes(q) || subject.includes(q);
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this evaluation record from database?')) {
      const ok = await deleteEvaluation(id);
      if (ok) {
        setEvaluations((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Finalized':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Finalized
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-800">
            <Check className="w-3 h-3 text-blue-400" />
            Completed
          </span>
        );
      case 'Needs Teacher Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Needs Teacher Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <Clock className="w-3 h-3 text-slate-400" />
            Processing
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-[#121826] border border-[#25324c] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1f283d] flex items-center justify-between bg-[#151c2c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1e2a44] border border-[#304168] flex items-center justify-center text-blue-300">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Answer-Sheet Evaluation History
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1b273d] text-blue-300 border border-[#2b3c5e]">
                  PERSISTENT DATABASE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                All processed student evaluations with AI predictions, teacher validations, and accuracy metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a2336] transition-colors"
              title="Refresh from database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a2336] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Category Filter Tabs & Search */}
        <div className="p-4 sm:px-6 border-b border-[#1c2538] bg-[#111724] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Category Tabs: Clearly separating Real vs Demo data */}
          <div className="flex items-center gap-1.5 bg-[#172033] p-1 rounded-xl border border-[#27344e] text-xs font-medium">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Records ({realCount + demoCount})
            </button>
            <button
              onClick={() => setFilterCategory('real')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'real'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
              <span>Real Uploads ({realCount})</span>
            </button>
            <button
              onClick={() => setFilterCategory('demo')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'demo'
                  ? 'bg-purple-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
              <span>Demo Data ({demoCount})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, roll #, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#172033] border border-[#283650] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          {isLoading && evaluations.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Loading records from backend database...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-16 space-y-3 border border-dashed border-[#243048] rounded-xl">
              <FileText className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-white">No evaluation records found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {filterCategory === 'real'
                  ? 'No real student answer sheets uploaded yet. Upload a real PDF answer-sheet in Step 1 to populate this section.'
                  : 'No evaluations match your search query.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#202b40]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#202b40] bg-[#162033] text-[11px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-3.5">STUDENT &amp; TYPE</th>
                    <th className="py-3 px-3">SUBJECT &amp; EXAM</th>
                    <th className="py-3 px-3">DATE / TIME</th>
                    <th className="py-3 px-3 text-right">AI MARKS</th>
                    <th className="py-3 px-3 text-right">TEACHER MARKS</th>
                    <th className="py-3 px-3 text-center">DIFF</th>
                    <th className="py-3 px-3 text-center">AGREEMENT</th>
                    <th className="py-3 px-3 text-center">STATUS</th>
                    <th className="py-3 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b253a]">
                  {filteredList.map((item) => {
                    const isSelected = item.id === currentEvaluationId;
                    const diff = item.accuracyMetrics?.difference ?? 0;
                    const agreement = item.accuracyMetrics?.overallMarkAgreementPct ?? 100;
                    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          onSelectEvaluation(item);
                          onClose();
                        }}
                        className={`hover:bg-[#182338] transition-colors cursor-pointer group ${
                          isSelected ? 'bg-blue-950/30' : ''
                        }`}
                      >
                        {/* Student Name + Type Badge */}
                        <td className="py-3.5 px-3.5">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                              {item.student.name}
                            </div>
                            {item.isDemo ? (
                              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-purple-950/60 text-purple-300 border border-purple-800">
                                DEMO
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-blue-950/60 text-blue-300 border border-blue-800 animate-pulse">
                                REAL DATA
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Roll {item.student.rollNo} · Class {item.student.classSection}
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="py-3.5 px-3">
                          <div className="text-slate-200 font-medium">{item.syllabus.subject}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                            {item.syllabus.examTitle}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* AI Marks */}
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-indigo-300">
                          {item.accuracyMetrics.totalAiMarks} / {item.accuracyMetrics.totalMaxMarks}
                        </td>

                        {/* Teacher Marks */}
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                          {item.accuracyMetrics.totalTeacherMarks} / {item.accuracyMetrics.totalMaxMarks}
                        </td>

                        {/* Difference */}
                        <td className="py-3.5 px-3 text-center font-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              diff === 0
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                                : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                            }`}
                          >
                            {diff === 0 ? '0.0' : `±${diff}`}
                          </span>
                        </td>

                        {/* Accuracy/Agreement */}
                        <td className="py-3.5 px-3 text-center font-mono font-semibold text-emerald-400">
                          {agreement}%
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>

                        {/* Action CTA */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                onSelectEvaluation(item);
                                onClose();
                              }}
                              className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <span>Open</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>

                            {!item.isDemo && (
                              <button
                                onClick={(e) => handleDelete(e, item.id)}
                                className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-red-950/40 transition-colors"
                                title="Delete real record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#1c2538] bg-[#101622] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <div>
            Showing {filteredList.length} of {evaluations.length} total evaluations stored in persistent database.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Real uploads protected from demo overwrite
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
