export interface SyllabusData {
  subject: string;
  topic: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  units: string[];
  importantConcepts: string[];
  contextReady: boolean;
}

export interface QuestionEvaluation {
  id: string;
  questionNumber: number;
  questionText: string;
  maxMarks: number;
  aiMark: number;
  teacherMark: number; // Ground truth reference
  studentAnswer: string;
  correctConcepts: string[];
  missingConcepts: string[];
  incorrectConcepts?: string[];
  aiFeedback: string;
  partialUnderstandingNotes?: string;
}

export interface AnswerSheetData {
  studentName: string;
  subject: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  questions: QuestionEvaluation[];
}

export interface AccuracyMetrics {
  markAgreement: number; // percentage (e.g. 93.3%)
  mae: number; // Mean Absolute Error: Sum |Teacher - AI| / N
  exactAgreement: number; // percentage of exact matches
  conceptIdentificationAccuracy: number; // percentage (e.g. 92.5%)
  feedbackRelevance: number; // teacher rating out of 5 (e.g. 4.5)
  totalAiMarks: number;
  totalTeacherMarks: number;
  totalMaxMarks: number;
}

export type WorkflowStep = 
  | 'home'
  | 'syllabus'
  | 'syllabus-understanding'
  | 'answer-sheet'
  | 'ai-evaluation'
  | 'teacher-reference'
  | 'accuracy-analysis'
  | 'summary';

/**
 * Calculates academic accuracy metrics comparing AI marks (prediction)
 * against Teacher marks (ground truth reference).
 */
export function calculateAccuracy(
  questions: QuestionEvaluation[],
  feedbackRelevance: number = 4.5,
  conceptAccuracy: number = 92.5
): AccuracyMetrics {
  if (!questions || questions.length === 0) {
    return {
      markAgreement: 0,
      mae: 0,
      exactAgreement: 0,
      conceptIdentificationAccuracy: conceptAccuracy,
      feedbackRelevance,
      totalAiMarks: 0,
      totalTeacherMarks: 0,
      totalMaxMarks: 0,
    };
  }

  let totalDiff = 0;
  let exactMatches = 0;
  let totalAi = 0;
  let totalTeacher = 0;
  let totalMax = 0;
  let agreementSum = 0;

  questions.forEach((q) => {
    const ai = Number(q.aiMark) || 0;
    const teacher = Number(q.teacherMark) || 0;
    const max = Number(q.maxMarks) || 5;

    totalAi += ai;
    totalTeacher += teacher;
    totalMax += max;

    const diff = Math.abs(teacher - ai);
    totalDiff += diff;

    if (diff === 0) {
      exactMatches += 1;
    }

    // Agreement per question normalized by maxMarks: 1 - (|diff| / maxMarks)
    const normalizedAgreement = Math.max(0, 1 - diff / max);
    agreementSum += normalizedAgreement;
  });

  const count = questions.length;
  const mae = Number((totalDiff / count).toFixed(2));
  const exactAgreement = Number(((exactMatches / count) * 100).toFixed(1));
  const markAgreement = Number(((agreementSum / count) * 100).toFixed(1));

  return {
    markAgreement,
    mae,
    exactAgreement,
    conceptIdentificationAccuracy: conceptAccuracy,
    feedbackRelevance: Number(feedbackRelevance.toFixed(1)),
    totalAiMarks: Number(totalAi.toFixed(1)),
    totalTeacherMarks: Number(totalTeacher.toFixed(1)),
    totalMaxMarks: totalMax,
  };
}
