export type CopybookStep = 'upload' | 'register' | 'student-detail' | 'approve';

export type CorrectionMode = 'Easy' | 'Medium' | 'Strict';

export interface QuestionStructure {
  qNum: number;
  question: string;
  topic: string;
  type: 'Descriptive' | 'Quantitative' | 'Diagram';
  marks: number;
}

export interface StudentScoreItem {
  qNum: number;
  marksAwarded: number;
  maxMarks: number;
  studentAnswer: string;
  feedback: string;
  isFlagged?: boolean;
  flagReason?: string;
  
  // AI Confidence & Evaluation (Requirements 4, 5)
  aiMark?: number;
  aiConfidence?: number; // e.g. 90, 72, 45
  confidenceLevel?: 'High' | 'Medium' | 'Low';
  needsTeacherReview?: boolean;
  aiFeedback?: string;
  correctConcepts?: string[];
  missingConcepts?: string[];
  incorrectConcepts?: string[];

  // Teacher Validation & Ground Truth (Requirement 5)
  teacherMark?: number;
  teacherFeedback?: string;
  teacherValidated?: boolean;
}

export interface StudentData {
  id: string;
  name: string;
  shortName: string;
  rollNo: number;
  classSection: string;
  idMatchConfidence: 'High' | 'Medium' | 'Low' | 'Unresolved';
  idMatchNote?: string;
  candidateMatches?: { name: string; confidence: number; selected?: boolean }[];
  totalMarks?: number;
  maxMarks: number;
  pendingMarks?: number;
  status: 'Auto-graded' | 'Needs review' | 'Edited';
  statusNote?: string;
  questions?: StudentScoreItem[];
  correctionLog?: string[];
  resolved?: boolean;
  isReal?: boolean;
  dbRecordId?: string;
}

export interface ReviewChecklistItem {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  actionText: string;
  resolved: boolean;
}
