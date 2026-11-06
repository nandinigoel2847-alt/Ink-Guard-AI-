# INKGUARD AI — THE EVIDENCE-FIRST BRAND GUARDIAN

> *"Catch the mistake. Show the evidence. Protect the brand."*

- **Innovating Organization:** Inkloom AI  
- **Lead Presenter & Architect:** Nandini Goel  
- **Academic Institution:** ABES Engineering College, Ghaziabad, UP, India  
- **Participation:** Individual  

---

## 1. Executive Summary

**InkGuard AI** is an intelligent enterprise brand-governance web platform engineered to maintain consistent, accurate, trustworthy, and accessible communications across all corporate publishing channels.

### The Problem
Organizations publish content across distributed teams, PR agencies, and generative AI systems. This introduces serious risks:
- Unsupported promotional claims and factual hallucinations
- Inconsistent brand voice and banned tech buzzwords
- Deprecated terminology and incorrect trademark casing
- Non-compliant visual tokens and logo modifications
- Accessibility violations (WCAG 2.1 AA)
- Missing legal disclosures and regulatory gates

### The Differentiator: The 5-Pillar Evidence Trail
Unlike generic spellcheckers or opaque AI black boxes, InkGuard AI substantiates every warning:
1. **What was flagged:** Exact text substring and character offset coordinates.
2. **Why it was flagged:** Actionable explanation of the risk or violation.
3. **Evidence source citation:** Direct quotation and section number from official brand guidelines, fact sheets, or SLA policies.
4. **Suggested correction:** Context-aware compliant phrasing with 1-click replacement.
5. **Human review requirement:** Mandatory sign-off routing (Brand Lead, Legal Counsel, or Auto-Fixable).

---

## 2. Technical Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend:** Node.js Express server (`server.ts`) with Vite dev middleware.
- **Intelligence Stack:** 
  - **Gemini 3.8 Flash** via `@google/genai` TypeScript SDK for deep semantic brand audit.
  - **Deterministic Brand Guardian Engine (`src/lib/ruleEngine.ts`):** Zero-downtime offline rule evaluation.
- **Multi-Brand Knowledge Base:** Pre-seeded with Inkloom AI Master Brand Kit, Aura HealthTech Enterprise, and Apex Global FinTech.
- **Certification & Sign-Off:** Generates verifiable compliance certificates with unique digital hashes (`INKG-VERIFIED-*`).

---

## 3. Quick Start & Local Setup

### Prerequisites
- Node.js 18+ (Node 20 or 22 recommended)
- npm or yarn

### Installation

1. Unzip the project folder:
   ```bash
   unzip InkGuard-AI-SourceCode-NandiniGoel-ABES.zip
   cd InkGuard-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY if desired for AI evaluation
   ```

4. Launch development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. Build for production:
   ```bash
   npm run build
   npm run start
   ```

---

## 4. Key Endpoints

- `POST /api/audit/analyze` — Evaluates draft copy against active brand guidelines and returns structured Evidence Trail findings.
- `POST /api/audit/fix-all` — Batch-applies all accepted corrections to generate compliant copy.
- `GET /api/brand-kits` — Lists all registered enterprise brand kits.
- `GET /api/guidelines` — Returns active brand rules and verified fact sheets.
- `GET /api/history` — Retrieves immutable compliance audit log.
- `PATCH /api/history/:id/signoff` — Signs off copy and generates official compliance certificate.
- `GET /api/download/project` — Exports complete project zip archive.

---

## 5. Contact & Attribution

- **Presenter:** Nandini Goel  
- **Email:** nandinigoel2847@gmail.com  
- **College:** ABES Engineering College  
- **Project:** InkGuard AI by Inkloom AI  
