import { SyllabusData, AnswerSheetData } from '../types/evaluation';

export const DEMO_SYLLABUS: SyllabusData = {
  subject: 'Biology',
  topic: 'Photosynthesis & Plant Physiology',
  fileName: 'Biology_Curriculum_Units_III_IV.pdf',
  fileSize: '1.4 MB',
  uploadedAt: 'Today, 09:15 AM',
  units: [
    'Cell Structure',
    'Photosynthesis',
    'Respiration',
    'Plant Nutrition',
  ],
  importantConcepts: [
    'Chlorophyll',
    'Sunlight',
    'Carbon dioxide',
    'Glucose formation',
    'Cellular respiration',
  ],
  contextReady: true,
};

export const DEMO_ANSWER_SHEET: AnswerSheetData = {
  studentName: 'Demo Student',
  subject: 'Biology',
  fileName: 'Student_AnswerSheet_Roll_104.pdf',
  fileSize: '2.1 MB',
  uploadedAt: 'Today, 09:22 AM',
  questions: [
    {
      id: 'q1',
      questionNumber: 1,
      questionText: 'Explain the light-dependent stage of photosynthesis and the role of chlorophyll in glucose synthesis.',
      maxMarks: 5,
      aiMark: 4,
      teacherMark: 4,
      studentAnswer:
        'Photosynthesis is the process in which green plants produce their own food. In this process, plants absorb sunlight through chlorophyll pigments situated inside the chloroplasts. The light energy drives the reaction that eventually synthesizes glucose molecules for the plant.',
      correctConcepts: [
        'Photosynthesis requires sunlight',
        'Chlorophyll is involved',
        'Plants produce glucose',
      ],
      missingConcepts: [
        'Role of carbon dioxide was not explained.',
      ],
      incorrectConcepts: [],
      aiFeedback:
        'Good understanding of the main concept. One important concept is missing.',
      partialUnderstandingNotes:
        'Demonstrates clear grasp of sunlight capture by chlorophyll, but omits the biochemical coupling with CO2 fixation.',
    },
    {
      id: 'q2',
      questionNumber: 2,
      questionText: 'Describe how carbon dioxide enters the leaf and is utilized in the chemical formation of carbohydrates.',
      maxMarks: 5,
      aiMark: 3,
      teacherMark: 3,
      studentAnswer:
        'Carbon dioxide enters through stomata on leaves. Once inside, it combines with chemical agents in the cell to make sugar molecules. This happens during day time.',
      correctConcepts: [
        'Basic concept identified',
      ],
      missingConcepts: [
        'Complete process was not explained.',
      ],
      incorrectConcepts: [],
      aiFeedback:
        'The answer shows partial understanding but requires a more complete explanation.',
      partialUnderstandingNotes:
        'Stomatal entry is acknowledged, but enzyme involvement and the sequential dark reaction pathway are omitted.',
    },
    {
      id: 'q3',
      questionNumber: 3,
      questionText: 'Distinguish between the energetic processes of photosynthesis and cellular respiration in green plants.',
      maxMarks: 5,
      aiMark: 5,
      teacherMark: 5,
      studentAnswer:
        'Photosynthesis is an anabolic process that captures light energy using chlorophyll and carbon dioxide to synthesize glucose and release oxygen. In contrast, cellular respiration is a catabolic process occurring in the mitochondria where glucose is broken down in the presence of oxygen to release ATP energy, water, and carbon dioxide.',
      correctConcepts: [
        'All important concepts identified',
        'Explanation is complete',
      ],
      missingConcepts: [],
      incorrectConcepts: [],
      aiFeedback:
        'The answer correctly explains the required concepts.',
      partialUnderstandingNotes:
        'Comprehensive comparative explanation aligning directly with syllabus definitions.',
    },
  ],
};

export const EVALUATION_CRITERIA_GUIDELINES = [
  {
    criterion: 'Correctness',
    description: 'Is the answer factually correct according to scientific principles?',
  },
  {
    criterion: 'Conceptual Understanding',
    description: 'Does the answer demonstrate understanding of the required concept beyond rote recall?',
  },
  {
    criterion: 'Completeness',
    description: 'Are the essential parts and mechanisms of the answer covered?',
  },
  {
    criterion: 'Relevance',
    description: 'Is the answer relevant to the specific question and prescribed syllabus?',
  },
  {
    criterion: 'Partial Understanding',
    description: 'Does the answer demonstrate partial knowledge even if intermediate steps are omitted?',
  },
  {
    criterion: 'Incorrect Concepts',
    description: 'Does the answer contain misconceptions, misleading terms, or erroneous causal claims?',
  },
];
