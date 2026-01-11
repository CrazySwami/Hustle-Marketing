# Generate Tasks Command

Use the template at `tasks/generate-tasks.md` to create a task breakdown from a PRD.

## Instructions

1. Read `tasks/generate-tasks.md` for the task generation process
2. Ask the user which PRD file to use (or use the most recent one)
3. Generate parent tasks FIRST, then PAUSE for user confirmation
4. After user says "Go", generate sub-tasks
5. Save the output to `tasks/tasks-[feature-name].md`

## Important

- Always include Task 0.0: Create feature branch
- Include test tasks for every feature task
- Be specific - tasks should be completable in one focused session
