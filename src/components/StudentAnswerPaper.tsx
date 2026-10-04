import React, { useState } from 'react';
import { StudentScoreItem } from '../types/copybook';
import { Eye, FileText, CheckCircle, ZoomIn, Check, AlertCircle } from 'lucide-react';

interface StudentAnswerPaperProps {
  question: StudentScoreItem;
  studentName: string;
  studentRoll: number;
  onOpenScan?: (qNum: number) => void;
}

export const StudentAnswerPaper: React.FC<StudentAnswerPaperProps> = ({
  question,
  studentName,
  studentRoll,
  onOpenScan,
}) => {
  const [viewMode, setViewMode] = useState<'paper' | 'transcription'>('paper');
  const [showRedPen, setShowRedPen] = useState<boolean>(true);

  const qNum = question.qNum;
  const marks = question.marksAwarded;
  const maxMarks = question.maxMarks;

  // Render authentic handwritten student paper answers based on Question # and Student
  const renderHandwrittenPaper = () => {
    switch (qNum) {
      case 1:
        return (
          <div className="space-y-3 font-handwriting text-xl text-[#102a5c] tracking-wide leading-8 select-text">
            <div className="flex items-baseline justify-between">
              <span className="font-bold underline decoration-slate-400">
                Ans 1. Crop Rotation &amp; its Benefits:
              </span>
              {showRedPen && (
                <span className="font-sans text-xs font-bold text-red-600 bg-red-100/80 px-2 py-0.5 rounded border border-red-300 transform rotate-1">
                  ✓ Core definition verified
                </span>
              )}
            </div>

            <p className="indent-4">
              Crop rotation is the agricultural practice of growing different kinds of crops alternately in sequential seasons on the same agricultural piece of land.
              {showRedPen && (
                <span className="inline-block ml-2 text-red-600 font-bold text-lg select-none">
                  ✓
                </span>
              )}
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="font-semibold text-slate-800">
                Two main benefits of practising crop rotation are:
              </div>
              <div className="pl-4 space-y-1">
                <div className="relative">
                  <span>
                    1. <strong className="font-bold text-[#0c234a]">Preserves Soil Nutrients:</strong> It prevents exhaustion of specific minerals because different crops have varying nutrient demands. For example, growing legumes restores soil nitrogen naturally.
                  </span>
                  {showRedPen && (
                    <span className="inline-block ml-2 text-red-600 font-bold text-lg select-none">
                      ✓ (1.5 marks)
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span>
                    2. <strong className="font-bold text-[#0c234a]">Pest &amp; Weed Control:</strong> It interrupts the reproductive life-cycle of crop-specific pests, insects, and weed infestations without heavy chemical sprays.
                  </span>
                  {showRedPen && (
                    <span className="inline-block ml-2 text-red-600 font-bold text-lg select-none">
                      ✓ (1.5 marks)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3 font-handwriting text-xl text-[#102a5c] tracking-wide leading-8 select-text">
            <div className="flex items-baseline justify-between">
              <span className="font-bold underline decoration-slate-400">
                Ans 2. Newton's Third Law of Motion:
              </span>
              {showRedPen && (
                <span className="font-sans text-xs font-bold text-red-600 bg-red-100/80 px-2 py-0.5 rounded border border-red-300">
                  ✓ Statement &amp; 2 Examples
                </span>
              )}
            </div>

            <p className="indent-4 italic text-[#0f234a]">
              &ldquo;To every action, there is always an equal and opposite reaction. The action and reaction forces act simultaneously on two mutually interacting bodies.&rdquo;
              {showRedPen && <span className="text-red-600 font-bold text-lg ml-2">✓</span>}
            </p>

            <div className="pt-1 space-y-1.5">
              <span className="font-semibold">Everyday Illustrations:</span>
              <ul className="list-decimal list-inside pl-2 space-y-1 text-lg">
                <li>
                  <strong className="text-[#0c234a]">Walking on ground:</strong> When walking, our foot exerts a backward force on the ground (Action). The ground pushes our foot forward with equal force (Reaction).
                  {showRedPen && <span className="text-red-600 font-bold ml-1.5">✓</span>}
                </li>
                <li>
                  <strong className="text-[#0c234a]">Recoil of gun / rowing a boat:</strong> When a bullet is fired, powder gases push bullet forward, and backward kick is felt on the gun.
                  {showRedPen && <span className="text-red-600 font-bold ml-1.5">✓</span>}
                </li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3 font-handwriting text-xl text-[#102a5c] tracking-wide leading-8 select-text">
            <div className="flex items-baseline justify-between">
              <span className="font-bold underline decoration-slate-400">
                Ans 3. Calculation of Pressure:
              </span>
              {showRedPen && (
                <span className="font-sans text-xs font-bold text-red-600 bg-red-100/80 px-2 py-0.5 rounded border border-red-300">
                  ✓ Stepwise numerical solution
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1 bg-white/70 p-3 rounded border border-slate-300/80 shadow-xs">
                <div className="text-sm font-sans font-bold text-slate-700 uppercase tracking-wider">
                  Given Parameters:
                </div>
                <div>Force applied (<span className="italic">F</span>) = <strong className="text-[#091b3a]">300 N</strong></div>
                <div>Contact Surface Area (<span className="italic">A</span>) = <strong className="text-[#091b3a]">0.05 m²</strong></div>
                <div>Pressure exerted (<span className="italic">P</span>) = ?</div>
              </div>

              <div className="space-y-1 bg-white/70 p-3 rounded border border-slate-300/80 shadow-xs">
                <div className="text-sm font-sans font-bold text-slate-700 uppercase tracking-wider">
                  Formula:
                </div>
                <div className="text-2xl font-bold text-[#0c234a]">
                  Pressure = Force / Area
                </div>
                <div className="text-sm text-slate-600">
                  SI unit: Newton/m² or Pascal (Pa)
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">P = 300 / 0.05</span>
                <span className="text-slate-400 font-sans">➔</span>
                <span className="text-2xl font-bold">P = 300 × 100 / 5 = 6000 N/m²</span>
                {showRedPen && <span className="text-red-600 font-bold text-xl">✓</span>}
              </div>

              <div className="inline-block p-2.5 bg-yellow-50/90 border-2 border-[#102a5c] rounded text-2xl font-bold text-[#0b1c3d]">
                Ans: Pressure = 6,000 Pa (or 6,000 N/m²)
                {showRedPen && (
                  <span className="ml-3 text-red-600 font-bold text-xl font-sans inline-flex items-center gap-1">
                    ✓ Full Credit (4/4)
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-3 font-handwriting text-xl text-[#102a5c] tracking-wide leading-7 select-text">
            <div className="flex items-baseline justify-between">
              <span className="font-bold underline decoration-slate-400">
                Ans 4. Schematic Diagram of a Typical Plant Cell:
              </span>
              {showRedPen && (
                <span className="font-sans text-xs font-bold text-red-600 bg-red-100/80 px-2 py-0.5 rounded border border-red-300">
                  ✓ Diagram &amp; 4 Organelle Labels
                </span>
              )}
            </div>

            {/* Simulated Hand-Drawn Plant Cell SVG */}
            <div className="relative bg-white/80 border-2 border-slate-400/80 rounded-xl p-4 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full max-w-sm flex items-center justify-center">
                <svg
                  viewBox="0 0 320 220"
                  className="w-full max-h-56 stroke-[#1a365d] fill-none"
                  style={{ strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}
                >
                  {/* Outer Cell Wall (Hexagonal / Rectangular) */}
                  <polygon
                    points="30,40 290,35 305,185 45,195"
                    stroke="#1e3a8a"
                    strokeWidth="3.5"
                    fill="#f0fdf4"
                  />
                  {/* Inner Cell Membrane */}
                  <polygon
                    points="38,48 282,43 296,177 52,187"
                    stroke="#0284c7"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                  />
                  {/* Large Central Vacuole */}
                  <ellipse
                    cx="150"
                    cy="115"
                    rx="65"
                    ry="45"
                    stroke="#0284c7"
                    strokeWidth="2"
                    fill="#e0f2fe"
                    fillOpacity="0.5"
                  />
                  {/* Nucleus */}
                  <circle cx="245" cy="85" r="22" stroke="#4338ca" strokeWidth="2.5" fill="#e0e7ff" />
                  <circle cx="248" cy="87" r="7" fill="#312e81" />
                  {/* Chloroplasts */}
                  <ellipse cx="80" cy="80" rx="14" ry="9" stroke="#15803d" strokeWidth="2" fill="#dcfce7" />
                  <ellipse cx="95" cy="150" rx="15" ry="10" stroke="#15803d" strokeWidth="2" fill="#dcfce7" />
                  <ellipse cx="225" cy="155" rx="13" ry="8" stroke="#15803d" strokeWidth="2" fill="#dcfce7" />

                  {/* Hand-drawn label pointers */}
                  <line x1="30" y1="40" x2="10" y2="25" stroke="#475569" strokeWidth="1.2" />
                  <line x1="245" y1="65" x2="255" y2="25" stroke="#475569" strokeWidth="1.2" />
                  <line x1="150" y1="70" x2="140" y2="25" stroke="#475569" strokeWidth="1.2" />
                  <line x1="80" y1="75" x2="45" y2="105" stroke="#475569" strokeWidth="1.2" />
                </svg>
              </div>

              {/* Hand-written Labels and Teacher Verification */}
              <div className="flex-1 space-y-2 text-base font-handwriting">
                <div className="p-2.5 bg-slate-50 border border-slate-300 rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0c234a]">1. Cell Wall (Rigid outer boundary)</span>
                    {showRedPen && <span className="text-red-600 font-bold font-sans text-xs">✓ Checked</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0c234a]">2. Large Central Vacuole (Tonoplast)</span>
                    {showRedPen && <span className="text-red-600 font-bold font-sans text-xs">✓ Checked</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0c234a]">3. Nucleus (with Nucleolus)</span>
                    {showRedPen && <span className="text-red-600 font-bold font-sans text-xs">✓ Checked</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0c234a]">4. Chloroplast (Site of Photosynthesis)</span>
                    {showRedPen && <span className="text-red-600 font-bold font-sans text-xs">✓ Checked</span>}
                  </div>
                </div>

                {showRedPen && (
                  <div className="text-xs font-sans text-red-700 bg-red-50 p-2 rounded border border-red-200 leading-tight">
                    <strong>Teacher Remark:</strong> Organelle boundaries clean and proportional. Diagram awarded <strong>{marks}/{maxMarks} Marks</strong>.
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-3 font-handwriting text-xl text-[#102a5c] tracking-wide leading-7 select-text">
            <div className="flex items-baseline justify-between">
              <span className="font-bold underline decoration-slate-400">
                Ans 5. Differences between Metals and Non-Metals:
              </span>
              {showRedPen && (
                <span className="font-sans text-xs font-bold text-red-600 bg-red-100/80 px-2 py-0.5 rounded border border-red-300">
                  ✓ Tabular distinction
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-lg font-handwriting border-2 border-slate-400 bg-white/80">
                <thead>
                  <tr className="border-b-2 border-slate-400 bg-slate-100/80 font-bold text-[#091e42]">
                    <th className="p-2 border-r-2 border-slate-400 w-32">Property</th>
                    <th className="p-2 border-r-2 border-slate-400">Metals</th>
                    <th className="p-2">Non-Metals</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-slate-300">
                  <tr>
                    <td className="p-2 font-bold border-r-2 border-slate-400">1. Malleability</td>
                    <td className="p-2 border-r-2 border-slate-400">
                      Can be beaten into thin sheets (e.g., Al foil)
                      {showRedPen && <span className="text-red-600 font-bold ml-1">✓</span>}
                    </td>
                    <td className="p-2">
                      Brittle, break upon hammering (e.g., Coal)
                      {showRedPen && <span className="text-red-600 font-bold ml-1">✓</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border-r-2 border-slate-400">2. Ductility</td>
                    <td className="p-2 border-r-2 border-slate-400">
                      Can be drawn into wires (e.g., Copper)
                      {showRedPen && <span className="text-red-600 font-bold ml-1">✓</span>}
                    </td>
                    <td className="p-2">
                      Non-ductile, snap immediately
                      {showRedPen && <span className="text-red-600 font-bold ml-1">✓</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border-r-2 border-slate-400">3. Conductivity</td>
                    <td className="p-2 border-r-2 border-slate-400">
                      Good conductors of heat &amp; electricity
                      {showRedPen && <span className="text-red-600 font-bold ml-1">✓</span>}
                    </td>
                    <td className="p-2">
                      Poor/bad conductors (except Graphite)
                      {showRedPen && <span className="text-red-600 font-bold ml-1">✓</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-3 font-handwriting text-xl text-[#102a5c] tracking-wide leading-8 select-text">
            <div className="flex items-baseline justify-between">
              <span className="font-bold underline decoration-slate-400">
                Ans 6. Process of Fertilisation in Human Beings:
              </span>
              {showRedPen && (
                <span className="font-sans text-xs font-bold text-red-600 bg-red-100/80 px-2 py-0.5 rounded border border-red-300">
                  ✓ Concept verified
                </span>
              )}
            </div>

            <p className="indent-4">
              Fertilisation in humans is internal. During reproduction, millions of sperms travel through the female reproductive tract towards the fallopian tube (oviduct).
              {showRedPen && <span className="text-red-600 font-bold ml-1.5">✓</span>}
            </p>
            <p className="indent-4">
              A single viable sperm penetrates and fuses its nucleus with the ovum nucleus. This fusion creates a single diploid cell called a <strong>Zygote</strong>, which then divides to form an embryo.
              {showRedPen && <span className="text-red-600 font-bold ml-1.5">✓ Full Marks</span>}
            </p>
          </div>
        );

      case 7:
        return (
          <div className="space-y-3 font-handwriting text-xl text-[#102a5c] tracking-wide leading-8 select-text">
            <div className="flex items-baseline justify-between">
              <span className="font-bold underline decoration-slate-400">
                Ans 7. Advantage &amp; Disadvantage of Synthetic Fibres (Nylon):
              </span>
              {showRedPen && (
                <span className="font-sans text-xs font-bold text-red-600 bg-red-100/80 px-2 py-0.5 rounded border border-red-300">
                  ✓ Example: Nylon
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <strong className="text-[#0c234a]">Advantage:</strong> Nylon fibre possesses extremely high tensile strength and elasticity. It is lightweight, resists wrinkles, and is easy to wash and quick to dry (used in parachutes &amp; ropes).
                {showRedPen && <span className="text-red-600 font-bold ml-1.5">✓ (2 Marks)</span>}
              </div>
              <div>
                <strong className="text-[#0c234a]">Disadvantage:</strong> Synthetic fibres melt upon catching fire, and the molten fabric sticks to the wearer&apos;s body causing severe burn injuries. Furthermore, they are non-biodegradable and pollute soil and water.
                {showRedPen && <span className="text-red-600 font-bold ml-1.5">✓ (2 Marks)</span>}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="font-handwriting text-xl text-[#102a5c] leading-8">
            <p className="indent-4">{question.studentAnswer}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* Paper Top Toolbar / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex items-center p-0.5 bg-[#172033] border border-[#27344d] rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('paper')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'paper'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Original Answer Paper</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('transcription')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'transcription'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Clean Transcription</span>
            </button>
          </div>

          {/* Toggle Red-Pen teacher annotation */}
          {viewMode === 'paper' && (
            <button
              type="button"
              onClick={() => setShowRedPen(!showRedPen)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                showRedPen
                  ? 'bg-red-950/40 text-red-300 border-red-800/80'
                  : 'bg-[#172033] text-slate-400 border-[#27344d] hover:text-slate-300'
              }`}
              title="Toggle AI / Teacher Red-Pen Corrections"
            >
              <span className={`w-2 h-2 rounded-full ${showRedPen ? 'bg-red-500' : 'bg-slate-500'}`} />
              <span>Red-Pen Marking: {showRedPen ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>

        {/* Inspect original scan button */}
        {onOpenScan && (
          <button
            type="button"
            onClick={() => onOpenScan(qNum)}
            className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Inspect Full Scanned Page</span>
          </button>
        )}
      </div>

      {/* Actual Paper View */}
      {viewMode === 'paper' ? (
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-300 bg-[#fdfbf7] text-slate-900">
          {/* Notebook Paper Top Header Tape / Binding */}
          <div className="bg-[#f0ebe1] border-b border-[#ded7ca] px-5 py-2 flex items-center justify-between text-[11px] font-mono text-slate-600 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>GREENWOOD PUBLIC SCHOOL · ANSWER BOOKLET</span>
              <span className="text-slate-400">|</span>
              <span>CANDIDATE: {studentName} (ROLL {studentRoll})</span>
            </div>
            <div className="text-slate-500">
              QUESTION {qNum} SHEET
            </div>
          </div>

          {/* Ruled Paper Content with Left Margin */}
          <div className="relative flex">
            {/* Left Margin Section */}
            <div className="w-16 sm:w-20 shrink-0 bg-[#faf6ed] border-r-2 border-red-400/70 p-3 flex flex-col items-center justify-start space-y-4 select-none">
              {/* Question # written in margin */}
              <div className="font-handwriting text-2xl font-bold text-[#102a5c] pt-1">
                Ans {qNum}
              </div>

              {/* Red-Pen Teacher Grade Mark in Margin */}
              {showRedPen && (
                <div className="flex flex-col items-center transform -rotate-3 text-red-600">
                  <span className="text-2xl font-bold leading-none">✓</span>
                  <div className="w-10 h-10 rounded-full border-2 border-red-600 flex flex-col items-center justify-center font-mono font-bold text-xs bg-red-50/60 shadow-xs mt-1">
                    <span>+{marks}</span>
                    <span className="text-[8px] text-red-500">/{maxMarks}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ruled Writing Area */}
            <div className="flex-1 p-4 sm:p-6 ruled-paper min-h-[160px]">
              {renderHandwrittenPaper()}
            </div>
          </div>

          {/* Paper Footer with Teacher Signature */}
          {showRedPen && (
            <div className="bg-[#faf6ed] border-t border-[#ded7ca] px-6 py-2 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-sans text-[11px] font-medium text-slate-700">
                  Contextual Syllabus Match: Evaluated using CBSE Class 8 Science Knowledge Base
                </span>
              </div>
              <div className="font-handwriting text-lg text-red-700 font-bold italic">
                Evaluator: Ms. Anjali Rao ✓
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Transcription Mode */
        <div className="p-4 bg-[#172033] rounded-xl border border-[#25324c] space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            TRANSCRIBED STUDENT ANSWER
          </div>
          <p className="text-xs text-slate-200 leading-relaxed italic bg-[#111726] p-3 rounded-lg border border-[#1e273a]">
            &ldquo;{question.studentAnswer}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
};
