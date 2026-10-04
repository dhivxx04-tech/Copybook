import { StoredEvaluationRecord, EvaluatedQuestion } from '../types/evaluationRecord';

export interface UploadEvaluationPayload {
  studentName: string;
  rollNo: number;
  classSection?: string;
  subject?: string;
  examTitle?: string;
  syllabusTopic?: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileBase64?: string;
  customQuestions?: any[];
}

export async function fetchEvaluations(filter: 'all' | 'real' | 'demo' = 'all'): Promise<{
  evaluations: StoredEvaluationRecord[];
  total: number;
  realCount: number;
  demoCount: number;
}> {
  try {
    const res = await fetch(`/api/evaluations?filter=${filter}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch evaluations: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('fetchEvaluations error:', err);
    return { evaluations: [], total: 0, realCount: 0, demoCount: 0 };
  }
}

export async function fetchEvaluationById(id: string): Promise<StoredEvaluationRecord | null> {
  try {
    const res = await fetch(`/api/evaluations/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.evaluation;
  } catch (err) {
    console.error(`fetchEvaluationById error for ${id}:`, err);
    return null;
  }
}

export async function uploadAndEvaluateAnswerSheet(
  payload: UploadEvaluationPayload
): Promise<StoredEvaluationRecord> {
  const res = await fetch('/api/evaluations/upload-and-evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload and evaluate answer sheet.');
  }

  const data = await res.json();
  return data.evaluation;
}

export async function submitTeacherValidation(
  id: string,
  questions: Array<{
    qNum: number;
    teacherMark: number;
    teacherFeedback: string;
    teacherValidated: boolean;
  }>
): Promise<StoredEvaluationRecord> {
  const res = await fetch(`/api/evaluations/${id}/teacher-validation`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update teacher validation.');
  }

  const data = await res.json();
  return data.evaluation;
}

export async function deleteEvaluation(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/evaluations/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.error(`deleteEvaluation error for ${id}:`, err);
    return false;
  }
}
