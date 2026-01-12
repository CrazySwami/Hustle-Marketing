# Social Canvas AI - Product Requirements Document

## Document Info
- **Version:** 1.0
- **Last Updated:** January 2026
- **Status:** Active Development (Post-MVP)

---

## 1. Executive Summary

### 1.1 Product Vision
Social Canvas AI is an AI-powered social media content creation platform that enables marketing professionals and creators to produce high-quality, on-brand visual content at unprecedented speed. By offering multi-provider AI capabilities with full cost transparency, Social Canvas AI democratizes professional-grade content creation while giving users control over their AI spending.

### 1.2 Mission Statement
*Empower every marketer to create stunning, on-brand social content in minutes, not hours—with AI that understands your brand as well as you do.*

### 1.3 Value Proposition
- **10x Faster Content Creation:** From idea to publish-ready content in minutes
- **Brand-Perfect Every Time:** AI that truly understands and applies brand guidelines
- **Choose Your AI:** Multi-provider support (OpenAI, Claude, Gemini) for optimal results
- **Transparent Pricing:** See exactly what AI costs per request—no hidden fees

---

## 2. Target Users

### 2.1 Primary Personas

#### Persona 1: Marketing Team Lead (Sarah)
- **Role:** Head of Marketing at mid-size company (50-200 employees)
- **Pain Points:**
  - Team drowning in content requests from multiple departments
  - Inconsistent brand application across team members
  - Design bottleneck—waiting on designers for simple social posts
  - Expensive agency retainers for content that could be done in-house
- **Goals:**
  - Increase content output without increasing headcount
  - Maintain brand consistency at scale
  - Reduce time-to-publish for reactive/timely content
- **Success Metric:** 3x content output, 50% reduction in design requests

#### Persona 2: Agency Creative Director (Marcus)
- **Role:** Creative Director at digital marketing agency
- **Pain Points:**
  - Managing brand guidelines for 10+ clients
  - Junior designers making brand mistakes
  - Tight margins—need efficiency without sacrificing quality
  - Clients want more content for the same budget
- **Goals:**
  - Scale content production across client accounts
  - Ensure brand compliance without constant reviews
  - Increase profit margins through efficiency
- **Success Metric:** 40% more client deliverables, 25% margin improvement

#### Persona 3: Small Business Owner (Elena)
- **Role:** Owner of boutique e-commerce brand
- **Pain Points:**
  - No design skills or budget for designer
  - Social presence suffering—inconsistent posting
  - Generic templates don't match brand aesthetic
  - Time split between 100 other priorities
- **Goals:**
  - Professional social presence without design expertise
  - Consistent posting schedule
  - Content that looks like a bigger brand made it
- **Success Metric:** Daily posting capability, professional brand image

#### Persona 4: Solo Content Creator (Jordan)
- **Role:** Influencer/Creator with 50K+ followers
- **Pain Points:**
  - Content creation taking hours per post
  - Struggling to maintain visual consistency
  - Can't afford design tools or assistants
  - Platform algorithm demands constant fresh content
- **Goals:**
  - Create more content with less effort
  - Stand out with unique, polished visuals
  - Maintain authentic brand voice
- **Success Metric:** 2x posting frequency, better engagement rates

### 2.2 User Segments by Priority
1. **Primary:** Marketing Teams & Agencies (highest LTV, most features needed)
2. **Secondary:** Small Business Owners (volume play, simpler needs)
3. **Tertiary:** Solo Creators (growth segment, price-sensitive)

---

## 3. Problem Statement

### 3.1 Market Problems
1. **Content Demand Explosion:** Social platforms now expect 5-10x more content than 5 years ago
2. **Design Bottleneck:** 73% of marketers say design resources limit their content output
3. **Brand Inconsistency:** Multi-platform presence leads to fragmented brand identity
4. **Tool Complexity:** Existing tools (Canva, Figma) require design skills most marketers lack
5. **AI Black Box:** Current AI tools don't explain costs or give model choices

### 3.2 Why Now?
- **AI Maturity:** GPT-5.2, Claude 4.5, and Gemini 3 now produce professional-quality outputs
- **Multi-Modal AI:** Image generation (DALL-E 3, GPT Image) is production-ready
- **API Accessibility:** Vercel AI Gateway enables multi-provider access with single integration
- **Market Timing:** Competitors haven't solved brand intelligence + AI transparency

---

## 4. Solution Overview

### 4.1 Core Product Components

```
┌─────────────────────────────────────────────────────────────────┐
│                      SOCIAL CANVAS AI                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   BRAND      │  │   CANVAS     │  │     AI       │          │
│  │   SYSTEM     │  │   EDITOR     │  │   ENGINE     │          │
│  │              │  │              │  │              │          │
│  │ • AI Extract │  │ • Templates  │  │ • Text Gen   │          │
│  │ • Guidelines │  │ • Layers     │  │ • Image Gen  │          │
│  │ • Assets     │  │ • Export     │  │ • Design AI  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │              MULTI-PROVIDER AI GATEWAY            │          │
│  │   OpenAI (GPT-5.2)  •  Anthropic (Claude 4.5)    │          │
│  │   Google (Gemini 3)  •  Cost Tracking            │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Key Features (Current State)

| Feature | Status | Description |
|---------|--------|-------------|
| Brand Guide Generator | ✅ Live | AI extracts brand from inputs |
| Canvas Editor | ✅ Live | Multi-size canvas with layers |
| AI Chat Panel | ✅ Live | Conversational AI assistance |
| Model Selector | ✅ Live | Choose provider + tier |
| Cost Tracker | ✅ Live | Real-time usage costs |
| Model Stats | ✅ Live | View all model pricing |
| Project Library | ✅ Live | Save/manage projects |

### 4.3 Platform Support

| Platform | Format | Dimensions | Status |
|----------|--------|------------|--------|
| Instagram | Post | 1080×1080 | ✅ |
| Instagram | Story | 1080×1920 | ✅ |
| Instagram | Reel Cover | 1080×1920 | ✅ |
| TikTok | Video Cover | 1080×1920 | ✅ |
| LinkedIn | Post | 1200×627 | ✅ |
| X/Twitter | Post | 1200×675 | ✅ |
| Facebook | Post | 1200×630 | ✅ |

---

## 5. Competitive Landscape

### 5.1 Competitor Analysis

| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|
| **Canva** | Massive template library, brand kits | AI is basic, no model choice, expensive teams tier | Deep AI, cost transparency, brand intelligence |
| **Adobe Express** | Creative Cloud integration, quality | Complex, expensive, AI limited | Simpler UX, better AI, transparent pricing |
| **Figma** | Collaborative, powerful | Not social-focused, steep learning curve | Social-first, AI-native, easier onboarding |
| **Jasper** | Strong text AI | No design/visual capability | Full visual + text solution |
| **Midjourney** | Best image gen quality | No design tools, no brand consistency | Integrated workflow, brand-aware |

### 5.2 Differentiation Matrix

```
                    Brand Intelligence
                           ↑
                           │
              Social       │      ★ Social Canvas AI
              Canvas AI    │
                           │
     ─────────────────────┼─────────────────────→ AI Capability
                           │
              Canva        │      Adobe Express
                           │
                           │
                    Basic Tools
```

---

## 6. Business Model

### 6.1 Pricing Strategy: Hybrid SaaS + Usage

#### Free Tier
- 3 projects/month
- 100 AI credits/month
- Basic templates
- Watermarked exports
- Community support

#### Pro ($29/month or $290/year)
- Unlimited projects
- 2,000 AI credits/month
- Premium templates
- No watermarks
- Priority support
- 1 brand guide

#### Team ($79/month or $790/year)
- Everything in Pro
- 10,000 AI credits/month
- 5 team seats
- 10 brand guides
- Collaboration features
- Admin controls

#### Agency ($199/month or $1,990/year)
- Everything in Team
- 50,000 AI credits/month
- Unlimited seats
- Unlimited brand guides
- White-label options
- API access
- Dedicated support

### 6.2 AI Credit System
- 1 credit = ~1,000 tokens (text) or 1 image generation
- Additional credits: $10 per 1,000 credits
- Credits roll over (up to 2x monthly allowance)
- Real-time cost display in-app

### 6.3 Revenue Projections (Year 1)

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|-----|-----|-----|-----|
| Users | 1K | 5K | 15K | 40K |
| Paid % | 5% | 8% | 10% | 12% |
| ARPU | $35 | $40 | $45 | $50 |
| MRR | $1.8K | $16K | $68K | $240K |

---

## 7. Success Metrics

### 7.1 North Star Metric
**Content Published per Active User per Week**
- Target: 5+ pieces of content/user/week

### 7.2 Key Performance Indicators

| Category | Metric | Current | Target (6mo) |
|----------|--------|---------|--------------|
| **Acquisition** | Weekly signups | - | 500 |
| **Activation** | Day 1 content created | - | 60% |
| **Engagement** | WAU/MAU ratio | - | 40% |
| **Retention** | Month 3 retention | - | 35% |
| **Revenue** | Conversion to paid | - | 10% |
| **Satisfaction** | NPS score | - | 50+ |

### 7.3 Feature-Specific Metrics

| Feature | Success Metric | Target |
|---------|---------------|--------|
| Brand Guide | Completion rate | 80% |
| AI Chat | Messages per session | 5+ |
| Canvas Editor | Exports per project | 2+ |
| Templates | Template usage rate | 40% |

---

## 8. Technical Architecture

### 8.1 Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  React 18 • Vite • Lucide Icons • CSS Modules          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    AI SERVICES                          │
│  Vercel AI SDK • AI Gateway • Multi-Provider           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │ OpenAI  │ │Anthropic│ │ Google  │                   │
│  │GPT-5.2  │ │Claude4.5│ │Gemini 3 │                   │
│  └─────────┘ └─────────┘ └─────────┘                   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     BACKEND (Planned)                   │
│  Next.js API Routes • Supabase • Edge Functions        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     STORAGE                             │
│  Supabase (Auth, DB) • Vercel Blob (Assets)            │
└─────────────────────────────────────────────────────────┘
```

### 8.2 AI Provider Strategy

| Provider | Use Case | Tier Mapping |
|----------|----------|--------------|
| **Anthropic** | Creative writing, brand voice, design suggestions | Default for brand work |
| **OpenAI** | Image generation, general tasks, coding | Default for images |
| **Google** | Long context, multimodal analysis, fast tasks | Default for analysis |

### 8.3 Key Technical Decisions

1. **Vercel AI Gateway:** Single API key for all providers, automatic routing
2. **Client-Side First:** Vite SPA for fast iteration, backend added as needed
3. **Cost Transparency:** Real-time token tracking exposed to users
4. **Model Flexibility:** Users choose provider/tier, not locked to one vendor

---

## 9. Roadmap

### 9.1 Current Release (v0.3)
- ✅ Multi-provider AI support
- ✅ Brand guide generator
- ✅ Canvas editor with presets
- ✅ Cost tracking & model stats
- ✅ Project library

### 9.2 Next Release (v0.4) - Image Generation
- 🔄 DALL-E 3 / GPT Image integration
- 🔄 Gemini image generation
- 🔄 Image editing & inpainting
- 🔄 Background removal

### 9.3 v0.5 - Multi-Asset Campaigns
- 📋 Create content for multiple platforms at once
- 📋 Batch resize & adapt
- 📋 Campaign management view
- 📋 Scheduling integration prep

### 9.4 v0.6 - Template Library
- 📋 Curated template marketplace
- 📋 Community templates
- 📋 Template customization
- 📋 Brand-matched suggestions

### 9.5 v1.0 - Production Launch
- 📋 Authentication & accounts
- 📋 Payment integration
- 📋 Team collaboration
- 📋 Mobile web optimization

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI costs exceed projections | Medium | High | Usage caps, tiered credits, cost alerts |
| Competitor copies features | High | Medium | Speed to market, brand intelligence moat |
| AI quality inconsistent | Medium | High | Multi-provider fallback, quality scoring |
| User adoption slow | Medium | High | Freemium model, viral sharing features |
| Platform API changes | Low | High | Abstract provider layer, diversify |

---

## 11. Open Questions

1. **Pricing Validation:** Should free tier exist or start with trial?
2. **Mobile Priority:** Native apps or PWA-first approach?
3. **Enterprise Features:** How early to add SSO, audit logs, etc.?
4. **Marketplace:** Should users sell templates to each other?
5. **Integrations:** Priority for Buffer, Hootsuite, Later, etc.?

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| AI Credit | Unit of AI usage (≈1,000 tokens or 1 image) |
| Brand Guide | Stored brand identity (colors, fonts, voice, logos) |
| Canvas | The design workspace for a specific format |
| Tier | AI capability level (Fast, Smart, Reasoning) |
| Provider | AI company (OpenAI, Anthropic, Google) |

---

## Appendix B: User Research Insights

*To be populated after user interviews*

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | Product Team | Initial PRD |
