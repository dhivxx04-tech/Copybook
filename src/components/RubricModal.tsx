import React from 'react';
import { QuestionStructure } from '../types/copybook';
import { X, BookOpen, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuestionStructure | null;
}

const RUBRIC_DETAILS: {
  [qNum: number]: {
    chapter: string;
    keyPoints: string[];
    partialCredit: string[];
    commonErrors: string[];
  };
} = {
  1: {
    chapter: 'NCERT Class 8 Chapter 1 — Crop Production and Management',
    keyPoints: [
      'Definition of crop rotation: practice of growing different crops alternately on the same land (1 mark).',
      'Benefit 1: Replenishment of soil nutrients / nitrogen through leguminous plants (1 mark).',
      'Benefit 2: Interruption of insect pest & pathogen life cycles / weed control (1 mark).',
    ],
    partialCredit: [
      '0.5 mark for defining as changing crops without specifying alternate sequence.',
      '1 mark per correctly elaborated benefit.',
    ],
    commonErrors: ['Confusing crop rotation with mixed cropping or intercropping.'],
  },
  2: {
    chapter: 'NCERT Class 8 Chapter 11 — Force and Pressure',
    keyPoints: [
      "Statement: 'To every action, there is an equal and opposite reaction; action and reaction act on two different bodies simultaneously' (2 marks).",
      'Daily life example 1: Walking on floor / pushing back water during swimming (1 mark).',
      'Daily life example 2: Recoil of gun / rocket propulsion / leaping out of a rowboat (1 mark).',
    ],
    partialCredit: [
      '1 mark if action-reaction equality is mentioned but two distinct bodies are not specified.',
      '0.5 mark per valid real-world example.',
    ],
    commonErrors: ['Assuming action and reaction cancel each other out on the same object.'],
  },
  3: {
    chapter: 'NCERT Class 8 Chapter 11 — Force and Pressure',
    keyPoints: [
      'Formula: Pressure (P) = Force (F) / Area (A) (1 mark).',
      'Substitution: P = 40 N / 2 m² (1 mark).',
      'Calculation: P = 20 (1 mark).',
      'SI Units: N/m² or Pascals (Pa) clearly stated (1 mark).',
    ],
    partialCredit: [
      'Deduct 1 mark if final numerical value has missing or incorrect SI unit.',
      'Full credit if 20 N/m² or 20 Pa is correctly derived.',
    ],
    commonErrors: ['Inverting formula as Area / Force or omitting unit.'],
  },
  4: {
    chapter: 'NCERT Class 8 Chapter 8 — Cell — Structure and Functions',
    keyPoints: [
      'Neat outline diagram of plant cell with distinct cell wall & cell membrane (2 marks).',
      'Any 4 correctly labelled organelles: Nucleus, Chloroplast / Plastid, Large Central Vacuole, Cytoplasm / Mitochondria (1 mark each = 4 marks).',
    ],
    partialCredit: [
      '0.5 mark per partly labelled or ambiguously pointed organelle boundary.',
      '1 mark deduction if shape is round/animal cell rather than rigid rectangular.',
    ],
    commonErrors: ['Misidentifying tonoplast as inner plasma membrane.'],
  },
  5: {
    chapter: 'NCERT Class 8 Chapter 4 — Materials: Metals and Non-metals',
    keyPoints: [
      'Property 1 — Malleability: Metals can be beaten into thin sheets; non-metals are brittle (1.25 marks).',
      'Property 2 — Ductility: Metals drawn into wires; non-metals cannot (1.25 marks).',
      'Property 3 — Electrical & Thermal Conductivity: Metals good; non-metals poor (1.25 marks).',
      'Property 4 — Sonority / Lustre: Metals produce ringing sound & shine; non-metals dull (1.25 marks).',
    ],
    partialCredit: ['1.25 marks per valid tabular comparison point.'],
    commonErrors: ['Listing chemical properties like reaction with acids instead of physical.'],
  },
  6: {
    chapter: 'NCERT Class 8 Chapter 9 — Reproduction in Animals',
    keyPoints: [
      'Definition: Fusion of male gamete (sperm) with female gamete (ovum) (2 marks).',
      'Location: Occurs in the oviduct / fallopian tube in humans (1 mark).',
      'Outcome: Formation of a single-celled diploid zygote (1 mark).',
    ],
    partialCredit: [
      '1 mark for generic definition without mentioning human gametes specifically.',
      '1 mark for identifying zygote as the product.',
    ],
    commonErrors: ['Confusing fertilisation with pollination or implantation.'],
  },
  7: {
    chapter: 'NCERT Class 8 Chapter 3 — Synthetic Fibres and Plastics',
    keyPoints: [
      'Naming valid synthetic fibre: Nylon, Rayon, Polyester, or Acrylic (1 mark).',
      'Advantage: High tensile strength, durable, lightweight, dries quickly, moth-resistant (1.5 marks).',
      'Disadvantage: Melts upon heating (sticking to skin / fire hazard) or non-biodegradable pollution (1.5 marks).',
    ],
    partialCredit: ['1 mark each for advantage and disadvantage without specific named fibre.'],
    commonErrors: ['Listing cotton or silk as synthetic.'],
  },
};

export const RubricModal: React.FC<RubricModalProps> = ({
  isOpen,
  onClose,
  question,
}) => {
  if (!isOpen || !question) return null;

  const rubric = RUBRIC_DETAILS[question.qNum] || {
    chapter: 'NCERT Class 8 Science Syllabus',
    keyPoints: ['Standard curriculum rubric criteria applied.'],
    partialCredit: ['Partial marks awarded based on concept completeness.'],
    commonErrors: ['Review standard textbook definitions.'],
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#121826] border border-[#25324c] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f283d] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1b253b] border border-[#2b3b5e] flex items-center justify-center text-blue-300">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  CBSE / NCERT Rubric Specification
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Question {question.qNum} · {question.marks} Marks
                </span>
              </div>
              <p className="text-xs text-slate-400">{rubric.chapter}</p>
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

        {/* Question Text */}
        <div className="p-3.5 bg-[#172033] rounded-xl border border-[#25324c] space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400">
            Official Question Statement:
          </div>
          <p className="text-sm font-semibold text-white">
            {question.question}
          </p>
        </div>

        {/* Required Rubric Key Points */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Core Marking Points (CBSE Guidelines)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {rubric.keyPoints.map((pt, idx) => (
              <li key={idx} className="p-2.5 bg-[#162033] rounded-lg border border-[#222e47] flex items-start gap-2">
                <span className="text-blue-400 font-mono font-bold shrink-0">#{idx + 1}</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Partial Credit Tolerance */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Partial Credit &amp; Tolerance Rules</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {rubric.partialCredit.map((pc, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>{pc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Misconceptions */}
        <div className="p-3 bg-amber-950/30 border border-amber-800/60 rounded-xl space-y-1 text-xs">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Common Student Misconception to Watch For</span>
          </div>
          <p className="text-amber-200/90 leading-relaxed text-[11px]">
            {rubric.commonErrors.join(' ')}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#1f283d] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
