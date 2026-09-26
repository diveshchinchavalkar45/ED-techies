# TeamSync AI

> **Smart teams. Better projects.**  
> A professional, minimalist web application for forming skill-balanced student project teams and guiding them autonomously through academic project lifecycles.

---

## 📌 Problem & Purpose

Students often struggle with two critical bottlenecks during university group projects:
1. **Unbalanced Team Formation:** Teams end up with duplicate skillsets (e.g., all frontend or all AI specialists) and lack leadership or coordination.
2. **Loss of Direction Post-Formation:** Teams lose momentum and miss deadlines without clear milestone tracking and early warnings.

**TeamSync AI** solves this with a transparent, rule-based team balancing engine paired with an autonomous **AI Project Coach** that offers timely, actionable suggestions to keep teams on track.

---

## ✨ Key Features

* **Student Skill & Preference Intake:**
  * Collects technical proficiencies (Python, Web Dev, AI/ML, Cloud, UI/UX, Testing/QA, etc.).
  * Collects soft skills (Leadership, Communication, Problem Solving, Time Management).
  * Captures preferred team roles (Developer, AI/ML Specialist, UI/UX Designer, Coordinator, etc.).
  * Includes a **Load Demo Students** button for instant demonstration.

* **Rule-Based Skill-Balanced Team Formation:**
  * Transparent algorithmic allocation distributing technical domains and leadership.
  * Prevents duplicate role bottlenecks and single-skill clustering.
  * Generates an interpretable **Skill Balance Score** (e.g., `87%`).
  * Plain-language **"Why these teams?"** rationales for each generated roster.
  * Supports re-balancing with the **Regenerate** button and locking teams.

* **Linear 5-Stage Project Lifecycle:**
  * Clean progression: `Define` ➔ `Plan` ➔ `Build` ➔ `Test` ➔ `Submit`.
  * Concrete deliverables, progress sliders, role-assigned checklists, and milestone target dates.
  * One-click stage advancement and completion.

* **Autonomous AI Project Coach:**
  * Lightweight dashboard assistant (max 2–3 actionable suggestions).
  * Automatically detects:
    * Unassigned responsibilities in *Plan* ➔ **Auto-Assign Owners**.
    * Approaching deadlines with low progress in *Build* ➔ **Prioritize Core Tasks**.
    * Inactive verification in *Test* ➔ **Generate Test Checklist**.
    * Scope locks and final submission verification.
  * One-click **Apply Suggestion** button directly updates the team state.

* **Modern Minimalist SaaS Dashboard:**
  * Clean typography, white/off-white background, indigo primary accent, and subtle borders.
  * Desktop-first, fully responsive on laptops, tablets, and mobile devices.
  * Persistent storage with browser `localStorage`.
  * Interactive **Try Demo** mode (no login or backend required).

---

## 🛠 Tech Stack

* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State & Persistence:** React Context + LocalStorage API

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* `npm` or `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/diveshchinchavalkar45/ED-techies.git
cd ED-techies

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
teamsync-ai/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Minimal SaaS top navigation & team switcher
│   │   ├── LandingPage.tsx        # Hero and 3 core feature pillars
│   │   ├── ProjectSetup.tsx       # Step 1: Project configuration
│   │   ├── StudentInput.tsx       # Step 2: Skill intake & tag selectors
│   │   ├── TeamResults.tsx        # Step 3: Balanced teams cards & explanations
│   │   ├── Dashboard.tsx          # Section 10 unified project dashboard
│   │   ├── ProjectLifecycle.tsx   # 5-stage lifecycle manager & task checklist
│   │   ├── AICoachPanel.tsx       # Autonomous AI coach widget
│   │   ├── TeamsView.tsx          # All-teams comparative overview
│   │   ├── ProjectView.tsx        # Course project timelines
│   │   └── SettingsView.tsx       # Project parameters & demo reset
│   ├── context/
│   │   └── ProjectContext.tsx     # Global state & LocalStorage sync
│   ├── data/
│   │   └── demoData.ts            # Realistic 12-student academic dataset
│   ├── types/
│   │   └── index.ts               # Core TypeScript definitions
│   ├── utils/
│   │   ├── teamBalancer.ts        # Transparent rule-based balancing logic
│   │   └── aiCoachEngine.ts       # AI Project Coach rules engine
│   ├── App.tsx                    # Main app orchestrator
│   ├── index.css                  # Tailwind styles
│   └── main.tsx                   # React root entry
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 📄 License

MIT License. Designed for higher education capstones, hackathons, and academic project teams.
