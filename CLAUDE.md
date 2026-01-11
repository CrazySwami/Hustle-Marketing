# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Social Canvas AI is a React + Vite web application for creating animated social media graphics with AI assistance. It combines a Canva-like editor experience with GSAP-style animations and Claude AI integration for design generation.

## Development Commands

```bash
# Development server (Vite with HMR)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend**: React 18 with Vite 6
- **AI Integration**: Vercel AI SDK with multi-provider support
- **Styling**: CSS-in-JS (inline styles)
- **State**: useReducer pattern for project state
- **Animation**: Custom animation engine with easing functions
- **Schema Validation**: Zod for AI structured outputs
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Space Grotesk, DM Sans)

### AI Providers (Multi-Model Support)
- **Anthropic Claude**: claude-sonnet-4-20250514 (default, best for creative tasks)
- **OpenAI GPT-4**: gpt-4o, gpt-4o-mini
- **Google Gemini**: gemini-1.5-pro, gemini-1.5-flash

### Core Directories

```
src/
├── services/ai/       # AI service layer (Vercel AI SDK)
│   ├── provider.js         # Multi-model provider abstraction
│   ├── brand-generator.js  # Brand suggestions service
│   ├── design-agent.js     # Design operations service
│   ├── fallback.js         # Provider fallback logic
│   └── schemas/            # Zod schemas for structured outputs
├── components/        # React UI components
│   ├── AIChatPanel.jsx       # AI assistant chat interface
│   ├── CanvasElement.jsx     # Renderable canvas elements
│   ├── EditorView.jsx        # Main canvas editor
│   ├── Timeline.jsx          # Animation timeline
│   ├── PropertiesPanel.jsx   # Element properties editor
│   ├── LeftSidebar.jsx       # Tool palette
│   ├── LibraryView.jsx       # Project library
│   ├── BrandGuideGenerator.jsx  # Brand creation wizard
│   ├── ExportModal.jsx       # Export dialog
│   └── LoadingScreen.jsx     # Initial loading
├── engine/            # Animation system
│   ├── AnimationEngine.js    # Frame interpolation engine
│   └── Easings.js           # Easing functions
├── state/             # State management
│   └── projectReducer.js     # Project state reducer
├── constants/         # Configuration
│   ├── canvasPresets.js      # Social media dimensions
│   ├── animationPresets.js   # Animation templates
│   └── defaultBrand.js       # Default brand config
├── utils/             # Helper functions
│   └── helpers.js
├── App.jsx            # Main app component
└── index.jsx          # Entry point
```

### Key Files
- `social-canvas-ai.jsx` - Original monolithic component (legacy, refactored into src/)
- `SOCIAL-CANVAS-AI-README.md` - Comprehensive technical documentation

## State Management Pattern

The app uses a centralized reducer pattern:

```javascript
// Actions: SET_PROJECT, UPDATE_PROJECT, ADD_ELEMENT, UPDATE_ELEMENT, DELETE_ELEMENT
dispatch({ type: 'ADD_ELEMENT', element: { type: 'text', content: '...' } });
```

## Canvas & Animation System

### Canvas Presets
Social media dimensions defined in `src/constants/canvasPresets.js`:
- Instagram Story/Post/Reel
- Facebook, TikTok, YouTube, Twitter/X, LinkedIn

### Animation Properties
Elements support keyframe animations with:
- `startTime`, `endTime` - Timeline bounds
- `animations` array - Property animations with easings
- Properties: x, y, scale, rotation, opacity

## Code Style Guidelines

- Use functional components with hooks
- Destructure props and state
- Keep components focused and composable
- Use meaningful variable names
- Add comments for complex animation logic

## Common Development Tasks

### Adding a New Element Type
1. Add type definition in `src/constants/index.js`
2. Handle rendering in `CanvasElement.jsx`
3. Add property controls in `PropertiesPanel.jsx`
4. Add creation UI in `LeftSidebar.jsx`

### Adding Animation Presets
1. Define in `src/constants/animationPresets.js`
2. Follow existing pattern: `{ property, from, to, ease, duration }`

### Modifying AI Chat Behavior
- Edit `src/components/AIChatPanel.jsx`
- AI should respect brand colors and personality from project state

## Important Notes

- The animation engine runs at 60fps using requestAnimationFrame
- Brand guide persists across projects via localStorage
- Canvas elements are rendered with CSS transforms for performance
- Export currently limited to JSON; video export planned

## Testing

Currently no test framework configured. Recommended additions:
- Vitest for unit tests
- Playwright for E2E testing

## Performance Considerations

- Debounce property panel updates to avoid re-render storms
- Use React.memo for canvas elements when list grows large
- Consider virtualization for timeline with many keyframes

---

## AI Development Workflow

This project uses a structured PRD-to-Tasks workflow inspired by [snarktank/ai-dev-tasks](https://github.com/snarktank/ai-dev-tasks).

### Quick Start for New Features
1. `Use tasks/create-prd.md for: [feature description]`
2. `Use tasks/generate-tasks.md with tasks/prd-[name].md`
3. Work through tasks sequentially, marking complete as you go

### Workflow Files
```
tasks/
├── create-prd.md       # PRD generation template
├── generate-tasks.md   # Task breakdown template
├── prd-*.md            # Generated PRDs
└── tasks-*.md          # Generated task lists
```

### Key Principles
- **One task at a time** - Complete and verify before moving on
- **Pause points** - AI stops after parent tasks for review
- **Progress tracking** - Mark `- [x]` after each sub-task
- **Browser verification** - UI changes require visual confirmation

See `docs/WORKFLOW-REFERENCE.md` for complete documentation.

---

## Project Learnings (AGENTS.md)

Update `AGENTS.md` after significant development sessions with:
- Discovered patterns
- Gotchas and edge cases
- Architectural decisions
