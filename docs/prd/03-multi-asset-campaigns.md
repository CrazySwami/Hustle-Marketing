# Multi-Asset Campaigns Feature PRD

## Document Info
- **Feature:** Multi-Asset Campaign Creation
- **Priority:** P1 (High Priority)
- **Version:** 1.0
- **Status:** Planning
- **Target Release:** v0.5

---

## 1. Overview

### 1.1 Feature Summary
Enable users to create content for multiple social media platforms simultaneously from a single design, automatically adapting layouts, copy, and assets to each platform's requirements while maintaining brand consistency.

### 1.2 Problem Statement
Marketers currently create the same content multiple times for different platforms—an Instagram post, then resize for Twitter, then adapt for LinkedIn. This repetitive work wastes hours per campaign and introduces inconsistencies. A single campaign launch can require 10+ individual design files.

### 1.3 Solution
A campaign-centric workflow where users design once and the system intelligently adapts content to all selected platforms. AI assists with copy variations, layout adaptations, and platform-specific optimizations.

### 1.4 Success Metrics
| Metric | Target |
|--------|--------|
| Campaign feature adoption | 40% of active users |
| Assets created per campaign | 4+ platforms |
| Time saved vs single-asset workflow | 60% reduction |
| Export completion rate | 85% |

---

## 2. User Stories

### 2.1 Primary User Stories

#### US-1: Create Multi-Platform Campaign
> **As a** marketing manager
> **I want to** create content for Instagram, LinkedIn, and Twitter at once
> **So that** I can launch coordinated campaigns faster

**Acceptance Criteria:**
- [ ] User can select multiple target platforms when starting
- [ ] Single canvas adapts to show all platform variations
- [ ] Changes to core content sync across platforms
- [ ] Platform-specific tweaks don't affect other platforms

#### US-2: AI-Adapted Copy
> **As a** social media manager
> **I want** the AI to adapt my copy for each platform's style
> **So that** content feels native to each platform

**Acceptance Criteria:**
- [ ] AI generates platform-appropriate copy variations
- [ ] LinkedIn copy is professional, Twitter is concise, Instagram is casual
- [ ] Hashtag suggestions are platform-specific
- [ ] User can edit any variation independently

#### US-3: Smart Layout Adaptation
> **As a** designer
> **I want** layouts to automatically adapt to different aspect ratios
> **So that** I don't manually recreate each size

**Acceptance Criteria:**
- [ ] Square design adapts to vertical (Story) and horizontal (Twitter)
- [ ] Text repositions intelligently for each format
- [ ] Images resize/crop appropriately
- [ ] User can override automatic positioning

#### US-4: Batch Export
> **As a** content creator
> **I want to** export all platform versions at once
> **So that** I can quickly upload to scheduling tools

**Acceptance Criteria:**
- [ ] Export all platforms with one click
- [ ] Files named by platform (campaign_instagram.png, campaign_twitter.png)
- [ ] Optional: ZIP download of all assets
- [ ] Optional: Direct upload to scheduling tool

#### US-5: Campaign Management
> **As a** agency account manager
> **I want to** organize content into campaigns
> **So that** I can track deliverables per client/initiative

**Acceptance Criteria:**
- [ ] Create named campaigns
- [ ] Add multiple designs to a campaign
- [ ] Campaign overview shows all assets
- [ ] Campaign-level export (all assets)

### 2.2 Secondary User Stories

#### US-6: Platform Recommendations
> **As a** small business owner
> **I want** the AI to recommend which platforms to target
> **So that** I focus on the right channels for my content

#### US-7: Schedule Preview
> **As a** marketing coordinator
> **I want to** see how content will look in a weekly calendar view
> **So that** I can ensure variety in my posting schedule

#### US-8: A/B Variations
> **As a** growth marketer
> **I want to** create A/B test variations within a campaign
> **So that** I can test different approaches

---

## 3. Functional Requirements

### 3.1 Campaign Creation

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-CAM-001 | Create campaign with name and date range | P0 |
| REQ-CAM-002 | Select target platforms (multi-select) | P0 |
| REQ-CAM-003 | Associate brand guide with campaign | P0 |
| REQ-CAM-004 | Add multiple designs/assets to campaign | P0 |
| REQ-CAM-005 | Campaign overview dashboard | P1 |

### 3.2 Multi-Platform Design

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-CAM-010 | Split-view showing all platform variations | P0 |
| REQ-CAM-011 | Sync mode: changes apply to all platforms | P0 |
| REQ-CAM-012 | Independent mode: edit single platform | P0 |
| REQ-CAM-013 | Visual indicator of which platforms are synced | P0 |
| REQ-CAM-014 | Preview each platform at actual dimensions | P1 |

### 3.3 AI Adaptation

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-CAM-020 | Auto-generate copy variations per platform | P0 |
| REQ-CAM-021 | Platform-specific hashtag suggestions | P0 |
| REQ-CAM-022 | Character count enforcement per platform | P0 |
| REQ-CAM-023 | Tone adjustment (professional/casual/concise) | P1 |
| REQ-CAM-024 | Emoji usage optimization per platform | P2 |

### 3.4 Layout Adaptation

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-CAM-030 | Smart resize with content-aware positioning | P0 |
| REQ-CAM-031 | Safe zone indicators for text/logos | P0 |
| REQ-CAM-032 | Image focal point preservation | P1 |
| REQ-CAM-033 | Font size auto-scaling | P1 |
| REQ-CAM-034 | Layout template per platform | P2 |

### 3.5 Export & Integration

| Requirement | Description | Priority |
|-------------|-------------|----------|
| REQ-CAM-040 | Batch export all platforms | P0 |
| REQ-CAM-041 | Platform-specific file naming | P0 |
| REQ-CAM-042 | ZIP archive download | P1 |
| REQ-CAM-043 | Copy-to-clipboard for caption text | P1 |
| REQ-CAM-044 | Integration with Buffer/Hootsuite (future) | P2 |

---

## 4. Platform Specifications

### 4.1 Supported Platforms

| Platform | Formats | Dimensions | Copy Limits |
|----------|---------|------------|-------------|
| **Instagram Post** | Square, Portrait, Landscape | 1080×1080, 1080×1350, 1080×566 | 2,200 chars |
| **Instagram Story** | Vertical | 1080×1920 | 2,200 chars |
| **Instagram Reel Cover** | Vertical | 1080×1920 | N/A |
| **TikTok** | Vertical | 1080×1920 | 2,200 chars |
| **LinkedIn Post** | Landscape | 1200×627 | 3,000 chars |
| **LinkedIn Article** | Landscape | 1280×720 | N/A |
| **X/Twitter Post** | Landscape | 1200×675 | 280 chars |
| **X/Twitter Header** | Wide | 1500×500 | N/A |
| **Facebook Post** | Landscape | 1200×630 | 63,206 chars |
| **Facebook Story** | Vertical | 1080×1920 | N/A |

### 4.2 Copy Adaptation Rules

```
┌─────────────────────────────────────────────────────────────┐
│                    COPY ADAPTATION ENGINE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT: "Check out our new summer collection! Perfect      │
│          for beach days and outdoor adventures. Shop now    │
│          at example.com #SummerStyle #NewArrivals"         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ TWITTER (280 chars, concise)                        │   │
│  │ "New summer collection just dropped! Perfect for    │   │
│  │  beach days ☀️ Shop: example.com #SummerStyle"      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ LINKEDIN (professional, longer)                     │   │
│  │ "Excited to announce our new summer collection,     │   │
│  │  designed for those who balance work and adventure. │   │
│  │  Whether you're heading to the beach or a rooftop   │   │
│  │  meeting, we've got you covered.                    │   │
│  │                                                     │   │
│  │  Explore the collection: example.com                │   │
│  │  #FashionIndustry #SummerCollection"                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ INSTAGRAM (casual, emoji-friendly)                  │   │
│  │ "Summer is calling! ☀️🌊                            │   │
│  │                                                     │   │
│  │  Our new collection is HERE and it's giving beach   │   │
│  │  day energy. Which piece are you grabbing first?    │   │
│  │                                                     │   │
│  │  Link in bio!                                       │   │
│  │  .                                                  │   │
│  │  #SummerStyle #NewArrivals #BeachVibes #OOTD       │   │
│  │  #FashionInspo #SummerFashion"                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. User Interface

### 5.1 Campaign Creation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    NEW CAMPAIGN                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Campaign Name                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Summer Collection Launch                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Brand Guide                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Acme Brand ▼                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Target Platforms                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☑ Instagram Post    ☑ Instagram Story              │   │
│  │ ☑ LinkedIn Post     ☐ LinkedIn Article             │   │
│  │ ☑ Twitter Post      ☐ Twitter Header               │   │
│  │ ☐ TikTok            ☐ Facebook Post                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Launch Date (optional)                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ January 15, 2026                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                    [Create Campaign]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Multi-Platform Editor View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Summer Collection Launch                           [Export All] [Save] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Sync Mode: [● On] Off     Editing: [All Platforms ▼]                  │
│                                                                         │
│  ┌───────────────┬───────────────┬───────────────┬───────────────┐     │
│  │  INSTAGRAM    │  INSTAGRAM    │   LINKEDIN    │   TWITTER     │     │
│  │    POST       │    STORY      │     POST      │     POST      │     │
│  │   1080×1080   │   1080×1920   │   1200×627    │   1200×675    │     │
│  ├───────────────┼───────────────┼───────────────┼───────────────┤     │
│  │               │               │               │               │     │
│  │   ┌─────┐    │   ┌─────┐    │  ┌─────────┐ │  ┌─────────┐  │     │
│  │   │     │    │   │     │    │  │         │ │  │         │  │     │
│  │   │  □  │    │   │     │    │  │    □    │ │  │    □    │  │     │
│  │   │     │    │   │  □  │    │  │         │ │  │         │  │     │
│  │   └─────┘    │   │     │    │  └─────────┘ │  └─────────┘  │     │
│  │               │   │     │    │               │               │     │
│  │   Caption     │   └─────┘    │   Caption     │   Caption     │     │
│  │   [Edit]      │   Tap to add │   [Edit]      │   [Edit]      │     │
│  │               │   text       │               │               │     │
│  └───────────────┴───────────────┴───────────────┴───────────────┘     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CAPTION (synced)                                     [AI ✨]   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ Check out our new summer collection! Perfect for beach  │   │   │
│  │  │ days and outdoor adventures.                            │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  [Generate Platform Variations]                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Campaign Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CAMPAIGNS                                          [+ New Campaign]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Summer Collection Launch              Launch: Jan 15, 2026      │   │
│  │  Acme Brand                            4 platforms • 12 assets   │   │
│  │                                                                   │   │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                     │   │
│  │  │ IG │ │ IG │ │ LI │ │ TW │ │ IG │ │ +6 │                     │   │
│  │  │Post│ │Stry│ │Post│ │Post│ │Post│ │more│                     │   │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                     │   │
│  │                                                                   │   │
│  │  [Open] [Export All] [Duplicate]                     [•••]      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Q1 Product Announcements              Launch: Feb 1, 2026       │   │
│  │  Acme Brand                            3 platforms • 6 assets    │   │
│  │  ...                                                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Export Modal

```
┌─────────────────────────────────────────────────────────────┐
│  EXPORT CAMPAIGN                                    [×]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Summer Collection Launch                                   │
│  12 assets across 4 platforms                               │
│                                                             │
│  Export Options                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☑ Instagram Post (3 assets)           PNG, 1080×1080│   │
│  │ ☑ Instagram Story (3 assets)          PNG, 1080×1920│   │
│  │ ☑ LinkedIn Post (3 assets)            PNG, 1200×627 │   │
│  │ ☑ Twitter Post (3 assets)             PNG, 1200×675 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  File Format: [PNG ▼]    Quality: [High ▼]                 │
│                                                             │
│  ☑ Include captions as text file                           │
│  ☑ Organize by platform (folders)                          │
│  ☐ Include metadata                                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Preview: summer-collection-launch.zip              │   │
│  │  ├── instagram-post/                                │   │
│  │  │   ├── summer-collection-launch-1.png            │   │
│  │  │   ├── summer-collection-launch-2.png            │   │
│  │  │   └── captions.txt                              │   │
│  │  ├── instagram-story/                              │   │
│  │  │   └── ...                                       │   │
│  │  └── ...                                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│         [Cancel]                    [Download ZIP]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Technical Design

### 6.1 Data Model

```javascript
// Campaign
{
  id: "campaign_123",
  name: "Summer Collection Launch",
  brandGuideId: "brand_456",
  launchDate: "2026-01-15",
  platforms: ["instagram-post", "instagram-story", "linkedin-post", "twitter-post"],
  assets: ["asset_1", "asset_2", "asset_3"],
  createdAt: "2026-01-10T10:00:00Z",
  updatedAt: "2026-01-10T14:30:00Z",
  status: "draft" // draft, scheduled, published
}

// Campaign Asset
{
  id: "asset_1",
  campaignId: "campaign_123",
  name: "Hero Image",
  baseDesign: { /* canvas data */ },
  platformVariations: {
    "instagram-post": {
      canvas: { /* adapted canvas */ },
      caption: "Summer vibes! ☀️ #SummerStyle",
      synced: true
    },
    "linkedin-post": {
      canvas: { /* adapted canvas */ },
      caption: "Excited to announce our summer collection...",
      synced: false // user made manual edits
    }
  }
}
```

### 6.2 Adaptation Engine

```
┌─────────────────────────────────────────────────────────────┐
│                   ADAPTATION ENGINE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT: Base Design (1080×1080)                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              LAYOUT ANALYZER                         │   │
│  │  • Identify focal points                            │   │
│  │  • Detect text regions                              │   │
│  │  • Find negative space                              │   │
│  │  • Calculate content hierarchy                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              RESIZE ENGINE                           │   │
│  │  • Scale to target dimensions                       │   │
│  │  • Reposition elements based on analysis            │   │
│  │  • Adjust font sizes proportionally                 │   │
│  │  • Crop/extend backgrounds as needed                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              SAFE ZONE CHECK                         │   │
│  │  • Verify text not in platform UI zones             │   │
│  │  • Check logo visibility                            │   │
│  │  • Validate CTA placement                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  OUTPUT: Platform-optimized variations                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 API Endpoints

#### POST /api/campaigns
```json
{
  "name": "Summer Collection Launch",
  "brandGuideId": "brand_456",
  "platforms": ["instagram-post", "instagram-story", "linkedin-post"],
  "launchDate": "2026-01-15"
}
```

#### POST /api/campaigns/:id/assets
```json
{
  "name": "Hero Image",
  "baseDesign": { /* canvas data */ }
}
```

#### POST /api/campaigns/:id/assets/:assetId/adapt
```json
{
  "platforms": ["instagram-story", "linkedin-post"],
  "options": {
    "adaptCopy": true,
    "adaptLayout": true
  }
}
```

#### POST /api/campaigns/:id/export
```json
{
  "platforms": ["instagram-post", "instagram-story", "linkedin-post"],
  "format": "png",
  "quality": "high",
  "includeCaptions": true,
  "organizeByPlatform": true
}
```

---

## 7. Implementation Plan

### 7.1 Phase 1: Foundation (Week 1-2)
- [ ] Campaign data model and storage
- [ ] Campaign CRUD operations
- [ ] Basic multi-platform canvas view
- [ ] Platform dimension presets

### 7.2 Phase 2: Adaptation (Week 2-3)
- [ ] Layout analysis algorithm
- [ ] Smart resize/reposition logic
- [ ] Safe zone detection
- [ ] Sync mode toggle

### 7.3 Phase 3: AI Copy (Week 3-4)
- [ ] Platform-specific copy generation
- [ ] Hashtag suggestions
- [ ] Character limit enforcement
- [ ] Tone adjustment

### 7.4 Phase 4: Export (Week 4-5)
- [ ] Batch export functionality
- [ ] ZIP packaging
- [ ] Caption text file generation
- [ ] Folder organization

### 7.5 Phase 5: Polish (Week 5-6)
- [ ] Campaign dashboard
- [ ] Performance optimization
- [ ] User testing
- [ ] Documentation

---

## 8. Open Questions

1. **Real-time Collaboration:** Should campaign editing support multiple users?
2. **Approval Workflow:** Add approval stages for agency use cases?
3. **Versioning:** Track versions of each asset within campaign?
4. **Scheduling Integration:** Which scheduling tools to integrate first?
5. **Analytics:** Show post-publish performance data in campaigns view?

---

## 9. Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Canvas editor | Engineering | ✅ Complete |
| Brand guide system | Product | ✅ Complete |
| AI text generation | Engineering | ✅ Complete |
| Export functionality | Engineering | Partial |
| Backend storage | Engineering | Required |

---

## 10. Success Criteria

### 10.1 Launch Criteria
- [ ] 4+ platforms supported at launch
- [ ] Layout adaptation works for 90% of designs without manual fixes
- [ ] Copy adaptation passes user quality review
- [ ] Export completes in < 30 seconds for 10 assets
- [ ] Campaign load time < 2 seconds

### 10.2 Post-Launch Metrics (30 days)
- [ ] 40% of users create at least one campaign
- [ ] Average 4+ platforms per campaign
- [ ] < 5% support tickets about adaptation issues
- [ ] NPS for feature > 40
