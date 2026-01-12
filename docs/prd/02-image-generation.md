# Image Generation Feature PRD

## Document Info
- **Feature:** AI Image Generation
- **Priority:** P0 (Critical Path)
- **Version:** 1.0
- **Status:** Planning
- **Target Release:** v0.4

---

## 1. Overview

### 1.1 Feature Summary
Integrate AI image generation capabilities into Social Canvas AI, enabling users to create custom visuals, edit existing images, and generate brand-consistent graphics directly within the canvas editor.

### 1.2 Problem Statement
Users currently must leave Social Canvas AI to generate images in external tools (Midjourney, DALL-E web), then import them—breaking workflow and losing brand context. This friction reduces productivity and leads to off-brand visuals.

### 1.3 Solution
Native image generation powered by multiple AI providers (GPT Image, DALL-E 3, Gemini), with brand-aware prompting that automatically incorporates brand colors, style, and guidelines into generated images.

### 1.4 Success Metrics
| Metric | Target |
|--------|--------|
| Image generation adoption | 60% of active users |
| Images generated per user/week | 5+ |
| Brand-style match rating | 4.2/5 user satisfaction |
| Workflow completion (gen → export) | 70% |

---

## 2. User Stories

### 2.1 Primary User Stories

#### US-1: Generate Image from Prompt
> **As a** marketing manager
> **I want to** generate an image by describing what I need
> **So that** I can create custom visuals without design skills

**Acceptance Criteria:**
- [ ] User can enter a text prompt describing desired image
- [ ] System generates image within 30 seconds
- [ ] Generated image appears on canvas, ready to use
- [ ] User can regenerate with same prompt for variations
- [ ] Cost is displayed before generation

#### US-2: Brand-Aware Generation
> **As a** brand manager
> **I want** generated images to automatically match my brand style
> **So that** all content is consistent without manual editing

**Acceptance Criteria:**
- [ ] System automatically injects brand colors into prompt
- [ ] Generated images reflect brand's visual style
- [ ] User can toggle brand-matching on/off
- [ ] Brand guide colors appear in generated images

#### US-3: Edit Existing Images
> **As a** content creator
> **I want to** modify parts of an existing image
> **So that** I can customize stock photos or fix generated images

**Acceptance Criteria:**
- [ ] User can select region of image to edit
- [ ] User describes what should change in selection
- [ ] AI regenerates only selected area
- [ ] Original image outside selection is preserved

#### US-4: Remove Background
> **As a** social media manager
> **I want to** remove backgrounds from product photos
> **So that** I can place products on branded backgrounds

**Acceptance Criteria:**
- [ ] One-click background removal
- [ ] Clean edges around subject
- [ ] Works on uploaded images and generated images
- [ ] Transparent PNG output option

#### US-5: Generate Variations
> **As a** a creative director
> **I want to** generate multiple variations of an image concept
> **So that** I can pick the best option for my campaign

**Acceptance Criteria:**
- [ ] Generate 4 variations from single prompt
- [ ] View variations in grid layout
- [ ] Select preferred variation(s) to add to canvas
- [ ] Iterate on selected variation

### 2.2 Secondary User Stories

#### US-6: Image-to-Image Generation
> **As a** designer
> **I want to** use a reference image to guide generation
> **So that** I can maintain visual consistency

#### US-7: Upscale Image
> **As a** marketer
> **I want to** upscale low-resolution images
> **So that** I can use older assets in high-quality posts

#### US-8: Style Transfer
> **As a** brand owner
> **I want to** apply my brand's visual style to any image
> **So that** all content feels cohesive

---

## 3. Functional Requirements

### 3.1 Generation Capabilities

#### 3.1.1 Text-to-Image
| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-IMG-001 | Generate images from natural language prompts | P0 |
| REQ-IMG-002 | Support multiple aspect ratios (1:1, 4:5, 16:9, 9:16) | P0 |
| REQ-IMG-003 | Generate at export-quality resolution (min 1024px) | P0 |
| REQ-IMG-004 | Show generation progress indicator | P0 |
| REQ-IMG-005 | Display cost estimate before generation | P0 |

#### 3.1.2 Image Editing
| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-IMG-010 | Inpainting (edit selected regions) | P1 |
| REQ-IMG-011 | Outpainting (extend image canvas) | P2 |
| REQ-IMG-012 | Background removal | P0 |
| REQ-IMG-013 | Object removal | P1 |

#### 3.1.3 Brand Integration
| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-IMG-020 | Auto-inject brand colors into prompts | P0 |
| REQ-IMG-021 | Brand style presets (minimal, bold, playful, etc.) | P1 |
| REQ-IMG-022 | Brand color palette enforcement | P1 |
| REQ-IMG-023 | Brand imagery library reference | P2 |

### 3.2 Provider Support

| Provider | Model | Capabilities | Cost (per image) |
|----------|-------|--------------|------------------|
| **OpenAI** | GPT Image (gpt-image-1) | Generate, edit, inpaint, text rendering | $0.01-0.17 |
| **OpenAI** | DALL-E 3 | Generate only, high quality | $0.04-0.12 |
| **Google** | Gemini 3 Pro Image | Generate, edit, diagrams | TBD |

### 3.3 UI Components

#### 3.3.1 Image Generation Panel
```
┌─────────────────────────────────────────────┐
│  Generate Image                    [×]      │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Describe your image...              │   │
│  │                                     │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Style:  [Realistic ▼]   Size: [1:1 ▼]     │
│                                             │
│  ☑ Match brand style                        │
│                                             │
│  Provider: [OpenAI ▼]  Model: [GPT Image ▼]│
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Estimated cost: ~$0.04              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Generate 1 Image]  [Generate 4 Variations]│
│                                             │
└─────────────────────────────────────────────┘
```

#### 3.3.2 Generation Results View
```
┌─────────────────────────────────────────────┐
│  Generated Images                  [×]      │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐                │
│  │          │  │          │                │
│  │  Image 1 │  │  Image 2 │                │
│  │    ✓     │  │          │                │
│  └──────────┘  └──────────┘                │
│                                             │
│  ┌──────────┐  ┌──────────┐                │
│  │          │  │          │                │
│  │  Image 3 │  │  Image 4 │                │
│  │          │  │          │                │
│  └──────────┘  └──────────┘                │
│                                             │
│  [Add Selected to Canvas]  [Regenerate]     │
│                                             │
│  Cost: $0.16 (4 images)                     │
└─────────────────────────────────────────────┘
```

#### 3.3.3 Image Edit Mode
```
┌─────────────────────────────────────────────┐
│  Edit Image                        [×]      │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │      [Image with brush overlay]    │   │
│  │      ░░░░░░░░░░░░░░░░░░░░░░░      │   │
│  │      ░░░ Selected Area ░░░░░      │   │
│  │      ░░░░░░░░░░░░░░░░░░░░░░░      │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Brush: ○ ○ ● ○ ○    [Erase Selection]     │
│                                             │
│  What should appear here?                   │
│  ┌─────────────────────────────────────┐   │
│  │ A golden retriever sitting...       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Apply Edit]  Cost: ~$0.02                │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 4. Technical Design

### 4.1 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     IMAGE GENERATION                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌────────────┐ │
│  │   Prompt    │───→│   Brand     │───→│  Provider  │ │
│  │   Builder   │    │  Enhancer   │    │  Router    │ │
│  └─────────────┘    └─────────────┘    └────────────┘ │
│                                               │        │
│                                               ▼        │
│  ┌─────────────────────────────────────────────────┐  │
│  │              AI GATEWAY                          │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐        │  │
│  │  │ OpenAI  │  │ OpenAI  │  │ Google  │        │  │
│  │  │GPT Image│  │ DALL-E 3│  │Gemini 3 │        │  │
│  │  └─────────┘  └─────────┘  └─────────┘        │  │
│  └─────────────────────────────────────────────────┘  │
│                           │                            │
│                           ▼                            │
│  ┌─────────────────────────────────────────────────┐  │
│  │              IMAGE PROCESSOR                     │  │
│  │  • Format conversion  • Resize  • Compression   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.2 API Endpoints (Backend Required)

#### POST /api/images/generate
```json
{
  "prompt": "A modern office with plants and natural light",
  "provider": "openai",
  "model": "gpt-image-1",
  "size": "1024x1024",
  "quality": "standard",
  "count": 1,
  "brandGuideId": "bg_123",
  "applyBrandStyle": true
}
```

**Response:**
```json
{
  "images": [
    {
      "id": "img_abc123",
      "url": "https://...",
      "prompt": "A modern office with plants... (enhanced)",
      "size": "1024x1024",
      "provider": "openai",
      "model": "gpt-image-1"
    }
  ],
  "cost": {
    "credits": 4,
    "usd": 0.04
  },
  "usage": {
    "promptTokens": 45,
    "totalCredits": 4
  }
}
```

#### POST /api/images/edit
```json
{
  "imageId": "img_abc123",
  "mask": "base64...",
  "prompt": "Add a laptop on the desk",
  "provider": "openai",
  "model": "gpt-image-1"
}
```

#### POST /api/images/remove-background
```json
{
  "imageId": "img_abc123"
}
```

### 4.3 Brand-Aware Prompt Enhancement

```javascript
function enhancePromptWithBrand(userPrompt, brandGuide) {
  const brandContext = [];

  // Add color context
  if (brandGuide.colors) {
    const colorNames = getColorNames(brandGuide.colors);
    brandContext.push(`Color palette: ${colorNames.join(', ')}`);
  }

  // Add style context
  if (brandGuide.style) {
    brandContext.push(`Visual style: ${brandGuide.style}`);
  }

  // Add mood context
  if (brandGuide.mood) {
    brandContext.push(`Mood: ${brandGuide.mood}`);
  }

  // Construct enhanced prompt
  return `${userPrompt}. ${brandContext.join('. ')}.`;
}
```

### 4.4 Cost Management

| Model | Quality | Size | Cost | Credits |
|-------|---------|------|------|---------|
| GPT Image | Low | 1024x1024 | $0.011 | 1 |
| GPT Image | Medium | 1024x1024 | $0.042 | 4 |
| GPT Image | High | 1024x1024 | $0.167 | 17 |
| DALL-E 3 | Standard | 1024x1024 | $0.040 | 4 |
| DALL-E 3 | HD | 1024x1024 | $0.080 | 8 |
| DALL-E 3 | Standard | 1792x1024 | $0.080 | 8 |
| DALL-E 3 | HD | 1792x1024 | $0.120 | 12 |

---

## 5. User Experience

### 5.1 Generation Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Click  │───→│  Enter  │───→│  See    │───→│ Generate│
│  "Add   │    │  Prompt │    │  Cost   │    │  Image  │
│  Image" │    │         │    │  Est.   │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                                                  │
     ┌────────────────────────────────────────────┘
     ▼
┌─────────┐    ┌─────────┐    ┌─────────┐
│  View   │───→│ Select  │───→│  Add to │
│ Results │    │ Image(s)│    │  Canvas │
└─────────┘    └─────────┘    └─────────┘
```

### 5.2 Entry Points

1. **Canvas Toolbar:** "Add Image" button → Generate tab
2. **AI Chat:** "Generate an image of..." command
3. **Right-click Canvas:** Context menu → "Generate Image Here"
4. **Empty Canvas:** "Generate your first image" CTA

### 5.3 Prompt Suggestions

Provide contextual prompt suggestions based on:
- Canvas type (Instagram Story → vertical imagery)
- Brand industry (Restaurant → food photography style)
- Recent successful prompts
- Trending social media visuals

```
Suggested prompts for Instagram Story:
• "Minimalist product flat lay with soft shadows"
• "Bold typography overlay on gradient background"
• "Behind-the-scenes office moment, candid style"
```

### 5.4 Error Handling

| Error | User Message | Recovery Action |
|-------|--------------|-----------------|
| Content policy violation | "This prompt may violate content guidelines. Try rephrasing." | Edit prompt |
| Generation timeout | "Generation is taking longer than expected. Try again?" | Retry button |
| Provider unavailable | "OpenAI is temporarily unavailable. Switch to Gemini?" | Provider switch |
| Insufficient credits | "You need 4 credits. You have 2. [Buy Credits]" | Upgrade CTA |

---

## 6. Non-Functional Requirements

### 6.1 Performance
| Metric | Target |
|--------|--------|
| Generation time (standard) | < 15 seconds |
| Generation time (HD) | < 30 seconds |
| UI responsiveness during generation | No blocking |
| Image load time (after generation) | < 2 seconds |

### 6.2 Reliability
| Metric | Target |
|--------|--------|
| Generation success rate | > 95% |
| Provider failover time | < 5 seconds |
| Error recovery | Automatic retry (1x) |

### 6.3 Security
- All images processed through secure endpoints
- No image content stored permanently without user consent
- Content moderation on all prompts (provider-side)
- Rate limiting: 10 generations/minute per user

---

## 7. Implementation Plan

### 7.1 Phase 1: Foundation (Week 1-2)
- [ ] Backend API endpoints for image generation
- [ ] OpenAI GPT Image integration
- [ ] Basic prompt → image flow
- [ ] Cost tracking integration

### 7.2 Phase 2: UI/UX (Week 2-3)
- [ ] Image generation panel component
- [ ] Results grid view
- [ ] Canvas integration (drag generated image)
- [ ] Progress indicators

### 7.3 Phase 3: Brand Integration (Week 3-4)
- [ ] Prompt enhancement with brand context
- [ ] Brand color injection
- [ ] Style presets

### 7.4 Phase 4: Advanced Features (Week 4-5)
- [ ] Image editing (inpainting)
- [ ] Background removal
- [ ] Variation generation
- [ ] DALL-E 3 support

### 7.5 Phase 5: Polish & Launch (Week 5-6)
- [ ] Error handling refinement
- [ ] Performance optimization
- [ ] User testing & iteration
- [ ] Documentation

---

## 8. Open Questions

1. **Prompt Library:** Should we provide a library of proven prompts?
2. **Image History:** How long to keep generated images? User's account or 24h?
3. **Negative Prompts:** Support "don't include X" syntax?
4. **Batch Generation:** Allow scheduling batch image generation?
5. **Quality Default:** Standard or HD as default (cost vs quality)?

---

## 9. Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Backend API infrastructure | Engineering | Required |
| Vercel AI Gateway image support | Vercel | Available |
| Cost tracking system | Engineering | ✅ Complete |
| Brand guide system | Product | ✅ Complete |

---

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Image gen costs too high for users | Medium | High | Quality tiers, cost warnings |
| Content moderation false positives | Medium | Medium | Appeal process, alternative prompts |
| Slow generation frustrates users | Medium | Medium | Progress UI, async notifications |
| Brand matching is poor quality | Medium | High | User feedback loop, manual overrides |

---

## Appendix: Competitive Analysis

| Feature | Social Canvas AI | Canva | Adobe Express |
|---------|-----------------|-------|---------------|
| Text-to-image | ✅ Multi-provider | ✅ Single model | ✅ Firefly |
| Brand-aware gen | ✅ Auto-inject | ❌ Manual | ❌ Manual |
| Model choice | ✅ 3 providers | ❌ | ❌ |
| Cost transparency | ✅ Per-image | ❌ Subscription | ❌ Credits hidden |
| Inpainting | ✅ Planned | ✅ | ✅ |
| Background removal | ✅ Planned | ✅ | ✅ |
