# Social Canvas AI - Technical Documentation & Project Roadmap

**Version:** 0.3.0 (Prototype)  
**Last Updated:** January 9, 2026  
**Status:** Functional Prototype - Ready for Expansion

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Vision](#project-vision)
3. [Architecture Overview](#architecture-overview)
4. [Feature Inventory](#feature-inventory)
5. [Technical Implementation](#technical-implementation)
6. [Component Reference](#component-reference)
7. [State Management](#state-management)
8. [Animation Engine](#animation-engine)
9. [AI Agent Integration](#ai-agent-integration)
10. [Data Structures](#data-structures)
11. [Styling System](#styling-system)
12. [Known Limitations](#known-limitations)
13. [Technical Debt](#technical-debt)
14. [Future Roadmap](#future-roadmap)
15. [Performance Considerations](#performance-considerations)
16. [Testing Requirements](#testing-requirements)
17. [Deployment Considerations](#deployment-considerations)
18. [API Integrations Needed](#api-integrations-needed)
19. [Appendix](#appendix)

---

## Executive Summary

Social Canvas AI is a web-based social media content editor that combines the user experience of Canva with GSAP-style animations and AI-powered design assistance. The application enables users to create animated social media graphics with an AI assistant that understands brand guidelines and can generate, modify, and animate design elements on command.

### Key Differentiators
- **AI-First Design**: Claude AI agent integrated directly into the canvas editor
- **Animation-Native**: Every element supports timeline-based animations
- **Brand-Aware**: Persistent brand guides that inform all design decisions
- **Multi-Platform Export**: Designed for all major social media formats

### Current State
The prototype demonstrates core functionality including canvas rendering, element manipulation, timeline playback, AI-driven design creation, and persistent storage. The animation engine is functional but simplified, and export capabilities are limited to JSON.

---

## Project Vision

### Problem Statement
Content creators and marketers need to produce high volumes of animated social media content across multiple platforms. Current tools either lack animation capabilities (Canva), require technical expertise (After Effects), or don't leverage AI for design assistance.

### Solution
An AI-powered canvas editor that:
1. Understands brand identity and maintains consistency
2. Generates professional designs from natural language prompts
3. Handles animations natively without timeline complexity
4. Exports to all major social platforms in appropriate formats
5. Learns from user preferences to improve suggestions

### Target Users
- Social Media Managers
- Content Creators
- Marketing Teams
- Small Business Owners
- Freelance Designers

---

## Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend Framework | React 18+ | Component-based UI |
| State Management | useReducer | Centralized project state |
| Animation | Custom Engine | Frame-by-frame interpolation |
| AI Integration | Claude API | Design generation & modification |
| Styling | CSS-in-JS (inline styles) | Component styling |
| Storage | window.storage API | Persistent data |
| Icons | Lucide React | UI iconography |
| Fonts | Google Fonts | Typography |

### Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LIBRARY VIEW                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Projects   │  │ Brand Guides │  │ Create New   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BRAND GENERATOR (4 Steps)                     │
│  [Name] → [AI Suggestions] → [Colors] → [Personality]           │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         EDITOR VIEW                              │
│  ┌────────────┐  ┌────────────────┐  ┌──────────────────┐       │
│  │   Left     │  │     Canvas     │  │   Right Panel    │       │
│  │  Sidebar   │  │   Workspace    │  │  - AI Chat       │       │
│  │ - Elements │  │  - Drag/Drop   │  │  - Properties    │       │
│  │ - Text     │  │  - Resize      │  │                  │       │
│  │ - Brand    │  │  - Selection   │  │                  │       │
│  │ - Uploads  │  │                │  │                  │       │
│  └────────────┘  └────────────────┘  └──────────────────┘       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      TIMELINE                             │   │
│  │  [Track Labels] | [Ruler + Playhead] [Track Bars]        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Dispatch Action → Reducer → New State → Re-render
                    ↓
              AI Chat Input
                    ↓
            Claude API Call
                    ↓
            Parse JSON Response
                    ↓
            Execute Operations
                    ↓
            Dispatch Actions
```

---

## Feature Inventory

### Implemented Features ✅

#### Library View
- [x] Project grid with thumbnail previews
- [x] Brand guide cards with color swatches
- [x] Canvas preset selection modal
- [x] 8 platform presets (Instagram Story/Post/Reel, Facebook, TikTok, YouTube, Twitter, LinkedIn)
- [x] Click to open existing projects
- [x] Empty state with create prompt

#### Brand Guide Generator
- [x] 4-step wizard flow
- [x] AI-generated brand suggestions (personality, tone, colors)
- [x] Manual color picker with hex input
- [x] Personality and tone definition
- [x] Brand persistence via storage API

#### Canvas Editor
- [x] Responsive canvas scaling
- [x] Element rendering (text, shapes, images)
- [x] Click-to-select elements
- [x] Drag-to-move elements
- [x] Corner resize handles
- [x] Selection outline indicator
- [x] Locked element visual state
- [x] Element visibility toggle

#### Left Sidebar
- [x] Panel toggle system (Elements, Text, Brand, Uploads)
- [x] Quick element buttons (Text, Rectangle, Circle, Image)
- [x] Text style presets (Heading, Subheading, Body, Button)
- [x] Brand color palette display
- [x] Upload zone UI (placeholder)

#### Right Panel - AI Chat
- [x] Chat message history
- [x] User/assistant message styling
- [x] Loading state with spinner
- [x] Context-aware system prompt
- [x] JSON operation parsing
- [x] Element creation from AI responses
- [x] Element modification from AI responses
- [x] Element deletion from AI responses

#### Right Panel - Properties
- [x] Position inputs (X, Y)
- [x] Size inputs (W, H)
- [x] Text content editor
- [x] Font size input
- [x] Color picker
- [x] Text alignment buttons
- [x] Shape fill color
- [x] Quick brand color buttons
- [x] Animation list display
- [x] Animation preset dropdown
- [x] Delete element button

#### Timeline
- [x] Play/Pause toggle
- [x] Time display (current/total)
- [x] Timeline ruler with markers
- [x] Draggable playhead
- [x] Track labels with element names
- [x] Visibility toggle per track
- [x] Lock toggle per track
- [x] Colored track bars by element type
- [x] Animation markers on tracks
- [x] Click-to-seek on ruler

#### Animation System
- [x] Custom easing functions (8 types)
- [x] Property interpolation (opacity, scale, x, y, rotation)
- [x] Time-based animation calculation
- [x] Default animations on new elements
- [x] Animation stacking per element
- [x] Start time offset support

#### Export
- [x] Export modal UI
- [x] Format selection (PNG, JPG, GIF, MP4, JSON)
- [x] JSON export functional
- [x] Export loading state

#### Persistence
- [x] Project save to storage
- [x] Project load from storage
- [x] Brand guide save to storage
- [x] Brand guide load from storage

### Partially Implemented Features ⚠️

| Feature | Status | What's Missing |
|---------|--------|----------------|
| Element Rotation | UI exists | No rotation handle, only input |
| Element Opacity | Animatable | No direct slider input |
| Image Upload | UI exists | No actual file handling |
| Undo/Redo | Not started | Need action history stack |
| Element Grouping | Not started | Need group data structure |
| Layer Reordering | Not started | Need drag-drop in timeline |
| Audio Track | UI exists | No audio handling |
| Video Elements | Not started | Need video player component |

### Not Implemented Features ❌

- Image generation (Nano Banana API)
- Stock media search (Unsplash, Pexels, Pixabay)
- Video export (requires server-side FFmpeg)
- GIF export (requires server-side processing)
- PNG/JPG export (requires canvas capture)
- SVG export (requires SVG generation)
- Cloud sync (requires backend)
- Collaboration (requires real-time sync)
- Templates library
- Font upload
- Custom animations builder
- Keyframe editor
- Effects (shadows, blur, gradients)
- Text effects (stroke, gradient fill)
- Shape morphing
- Path animations
- 3D transforms
- Audio waveform visualization
- Beat sync for animations

---

## Technical Implementation

### File Structure (Recommended for Expansion)

```
social-canvas-ai/
├── public/
│   └── index.html
├── src/
│   ├── index.jsx                 # Entry point
│   ├── App.jsx                   # Main app component
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Input.jsx
│   │   │   └── ColorPicker.jsx
│   │   │
│   │   ├── library/
│   │   │   ├── LibraryView.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── BrandCard.jsx
│   │   │   └── PresetModal.jsx
│   │   │
│   │   ├── brand/
│   │   │   ├── BrandGenerator.jsx
│   │   │   ├── BrandStep.jsx
│   │   │   └── ColorInputs.jsx
│   │   │
│   │   ├── editor/
│   │   │   ├── EditorView.jsx
│   │   │   ├── EditorHeader.jsx
│   │   │   ├── CanvasContainer.jsx
│   │   │   └── ExportModal.jsx
│   │   │
│   │   ├── sidebar/
│   │   │   ├── LeftSidebar.jsx
│   │   │   ├── ElementsPanel.jsx
│   │   │   ├── TextPanel.jsx
│   │   │   ├── BrandPanel.jsx
│   │   │   └── UploadsPanel.jsx
│   │   │
│   │   ├── canvas/
│   │   │   ├── Canvas.jsx
│   │   │   ├── CanvasElement.jsx
│   │   │   ├── TextElement.jsx
│   │   │   ├── ShapeElement.jsx
│   │   │   ├── ImageElement.jsx
│   │   │   ├── ResizeHandles.jsx
│   │   │   └── SelectionBox.jsx
│   │   │
│   │   ├── timeline/
│   │   │   ├── Timeline.jsx
│   │   │   ├── TimelineControls.jsx
│   │   │   ├── TimelineRuler.jsx
│   │   │   ├── TrackLabels.jsx
│   │   │   ├── TrackBars.jsx
│   │   │   └── Playhead.jsx
│   │   │
│   │   ├── properties/
│   │   │   ├── PropertiesPanel.jsx
│   │   │   ├── PositionSection.jsx
│   │   │   ├── TextSection.jsx
│   │   │   ├── ShapeSection.jsx
│   │   │   └── AnimationSection.jsx
│   │   │
│   │   └── ai/
│   │       ├── AIChatPanel.jsx
│   │       ├── ChatMessage.jsx
│   │       ├── ChatInput.jsx
│   │       └── AIOperationParser.jsx
│   │
│   ├── hooks/
│   │   ├── useProject.js         # Project state hook
│   │   ├── useAnimation.js       # Animation playback hook
│   │   ├── useCanvas.js          # Canvas interaction hook
│   │   ├── useStorage.js         # Persistence hook
│   │   └── useAI.js              # AI chat hook
│   │
│   ├── engine/
│   │   ├── AnimationEngine.js    # Core animation logic
│   │   ├── Easings.js            # Easing functions
│   │   ├── Interpolators.js      # Value interpolation
│   │   └── Timeline.js           # Timeline management
│   │
│   ├── state/
│   │   ├── projectReducer.js     # Project state reducer
│   │   ├── actions.js            # Action creators
│   │   └── initialState.js       # Default state
│   │
│   ├── services/
│   │   ├── aiService.js          # Claude API wrapper
│   │   ├── storageService.js     # Storage abstraction
│   │   ├── exportService.js      # Export handlers
│   │   └── mediaService.js       # Media upload/fetch
│   │
│   ├── utils/
│   │   ├── canvasUtils.js        # Canvas calculations
│   │   ├── colorUtils.js         # Color manipulation
│   │   ├── timeUtils.js          # Time formatting
│   │   └── idGenerator.js        # Unique ID generation
│   │
│   ├── constants/
│   │   ├── canvasPresets.js      # Platform dimensions
│   │   ├── animationPresets.js   # Animation definitions
│   │   ├── defaultBrand.js       # Default brand guide
│   │   └── elementDefaults.js    # Element default values
│   │
│   └── styles/
│       ├── variables.css         # CSS variables
│       ├── reset.css             # CSS reset
│       ├── components/           # Component styles
│       └── themes/               # Theme variations
│
├── server/                       # Future backend
│   ├── api/
│   │   ├── export.js             # Video/image export
│   │   ├── media.js              # Media processing
│   │   └── ai.js                 # AI proxy
│   │
│   └── services/
│       ├── ffmpeg.js             # Video rendering
│       ├── sharp.js              # Image processing
│       └── storage.js            # Cloud storage
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/
    ├── API.md
    ├── COMPONENTS.md
    └── CONTRIBUTING.md
```

---

## Component Reference

### Core Components

#### `SocialCanvasAI` (Main App)
**Purpose:** Root component managing view routing and global state  
**State:**
- `view`: Current view ('loading' | 'library' | 'brand-generator' | 'editor')
- `projects`: Array of saved projects
- `brandGuides`: Array of saved brand guides
- `currentProject`: Active project (via useReducer)

**Responsibilities:**
- View routing based on state
- Data persistence orchestration
- Project/Brand creation handlers

---

#### `LibraryView`
**Purpose:** Home screen showing projects and brand guides  
**Props:**
- `projects`: Array of project objects
- `brandGuides`: Array of brand guide objects
- `onCreateProject`: (preset) => void
- `onOpenProject`: (project) => void
- `onCreateBrand`: () => void

**State:**
- `showPresetModal`: Boolean for modal visibility

---

#### `BrandGuideGenerator`
**Purpose:** 4-step wizard for creating brand guides  
**Props:**
- `onComplete`: (brand) => void
- `onBack`: () => void

**State:**
- `step`: Current step (0-3)
- `brand`: Brand data being built
- `aiLoading`: Loading state for AI suggestions
- `aiSuggestions`: AI-generated suggestions

**Steps:**
1. Brand name input
2. AI suggestions display/acceptance
3. Color customization
4. Personality & tone definition

---

#### `EditorView`
**Purpose:** Main canvas editor with all panels  
**Props:**
- `project`: Current project object
- `dispatch`: State dispatcher
- `onBack`: () => void
- `onSave`: () => void

**State:**
- `selectedId`: Currently selected element ID
- `activePanel`: Active left sidebar panel
- `currentTime`: Playback position (ms)
- `isPlaying`: Playback state
- `showExport`: Export modal visibility
- `canvasScale`: Calculated canvas scale factor

---

#### `CanvasElement`
**Purpose:** Renders individual elements with animation support  
**Props:**
- `element`: Element data object
- `isSelected`: Boolean selection state
- `onSelect`: (id) => void
- `onUpdate`: (id, updates) => void
- `scale`: Canvas scale factor
- `currentTime`: Current playback time
- `isPlaying`: Playback state

**Behavior:**
- Calculates animated values based on currentTime
- Handles drag-to-move
- Handles corner resize
- Renders appropriate content type (text/shape/image)
- Shows resize handles when selected

---

#### `Timeline`
**Purpose:** Animation timeline with tracks and playback controls  
**Props:**
- `project`: Current project
- `dispatch`: State dispatcher
- `selectedId`: Selected element ID
- `onSelect`: (id) => void
- `currentTime`: Current time (ms)
- `onTimeChange`: (time) => void
- `isPlaying`: Playback state
- `onPlayPause`: () => void

**Features:**
- Play/pause button
- Time display
- Ruler with time markers
- Draggable playhead
- Track labels with visibility/lock toggles
- Colored track bars

---

#### `AIChatPanel`
**Purpose:** AI assistant chat interface  
**Props:**
- `project`: Current project (for context)
- `selectedElement`: Currently selected element
- `dispatch`: State dispatcher
- `brand`: Brand guide for context

**State:**
- `messages`: Chat history array
- `input`: Current input text
- `isLoading`: API call in progress

**Behavior:**
- Builds context-aware system prompt
- Sends requests to Claude API
- Parses JSON operations from responses
- Dispatches actions to modify canvas

---

#### `PropertiesPanel`
**Purpose:** Element property editor  
**Props:**
- `element`: Selected element (or null)
- `onUpdate`: (id, updates) => void
- `onDelete`: (id) => void
- `brand`: Brand guide for quick colors

**Sections:**
- Position & Size (X, Y, W, H)
- Text properties (content, size, color, align)
- Shape properties (fill, border radius)
- Animations (list, add preset)

---

## State Management

### Project Reducer

```javascript
const projectReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROJECT':
      // Replace entire project state
      return action.project;
    
    case 'UPDATE_PROJECT':
      // Update project-level properties
      return { ...state, ...action.updates, updatedAt: Date.now() };
    
    case 'ADD_ELEMENT':
      // Add new element with generated ID
      return {
        ...state,
        elements: [...state.elements, newElement],
      };
    
    case 'UPDATE_ELEMENT':
      // Update specific element by ID
      return {
        ...state,
        elements: state.elements.map(el =>
          el.id === action.id ? { ...el, ...action.updates } : el
        ),
      };
    
    case 'DELETE_ELEMENT':
      // Remove element by ID
      return {
        ...state,
        elements: state.elements.filter(el => el.id !== action.id),
      };
    
    default:
      return state;
  }
};
```

### Action Types

| Action | Payload | Description |
|--------|---------|-------------|
| `SET_PROJECT` | `{ project }` | Replace entire project |
| `UPDATE_PROJECT` | `{ updates }` | Merge updates into project |
| `ADD_ELEMENT` | `{ element }` | Add element (ID auto-generated) |
| `UPDATE_ELEMENT` | `{ id, updates }` | Update element properties |
| `DELETE_ELEMENT` | `{ id }` | Remove element |

### Future Actions Needed

| Action | Purpose |
|--------|---------|
| `REORDER_ELEMENTS` | Change z-index order |
| `DUPLICATE_ELEMENT` | Clone element |
| `GROUP_ELEMENTS` | Create element group |
| `UNGROUP_ELEMENTS` | Dissolve group |
| `UNDO` | Revert last action |
| `REDO` | Reapply undone action |
| `SET_DURATION` | Change project duration |
| `ADD_KEYFRAME` | Add animation keyframe |
| `UPDATE_KEYFRAME` | Modify keyframe |
| `DELETE_KEYFRAME` | Remove keyframe |

---

## Animation Engine

### Overview

The custom animation engine calculates element properties at any given time without external dependencies. It uses easing functions to interpolate between start and end values.

### Easing Functions

```javascript
const easings = {
  linear: t => t,
  'power1.out': t => 1 - Math.pow(1 - t, 1),
  'power2.out': t => 1 - Math.pow(1 - t, 2),
  'power3.out': t => 1 - Math.pow(1 - t, 3),
  'power2.in': t => Math.pow(t, 2),
  'power3.in': t => Math.pow(t, 3),
  'power2.inOut': t => t < 0.5 
    ? 2 * t * t 
    : 1 - Math.pow(-2 * t + 2, 2) / 2,
  'back.out(1.7)': t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  'elastic.out(1, 0.5)': t => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * 
      Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
  },
};
```

### Animation Presets

| Preset | Property | From | To | Ease | Duration |
|--------|----------|------|-----|------|----------|
| fadeIn | opacity | 0 | 1 | power2.out | 500ms |
| fadeOut | opacity | 1 | 0 | power2.in | 500ms |
| slideInLeft | x | -200 | 0 | power3.out | 600ms |
| slideInRight | x | 200 | 0 | power3.out | 600ms |
| slideInUp | y | 200 | 0 | power3.out | 600ms |
| slideInDown | y | -200 | 0 | power3.out | 600ms |
| scaleIn | scale | 0 | 1 | back.out(1.7) | 500ms |
| bounceIn | scale | 0 | 1 | elastic.out(1,0.5) | 800ms |
| rotateIn | rotation | -180 | 0 | power2.out | 600ms |

### Value Calculation

```javascript
const getAnimatedValues = (element, currentTime) => {
  const values = {
    x: element.x,
    y: element.y,
    scale: 1,
    rotation: element.rotation || 0,
    opacity: element.opacity ?? 1,
  };
  
  // Check visibility window
  if (currentTime < element.startTime || currentTime > element.endTime) {
    values.opacity = 0;
    return values;
  }
  
  // Apply each animation
  element.animations.forEach(anim => {
    const animStart = element.startTime + (anim.startTime || 0);
    const animEnd = animStart + (anim.duration || 500);
    
    if (currentTime < animStart) {
      // Before: use "from" value
      values[anim.property] = anim.from;
    } else if (currentTime >= animEnd) {
      // After: use "to" value
      values[anim.property] = anim.to;
    } else {
      // During: interpolate
      const progress = (currentTime - animStart) / (anim.duration || 500);
      const easedProgress = getEasing(anim.ease)(progress);
      values[anim.property] = anim.from + (anim.to - anim.from) * easedProgress;
    }
  });
  
  return values;
};
```

### Limitations & Improvements Needed

| Current Limitation | Improvement |
|-------------------|-------------|
| No keyframe editor | Build visual keyframe timeline |
| Limited properties | Add: blur, shadow, color, skew |
| No bezier curves | Add custom cubic-bezier support |
| No path animations | Add SVG path following |
| No spring physics | Add spring-based easing |
| No sequencing | Add animation groups/sequences |
| No repeating | Add loop/yoyo support |
| Single value interpolation | Add multi-value (gradients, colors) |

---

## AI Agent Integration

### System Prompt Structure

The AI receives comprehensive context about the current state:

```
1. Canvas dimensions and duration
2. Current element count
3. Selected element details (if any)
4. Complete brand color palette
5. Available animation presets
6. Operation instructions with examples
7. Positioning guidelines
```

### Supported Operations

```json
{
  "operations": [
    {
      "type": "addElement",
      "element": { /* element definition */ }
    },
    {
      "type": "updateElement",
      "id": "el-123",
      "updates": { /* property updates */ }
    },
    {
      "type": "deleteElement",
      "id": "el-123"
    }
  ]
}
```

### Response Parsing

```javascript
// Extract JSON from markdown code blocks
const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
if (jsonMatch) {
  const { operations } = JSON.parse(jsonMatch[1]);
  operations.forEach(op => {
    // Execute each operation via dispatch
  });
}
```

### AI Improvements Needed

| Improvement | Description |
|-------------|-------------|
| Multi-turn context | Include previous messages in API calls |
| Error handling | Better parsing of malformed responses |
| Streaming | Show partial responses as they generate |
| Vision | Allow AI to "see" current canvas state |
| Design rules | Teach AI about design principles |
| Layout engine | AI-driven auto-layout suggestions |
| A/B variants | Generate multiple design options |
| Feedback loop | Learn from user edits |

---

## Data Structures

### Project Object

```typescript
interface Project {
  id: string;              // Unique identifier
  name: string;            // Project name
  createdAt: number;       // Unix timestamp
  updatedAt: number;       // Unix timestamp
  brandGuide: BrandGuide;  // Associated brand
  canvas: {
    preset: string;        // Preset key
    name: string;          // Display name
    width: number;         // Pixels
    height: number;        // Pixels
  };
  duration: number;        // Milliseconds
  elements: Element[];     // All elements
}
```

### Brand Guide Object

```typescript
interface BrandGuide {
  id: string;
  name: string;
  logo: string | null;     // URL or base64
  colors: {
    primary: string;       // Hex color
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textMuted?: string;
  };
  fonts: {
    heading: string;       // Font family
    body: string;
  };
  personality: string;     // Description
  tone: string;           // Description
}
```

### Element Object

```typescript
interface BaseElement {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image';
  x: number;               // Position from left
  y: number;               // Position from top
  width: number;
  height: number;
  rotation: number;        // Degrees
  opacity: number;         // 0-1
  locked: boolean;
  visible: boolean;
  startTime: number;       // When element appears (ms)
  endTime: number;         // When element disappears (ms)
  animations: Animation[];
}

interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
}

interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle';
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
  hasText?: boolean;
  textContent?: string;
  textColor?: string;
}

interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  objectFit: 'cover' | 'contain' | 'fill';
}
```

### Animation Object

```typescript
interface Animation {
  id: string;
  property: 'opacity' | 'scale' | 'x' | 'y' | 'rotation';
  from: number;
  to: number;
  duration: number;        // Milliseconds
  startTime: number;       // Offset from element start
  ease: string;            // Easing function name
}
```

---

## Styling System

### Design Tokens

```css
/* Colors */
--color-background: #08080C;
--color-surface: #111118;
--color-surface-hover: #1a1a24;
--color-surface-active: #222230;
--color-border: #1a1a24;
--color-border-focus: #00D4FF;

--color-primary: #00D4FF;      /* Electric blue */
--color-secondary: #7B2CBF;    /* Deep purple */
--color-accent: #FF006E;       /* Hot pink */

--color-text: #FFFFFF;
--color-text-muted: #888888;
--color-text-dim: #555555;

/* Typography */
--font-heading: 'Space Grotesk', sans-serif;
--font-body: 'DM Sans', sans-serif;

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 2px 4px rgba(0,0,0,0.2);
--shadow-md: 0 4px 16px rgba(0,0,0,0.3);
--shadow-lg: 0 16px 48px rgba(0,0,0,0.5);
```

### Component Patterns

```css
/* Button - Primary */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-weight: 600;
}

/* Button - Ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  padding: 8px 14px;
}
.btn-ghost:hover {
  background: rgba(255,255,255,0.08);
  color: white;
}

/* Card */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
.card:hover {
  border-color: var(--color-primary);
}

/* Input */
.input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: white;
  padding: 10px 14px;
}
.input:focus {
  border-color: var(--color-primary);
  outline: none;
}
```

---

## Known Limitations

### Critical Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| No video export | Can't produce final deliverables | Export JSON, use external tool |
| No image export | Can't produce static frames | Screenshot manually |
| No cloud storage | Data lost if storage cleared | Export JSON regularly |
| Single user only | No collaboration | Share JSON files |
| No mobile support | Desktop only | Use desktop browser |

### Functional Limitations

| Limitation | Impact |
|------------|--------|
| No undo/redo | Mistakes require manual reversal |
| No layer reorder | Must delete and recreate |
| No element copy/paste | Must recreate elements |
| No multi-select | Edit one element at a time |
| No zoom controls | Fixed canvas scale |
| No rulers/guides | Manual alignment only |
| No snap-to-grid | Freeform positioning |
| No text editing on canvas | Use properties panel |
| No rich text | Single style per text element |
| No custom fonts | Limited to Google Fonts |

### Performance Limitations

| Limitation | Impact |
|------------|--------|
| No virtual rendering | Slow with many elements |
| Re-render on every frame | CPU intensive during playback |
| Large images not optimized | Memory issues possible |
| No debouncing on inputs | Frequent re-renders |

---

## Technical Debt

### High Priority

| Issue | Description | Solution |
|-------|-------------|----------|
| Monolithic file | All code in single file | Split into modules |
| Inline styles | Hard to maintain | Extract to CSS modules |
| No TypeScript | No type safety | Convert to TypeScript |
| No error boundaries | Crashes break app | Add React error boundaries |
| No loading states | UI freezes on operations | Add suspense/loading |

### Medium Priority

| Issue | Description | Solution |
|-------|-------------|----------|
| Magic numbers | Hardcoded values | Extract to constants |
| Prop drilling | Deep component props | Use Context API |
| No memoization | Unnecessary re-renders | Add useMemo/useCallback |
| Inconsistent naming | Mixed conventions | Standardize naming |
| No comments | Code hard to follow | Add JSDoc comments |

### Low Priority

| Issue | Description | Solution |
|-------|-------------|----------|
| Console.log statements | Debug code in production | Remove or use logger |
| Unused variables | Dead code | Cleanup |
| Mixed async patterns | Callbacks and async/await | Standardize on async/await |

---

## Future Roadmap

### Phase 1: Foundation (Weeks 1-4)

#### Week 1-2: Code Architecture
- [ ] Split into modular file structure
- [ ] Add TypeScript support
- [ ] Implement proper CSS system (CSS Modules or Tailwind)
- [ ] Add ESLint and Prettier
- [ ] Set up testing framework (Jest + React Testing Library)

#### Week 3-4: Core Stability
- [ ] Implement undo/redo system
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Fix resize handles for all directions
- [ ] Add rotation handle
- [ ] Implement element duplication
- [ ] Add keyboard shortcuts

### Phase 2: Editor Enhancements (Weeks 5-8)

#### Week 5-6: Canvas Features
- [ ] Multi-select elements
- [ ] Group/ungroup elements
- [ ] Layer reordering (drag-drop in timeline)
- [ ] Canvas zoom and pan
- [ ] Rulers and guides
- [ ] Snap to grid/elements
- [ ] Alignment tools

#### Week 7-8: Element Features
- [ ] On-canvas text editing
- [ ] Rich text support (multiple styles)
- [ ] More shape types (triangle, star, polygon, line, arrow)
- [ ] SVG import
- [ ] Gradient fills
- [ ] Drop shadows
- [ ] Blur effects
- [ ] Borders with radius per corner

### Phase 3: Animation System (Weeks 9-12)

#### Week 9-10: Timeline Improvements
- [ ] Keyframe editor UI
- [ ] Drag keyframes on timeline
- [ ] Trim element duration handles
- [ ] Animation curves editor (bezier)
- [ ] Animation preview thumbnails

#### Week 11-12: Advanced Animations
- [ ] Spring physics animations
- [ ] Path animations (follow SVG path)
- [ ] Color transitions
- [ ] Gradient animations
- [ ] Text character animations
- [ ] Stagger/sequence builder
- [ ] Animation templates library

### Phase 4: Media Integration (Weeks 13-16)

#### Week 13-14: Image Handling
- [ ] Image upload with optimization
- [ ] Unsplash integration
- [ ] Pexels integration
- [ ] Pixabay integration
- [ ] Image cropping tool
- [ ] Image filters (brightness, contrast, saturation)
- [ ] Background removal

#### Week 15-16: AI Image Generation
- [ ] Nano Banana API integration
- [ ] Text-to-image generation
- [ ] Image variations
- [ ] Inpainting/outpainting
- [ ] Style transfer
- [ ] AI image upscaling

### Phase 5: Export Pipeline (Weeks 17-20)

#### Week 17-18: Backend Setup
- [ ] Node.js backend server
- [ ] FFmpeg integration for video
- [ ] Sharp integration for images
- [ ] Queue system for exports
- [ ] Progress tracking

#### Week 19-20: Export Features
- [ ] PNG/JPG export (static frame)
- [ ] GIF export (animated)
- [ ] MP4 export (video)
- [ ] WebM export
- [ ] Quality/compression options
- [ ] Batch export (all sizes)

### Phase 6: Collaboration & Cloud (Weeks 21-24)

#### Week 21-22: User System
- [ ] Authentication (email, Google, Apple)
- [ ] User profiles
- [ ] Cloud project storage
- [ ] Auto-save
- [ ] Version history

#### Week 23-24: Collaboration
- [ ] Share project links
- [ ] Real-time collaboration (Y.js or similar)
- [ ] Comments on canvas
- [ ] Team workspaces
- [ ] Permission levels

### Phase 7: Templates & AI (Weeks 25-28)

#### Week 25-26: Template System
- [ ] Template library
- [ ] Category organization
- [ ] Template preview
- [ ] One-click apply
- [ ] Custom template creation
- [ ] Template marketplace

#### Week 27-28: Advanced AI
- [ ] Multi-turn conversation memory
- [ ] AI design suggestions
- [ ] Auto-layout generation
- [ ] A/B variant generation
- [ ] Brand consistency checking
- [ ] Copy generation
- [ ] Hashtag suggestions

### Phase 8: Mobile & Polish (Weeks 29-32)

#### Week 29-30: Mobile Support
- [ ] Responsive design
- [ ] Touch interactions
- [ ] Mobile-optimized timeline
- [ ] PWA support
- [ ] Offline capability

#### Week 31-32: Polish
- [ ] Onboarding flow
- [ ] Tutorials/tooltips
- [ ] Keyboard shortcuts panel
- [ ] Performance optimization
- [ ] Accessibility (ARIA, keyboard nav)
- [ ] Internationalization (i18n)

---

## Performance Considerations

### Current Bottlenecks

| Area | Issue | Impact |
|------|-------|--------|
| Animation Loop | Re-renders all elements every frame | High CPU during playback |
| State Updates | No batching or debouncing | Frequent re-renders |
| Canvas Scale | Recalculated on every render | Unnecessary computation |
| AI Responses | Blocking during API calls | UI unresponsive |

### Optimization Strategies

#### Rendering
- Implement React.memo on CanvasElement
- Use useMemo for expensive calculations
- Consider canvas-based rendering for playback
- Implement virtual scrolling for timeline tracks

#### State
- Add Redux or Zustand for complex state
- Implement action batching
- Debounce input handlers
- Use optimistic updates

#### Animation
- Pre-calculate animation values
- Use Web Workers for computation
- Consider GSAP for complex animations
- Implement frame skipping under load

#### Memory
- Lazy load images
- Implement image caching
- Clean up unused resources
- Monitor memory usage

---

## Testing Requirements

### Unit Tests

| Component | Tests Needed |
|-----------|--------------|
| projectReducer | All action types, edge cases |
| Animation Engine | All easings, interpolation, edge cases |
| getAnimatedValues | Various element/time combinations |
| AI Parser | Valid JSON, invalid JSON, edge cases |
| Color Utils | Hex conversion, manipulation |
| Time Utils | Formatting, parsing |

### Integration Tests

| Flow | Tests Needed |
|------|--------------|
| Create Project | Select preset → Initialize → Open editor |
| Add Element | Click button → Element appears → Can select |
| Edit Element | Select → Modify property → Updates |
| AI Chat | Send message → Receive response → Apply changes |
| Timeline | Play → Animations run → Stop |
| Save/Load | Save → Refresh → Load → Data intact |

### E2E Tests

| Scenario | Steps |
|----------|-------|
| Full Workflow | Create brand → Create project → Add elements → Animate → Export |
| AI Design | New project → Ask AI to create design → Review → Modify |
| Complex Animation | Multiple elements → Staggered animations → Preview |

---

## Deployment Considerations

### Frontend Deployment

| Platform | Considerations |
|----------|----------------|
| Vercel | Easy React deployment, serverless functions |
| Netlify | Similar to Vercel, good for static |
| AWS Amplify | Full AWS integration |
| Cloudflare Pages | Edge deployment, fast globally |

### Backend Requirements (for export)

| Service | Purpose |
|---------|---------|
| AWS Lambda / Vercel Functions | Serverless API endpoints |
| AWS S3 | Media storage |
| Redis | Job queue (BullMQ) |
| AWS MediaConvert / FFmpeg | Video processing |
| CloudFront / Cloudflare | CDN for assets |

### Environment Variables

```env
# API Keys
ANTHROPIC_API_KEY=sk-ant-...
UNSPLASH_ACCESS_KEY=...
PEXELS_API_KEY=...
NANO_BANANA_API_KEY=...

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...

# Database
DATABASE_URL=...

# Auth
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## API Integrations Needed

### Media APIs

| API | Purpose | Priority |
|-----|---------|----------|
| Unsplash | Free stock photos | High |
| Pexels | Free stock photos/videos | High |
| Pixabay | Free media library | Medium |
| Nano Banana | AI image generation | High |
| Remove.bg | Background removal | Medium |
| Cloudinary | Image processing | Low |

### AI APIs

| API | Purpose | Priority |
|-----|---------|----------|
| Claude (current) | Design generation | ✅ Implemented |
| Claude Vision | Canvas analysis | High |
| OpenAI | Alternative AI provider | Low |
| Replicate | Additional AI models | Low |

### Export APIs

| API | Purpose | Priority |
|-----|---------|----------|
| FFmpeg (self-hosted) | Video rendering | High |
| Creatomate | Cloud video API | Medium |
| Shotstack | Cloud video API | Medium |

### Storage APIs

| API | Purpose | Priority |
|-----|---------|----------|
| AWS S3 | File storage | High |
| Cloudflare R2 | Alternative storage | Medium |
| Firebase Storage | Quick setup option | Low |

---

## Appendix

### Canvas Preset Reference

| Platform | Preset Key | Width | Height | Aspect Ratio |
|----------|------------|-------|--------|--------------|
| Instagram Story | ig-story | 1080 | 1920 | 9:16 |
| Instagram Post | ig-post | 1080 | 1080 | 1:1 |
| Instagram Reel | ig-reel | 1080 | 1920 | 9:16 |
| Facebook Post | fb-post | 1200 | 630 | ~1.9:1 |
| TikTok | tiktok | 1080 | 1920 | 9:16 |
| YouTube Thumbnail | youtube-thumb | 1280 | 720 | 16:9 |
| Twitter/X Post | twitter | 1600 | 900 | 16:9 |
| LinkedIn Post | linkedin | 1200 | 627 | ~1.9:1 |

### Keyboard Shortcuts (Planned)

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Cmd/Ctrl + C` | Copy element |
| `Cmd/Ctrl + V` | Paste element |
| `Cmd/Ctrl + D` | Duplicate element |
| `Delete / Backspace` | Delete selected |
| `Cmd/Ctrl + G` | Group selected |
| `Cmd/Ctrl + Shift + G` | Ungroup |
| `Space` | Play/Pause |
| `Arrow keys` | Nudge element |
| `Shift + Arrow` | Nudge 10px |
| `[ / ]` | Send back/forward |
| `Cmd/Ctrl + [ / ]` | Send to back/front |
| `Cmd/Ctrl + A` | Select all |
| `Escape` | Deselect |
| `Cmd/Ctrl + +/-` | Zoom in/out |
| `Cmd/Ctrl + 0` | Zoom to fit |
| `Cmd/Ctrl + S` | Save |
| `Cmd/Ctrl + E` | Export |

### Color Utilities (Planned)

```javascript
// Hex to RGB
hexToRgb('#00D4FF') // { r: 0, g: 212, b: 255 }

// RGB to Hex
rgbToHex(0, 212, 255) // '#00D4FF'

// Lighten/Darken
lighten('#00D4FF', 20) // '#33DDFF'
darken('#00D4FF', 20)  // '#00A8CC'

// Generate palette
generatePalette('#00D4FF') // [complementary, triadic, etc.]

// Check contrast
getContrast('#000000', '#FFFFFF') // 21 (WCAG AAA)
```

### Animation Easing Curves

```
linear:           ████████████████████
power1.out:       ████████████████░░░░
power2.out:       ██████████████░░░░░░
power3.out:       ████████████░░░░░░░░
power2.in:        ░░░░░░██████████████
power3.in:        ░░░░░░░░████████████
power2.inOut:     ░░░░████████████░░░░
back.out:         ███████████████▓░░░░ (overshoot)
elastic.out:      ██████████▓▒░▓████░░ (bounce)
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-01-09 | Initial prototype with basic canvas |
| 0.2.0 | 2026-01-09 | Fixed timeline layout and element rendering |
| 0.3.0 | 2026-01-09 | Added custom animation engine |

---

## Contributors

- Development: Claude (AI Assistant)
- Product Direction: Alfonso (Creative Director, ROI Amplified)

---

## License

Proprietary - All rights reserved.

---

*This documentation will be updated as the project evolves.*
