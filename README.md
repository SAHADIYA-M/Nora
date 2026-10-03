# Nora — Astronaut Health Monitor & Space Bio-Telemetry

> **Live Application**: [https://sahadiya-m.github.io/Nora/](https://sahadiya-m.github.io/Nora/)

Nora is an advanced bio-telemetry monitoring, emergency health alert, and space medical simulation system engineered for astronaut health tracking during space missions.

> [!IMPORTANT]  
> **Simulation Disclaimer**: This application is a **medical simulation model only** created for operational UI testing, telemetry stream visualization, and emergency protocol demonstrations.

> [!NOTE]
> **Simulation Focus**: While multiple biometric parameters (Heart Rate, Body Temperature, Sleep Rest, Exercise Time) are displayed on the monitoring dashboard, the active alert threshold engine, simulation triggers, and emergency protocol popups are specifically implemented around **Oxygen Level (% SpO2) variations** (critical breach threshold at < 90% SpO2).

---

## Key Features

* **Real-Time Dynamic Telemetry Stream**: Simulates continuous time-varying bio-telemetry sampling (SpO2 oxygen saturation, heart rate BPM, body temperature °C, sleep rest, and workout metrics) updated every 2.5 seconds.
* **3 Preset Simulation Modes**:
  * **Normal (Nominal)**: Baseline resting vitals (98.5% SpO2, 72 BPM, 36.8°C).
  * **Warning (Caution)**: Exertion alert state with pulse spikes and oxygen drops.
  * **Critical (Breach)**: Hypoxia alert state (<90% SpO2) triggering immediate suit oxygen protocols.
* **Dual Interface Modes**:
  * **Space Health Guide**: Live vital dashboards, SVG telemetry stream graphs, and interactive simulation controls.
  * **Nora Muse Mode**: Operational instructions, preventative clinical precautions, and emergency action guidelines.
* **Voice Synthesis System**: Built-in browser speech synthesis providing audio announcements for vital status changes.
* **Emergency Pop-Up Protocol**: Actionable step-by-step modal guides triggered during warning or critical health events.

---

## Technology Stack

### Frontend Core
* **React 19**: Component-driven reactive user interface.
* **TypeScript**: Type-safe development with strict vitals and state models.
* **Vite 8**: Next-generation lightning-fast frontend tooling and bundle optimizer.

### UI & Styling System
* **Vanilla CSS Design Tokens**: Custom CSS variables (`--primary-violet`, `--primary-cyan`, `--gradient-nora`, etc.) for theme consistency.
* **Glassmorphism Aesthetic**: Modern translucency with `backdrop-filter: blur(16px)` and subtle glowing borders.
* **Lucide React**: Clean, modern vector icon suite.
* **Google Fonts**:
  * `Outfit`: Sans-serif typography for clean interface headers.
  * `JetBrains Mono`: Monospaced font for mission clocks and telemetry readings.

### Tooling & CI/CD Deployment
* **Oxlint**: High-speed Linter for code quality.
* **GitHub Actions**: Automated build and deployment pipeline (`deploy.yml`) publishing to GitHub Pages on every push to `main`.

---

## Design System & Visual Architecture

1. **Space Mission Palette**: Deep space slates, clean whites, paired with neon violet (`#7c3aed`), cyan (`#0891b2`), and pink (`#db2777`) accents.
2. **Color-Coded Status Severity**:
   * 🟢 **Nominal / Normal**: `#059669` (Emerald Green)
   * 🟠 **Warning / Caution**: `#d97706` (Amber Gold)
   * 🔴 **Critical / Breach**: `#dc2626` (Crimson Red)
3. **Micro-Animations & Telemetry Graphs**: Smooth CSS keyframe pulses, live updating SVG sparklines, and active synthesizer wave indicators.
4. **Responsive Layout**: Flexible CSS grid and flexbox architecture designed to adapt seamlessly across desktop monitors, mission tablets, and mobile screens.

---

## Project Folder Structure

```
Nora/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment workflow
├── public/
│   ├── favicon.svg                 # SVG Site Favicon
│   ├── logo.png                    # Space Health Guide Logo
│   └── astronaut_silhouette.svg    # Astronaut Silhouette Icon
├── src/
│   ├── assets/                     # Bundled media & graphic assets
│   │   ├── logo.png
│   │   └── astronaut_silhouette.svg
│   ├── components/                 # React UI components
│   │   ├── AstronautHealthDashboard.tsx  # Dynamic vital cards & telemetry graph
│   │   ├── Header.tsx                        # Navigation bar, clock & voice controls
│   │   ├── NoraAssistant.tsx                 # Interactive AI chat assistant interface
│   │   └── PersonaSettingsModal.tsx          # Preference modal & AI engine configuration
│   ├── data/                       # Static datasets & persona configurations
│   │   └── personas.ts
│   ├── types/                      # TypeScript definitions & vitals interfaces
│   │   └── index.ts
│   ├── App.tsx                     # Main application container & simulation engine
│   ├── App.css                     # Layout utilities & keyframe animations
│   ├── index.css                   # Global design tokens & CSS variables
│   └── main.tsx                    # Vite React DOM entry point
├── index.html                      # HTML document entry with font imports & metadata
├── package.json                    # Project dependencies & build scripts
├── tsconfig.json                   # TypeScript compiler configuration
└── vite.config.ts                  # Vite build config with relative base path
```

---

## Local Development Setup

To run Nora locally on your machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SAHADIYA-M/Nora.git
   cd Nora
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

