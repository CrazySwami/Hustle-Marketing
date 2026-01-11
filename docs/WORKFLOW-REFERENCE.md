# AI Development Workflow Reference

Complete documentation of the Ralph and AI Dev Tasks workflow systems.

> **Sources**: [snarktank/ai-dev-tasks](https://github.com/snarktank/ai-dev-tasks) (7.3k stars) | [snarktank/ralph](https://github.com/snarktank/ralph) (2.5k stars)

---

## Installed Components

```
Social-Canvas-ai/
├── CLAUDE.md                          # Project context for Claude
├── AGENTS.md                          # Pattern logging (Ralph-style)
├── .claude/
│   ├── settings.json                  # Permissions config
│   ├── commands/
│   │   ├── create-prd.md              # /create-prd command
│   │   ├── generate-tasks.md          # /generate-tasks command
│   │   └── work-tasks.md              # /work-tasks command
│   └── skills/
│       ├── prd/SKILL.md               # PRD generation skill
│       └── ralph/SKILL.md             # Ralph PRD converter skill
├── tasks/
│   ├── create-prd.md                  # Official PRD template
│   └── generate-tasks.md              # Official task generation template
├── scripts/ralph/
│   ├── ralph.sh                       # Autonomous agent loop (for Amp CLI)
│   ├── prompt.md                      # Agent instructions
│   └── prd.json.example               # Example PRD format
├── docs/
│   └── WORKFLOW-REFERENCE.md          # This file
├── .ai-dev-tasks-reference/           # Cloned repo (reference)
└── .ralph-reference/                  # Cloned repo (reference)
```

---

## Quick Start

### 1. Create a PRD
```
Use tasks/create-prd.md to create a PRD for: [your feature description]
```

### 2. Generate Tasks
```
Use tasks/generate-tasks.md with tasks/prd-[feature].md to create a task list
```

### 3. Execute Tasks
```
Start on task 1.1 from tasks/tasks-[feature].md
```

---

## The AI Dev Tasks System (snarktank/ai-dev-tasks)

A 7.3k star workflow for structured AI-assisted development.

### Core Principle
Instead of one giant prompt, break work into:
1. **Scope Definition** (PRD)
2. **Granular Planning** (Task List)
3. **Iterative Verification** (Step-by-step execution)

### File Structure
```
project/
├── tasks/
│   ├── create-prd.md        # PRD creation template
│   ├── generate-tasks.md    # Task generation template
│   ├── prd-[feature].md     # Generated PRDs
│   └── tasks-[feature].md   # Generated task lists
```

### Workflow Phases

#### Phase 1: PRD Creation
1. Provide feature description
2. AI asks 3-5 clarifying questions
3. AI generates structured PRD
4. Review and refine

#### Phase 2: Task Generation
1. Reference the PRD
2. AI generates parent tasks (5-8 high-level)
3. **PAUSE** - User confirms with "Go"
4. AI generates sub-tasks
5. Review task breakdown

#### Phase 3: Implementation
1. Work through tasks sequentially
2. Mark `- [x]` as each completes
3. AI pauses after each sub-task for review
4. Course-correct as needed

---

## The Ralph System (snarktank/ralph)

An autonomous AI agent loop for Amp CLI.

### Key Concept
Ralph runs multiple iterations of an AI agent, with each iteration:
- Getting a fresh context window
- Reading `prd.json` for current state
- Working on ONE user story
- Committing changes
- Updating progress

### Core Files
| File | Purpose |
|------|---------|
| `ralph.sh` | Bash loop spawning AI instances |
| `prompt.md` | Instructions for each iteration |
| `prd.json` | User stories with completion status |
| `progress.txt` | Learnings persisted across iterations |

### prd.json Structure
```json
{
  "project": "Feature Name",
  "branchName": "feature/name",
  "description": "What we're building",
  "userStories": [
    {
      "id": "US-001",
      "title": "Story Title",
      "description": "Detailed description",
      "priority": 1,
      "passes": false,
      "acceptanceCriteria": [
        "Criterion 1",
        "Criterion 2"
      ]
    }
  ]
}
```

### Critical Patterns

#### Right-Sized Tasks
Stories must fit in ONE context window. Good examples:
- Add a database column with migration
- Create a UI component
- Update server logic
- Add list filters

Bad examples (too large):
- "Build entire dashboard"
- "Add authentication"
- "Refactor API"

#### AGENTS.md Pattern
After each iteration, update AGENTS.md with:
- Discovered patterns
- Gotchas
- Codebase conventions

This helps future iterations avoid repeating mistakes.

#### Progress Tracking
`progress.txt` structure:
```
## Codebase Patterns
[Consolidated learnings at top]

---
## 2024-01-15 10:30 - US-001 Complete
- Implemented: [what]
- Files changed: [list]
- Learnings: [insights]
```

---

## Best Practices

### Context Management
1. Use `/clear` between distinct features
2. Keep CLAUDE.md concise and focused
3. Break large features into multiple PRDs
4. Document patterns in AGENTS.md

### Task Quality
1. Each task should be independently testable
2. Include test tasks for every feature task
3. Be specific: "Add X button to Y panel" not "Add UI"
4. Write for junior developers

### Workflow Hygiene
1. Commit after each major milestone
2. Update progress tracking immediately
3. Browser-verify UI changes
4. Run tests before marking complete

---

## Integration with Claude Code

### Adding as Custom Commands

Create `.claude/commands/create-prd.md`:
```markdown
Use the @tasks/create-prd.md template to create a PRD for the feature I describe.
```

Create `.claude/commands/generate-tasks.md`:
```markdown
Use @tasks/generate-tasks.md with the PRD I reference to create a task list.
```

Then use `/create-prd` or `/generate-tasks` in Claude Code.

---

## Sources

- [snarktank/ai-dev-tasks](https://github.com/snarktank/ai-dev-tasks) - 7.3k stars
- [snarktank/ralph](https://github.com/snarktank/ralph) - 2.5k stars
- [Ryan Carson's 3-Step Workflow](https://www.lennysnewsletter.com/p/a-3-step-ai-coding-workflow-for-solo)
- [Anthropic Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
