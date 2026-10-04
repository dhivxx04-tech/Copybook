import React, { useState, useEffect } from 'react';
import { CopybookStep, CorrectionMode, StudentData, ReviewChecklistItem } from './types/copybook';
import { INITIAL_STUDENTS, INITIAL_CHECKLIST_ITEMS } from './data/copybookData';
import { CopybookHeader } from './components/CopybookHeader';
import { Step1Upload } from './components/steps/Step1Upload';
import { Step2ReviewRegister } from './components/steps/Step2ReviewRegister';
import { Step3StudentDetail } from './components/steps/Step3StudentDetail';
import { Step4ApproveNotify } from './components/steps/Step4ApproveNotify';
import { RecordsModal } from './components/RecordsModal';
import { AccuracyBenchmarkModal } from './components/AccuracyBenchmarkModal';
import { EvaluationHistoryModal } from './components/EvaluationHistoryModal';
import { fetchEvaluations, submitTeacherValidation } from './services/evaluationApi';
import { StoredEvaluationRecord } from './types/evaluationRecord';

export default function App() {
  const [currentStep, setCurrentStep] = useState<CopybookStep>('upload');
  const [correctionMode, setCorrectionMode] = useState<CorrectionMode>('Medium');
  const [students, setStudents] = useState<StudentData[]>(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('rohan');
  const [checklistItems, setChecklistItems] = useState<ReviewChecklistItem[]>(INITIAL_CHECKLIST_ITEMS);
  const [isRecordsOpen, setIsRecordsOpen] = useState<boolean>(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load persistent real evaluation records from backend on mount
  useEffect(() => {
    async function syncBackendData() {
      try {
        const data = await fetchEvaluations('real');
        if (data.evaluations && data.evaluations.length > 0) {
          const realStudents: StudentData[] = data.evaluations.map((rec) => ({
            id: rec.student.id,
            name: rec.student.name,
            shortName: rec.student.name.split(' ')[0] + ' ' + (rec.student.name.split(' ')[1]?.[0] || '') + '.',
            rollNo: rec.student.rollNo,
            classSection: rec.student.classSection,
            idMatchConfidence: 'High',
            totalMarks: rec.accuracyMetrics.totalTeacherMarks,
            maxMarks: rec.accuracyMetrics.totalMaxMarks,
            status: rec.status === 'Needs Teacher Review' ? 'Needs review' : rec.status === 'Finalized' ? 'Edited' : 'Auto-graded',
            isReal: true,
            dbRecordId: rec.id,
            questions: rec.questions.map((q) => ({
              qNum: q.qNum,
              marksAwarded: q.teacherMark ?? q.aiMark,
              maxMarks: q.maxMarks,
              studentAnswer: q.studentAnswer,
              feedback: q.aiFeedback,
              aiMark: q.aiMark,
              aiConfidence: q.aiConfidence,
              confidenceLevel: q.confidenceLevel,
              needsTeacherReview: q.needsTeacherReview,
              aiFeedback: q.aiFeedback,
              correctConcepts: q.correctConcepts,
              missingConcepts: q.missingConcepts,
              incorrectConcepts: q.incorrectConcepts,
              teacherMark: q.teacherMark,
              teacherFeedback: q.teacherFeedback,
              teacherValidated: q.teacherValidated,
              isFlagged: q.needsTeacherReview,
              flagReason: q.needsTeacherReview ? 'Low AI confidence score requires teacher review.' : undefined,
            })),
            correctionLog: [`Loaded from persistent backend database (${rec.answerSheet.fileName})`],
          }));

          setStudents((prev) => {
            const existingIds = new Set(prev.map((s) => s.id));
            const fresh = realStudents.filter((rs) => !existingIds.has(rs.id));
            return [...fresh, ...prev];
          });
        }
      } catch (err) {
        console.warn('Initial backend sync notice:', err);
      }
    }

    syncBackendData();
  }, []);

  // Handler when a real answer sheet is uploaded & evaluated via Step 1
  const handleRealEvaluationComplete = (rec: StoredEvaluationRecord) => {
    const newStudent: StudentData = {
      id: rec.student.id,
      name: rec.student.name,
      shortName: rec.student.name.split(' ')[0] + ' ' + (rec.student.name.split(' ')[1]?.[0] || '') + '.',
      rollNo: rec.student.rollNo,
      classSection: rec.student.classSection,
      idMatchConfidence: 'High',
      totalMarks: rec.accuracyMetrics.totalTeacherMarks,
      maxMarks: rec.accuracyMetrics.totalMaxMarks,
      status: rec.status === 'Needs Teacher Review' ? 'Needs review' : 'Auto-graded',
      isReal: true,
      dbRecordId: rec.id,
      questions: rec.questions.map((q) => ({
        qNum: q.qNum,
        marksAwarded: q.teacherMark ?? q.aiMark,
        maxMarks: q.maxMarks,
        studentAnswer: q.studentAnswer,
        feedback: q.aiFeedback,
        aiMark: q.aiMark,
        aiConfidence: q.aiConfidence,
        confidenceLevel: q.confidenceLevel,
        needsTeacherReview: q.needsTeacherReview,
        aiFeedback: q.aiFeedback,
        correctConcepts: q.correctConcepts,
        missingConcepts: q.missingConcepts,
        incorrectConcepts: q.incorrectConcepts,
        teacherMark: q.teacherMark,
        teacherFeedback: q.teacherFeedback,
        teacherValidated: q.teacherValidated,
        isFlagged: q.needsTeacherReview,
        flagReason: q.needsTeacherReview ? 'Low AI confidence detected on real handwriting.' : undefined,
      })),
      correctionLog: [`Real answer sheet evaluated at ${new Date().toLocaleTimeString()} · Persisted to database`],
    };

    setStudents((prev) => [newStudent, ...prev.filter((s) => s.id !== newStudent.id)]);
    setSelectedStudentId(newStudent.id);
    setCurrentStep('student-detail');
  };

  // Quick helper to resolve Rohan Gupta's smudged candidate match
  const handleAssignCandidate = (studentId: string, candidateName: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updatedCandidates = s.candidateMatches?.map((c) => ({
            ...c,
            selected: c.name === candidateName,
          }));
          return {
            ...s,
            idMatchConfidence: 'High',
            totalMarks: 25,
            status: 'Auto-graded',
            idMatchNote: undefined,
            candidateMatches: updatedCandidates,
            resolved: true,
          };
        }
        return s;
      })
    );

    // Also mark checklist item for Rohan as resolved
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, resolved: true } : item
      )
    );
  };

  // Resolve Rohan's identity directly from student detail
  const handleResolveStudentIdentity = (studentId: string) => {
    handleAssignCandidate(studentId, 'Rohan Gupta');
  };

  // Update mark and teacher feedback for any student question & sync with backend database
  const handleUpdateStudentMarks = (
    studentId: string, 
    qNum: number, 
    newMarks: number,
    teacherFeedbackText?: string
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updatedQuestions = s.questions?.map((q) => {
            if (q.qNum === qNum) {
              return { 
                ...q, 
                marksAwarded: newMarks, 
                teacherMark: newMarks,
                teacherFeedback: teacherFeedbackText || q.teacherFeedback,
                teacherValidated: true,
                isFlagged: false 
              };
            }
            return q;
          });

          const newTotal = updatedQuestions?.reduce((acc, q) => acc + q.marksAwarded, 0) || s.totalMarks;
          const logEntry = `Teacher adjusted Q#${qNum}: updated to ${newMarks} marks.`;

          // If backed by database record, sync in background
          if (s.dbRecordId) {
            submitTeacherValidation(s.dbRecordId, [{
              qNum,
              teacherMark: newMarks,
              teacherFeedback: teacherFeedbackText || 'Teacher ground truth validated.',
              teacherValidated: true,
            }]).catch((err) => console.warn('Database background update error:', err));
          }

          return {
            ...s,
            questions: updatedQuestions,
            totalMarks: newTotal,
            status: 'Edited',
            correctionLog: [...(s.correctionLog || []), logEntry],
          };
        }
        return s;
      })
    );
  };

  // Save full teacher validation to persistent backend database
  const handleSaveTeacherValidation = async (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student || !student.dbRecordId || !student.questions) return;

    try {
      const payload = student.questions.map((q) => ({
        qNum: q.qNum,
        teacherMark: q.teacherMark ?? q.marksAwarded,
        teacherFeedback: q.teacherFeedback || 'Verified by teacher.',
        teacherValidated: true,
      }));

      await submitTeacherValidation(student.dbRecordId, payload);
    } catch (err) {
      console.error('Failed to save teacher validation to DB:', err);
    }
  };

  // Resolve flag on specific question
  const handleResolveFlag = (studentId: string, qNum: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updatedQuestions = s.questions?.map((q) => {
            if (q.qNum === qNum) {
              return { ...q, isFlagged: false };
            }
            return q;
          });

          const newPending = (s.pendingMarks || 0) > 0 ? (s.pendingMarks || 0) - 1 : 0;
          const newTotal = (s.totalMarks || 0) + (s.pendingMarks || 0);

          return {
            ...s,
            questions: updatedQuestions,
            pendingMarks: undefined,
            totalMarks: newTotal,
            status: 'Edited',
            correctionLog: [...(s.correctionLog || []), `Q#${qNum} flagged issue resolved and verified by teacher.`],
          };
        }
        return s;
      })
    );

    // Resolve corresponding checklist item
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, resolved: true } : item
      )
    );
  };

  // Resolve checklist item from Step 4
  const handleResolveChecklistItem = (itemId: string) => {
    const item = checklistItems.find((i) => i.id === itemId);
    if (!item) return;

    if (item.studentId === 'rohan') {
      handleAssignCandidate('rohan', 'Rohan Gupta');
    } else if (item.studentId === 'ishaan') {
      handleResolveFlag('ishaan', 4);
    } else if (item.studentId === 'vihaan') {
      handleResolveFlag('vihaan', 5);
      handleResolveFlag('vihaan', 6);
    }

    setChecklistItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, resolved: true } : i))
    );
  };

  // Select evaluation from history modal
  const handleSelectEvaluationFromHistory = (rec: StoredEvaluationRecord) => {
    // Check if student exists in state
    let targetStudent = students.find((s) => s.dbRecordId === rec.id || s.id === rec.student.id);

    if (!targetStudent) {
      targetStudent = {
        id: rec.student.id,
        name: rec.student.name,
        shortName: rec.student.name.split(' ')[0] + ' ' + (rec.student.name.split(' ')[1]?.[0] || '') + '.',
        rollNo: rec.student.rollNo,
        classSection: rec.student.classSection,
        idMatchConfidence: 'High',
        totalMarks: rec.accuracyMetrics.totalTeacherMarks,
        maxMarks: rec.accuracyMetrics.totalMaxMarks,
        status: rec.status === 'Needs Teacher Review' ? 'Needs review' : rec.status === 'Finalized' ? 'Edited' : 'Auto-graded',
        isReal: !rec.isDemo,
        dbRecordId: rec.id,
        questions: rec.questions.map((q) => ({
          qNum: q.qNum,
          marksAwarded: q.teacherMark ?? q.aiMark,
          maxMarks: q.maxMarks,
          studentAnswer: q.studentAnswer,
          feedback: q.aiFeedback,
          aiMark: q.aiMark,
          aiConfidence: q.aiConfidence,
          confidenceLevel: q.confidenceLevel,
          needsTeacherReview: q.needsTeacherReview,
          aiFeedback: q.aiFeedback,
          correctConcepts: q.correctConcepts,
          missingConcepts: q.missingConcepts,
          incorrectConcepts: q.incorrectConcepts,
          teacherMark: q.teacherMark,
          teacherFeedback: q.teacherFeedback,
          teacherValidated: q.teacherValidated,
          isFlagged: q.needsTeacherReview,
        })),
      };

      setStudents((prev) => [targetStudent!, ...prev]);
    }

    setSelectedStudentId(targetStudent.id);
    setCurrentStep('student-detail');
  };

  const needsReviewCount = students.filter((s) => s.status === 'Needs review').length;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30">
      {/* Copybook Top App Bar with Brand, 4-Step Stepper, History and Records button */}
      <CopybookHeader
        currentStep={currentStep}
        onNavigate={(step) => setCurrentStep(step)}
        onOpenRecords={() => setIsRecordsOpen(true)}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        needsReviewCount={needsReviewCount}
      />

      {/* Main Screen Content */}
      <main className="flex-1 pb-16">
        {currentStep === 'upload' && (
          <Step1Upload
            onStartGrading={() => setCurrentStep('register')}
            correctionMode={correctionMode}
            onSetCorrectionMode={setCorrectionMode}
            onRealEvaluationComplete={handleRealEvaluationComplete}
          />
        )}

        {currentStep === 'register' && (
          <Step2ReviewRegister
            students={students}
            onSelectStudent={(studentId) => {
              setSelectedStudentId(studentId);
              setCurrentStep('student-detail');
            }}
            onContinueToApproval={() => setCurrentStep('approve')}
            onAssignCandidate={handleAssignCandidate}
            correctionMode={correctionMode}
          />
        )}

        {currentStep === 'student-detail' && (
          <Step3StudentDetail
            students={students}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
            onBackToRegister={() => setCurrentStep('register')}
            onUpdateStudentMarks={handleUpdateStudentMarks}
            onResolveStudentIdentity={handleResolveStudentIdentity}
            onResolveFlag={handleResolveFlag}
            onSaveTeacherValidation={handleSaveTeacherValidation}
          />
        )}

        {currentStep === 'approve' && (
          <Step4ApproveNotify
            checklistItems={checklistItems}
            students={students}
            onResolveItem={handleResolveChecklistItem}
            onGoToStudent={(studentId) => {
              setSelectedStudentId(studentId);
              setCurrentStep('student-detail');
            }}
            onGoToRegister={() => setCurrentStep('register')}
          />
        )}
      </main>

      {/* Records Modal */}
      <RecordsModal
        isOpen={isRecordsOpen}
        onClose={() => setIsRecordsOpen(false)}
        onSelectCurrent={() => setCurrentStep('register')}
      />

      {/* Accuracy & Ground Truth Benchmark Modal */}
      <AccuracyBenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />

      {/* Persistent Answer-Sheet Evaluation History Modal (Requirements 7, 8, 9) */}
      <EvaluationHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectEvaluation={handleSelectEvaluationFromHistory}
      />
    </div>
  );
}

