import React from 'react';
import { WorkflowStep } from '../types/evaluation';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: WorkflowStep;
  onStepClick: (step: WorkflowStep) => void;
  completedSteps: Set<WorkflowStep>;
}

interface StepItem {
  id: WorkflowStep;
  number: string;
  label: string;
  sublabel: string;
}

const STEPS: StepItem[] = [
  {
    id: 'syllabus',
    number: '01',
    label: 'Syllabus',
    sublabel: 'Upload syllabus',
  },
  {
    id: 'syllabus-understanding',
    number: '02',
    label: 'Understanding',
    sublabel: 'Topics & concepts',
  },
  {
    id: 'answer-sheet',
    number: '03',
    label: 'Answer Sheet',
    sublabel: 'Student submission',
  },
  {
    id: 'ai-evaluation',
    number: '04',
    label: 'AI Evaluation',
    sublabel: 'Syllabus context',
  },
  {
    id: 'teacher-reference',
    number: '05',
    label: 'Teacher Ref',
    sublabel: 'Ground truth',
  },
  {
    id: 'accuracy-analysis',
    number: '06',
    label: 'Accuracy',
    sublabel: 'MAE & agreement',
  },
  {
    id: 'summary',
    number: '07',
    label: 'Result',
    sublabel: 'Evaluation summary',
  },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  if (currentStep === 'home') {
    return null;
  }

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between overflow-x-auto pb-1 scrollbar-thin">
          {STEPS.map((step, idx) => {
            const isCurrent = step.id === currentStep;
            const isCompleted = completedSteps.has(step.id);
            const isPast = idx < currentIndex;
            const isClickable = isCompleted || isPast || isCurrent;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <div
                    className={`h-[1px] flex-1 min-w-[14px] mx-1.5 transition-colors ${
                      isPast ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => onStepClick(step.id)}
                  className={`flex items-center gap-2 group text-left transition-all ${
                    !isClickable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 font-bold'
                        : isCompleted || isPast
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-semibold whitespace-nowrap transition-colors ${
                        isCurrent
                          ? 'text-indigo-900 font-bold'
                          : isCompleted || isPast
                          ? 'text-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[10px] text-slate-400 whitespace-nowrap hidden lg:block">
                      {step.sublabel}
                    </div>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
