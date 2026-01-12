# Template Library Feature PRD

## Document Info
- **Feature:** Template Library & Marketplace
- **Priority:** P1 (High Priority)
- **Version:** 1.0
- **Status:** Planning
- **Target Release:** v0.6

---

## 1. Overview

### 1.1 Feature Summary
A comprehensive template library providing professionally designed, customizable templates for all supported social media platforms. Templates automatically adapt to user's brand colors, fonts, and style, dramatically reducing time-to-publish while maintaining professional quality.

### 1.2 Problem Statement
Users with limited design skills struggle to create professional-looking content from scratch. Even experienced designers waste time recreating common layouts. Existing template solutions (Canva, etc.) don't intelligently apply brand guidelines, resulting in manual customization work for every template used.

### 1.3 Solution
An AI-enhanced template library where:
1. Templates auto-adapt to user's brand colors, fonts, and style
2. AI suggests templates based on content type, industry, and trends
3. Smart placeholders for text and images reduce customization time
4. Users can save custom templates for team reuse

### 1.4 Success Metrics
| Metric | Target |
|--------|--------|
| Template usage rate | 50% of new projects start from template |
| Time-to-first-export (with template) | < 5 minutes |
| Template satisfaction rating | 4.3/5 |
| Custom template saves | 20% of users save 1+ template |

---

## 2. User Stories

### 2.1 Primary User Stories

#### US-1: Browse & Select Template
> **As a** small business owner
> **I want to** browse templates by category and platform
> **So that** I can find a design that fits my content quickly

**Acceptance Criteria:**
- [ ] Filter templates by platform (Instagram, LinkedIn, etc.)
- [ ] Filter by category (announcement, quote, product, etc.)
- [ ] Preview template before selecting
- [ ] See template thumbnail with brand colors applied

#### US-2: Brand Auto-Application
> **As a** marketing manager
> **I want** templates to automatically use my brand colors and fonts
> **So that** I don't manually change colors on every template

**Acceptance Criteria:**
- [ ] Template colors adapt to active brand guide
- [ ] Fonts change to brand fonts
- [ ] Logo placeholder pre-filled with brand logo
- [ ] User can toggle "Apply Brand" on/off

#### US-3: Smart Content Placeholders
> **As a** content creator
> **I want** clear indicators showing where to add my content
> **So that** I know exactly what to customize

**Acceptance Criteria:**
- [ ] Text placeholders show content type ("Headline here", "Body text")
- [ ] Image placeholders indicate recommended dimensions
- [ ] AI suggests content based on placeholder type
- [ ] Easy one-click placeholder replacement

#### US-4: AI Template Recommendations
> **As a** new user
> **I want** the AI to suggest templates based on what I'm creating
> **So that** I don't have to search through hundreds of options

**Acceptance Criteria:**
- [ ] AI asks about content type/goal
- [ ] Shows top 6 recommended templates
- [ ] Recommendations consider brand style
- [ ] "Show more like this" option

#### US-5: Save Custom Templates
> **As a** agency designer
> **I want to** save my designs as reusable templates
> **So that** my team can maintain consistency without recreating layouts

**Acceptance Criteria:**
- [ ] Save any design as template
- [ ] Define placeholder regions
- [ ] Add template to team library
- [ ] Set template permissions (private/team/public)

### 2.2 Secondary User Stories

#### US-6: Template Collections
> **As a** marketing coordinator
> **I want to** create collections of related templates
> **So that** my team uses approved designs for campaigns

#### US-7: Trending Templates
> **As a** influencer
> **I want to** see trending template styles
> **So that** my content feels current and engaging

#### US-8: Template Analytics
> **As a** agency owner
> **I want to** see which templates my team uses most
> **So that** I can prioritize creating more of what works

---

## 3. Functional Requirements

### 3.1 Template Library

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-TPL-001 | Browse templates in grid view | P0 |
| REQ-TPL-002 | Filter by platform | P0 |
| REQ-TPL-003 | Filter by category | P0 |
| REQ-TPL-004 | Search templates by keyword | P0 |
| REQ-TPL-005 | Preview template (large view) | P0 |
| REQ-TPL-006 | Sort by popularity, newest, trending | P1 |
| REQ-TPL-007 | Favorite templates | P1 |
| REQ-TPL-008 | Recently used templates | P1 |

### 3.2 Brand Adaptation

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-TPL-010 | Auto-apply brand primary color | P0 |
| REQ-TPL-011 | Auto-apply brand secondary/accent colors | P0 |
| REQ-TPL-012 | Auto-apply brand fonts | P0 |
| REQ-TPL-013 | Insert brand logo in placeholder | P0 |
| REQ-TPL-014 | Preview with/without brand applied | P1 |
| REQ-TPL-015 | Color harmony adjustments | P2 |

### 3.3 Smart Placeholders

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-TPL-020 | Text placeholder with content hint | P0 |
| REQ-TPL-021 | Image placeholder with size guide | P0 |
| REQ-TPL-022 | Click-to-edit placeholder interaction | P0 |
| REQ-TPL-023 | AI text generation for placeholder | P1 |
| REQ-TPL-024 | AI image generation for placeholder | P1 |
| REQ-TPL-025 | Placeholder validation (required vs optional) | P2 |

### 3.4 Custom Templates

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-TPL-030 | Save design as template | P0 |
| REQ-TPL-031 | Define placeholder zones | P1 |
| REQ-TPL-032 | Add template metadata (name, category) | P0 |
| REQ-TPL-033 | Team template sharing | P1 |
| REQ-TPL-034 | Template permissions | P1 |
| REQ-TPL-035 | Edit existing custom template | P1 |

### 3.5 AI Features

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-TPL-040 | Template recommendations based on goal | P0 |
| REQ-TPL-041 | "More like this" suggestions | P1 |
| REQ-TPL-042 | Industry-specific recommendations | P1 |
| REQ-TPL-043 | Trending template detection | P2 |
| REQ-TPL-044 | Seasonal/event-based suggestions | P2 |

---

## 4. Template Categories

### 4.1 Category Taxonomy

```
Templates
├── Announcements
│   ├── Product Launch
│   ├── Event
│   ├── Sale/Promotion
│   ├── Company News
│   └── Feature Update
├── Educational
│   ├── Tips & How-to
│   ├── Statistics/Data
│   ├── Carousel/Slides
│   ├── Infographic
│   └── Tutorial
├── Engagement
│   ├── Question/Poll
│   ├── Quote
│   ├── Testimonial
│   ├── User-Generated
│   └── Behind-the-Scenes
├── Product
│   ├── Product Feature
│   ├── Comparison
│   ├── Collection
│   ├── Before/After
│   └── Unboxing
├── Brand
│   ├── Team/People
│   ├── Values/Mission
│   ├── Milestones
│   ├── Thank You
│   └── Welcome
└── Seasonal
    ├── Holidays
    ├── Seasons
    ├── Events
    └── Awareness Days
```

### 4.2 Platform Coverage

| Platform | Template Count (Launch) | Categories |
|----------|------------------------|------------|
| Instagram Post | 100 | All |
| Instagram Story | 80 | All |
| Instagram Carousel | 40 | Educational, Product |
| LinkedIn Post | 60 | Professional focus |
| Twitter Post | 50 | All |
| TikTok Cover | 30 | Engagement, Product |
| Facebook Post | 40 | All |

**Total Launch Target: 400 templates**

---

## 5. User Interface

### 5.1 Template Browser

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TEMPLATES                                              [+ Save Custom] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search templates...                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Platform: [All ▼]  Category: [All ▼]  Style: [All ▼]  Sort: [Popular]│
│                                                                         │
│  ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│  ✨ AI RECOMMENDED FOR YOU                                   [See All] │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │            │ │            │ │            │ │            │          │
│  │  Template  │ │  Template  │ │  Template  │ │  Template  │          │
│  │     1      │ │     2      │ │     3      │ │     4      │          │
│  │            │ │            │ │            │ │            │          │
│  │  IG Post   │ │  IG Story  │ │  LinkedIn  │ │  IG Post   │          │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘          │
│                                                                         │
│  ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│  📢 ANNOUNCEMENTS                                            [See All] │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │            │ │            │ │            │ │            │          │
│  │  Product   │ │   Event    │ │   Sale     │ │   News     │          │
│  │  Launch    │ │  Promo     │ │  Announce  │ │  Update    │          │
│  │            │ │            │ │            │ │            │          │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘          │
│                                                                         │
│  📚 EDUCATIONAL                                              [See All] │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │            │ │            │ │            │ │            │          │
│  │   Tips     │ │   Stats    │ │  Carousel  │ │  How-To    │          │
│  │            │ │            │ │            │ │            │          │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Template Preview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                  [×]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │                             │  │                                 │  │
│  │                             │  │  Product Launch Template        │  │
│  │                             │  │  Instagram Post • 1080×1080     │  │
│  │       TEMPLATE PREVIEW      │  │                                 │  │
│  │       (Brand Applied)       │  │  Perfect for announcing new     │  │
│  │                             │  │  products, features, or         │  │
│  │                             │  │  services to your audience.     │  │
│  │                             │  │                                 │  │
│  │                             │  │  ─────────────────────────────  │  │
│  │                             │  │                                 │  │
│  │                             │  │  Placeholders:                  │  │
│  │                             │  │  • Headline text                │  │
│  │                             │  │  • Product image                │  │
│  │                             │  │  • Description text             │  │
│  │                             │  │  • CTA button                   │  │
│  │                             │  │                                 │  │
│  └─────────────────────────────┘  │  ─────────────────────────────  │  │
│                                    │                                 │  │
│  ☑ Apply my brand                  │  Style: Bold / Modern           │  │
│                                    │  Colors: 4 customizable         │  │
│  ┌──────────────────────────────┐ │                                 │  │
│  │ [Use This Template]          │ │  ♡ 2.4k uses this month        │  │
│  └──────────────────────────────┘ │                                 │  │
│                                    └─────────────────────────────────┘  │
│                                                                         │
│  Similar Templates:                                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │        │ │        │ │        │ │        │                          │
│  └────────┘ └────────┘ └────────┘ └────────┘                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Template Editing (with Placeholders)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Product Launch • Instagram Post                     [Save] [Export]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │    ╔═══════════════════════════════════════════════╗           │   │
│  │    ║                                               ║           │   │
│  │    ║  ┌───────────────────────────────────────┐   ║           │   │
│  │    ║  │ 📷 Click to add product image         │   ║           │   │
│  │    ║  │    Recommended: 800×600px             │   ║           │   │
│  │    ║  │    [Upload] [Generate with AI]        │   ║           │   │
│  │    ║  └───────────────────────────────────────┘   ║           │   │
│  │    ║                                               ║           │   │
│  │    ║  ┌───────────────────────────────────────┐   ║           │   │
│  │    ║  │ ✏️ Your headline here                 │   ║ ← Click   │   │
│  │    ║  │    [AI Suggest]                       │   ║   to edit │   │
│  │    ║  └───────────────────────────────────────┘   ║           │   │
│  │    ║                                               ║           │   │
│  │    ║  ┌───────────────────────────────────────┐   ║           │   │
│  │    ║  │ ✏️ Add a short description            │   ║           │   │
│  │    ║  └───────────────────────────────────────┘   ║           │   │
│  │    ║                                               ║           │   │
│  │    ║       [ Shop Now ]  ← CTA Button             ║           │   │
│  │    ║                                               ║           │   │
│  │    ╚═══════════════════════════════════════════════╝           │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Checklist:                                                             │
│  ✓ Brand colors applied  ✓ Logo added  ○ Product image  ○ Headline    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Save as Template

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SAVE AS TEMPLATE                                               [×]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Template Name                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Monthly Sale Announcement                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Category                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Announcements > Sale/Promotion ▼                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Description                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Bold sale announcement template with product showcase           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Define Placeholders (click regions on preview)                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ☑ "SALE" text → Headline placeholder                            │   │
│  │ ☑ "50% OFF" text → Discount placeholder                         │   │
│  │ ☑ Product image → Image placeholder                             │   │
│  │ ☑ Background color → Keep as brand primary                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Visibility                                                             │
│  ○ Private (only me)                                                   │
│  ● Team (my organization)                                              │
│  ○ Public (template library)                                           │
│                                                                         │
│                     [Cancel]        [Save Template]                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Technical Design

### 6.1 Template Data Model

```javascript
// Template
{
  id: "tpl_123",
  name: "Product Launch Bold",
  category: "announcements/product-launch",
  platform: "instagram-post",
  dimensions: { width: 1080, height: 1080 },
  thumbnail: "https://...",

  // Design data
  canvas: {
    backgroundColor: "{{brand.primary}}",  // Tokenized
    elements: [
      {
        id: "el_1",
        type: "text",
        placeholder: {
          enabled: true,
          label: "Headline",
          hint: "Your product name",
          required: true
        },
        content: "NEW ARRIVAL",
        style: {
          font: "{{brand.fontHeading}}",
          color: "{{brand.textOnPrimary}}",
          size: 48
        },
        position: { x: 100, y: 200 }
      },
      {
        id: "el_2",
        type: "image",
        placeholder: {
          enabled: true,
          label: "Product Image",
          hint: "800×600px recommended",
          required: true,
          aspectRatio: "4:3"
        },
        position: { x: 140, y: 300 },
        size: { width: 800, height: 600 }
      }
    ]
  },

  // Metadata
  tags: ["bold", "modern", "product", "launch"],
  style: "bold",
  usageCount: 2400,
  rating: 4.5,

  // Ownership
  author: "social-canvas",  // or user_id for custom
  visibility: "public",     // public, team, private

  createdAt: "2025-12-01",
  updatedAt: "2026-01-10"
}
```

### 6.2 Brand Token System

```javascript
// Brand tokens used in templates
const brandTokens = {
  // Colors
  "{{brand.primary}}": brandGuide.colors.primary,
  "{{brand.secondary}}": brandGuide.colors.secondary,
  "{{brand.accent}}": brandGuide.colors.accent,
  "{{brand.background}}": brandGuide.colors.background,
  "{{brand.textOnPrimary}}": getContrastColor(brandGuide.colors.primary),

  // Fonts
  "{{brand.fontHeading}}": brandGuide.fonts.heading,
  "{{brand.fontBody}}": brandGuide.fonts.body,

  // Assets
  "{{brand.logo}}": brandGuide.assets.logo,
  "{{brand.logoLight}}": brandGuide.assets.logoLight,
  "{{brand.logoDark}}": brandGuide.assets.logoDark,
};

function applyBrandToTemplate(template, brandGuide) {
  const tokens = buildTokenMap(brandGuide);
  return deepReplace(template, tokens);
}
```

### 6.3 AI Recommendation Engine

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TEMPLATE RECOMMENDATION ENGINE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  INPUTS:                                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • User's brand industry (e.g., "e-commerce", "saas")            │   │
│  │ • Brand style (minimal, bold, playful, professional)            │   │
│  │ • Target platform (Instagram, LinkedIn, etc.)                   │   │
│  │ • Content goal (announce, educate, engage, sell)                │   │
│  │ • Past template usage history                                   │   │
│  │ • Team's template preferences                                   │   │
│  │ • Current trends/seasonality                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│                           │                                             │
│                           ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                   SCORING ALGORITHM                              │   │
│  │                                                                   │   │
│  │  Score = (StyleMatch × 0.3) + (CategoryMatch × 0.25)            │   │
│  │        + (PopularityScore × 0.2) + (RecencyBonus × 0.15)        │   │
│  │        + (PersonalHistory × 0.1)                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│                           │                                             │
│                           ▼                                             │
│  OUTPUT: Top 6-12 recommended templates, ranked                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.4 API Endpoints

#### GET /api/templates
```json
{
  "platform": "instagram-post",
  "category": "announcements",
  "search": "product launch",
  "sort": "popular",
  "limit": 20,
  "offset": 0
}
```

#### GET /api/templates/recommended
```json
{
  "brandGuideId": "brand_123",
  "platform": "instagram-post",
  "goal": "announce",
  "limit": 6
}
```

#### POST /api/templates (save custom)
```json
{
  "name": "Monthly Sale Template",
  "category": "announcements/sale",
  "platform": "instagram-post",
  "canvas": { /* design data */ },
  "placeholders": [
    { "elementId": "el_1", "label": "Headline", "required": true }
  ],
  "visibility": "team"
}
```

#### POST /api/templates/:id/use
```json
{
  "brandGuideId": "brand_123",
  "applyBrand": true
}
```
**Response:** New project with template applied

---

## 7. Implementation Plan

### 7.1 Phase 1: Foundation (Week 1-2)
- [ ] Template data model and storage
- [ ] Template browser UI (grid, filters)
- [ ] Basic template preview
- [ ] Template → Project conversion

### 7.2 Phase 2: Brand Integration (Week 2-3)
- [ ] Brand token system
- [ ] Auto-apply brand to template
- [ ] Preview with/without brand
- [ ] Token replacement engine

### 7.3 Phase 3: Placeholders (Week 3-4)
- [ ] Placeholder detection in editor
- [ ] Click-to-edit placeholder UX
- [ ] Placeholder validation
- [ ] AI suggestions for placeholders

### 7.4 Phase 4: Custom Templates (Week 4-5)
- [ ] Save design as template
- [ ] Define placeholders UI
- [ ] Team template sharing
- [ ] Template permissions

### 7.5 Phase 5: AI & Polish (Week 5-6)
- [ ] Recommendation engine
- [ ] "More like this" feature
- [ ] Usage analytics
- [ ] Template curation (launch set)

---

## 8. Content Strategy

### 8.1 Launch Template Set (400 templates)

| Category | Count | Platforms |
|----------|-------|-----------|
| Announcements | 80 | All |
| Educational | 100 | IG, LI, TW |
| Engagement | 70 | IG, TW, TikTok |
| Product | 80 | All |
| Brand | 40 | All |
| Seasonal | 30 | All |

### 8.2 Template Creation Guidelines

1. **Brand Compatibility**
   - Use brand tokens for ALL colors
   - Use brand tokens for fonts
   - Include logo placeholder
   - Test with 5+ different brand palettes

2. **Placeholder Design**
   - Clear visual boundaries
   - Helpful hint text
   - Sensible defaults
   - AI-friendly prompts

3. **Quality Standards**
   - Professional typography
   - Balanced composition
   - Mobile-preview tested
   - Accessibility checked (contrast)

### 8.3 Template Refresh Cadence
- **Weekly:** 10 new trending/seasonal templates
- **Monthly:** 30 new templates across categories
- **Quarterly:** Category expansion, style refresh

---

## 9. Open Questions

1. **Marketplace:** Allow users to sell templates to other users?
2. **Template Rating:** How to handle low-rated templates?
3. **AI Generation:** Can AI generate new templates on-demand?
4. **Figma Import:** Support importing Figma designs as templates?
5. **Template Versioning:** How to handle template updates vs user copies?

---

## 10. Success Criteria

### 10.1 Launch Criteria
- [ ] 400 templates across all categories
- [ ] Brand auto-application works for 95% of templates
- [ ] Placeholder system intuitive (< 10% support tickets)
- [ ] Template browser load time < 2 seconds
- [ ] Search returns relevant results

### 10.2 Post-Launch Metrics (60 days)
- [ ] 50% of new projects start from template
- [ ] Average 4.2+ rating across templates
- [ ] 20% of users save at least one custom template
- [ ] < 2 min average time from template select to first edit
- [ ] 30% reduction in blank canvas starts
