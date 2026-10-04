# AI-Based Examination Answer Sheet Evaluation System

A full-stack, automated evaluation system that analyzes student handwritten and printed answer sheet PDFs against a reference syllabus and marking rubrics, with real-time teacher validation and academic benchmark agreement metrics.

---

## 🎯 Workflow Overview

1. **Syllabus & Marking Key**: Teacher/Admin configures syllabus topics, concepts, question weights, and marking rubrics.
2. **Answer Sheet Processing**: Student answer sheets (PDF / Scanned images) are uploaded and processed using Gemini's native multimodal document understanding.
3. **AI Evaluation**: The AI assigns question-wise marks, conceptual feedback, identified correct concepts, missing concepts, and confidence scores (`High`, `Medium`, `Low`).
4. **Teacher Validation**: Teachers review evaluations, modify marks and feedback, and establish the ground-truth reference values.
5. **Accuracy & Benchmark Analytics**: Evaluates Mean Absolute Error (MAE), exact mark agreement percentage, overall score agreement, and delta distributions.
6. **Persistent Evaluation History**: Complete evaluation runs, student answers, teacher modifications, and audit logs are persisted across restarts.

---

## 📁 Repository Structure

```text
├── src/
│   ├── components/         # UI components & review modals
│   │   ├── steps/          # Multi-step workflow (Upload, Review, Student Detail, Approval)
│   │   ├── EvaluationHistoryModal.tsx  # Persistent record lookup & audit
│   │   ├── AccuracyBenchmarkModal.tsx # Statistical agreement benchmark
│   │   └── ...
│   ├── services/           # Frontend API service layer
│   │   └── evaluationApi.ts
│   ├── types/              # Domain interfaces & TypeScript definitions
│   │   ├── evaluationRecord.ts
│   │   └── copybook.ts
│   └── data/               # Reference benchmarks & seed data
├── data/
│   └── evaluations_db.json # Persistent JSON evaluation database
├── server.ts               # Express backend API + Vite middleware / static serving
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules for student privacy & secrets
└── package.json            # Scripts & dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ or 22+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Install dependencies
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Set your Gemini API key in `.env`:

```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

### Running Locally

```bash
# Start dev server with hot module reload & backend API
npm run dev
```

### Building for Production & Cloud Run

```bash
# Compile frontend assets
npm run build

# Start production server
npm start
```

---

## 🛡️ Security & Privacy

- Student answer sheet scans and personal student identifiable information are excluded from git tracking (`.gitignore`).
- No hardcoded API keys or credentials exist in codebase.
- File uploads are processed in memory / backend storage abstractions with configurable retention policies.
