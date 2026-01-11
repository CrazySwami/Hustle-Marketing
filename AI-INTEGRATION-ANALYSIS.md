# Social Canvas AI - AI Integration Analysis

## Current Implementation vs Vercel AI SDK

**Date:** January 11, 2026  
**Purpose:** Evaluate migration from direct Claude API to Vercel AI SDK for multi-model support

---

## Executive Summary

**Current State:** The Social Canvas AI prototype uses direct `fetch()` calls to the Anthropic API (`api.anthropic.com/v1/messages`). This is Claude-specific and requires manual handling of responses, errors, and streaming.

**Recommendation:** Migrate to Vercel AI SDK for:
- Multi-model support (OpenAI, Claude, Gemini, Mistral, etc.)
- Built-in streaming, error handling, and retry logic
- Type-safe structured outputs
- React hooks for UI integration
- Model fallback chains

**Migration Effort:** Low-Medium (2-3 days for core functionality)

---

## Current Implementation Analysis

### Usage Points

The prototype calls the Claude API in **two places**:

#### 1. Brand Guide Generator (Line ~322)
```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `Based on this brand name: "${brand.name}", suggest:
        1. A brand personality (2-3 adjectives)
        2. A tone of voice (1 sentence)
        3. A primary color (hex code)...
        Respond in JSON format only: { "personality": "...", ... }`
    }],
  })
});

const data = await response.json();
const text = data.content.map(c => c.text || '').join('');
const jsonMatch = text.match(/\{[\s\S]*\}/);
const suggestions = JSON.parse(jsonMatch[0]);
```

**Issues:**
- Manual JSON parsing from text response
- No schema validation
- No error handling for malformed JSON
- No streaming

#### 2. AI Chat Panel / Design Agent (Line ~1151)
```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })
});

const data = await response.json();
const assistantMessage = data.content?.map(c => c.text || '').join('') || '';

// Manual JSON extraction from markdown code blocks
const jsonMatch = assistantMessage.match(/```json\s*([\s\S]*?)\s*```/);
if (jsonMatch) {
  const { operations } = JSON.parse(jsonMatch[1]);
  // Execute operations...
}
```

**Issues:**
- Manual response parsing
- Regex-based JSON extraction (fragile)
- No streaming (UI waits for full response)
- No retry logic
- No multi-turn conversation context
- No type safety

---

## Vercel AI SDK Solution

### Why Vercel AI SDK?

| Feature | Current (Direct API) | Vercel AI SDK |
|---------|---------------------|---------------|
| Multi-model | ❌ Claude only | ✅ OpenAI, Claude, Gemini, Mistral, etc. |
| Streaming | ❌ Manual implementation | ✅ Built-in `streamText` |
| Structured Output | ❌ Manual JSON parsing | ✅ Schema validation with Zod |
| Error Handling | ❌ Manual | ✅ Typed errors + retry logic |
| React Hooks | ❌ None | ✅ `useChat`, `useCompletion` |
| Type Safety | ❌ None | ✅ Full TypeScript support |
| Model Fallback | ❌ None | ✅ Built-in fallback chains |
| Tool Calling | ❌ Manual | ✅ Native tool support |

### Provider Abstraction

The Vercel AI SDK provides a unified interface - switch models with one line:

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

// Same code, different models
const result = await generateText({
  model: openai('gpt-4o'),           // OpenAI
  // model: anthropic('claude-sonnet-4-20250514'), // Claude
  // model: google('gemini-1.5-pro'),    // Gemini
  prompt: 'Generate brand suggestions...',
});
```

### Built-in Structured Outputs

Instead of manual JSON parsing, use schema validation:

```typescript
import { generateText, Output } from 'ai';
import { z } from 'zod';

const BrandSuggestionSchema = z.object({
  personality: z.string().describe('2-3 adjectives describing the brand'),
  tone: z.string().describe('One sentence describing tone of voice'),
  colors: z.object({
    primary: z.string().describe('Hex color code'),
    secondary: z.string().describe('Hex color code'),
    accent: z.string().describe('Hex color code'),
  }),
});

const result = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: `Based on brand name "${brandName}", suggest personality, tone, and colors.`,
  output: Output.object({ schema: BrandSuggestionSchema }),
});

// result.object is typed and validated!
const { personality, tone, colors } = result.object;
```

### Streaming with React Hooks

For the AI chat panel, use `useChat` for automatic streaming:

```typescript
// Client component
import { useChat } from '@ai-sdk/react';

function AIChatPanel() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      // Parse and execute operations from message
    },
  });

  return (
    <div>
      {messages.map(m => <ChatMessage key={m.id} {...m} />)}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```

```typescript
// API route: app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: designAgentSystemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
```

---

## Migration Plan

### Phase 1: Setup (Day 1)

#### Install Dependencies
```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google zod
```

#### Environment Variables
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

#### Create AI Service Abstraction
```typescript
// src/services/ai/provider.ts
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

export type ModelProvider = 'openai' | 'anthropic' | 'google';

export const models = {
  openai: {
    fast: openai('gpt-4o-mini'),
    smart: openai('gpt-4o'),
    reasoning: openai('o1'),
  },
  anthropic: {
    fast: anthropic('claude-3-5-haiku-20241022'),
    smart: anthropic('claude-sonnet-4-20250514'),
    reasoning: anthropic('claude-opus-4-20250514'),
  },
  google: {
    fast: google('gemini-1.5-flash'),
    smart: google('gemini-1.5-pro'),
    reasoning: google('gemini-2.0-flash-thinking-exp'),
  },
};

export function getModel(provider: ModelProvider, tier: 'fast' | 'smart' | 'reasoning' = 'smart') {
  return models[provider][tier];
}
```

### Phase 2: Brand Generator Migration (Day 1)

#### Before (Current)
```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  })
});
const data = await response.json();
const text = data.content.map(c => c.text || '').join('');
const jsonMatch = text.match(/\{[\s\S]*\}/);
const suggestions = JSON.parse(jsonMatch[0]);
```

#### After (Vercel AI SDK)
```typescript
import { generateText, Output } from 'ai';
import { getModel } from '@/services/ai/provider';
import { z } from 'zod';

const BrandSuggestionSchema = z.object({
  personality: z.string(),
  tone: z.string(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),
});

async function generateBrandSuggestions(brandName: string, provider: ModelProvider = 'anthropic') {
  const result = await generateText({
    model: getModel(provider, 'smart'),
    prompt: `Based on this brand name: "${brandName}", suggest personality, tone, and colors.`,
    output: Output.object({ schema: BrandSuggestionSchema }),
  });
  
  return result.object; // Typed & validated!
}
```

### Phase 3: Design Agent Migration (Day 2)

#### Schema Definitions
```typescript
// src/services/ai/schemas/design-operations.ts
import { z } from 'zod';

const AnimationSchema = z.object({
  property: z.enum(['opacity', 'scale', 'x', 'y', 'rotation']),
  from: z.number(),
  to: z.number(),
  duration: z.number().default(500),
  startTime: z.number().default(0),
  ease: z.string().default('power2.out'),
});

const BaseElementSchema = z.object({
  name: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number().default(0),
  opacity: z.number().default(1),
  animations: z.array(AnimationSchema).default([]),
});

const TextElementSchema = BaseElementSchema.extend({
  type: z.literal('text'),
  content: z.string(),
  fontSize: z.number(),
  fontFamily: z.string(),
  fontWeight: z.number(),
  color: z.string(),
  textAlign: z.enum(['left', 'center', 'right']),
});

const ShapeElementSchema = BaseElementSchema.extend({
  type: z.literal('shape'),
  shapeType: z.enum(['rectangle', 'circle']),
  fill: z.string(),
  borderRadius: z.number().default(0),
});

const ImageElementSchema = BaseElementSchema.extend({
  type: z.literal('image'),
  src: z.string(),
  objectFit: z.enum(['cover', 'contain', 'fill']).default('cover'),
});

const ElementSchema = z.discriminatedUnion('type', [
  TextElementSchema,
  ShapeElementSchema,
  ImageElementSchema,
]);

const AddOperationSchema = z.object({
  type: z.literal('addElement'),
  element: ElementSchema,
});

const UpdateOperationSchema = z.object({
  type: z.literal('updateElement'),
  id: z.string(),
  updates: z.record(z.any()),
});

const DeleteOperationSchema = z.object({
  type: z.literal('deleteElement'),
  id: z.string(),
});

export const DesignOperationsSchema = z.object({
  operations: z.array(z.discriminatedUnion('type', [
    AddOperationSchema,
    UpdateOperationSchema,
    DeleteOperationSchema,
  ])),
  message: z.string().optional(),
});

export type DesignOperations = z.infer<typeof DesignOperationsSchema>;
```

#### Design Agent Service
```typescript
// src/services/ai/design-agent.ts
import { generateText, Output } from 'ai';
import { getModel, ModelProvider } from './provider';
import { DesignOperationsSchema } from './schemas/design-operations';

interface DesignContext {
  canvasWidth: number;
  canvasHeight: number;
  duration: number;
  elements: any[];
  selectedElement?: any;
  brand: {
    colors: Record<string, string>;
    fonts: { heading: string; body: string };
  };
}

export async function executeDesignPrompt(
  userMessage: string,
  context: DesignContext,
  provider: ModelProvider = 'anthropic'
) {
  const systemPrompt = buildDesignSystemPrompt(context);
  
  const result = await generateText({
    model: getModel(provider, 'smart'),
    system: systemPrompt,
    prompt: userMessage,
    output: Output.object({ 
      schema: DesignOperationsSchema,
      name: 'design_operations',
      description: 'Operations to modify the canvas design',
    }),
  });
  
  return result.object;
}

function buildDesignSystemPrompt(context: DesignContext): string {
  return `You are a creative AI assistant helping design social media content.

CANVAS: ${context.canvasWidth}x${context.canvasHeight} pixels
DURATION: ${context.duration}ms
ELEMENTS: ${context.elements.length} elements
${context.selectedElement ? `SELECTED: ${context.selectedElement.name}` : ''}

BRAND COLORS:
${Object.entries(context.brand.colors).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

FONTS:
- Heading: ${context.brand.fonts.heading}
- Body: ${context.brand.fonts.body}

Generate operations to fulfill the user's design request.
Always include at least one animation for visual interest.
Center elements by default: x = (canvasWidth - elementWidth) / 2`;
}
```

### Phase 4: Model Selection UI (Day 2-3)

#### Model Selector Component
```typescript
// src/components/ai/ModelSelector.tsx
import { useState } from 'react';
import { ModelProvider } from '@/services/ai/provider';

interface ModelSelectorProps {
  value: ModelProvider;
  onChange: (provider: ModelProvider) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const providers = [
    { id: 'anthropic', name: 'Claude', icon: '🟣', description: 'Best for creative tasks' },
    { id: 'openai', name: 'GPT-4', icon: '🟢', description: 'Best for general tasks' },
    { id: 'google', name: 'Gemini', icon: '🔵', description: 'Best for multimodal' },
  ];

  return (
    <div className="model-selector">
      <label>AI Model</label>
      <div className="model-options">
        {providers.map(p => (
          <button
            key={p.id}
            className={value === p.id ? 'active' : ''}
            onClick={() => onChange(p.id as ModelProvider)}
          >
            <span className="icon">{p.icon}</span>
            <span className="name">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### Updated AI Chat Panel
```typescript
// src/components/ai/AIChatPanel.tsx
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { ModelSelector } from './ModelSelector';
import { ModelProvider } from '@/services/ai/provider';

export function AIChatPanel({ project, dispatch }) {
  const [provider, setProvider] = useState<ModelProvider>('anthropic');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/design-chat',
    body: {
      provider,
      context: {
        canvasWidth: project.canvas.width,
        canvasHeight: project.canvas.height,
        duration: project.duration,
        elements: project.elements,
        brand: project.brandGuide,
      },
    },
    onFinish: (message) => {
      // Parse operations from the structured response
      try {
        const data = JSON.parse(message.content);
        if (data.operations) {
          data.operations.forEach(op => {
            dispatch({ type: op.type.toUpperCase(), ...op });
          });
        }
      } catch (e) {
        // Regular text message, no operations
      }
    },
  });

  return (
    <div className="ai-chat-panel">
      <ModelSelector value={provider} onChange={setProvider} />
      
      <div className="chat-messages">
        {messages.map(m => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me to create something..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
```

### Phase 5: Model Fallback & Cost Optimization (Day 3)

#### Automatic Fallback Chain
```typescript
// src/services/ai/fallback.ts
import { generateText } from 'ai';
import { models } from './provider';

export async function generateWithFallback(options: any) {
  const fallbackChain = [
    models.anthropic.smart,  // Try Claude first
    models.openai.smart,     // Fall back to GPT-4
    models.google.smart,     // Fall back to Gemini
  ];

  for (const model of fallbackChain) {
    try {
      return await generateText({ ...options, model });
    } catch (error) {
      console.warn(`Model failed, trying next:`, error);
      continue;
    }
  }
  
  throw new Error('All models failed');
}
```

#### Cost-Based Routing
```typescript
// src/services/ai/router.ts
import { models, ModelProvider } from './provider';

interface TaskAnalysis {
  complexity: 'low' | 'medium' | 'high';
  requiresCreativity: boolean;
  requiresReasoning: boolean;
}

export function selectOptimalModel(task: TaskAnalysis) {
  // Simple tasks → fast/cheap model
  if (task.complexity === 'low' && !task.requiresCreativity) {
    return models.openai.fast; // gpt-4o-mini is cheapest
  }
  
  // Creative tasks → Claude
  if (task.requiresCreativity) {
    return models.anthropic.smart;
  }
  
  // Reasoning tasks → thinking models
  if (task.requiresReasoning) {
    return models.google.reasoning; // Gemini thinking
  }
  
  // Default to Claude for design work
  return models.anthropic.smart;
}
```

---

## Feature Comparison: What Each Model Does Best

| Task | Best Model | Why |
|------|------------|-----|
| Brand Personality | Claude | Creative, nuanced language |
| Color Suggestions | Any | Simple structured output |
| Layout Design | Claude | Understanding design principles |
| Animation Timing | GPT-4 | Good at numerical reasoning |
| Copy Writing | Claude | Natural, engaging text |
| Image Generation | Gemini 2.0 | Native image output |
| Code Generation | Claude | Best code quality |
| Multi-modal (w/ images) | Gemini | Best vision capabilities |

---

## API Route Structure (Next.js)

```
app/
├── api/
│   ├── ai/
│   │   ├── brand-suggestions/
│   │   │   └── route.ts       # Brand generator
│   │   ├── design-chat/
│   │   │   └── route.ts       # Design agent (streaming)
│   │   └── analyze-image/
│   │       └── route.ts       # Image analysis (future)
```

---

## Environment Configuration

```env
# Required for multi-model support
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Optional: Default provider
DEFAULT_AI_PROVIDER=anthropic

# Optional: Enable/disable specific providers
ENABLE_OPENAI=true
ENABLE_ANTHROPIC=true
ENABLE_GOOGLE=true
```

---

## Cost Comparison (Per 1M Tokens)

| Provider | Model | Input | Output |
|----------|-------|-------|--------|
| Anthropic | Claude Sonnet 4 | $3 | $15 |
| Anthropic | Claude Haiku 3.5 | $0.80 | $4 |
| OpenAI | GPT-4o | $2.50 | $10 |
| OpenAI | GPT-4o-mini | $0.15 | $0.60 |
| Google | Gemini 1.5 Pro | $1.25 | $5 |
| Google | Gemini 1.5 Flash | $0.075 | $0.30 |

**Recommendation:** Use GPT-4o-mini or Gemini Flash for simple structured outputs (brand colors), Claude Sonnet for creative design work.

---

## Migration Checklist

### Day 1
- [ ] Install Vercel AI SDK packages
- [ ] Set up environment variables
- [ ] Create provider abstraction
- [ ] Migrate brand generator to structured output
- [ ] Test with all three providers

### Day 2
- [ ] Define Zod schemas for design operations
- [ ] Create design agent service
- [ ] Set up streaming API route
- [ ] Migrate AI chat panel to useChat hook
- [ ] Add model selector UI

### Day 3
- [ ] Implement fallback chain
- [ ] Add cost-based routing
- [ ] Test edge cases and error handling
- [ ] Update documentation
- [ ] Performance testing

---

## Conclusion

**Is it Claude-specific?** No! The current implementation only uses standard HTTP requests with JSON. The prompt engineering and response parsing work with any model.

**How easy to migrate?** Very easy. The Vercel AI SDK provides:
1. **Drop-in replacement** for API calls
2. **Better structured outputs** via Zod schemas
3. **Built-in streaming** via hooks
4. **Model switching** with one line change

**Recommended approach:**
1. Start with Vercel AI SDK for new features
2. Migrate existing API calls incrementally
3. Add model selector for user choice
4. Implement smart routing for cost optimization

The abstraction layer means you can experiment with different models per task and let users choose their preferred provider.
