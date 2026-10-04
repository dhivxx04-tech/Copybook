export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type EvaluationStatus = 'Processing' | 'Completed' | 'Needs Teacher Review' | 'Finalized';

export interface EvaluatedQuestion {
  qNum: number;
  question: string;
  topic: string;
  maxMarks: number;
  studentAnswer: string;
  
  // AI evaluation
  aiMark: number;
  aiConfidence: number; // percentage 0-100 (e.g. 90, 72, 45)
  confidenceLevel: ConfidenceLevel;
  needsTeacherReview: boolean;
  aiFeedback: string;
  correctConcepts: string[];
  missingConcepts: string[];
  incorrectConcepts: string[];

  // Teacher validation (ground truth reference)
  teacherMark: number;
  teacherFeedback: string;
  teacherValidated: boolean;
}

export interface AccuracyCalculation {
  totalAiMarks: number;
  totalTeacherMarks: number;
  totalMaxMarks: number;
  difference: number; // |AI Mark - Teacher Mark|
  exactAgreementPct: number; // percentage where AI Mark === Teacher Mark
  mae: number; // Mean Absolute Error: Sum |AI - Teacher| / N
  overallMarkAgreementPct: number; // 100 - average percentage error
}

export interface StoredEvaluationRecord {
  id: string;
  isDemo: boolean;
  student: {
    id: string;
    name: string;
    rollNo: number;
    classSection: string;
  };
  syllabus: {
    subject: string;
    examTitle: string;
    topic: string;
    units: string[];
    importantConcepts: string[];
  };
  answerSheet: {
    fileName: string;
    fileSize: string;
    pageCount: number;
    fileType: string;
    uploadedAt: string;
    handwritingStyleDetected?: string;
    previewUrl?: string;
  };
  questions: EvaluatedQuestion[];
  accuracyMetrics: AccuracyCalculation;
  status: EvaluationStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Computes accuracy metrics strictly according to the user requirement:
 * Absolute Error = |AI Mark - Teacher Mark|
 * MAE = Sum of Absolute Errors / Number of Answers
 * Exact Agreement = (Count where AI === Teacher) / Number of Answers * 100
 */
export function computeEvaluationAccuracy(questions: EvaluatedQuestion[]): AccuracyCalculation {
  if (!questions || questions.length === 0) {
    return {
      totalAiMarks: 0,
      totalTeacherMarks: 0,
      totalMaxMarks: 0,
      difference: 0,
      exactAgreementPct: 100,
      mae: 0,
      overallMarkAgreementPct: 100,
    };
  }

  let totalAi = 0;
  let totalTeacher = 0;
  let totalMax = 0;
  let totalAbsError = 0;
  let exactMatches = 0;
  let agreementScoreSum = 0;

  for (const q of questions) {
    const ai = Number(q.aiMark) || 0;
    const teacher = Number(q.teacherMark) || 0;
    const max = Number(q.maxMarks) || 5;

    totalAi += ai;
    totalTeacher += teacher;
    totalMax += max;

    const absError = Math.abs(ai - teacher);
    totalAbsError += absError;

    if (absError < 0.05) {
      exactMatches += 1;
    }

    // Normalized agreement per question: max(0, 1 - absError / max)
    const normAgreement = Math.max(0, 1 - (absError / max));
    agreementScoreSum += normAgreement;
  }

  const count = questions.length;
  const mae = Number((totalAbsError / count).toFixed(2));
  const diff = Number(Math.abs(totalAi - totalTeacher).toFixed(2));
  const exactAgreementPct = Number(((exactMatches / count) * 100).toFixed(1));
  const overallMarkAgreementPct = Number(((agreementScoreSum / count) * 100).toFixed(1));

  return {
    totalAiMarks: Number(totalAi.toFixed(1)),
    totalTeacherMarks: Number(totalTeacher.toFixed(1)),
    totalMaxMarks: totalMax,
    difference: diff,
    exactAgreementPct,
    mae,
    overallMarkAgreementPct,
  };
}
