# Testing & Quality Assurance System PRD

## Document Info
- **Feature:** Automated Testing & AI-Powered Quality Assurance
- **Priority:** P0 (Infrastructure)
- **Version:** 1.0
- **Status:** Planning
- **Target Release:** Immediate (Development Infrastructure)

---

## 1. Overview

### 1.1 Feature Summary
A comprehensive testing and quality assurance system that integrates into the AI-assisted development workflow. The system uses Claude Code skills to automatically run appropriate tests based on the type of code being written, with Haiku-powered visual QA for UI components.

### 1.2 Problem Statement
Manual testing is inconsistent and often skipped during rapid development. UI regressions slip through because visual review is time-consuming. Developers don't always know which tests to run for their changes.

### 1.3 Solution
An intelligent testing system where:
1. **Context-aware testing** - AI determines which tests to run based on code changes
2. **Visual QA automation** - Haiku reviews every Storybook story for issues
3. **Continuous quality gates** - Tests run as part of the development loop
4. **Web research integration** - AI looks up latest docs/APIs when needed

### 1.4 Success Metrics
| Metric | Target |
|--------|--------|
| Test coverage (unit) | > 80% |
| Visual regression catch rate | > 95% |
| E2E test pass rate | > 98% |
| Time to detect issues | < 5 minutes |

---

## 2. System Architecture

### 2.1 Testing Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TESTING & QUALITY SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    CLAUDE CODE SKILLS                            │   │
│  │                                                                   │   │
│  │  /test-unit      Unit tests with Vitest + coverage               │   │
│  │  /test-e2e       E2E tests with Playwright                       │   │
│  │  /test-visual    Storybook visual + interaction tests            │   │
│  │  /visual-qa      Full Haiku audit (screenshot → analyze → fix)   │   │
│  │  /test-all       Run complete test suite                         │   │
│  │  /test-review    AI code review for antipatterns                 │   │
│  │                                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐              │
│  │    VITEST     │  │  PLAYWRIGHT   │  │  STORYBOOK    │              │
│  │               │  │               │  │               │              │
│  │ • Unit tests  │  │ • E2E tests   │  │ • Component   │              │
│  │ • Component   │  │ • API tests   │  │   stories     │              │
│  │ • Hooks       │  │ • Cross-      │  │ • Interaction │              │
│  │ • Utils       │  │   browser     │  │   tests       │              │
│  │ • Coverage    │  │ • Screenshots │  │ • Visual      │              │
│  │               │  │               │  │   snapshots   │              │
│  └───────────────┘  └───────────────┘  └───────────────┘              │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    HAIKU VISUAL QA                               │   │
│  │                                                                   │   │
│  │  1. Screenshot every Storybook story                             │   │
│  │  2. Send to Claude Haiku for analysis                            │   │
│  │  3. Detect: layout issues, accessibility, responsiveness         │   │
│  │  4. Generate fix suggestions or auto-fix                         │   │
│  │                                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Choices

| Layer | Technology | Reason |
|-------|------------|--------|
| **UI Framework** | Shadcn/ui | Modern, accessible, customizable components |
| **Unit Testing** | Vitest | Fast, Vite-native, excellent DX |
| **E2E Testing** | Playwright | Cross-browser, reliable, good CI support |
| **Component Dev** | Storybook | Isolated component development, visual testing |
| **Visual QA** | Claude Haiku | Fast, cost-effective image analysis |
| **Test Runner** | Claude Code Skills | Integrated into dev workflow |

---

## 3. Component Setup

### 3.1 Shadcn/ui Configuration

```bash
# Installation
npx shadcn@latest init

# Configuration choices:
# - Style: New York
# - Base color: Slate (matches dark theme)
# - CSS variables: Yes
# - Tailwind CSS: Yes
# - Components location: src/components/ui
# - Utils location: src/lib/utils
```

**Components to Install (Priority Order):**

| Component | Use Case | Priority |
|-----------|----------|----------|
| Button | CTAs, actions | P0 |
| Input | Forms, search | P0 |
| Dialog/Modal | Overlays, confirmations | P0 |
| Card | Content containers | P0 |
| Tabs | Navigation, panels | P0 |
| Select | Dropdowns | P0 |
| Slider | Range inputs, settings | P1 |
| Toast | Notifications | P1 |
| Tooltip | Help text | P1 |
| Dropdown Menu | Context menus | P1 |
| Sheet | Side panels | P1 |
| Progress | Loading states | P1 |
| Badge | Status indicators | P2 |
| Avatar | User images | P2 |
| Skeleton | Loading placeholders | P2 |

### 3.2 Storybook Configuration

```javascript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-coverage',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // Merge with Vite config
    return config;
  },
};

export default config;
```

### 3.3 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3.4 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.stories.tsx',
        '**/*.d.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

---

## 4. Testing Workflow

### 4.1 Context-Aware Test Selection

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    INTELLIGENT TEST ROUTING                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CODE CHANGE DETECTED                                                   │
│         │                                                               │
│         ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    CHANGE ANALYZER                               │   │
│  │                                                                   │   │
│  │  Files changed:                                                   │   │
│  │  • src/components/*.tsx  → Run: Storybook, Visual QA, Unit      │   │
│  │  • src/services/*.ts     → Run: Unit, E2E (API)                 │   │
│  │  • src/hooks/*.ts        → Run: Unit                            │   │
│  │  • src/pages/*.tsx       → Run: E2E, Visual QA                  │   │
│  │  • e2e/*.spec.ts         → Run: E2E                             │   │
│  │                                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│         │                                                               │
│         ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    TEST EXECUTION                                │   │
│  │                                                                   │   │
│  │  Parallel execution:                                              │   │
│  │  ├── Unit tests (Vitest)        ~10 seconds                      │   │
│  │  ├── Component tests (Storybook) ~20 seconds                     │   │
│  │  └── E2E tests (Playwright)      ~60 seconds                     │   │
│  │                                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│         │                                                               │
│         ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    RESULTS & FEEDBACK                            │   │
│  │                                                                   │   │
│  │  ✓ 45 unit tests passed                                          │   │
│  │  ✓ 12 component stories rendered                                 │   │
│  │  ✗ 1 E2E test failed: login-flow.spec.ts:23                     │   │
│  │                                                                   │   │
│  │  [View Details] [Auto-fix] [Skip & Continue]                    │   │
│  │                                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Test Trigger Matrix

| Change Type | Unit | E2E | Visual | AI Review |
|-------------|------|-----|--------|-----------|
| Component (tsx) | ✓ | - | ✓ | ✓ |
| Hook (ts) | ✓ | - | - | ✓ |
| Service/API (ts) | ✓ | ✓ | - | ✓ |
| Page (tsx) | ✓ | ✓ | ✓ | ✓ |
| Style (css) | - | - | ✓ | - |
| Config | - | ✓ | - | ✓ |
| Test file | - | Run self | - | - |

---

## 5. Haiku Visual QA System

### 5.1 Visual QA Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HAIKU VISUAL QA PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  STEP 1: SCREENSHOT CAPTURE                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  • Start Storybook in headless mode                             │   │
│  │  • Enumerate all stories                                         │   │
│  │  • Capture screenshot of each story                             │   │
│  │  • Multiple viewports: desktop, tablet, mobile                  │   │
│  │  • Save to: .storybook/screenshots/                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                           │                                             │
│                           ▼                                             │
│  STEP 2: HAIKU ANALYSIS                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  For each screenshot, ask Haiku:                                │   │
│  │                                                                   │   │
│  │  "Analyze this UI component screenshot for:                      │   │
│  │   1. Visual bugs (alignment, spacing, overflow)                  │   │
│  │   2. Accessibility issues (contrast, touch targets)             │   │
│  │   3. Consistency with design system                              │   │
│  │   4. Responsive layout issues                                    │   │
│  │   5. Missing states (hover, focus, disabled)                    │   │
│  │                                                                   │   │
│  │   Return JSON with issues found and severity."                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                           │                                             │
│                           ▼                                             │
│  STEP 3: ISSUE AGGREGATION                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  • Group issues by component                                     │   │
│  │  • Prioritize by severity (critical, warning, info)             │   │
│  │  • Generate report with screenshots + annotations               │   │
│  │  • Create fix suggestions                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                           │                                             │
│                           ▼                                             │
│  STEP 4: AUTO-FIX (Optional)                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  • Send issues to Claude Opus for fixes                         │   │
│  │  • Apply CSS/component fixes                                     │   │
│  │  • Re-run visual QA to verify                                   │   │
│  │  • Generate PR with fixes                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Haiku Analysis Prompt

```
You are a UI/UX quality assurance expert. Analyze this screenshot of a React component.

COMPONENT: {{component_name}}
STORY: {{story_name}}
VIEWPORT: {{viewport}} ({{width}}x{{height}})

Check for these issues:

1. **Layout Issues**
   - Misalignment of elements
   - Inconsistent spacing
   - Overflow/clipping
   - Broken responsive behavior

2. **Visual Bugs**
   - Missing styles
   - Wrong colors (not matching brand)
   - Font rendering issues
   - Border/shadow inconsistencies

3. **Accessibility**
   - Insufficient color contrast (< 4.5:1)
   - Touch targets too small (< 44px)
   - Missing focus indicators
   - Text readability issues

4. **Component State**
   - Is this a valid visual state?
   - Missing interactive states?
   - Loading state looks correct?
   - Error state clearly visible?

5. **Design System Compliance**
   - Using correct typography scale?
   - Spacing follows 4px/8px grid?
   - Colors from approved palette?
   - Icons consistent style?

Return JSON:
{
  "component": "ComponentName",
  "story": "StoryName",
  "viewport": "desktop",
  "issues": [
    {
      "severity": "critical|warning|info",
      "category": "layout|visual|accessibility|state|design-system",
      "description": "Description of the issue",
      "location": "Approximate location in component",
      "suggestion": "How to fix this issue"
    }
  ],
  "overallScore": 85,
  "passed": true|false
}
```

### 5.3 Visual QA Report

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    VISUAL QA REPORT                                      │
│                    Generated: 2026-01-11 15:30                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SUMMARY                                                                 │
│  ═══════════════════════════════════════════════════════════════════   │
│  Stories analyzed: 45                                                   │
│  Passed: 42 (93%)                                                       │
│  Issues found: 8                                                        │
│    • Critical: 1                                                        │
│    • Warning: 4                                                         │
│    • Info: 3                                                            │
│                                                                         │
│  CRITICAL ISSUES                                                        │
│  ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Button/Primary - Mobile                                        │   │
│  │  ┌──────────────────┐                                           │   │
│  │  │  [Screenshot]    │  Issue: Text overflow on mobile           │   │
│  │  │                  │  Category: Layout                          │   │
│  │  │  "Shop Now →"    │  Suggestion: Add text-overflow: ellipsis  │   │
│  │  │   overflows ──►  │               or reduce font size         │   │
│  │  └──────────────────┘                                           │   │
│  │                                                                   │   │
│  │  [View Code] [Apply Fix] [Ignore]                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  WARNINGS                                                               │
│  ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│  • Card/Default: Shadow appears cut off at bottom                      │
│  • Input/Error: Error text contrast ratio is 3.8:1 (need 4.5:1)       │
│  • Modal/Large: Close button touch target is 32px (need 44px)         │
│  • Tabs/Active: Active indicator misaligned by 2px                     │
│                                                                         │
│  [Apply All Fixes] [Export Report] [Mark as Reviewed]                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Claude Code Skills Integration

### 6.1 Available Skills

| Skill | Command | Description |
|-------|---------|-------------|
| Unit Tests | `/test-unit` | Run Vitest with coverage |
| E2E Tests | `/test-e2e` | Run Playwright across browsers |
| Visual Tests | `/test-visual` | Run Storybook interaction tests |
| Visual QA | `/visual-qa` | Full Haiku screenshot audit |
| All Tests | `/test-all` | Complete test suite |
| Code Review | `/test-review` | AI review for antipatterns |
| Test Debug | `/test-debug` | Analyze failures with screenshots |

### 6.2 Skill Trigger Patterns

```javascript
// When AI detects these patterns, suggest relevant skills:

const skillTriggers = {
  // After writing a new component
  'new_component': {
    suggest: ['/test-visual', '/visual-qa'],
    message: 'New component created. Run visual tests?'
  },

  // After modifying API/service code
  'api_change': {
    suggest: ['/test-e2e', '/test-unit'],
    message: 'API changes detected. Run E2E tests?'
  },

  // After fixing a bug
  'bug_fix': {
    suggest: ['/test-all'],
    message: 'Bug fix complete. Run full test suite?'
  },

  // Before committing
  'pre_commit': {
    suggest: ['/test-unit', '/test-review'],
    message: 'Running pre-commit checks...'
  },

  // After CSS/style changes
  'style_change': {
    suggest: ['/visual-qa'],
    message: 'Style changes detected. Run visual QA?'
  }
};
```

### 6.3 TDD Workflow Skills

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TDD CYCLE SKILLS                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  /red     → Write ONE failing test                                      │
│              │                                                          │
│              ▼                                                          │
│  /green   → Write minimal code to pass                                  │
│              │                                                          │
│              ▼                                                          │
│  /refactor → Improve code, keep tests green                            │
│              │                                                          │
│              ▼                                                          │
│  /cycle   → Run complete Red-Green-Refactor cycle                      │
│                                                                         │
│  /spike   → Exploratory coding before TDD                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Web Research Integration

### 7.1 Research Triggers

The AI should automatically research when:

| Trigger | Research Action |
|---------|-----------------|
| Using unfamiliar API | Look up latest docs |
| Installing new package | Check for breaking changes, best practices |
| Implementing pattern | Find examples, common approaches |
| Encountering error | Search for solutions |
| Writing tests | Find testing patterns for technology |

### 7.2 Research Sources Priority

1. **Official Documentation** - Always prefer official docs
2. **GitHub Issues/Discussions** - For edge cases, bugs
3. **Stack Overflow** - For common patterns
4. **Blog Posts (recent)** - For tutorials, examples
5. **NPM/Package Docs** - For package-specific info

### 7.3 Research Context Injection

```javascript
// Before making implementation decisions, AI should:

async function researchBeforeImplementing(task) {
  const context = await gatherResearchContext(task);

  return {
    // Latest version info
    packages: await getLatestVersions(task.dependencies),

    // Current best practices
    patterns: await searchBestPractices(task.technology),

    // Known issues to avoid
    pitfalls: await searchKnownIssues(task.technology),

    // Example implementations
    examples: await findExamples(task.pattern),
  };
}
```

---

## 8. Implementation Plan

### 8.1 Phase 1: Foundation (Day 1-2)
- [ ] Install and configure Shadcn/ui
- [ ] Set up Tailwind CSS properly
- [ ] Install core Shadcn components
- [ ] Create component directory structure

### 8.2 Phase 2: Testing Setup (Day 2-3)
- [ ] Install and configure Vitest
- [ ] Install and configure Playwright
- [ ] Set up test directory structure
- [ ] Create test utilities and helpers

### 8.3 Phase 3: Storybook (Day 3-4)
- [ ] Install and configure Storybook
- [ ] Create stories for existing components
- [ ] Set up Storybook addons (a11y, interactions)
- [ ] Configure screenshot capture

### 8.4 Phase 4: Visual QA (Day 4-5)
- [ ] Create Haiku visual QA script
- [ ] Set up screenshot automation
- [ ] Build report generator
- [ ] Test on existing components

### 8.5 Phase 5: Integration (Day 5-6)
- [ ] Wire up Claude Code skills
- [ ] Create skill trigger logic
- [ ] Document usage patterns
- [ ] Test full workflow

---

## 9. File Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── features/              # Feature components
│   │   ├── canvas/
│   │   ├── brand/
│   │   └── ...
│   └── __stories__/           # Storybook stories
│       ├── Button.stories.tsx
│       └── ...
├── lib/
│   └── utils.ts               # Shadcn utilities
├── test/
│   ├── setup.ts               # Test setup
│   ├── utils.tsx              # Test utilities
│   └── mocks/                 # Mock data
└── styles/
    └── globals.css            # Tailwind + Shadcn styles

e2e/
├── fixtures/                  # Test fixtures
├── pages/                     # Page objects
└── specs/                     # E2E test specs
    ├── auth.spec.ts
    ├── canvas.spec.ts
    └── ...

.storybook/
├── main.ts                    # Storybook config
├── preview.ts                 # Story decorators
└── screenshots/               # Visual QA screenshots
```

---

## 10. Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",

    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",

    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:debug": "playwright test --debug",
    "e2e:report": "playwright show-report",

    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build",
    "storybook:test": "test-storybook",

    "visual-qa": "node scripts/visual-qa.mjs",
    "visual-qa:report": "open .storybook/visual-qa-report.html",

    "lint": "eslint src --ext ts,tsx",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "typecheck": "tsc --noEmit",

    "qa": "npm run lint && npm run typecheck && npm run test:run && npm run e2e"
  }
}
```

---

## 11. Success Criteria

### 11.1 Setup Complete When:
- [ ] Shadcn/ui installed with 10+ core components
- [ ] Vitest running with > 80% coverage threshold
- [ ] Playwright testing 3+ browsers
- [ ] Storybook with stories for all UI components
- [ ] Haiku visual QA generating reports
- [ ] All Claude Code skills working

### 11.2 Quality Gates:
- [ ] No PR merged without passing unit tests
- [ ] Visual QA score > 90% for all components
- [ ] E2E tests cover critical user flows
- [ ] Code review catches 0 critical issues post-merge
