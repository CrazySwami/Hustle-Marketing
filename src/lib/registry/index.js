/**
 * Registry Module - Central export for all registry functionality
 */

export * from './test-registry.js';
export * from './tracking-registry.js';

// Re-export commonly used functions with cleaner names
export {
  getTestsForFile,
  getTestsForFiles,
  getSkillsForTests,
  TEST_TYPES,
  SKILL_MAPPINGS,
} from './test-registry.js';

export {
  registerComponent,
  updateComponentStatus,
  getComponent,
  getComponents,
  recordTestRun,
  recordTestResult,
  recordQAAudit,
  recordQAIssue,
  getRegistrySummary,
  initializeRegistry,
  COMPONENT_STATUS,
  TEST_STATUS,
} from './tracking-registry.js';
