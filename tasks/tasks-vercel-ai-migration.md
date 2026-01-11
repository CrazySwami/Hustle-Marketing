# Task List: Vercel AI SDK Migration

Based on: `AI-INTEGRATION-ANALYSIS.md`

## Relevant Files

### New Files to Create
- `src/services/ai/provider.ts` - Multi-model provider abstraction
- `src/services/ai/schemas/brand-suggestions.ts` - Zod schema for brand generator
- `src/services/ai/schemas/design-operations.ts` - Zod schema for design agent
- `src/services/ai/design-agent.ts` - Design agent service
- `src/services/ai/fallback.ts` - Fallback chain logic
- `src/services/ai/router.ts` - Cost-based model routing
- `src/components/ai/ModelSelector.jsx` - Model selection UI component
- `src/hooks/useAI.ts` - Custom hook for AI operations

### Files to Modify
- `src/components/BrandGuideGenerator.jsx` - Migrate to Vercel AI SDK
- `src/components/AIChatPanel.jsx` - Migrate to Vercel AI SDK + streaming
- `package.json` - Add dependencies
- `.env.example` - Add API key placeholders
- `vite.config.js` - Environment variable handling

## Notes

- This is a Vite + React project (client-side), not Next.js
- AI calls will be made directly from the client for simplicity
- API keys will need to be handled securely (consider backend proxy later)
- Using TypeScript for new AI services, JSX for React components

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, check it off by changing `- [ ]` to `- [x]`.

Update after completing each sub-task, not just parent tasks.

---

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout branch: `git checkout -b feature/vercel-ai-migration`

- [x] 1.0 Install Dependencies & Setup
  - [x] 1.1 Install Vercel AI SDK core: `npm install ai`
  - [x] 1.2 Install provider packages: `npm install @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google`
  - [x] 1.3 Install Zod for schema validation: `npm install zod`
  - [x] 1.4 Install React hooks package: `npm install @ai-sdk/react`
  - [x] 1.5 Update `.env.example` with all required API keys
  - [x] 1.6 Update `vite.config.js` to expose environment variables to client

- [x] 2.0 Create Provider Abstraction Layer
  - [x] 2.1 Create `src/services/ai/` directory structure
  - [x] 2.2 Create `provider.js` with model configurations for OpenAI, Anthropic, Google
  - [x] 2.3 Create `getModel()` function for selecting models by provider and tier
  - [x] 2.4 Export provider info and helper functions

- [x] 3.0 Create Zod Schemas for Structured Outputs
  - [x] 3.1 Create `schemas/brand-suggestions.js` with BrandSuggestionSchema
  - [x] 3.2 Create `schemas/design-operations.js` with:
    - AnimationSchema
    - BaseElementSchema
    - TextElementSchema, ShapeElementSchema, ImageElementSchema
    - ElementSchema (discriminated union)
    - AddOperation, UpdateOperation, DeleteOperation schemas
    - DesignOperationsSchema
  - [x] 3.3 Export schemas from index.js

- [x] 4.0 Migrate Brand Guide Generator
  - [x] 4.1 Create brand generation service function using `generateObject`
  - [x] 4.2 Update `BrandGuideGenerator.jsx` to use new service
  - [x] 4.3 Remove manual JSON parsing logic
  - [x] 4.4 Add error handling for API failures
  - [x] 4.5 Add provider selection UI

- [x] 5.0 Create Design Agent Service
  - [x] 5.1 Create `design-agent.js` with `executeDesignPrompt` function
  - [x] 5.2 Build system prompt generator with canvas context
  - [x] 5.3 Use `generateObject` with DesignOperationsSchema
  - [x] 5.4 Add operation execution logic

- [x] 6.0 Migrate AI Chat Panel
  - [x] 6.1 Update `AIChatPanel.jsx` to use design agent service
  - [x] 6.2 Replace fetch calls with Vercel AI SDK
  - [x] 6.3 Connect operations to dispatch for state updates
  - [x] 6.4 Add loading states and error handling
  - [x] 6.5 Add clear chat functionality

- [x] 7.0 Add Model Selection UI
  - [x] 7.1 Create `ModelSelector.jsx` component
  - [x] 7.2 Add provider icons and descriptions
  - [x] 7.3 Integrate into AIChatPanel and BrandGuideGenerator
  - [x] 7.4 Persist model selection in localStorage
  - [x] 7.5 Style to match existing UI

- [x] 8.0 Implement Fallback Chain
  - [x] 8.1 Create `fallback.js` with `generateObjectWithFallback` function
  - [x] 8.2 Define fallback order: Claude → GPT-4 → Gemini
  - [x] 8.3 Add retry logic with exponential backoff
  - [x] 8.4 Log failures for debugging

- [ ] 9.0 Add Cost-Based Routing (Optional)
  - [ ] 9.1 Create `router.ts` with task analysis logic
  - [ ] 9.2 Route simple tasks to cheaper models (GPT-4o-mini, Gemini Flash)
  - [ ] 9.3 Route creative tasks to Claude
  - [ ] 9.4 Add configuration for routing preferences

- [ ] 10.0 Testing & Documentation
  - [ ] 10.1 Test all providers manually
  - [ ] 10.2 Test fallback scenarios
  - [ ] 10.3 Update CLAUDE.md with new architecture
  - [ ] 10.4 Update README with setup instructions
  - [ ] 10.5 Commit all changes with descriptive message

- [ ] 11.0 Final Cleanup & Push
  - [ ] 11.1 Remove old direct API call code
  - [ ] 11.2 Run linter and fix issues
  - [ ] 11.3 Test full application flow
  - [ ] 11.4 Merge to main branch
  - [ ] 11.5 Push to GitHub
