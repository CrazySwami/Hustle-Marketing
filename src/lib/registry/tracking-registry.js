/**
 * Tracking Registry - Maintains status of components, tests, and QA
 * Persisted to JSON for cross-session tracking
 */

import fs from 'fs';
import path from 'path';

const REGISTRY_PATH = path.join(process.cwd(), '.registry');
const COMPONENTS_FILE = path.join(REGISTRY_PATH, 'components.json');
const TEST_RESULTS_FILE = path.join(REGISTRY_PATH, 'test-results.json');
const QA_RESULTS_FILE = path.join(REGISTRY_PATH, 'qa-results.json');

/**
 * Component status types
 */
export const COMPONENT_STATUS = {
  DRAFT: 'draft',
  IMPLEMENTED: 'implemented',
  TESTED: 'tested',
  QA_PASSED: 'qa-passed',
  PRODUCTION: 'production',
};

/**
 * Test result status
 */
export const TEST_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  PASSED: 'passed',
  FAILED: 'failed',
  SKIPPED: 'skipped',
};

/**
 * Ensure registry directory exists
 */
function ensureRegistryDir() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    fs.mkdirSync(REGISTRY_PATH, { recursive: true });
  }
}

/**
 * Load JSON file safely
 */
function loadJSON(filePath, defaultValue = {}) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
  }
  return defaultValue;
}

/**
 * Save JSON file
 */
function saveJSON(filePath, data) {
  ensureRegistryDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ============================================
// Component Registry
// ============================================

/**
 * Get all registered components
 */
export function getComponents() {
  return loadJSON(COMPONENTS_FILE, { components: [], lastUpdated: null });
}

/**
 * Register a new component
 */
export function registerComponent(component) {
  const registry = getComponents();
  const existing = registry.components.findIndex(c => c.path === component.path);

  const entry = {
    ...component,
    registeredAt: existing >= 0 ? registry.components[existing].registeredAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    registry.components[existing] = { ...registry.components[existing], ...entry };
  } else {
    registry.components.push(entry);
  }

  registry.lastUpdated = new Date().toISOString();
  saveJSON(COMPONENTS_FILE, registry);
  return entry;
}

/**
 * Update component status
 */
export function updateComponentStatus(componentPath, status, metadata = {}) {
  const registry = getComponents();
  const component = registry.components.find(c => c.path === componentPath);

  if (component) {
    component.status = status;
    component.updatedAt = new Date().toISOString();
    Object.assign(component, metadata);
    registry.lastUpdated = new Date().toISOString();
    saveJSON(COMPONENTS_FILE, registry);
  }

  return component;
}

/**
 * Get component by path
 */
export function getComponent(componentPath) {
  const registry = getComponents();
  return registry.components.find(c => c.path === componentPath);
}

/**
 * Get components by status
 */
export function getComponentsByStatus(status) {
  const registry = getComponents();
  return registry.components.filter(c => c.status === status);
}

// ============================================
// Test Results Registry
// ============================================

/**
 * Get all test results
 */
export function getTestResults() {
  return loadJSON(TEST_RESULTS_FILE, { results: [], runs: [] });
}

/**
 * Record a test run
 */
export function recordTestRun(run) {
  const registry = getTestResults();

  const entry = {
    id: `run-${Date.now()}`,
    ...run,
    timestamp: new Date().toISOString(),
  };

  registry.runs.push(entry);

  // Keep only last 100 runs
  if (registry.runs.length > 100) {
    registry.runs = registry.runs.slice(-100);
  }

  saveJSON(TEST_RESULTS_FILE, registry);
  return entry;
}

/**
 * Record individual test result
 */
export function recordTestResult(result) {
  const registry = getTestResults();

  const entry = {
    id: `test-${Date.now()}`,
    ...result,
    timestamp: new Date().toISOString(),
  };

  // Find existing result for this test
  const existing = registry.results.findIndex(
    r => r.testName === result.testName && r.file === result.file
  );

  if (existing >= 0) {
    registry.results[existing] = entry;
  } else {
    registry.results.push(entry);
  }

  saveJSON(TEST_RESULTS_FILE, registry);
  return entry;
}

/**
 * Get test results for a file
 */
export function getTestResultsForFile(filePath) {
  const registry = getTestResults();
  return registry.results.filter(r => r.file === filePath);
}

/**
 * Get latest test run
 */
export function getLatestTestRun(testType = null) {
  const registry = getTestResults();
  const runs = testType
    ? registry.runs.filter(r => r.type === testType)
    : registry.runs;
  return runs[runs.length - 1] || null;
}

// ============================================
// QA Results Registry
// ============================================

/**
 * Get all QA results
 */
export function getQAResults() {
  return loadJSON(QA_RESULTS_FILE, { audits: [], issues: [] });
}

/**
 * Record a QA audit
 */
export function recordQAAudit(audit) {
  const registry = getQAResults();

  const entry = {
    id: `audit-${Date.now()}`,
    ...audit,
    timestamp: new Date().toISOString(),
  };

  registry.audits.push(entry);

  // Keep only last 50 audits
  if (registry.audits.length > 50) {
    registry.audits = registry.audits.slice(-50);
  }

  saveJSON(QA_RESULTS_FILE, registry);
  return entry;
}

/**
 * Record a QA issue
 */
export function recordQAIssue(issue) {
  const registry = getQAResults();

  const entry = {
    id: `issue-${Date.now()}`,
    ...issue,
    status: issue.status || 'open',
    createdAt: new Date().toISOString(),
  };

  registry.issues.push(entry);
  saveJSON(QA_RESULTS_FILE, registry);
  return entry;
}

/**
 * Update QA issue status
 */
export function updateQAIssue(issueId, updates) {
  const registry = getQAResults();
  const issue = registry.issues.find(i => i.id === issueId);

  if (issue) {
    Object.assign(issue, updates, { updatedAt: new Date().toISOString() });
    saveJSON(QA_RESULTS_FILE, registry);
  }

  return issue;
}

/**
 * Get open QA issues
 */
export function getOpenQAIssues() {
  const registry = getQAResults();
  return registry.issues.filter(i => i.status === 'open');
}

/**
 * Get QA issues for component
 */
export function getQAIssuesForComponent(componentPath) {
  const registry = getQAResults();
  return registry.issues.filter(i => i.component === componentPath);
}

// ============================================
// Summary & Reporting
// ============================================

/**
 * Get full registry summary
 */
export function getRegistrySummary() {
  const components = getComponents();
  const tests = getTestResults();
  const qa = getQAResults();

  const componentsByStatus = {};
  Object.values(COMPONENT_STATUS).forEach(status => {
    componentsByStatus[status] = components.components.filter(c => c.status === status).length;
  });

  const recentRuns = tests.runs.slice(-10);
  const passRate = recentRuns.length > 0
    ? recentRuns.filter(r => r.status === 'passed').length / recentRuns.length
    : 0;

  return {
    components: {
      total: components.components.length,
      byStatus: componentsByStatus,
      lastUpdated: components.lastUpdated,
    },
    tests: {
      totalResults: tests.results.length,
      recentRuns: recentRuns.length,
      passRate: Math.round(passRate * 100),
      lastRun: getLatestTestRun(),
    },
    qa: {
      totalAudits: qa.audits.length,
      openIssues: qa.issues.filter(i => i.status === 'open').length,
      resolvedIssues: qa.issues.filter(i => i.status === 'resolved').length,
      lastAudit: qa.audits[qa.audits.length - 1] || null,
    },
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Initialize registry with existing components
 */
export function initializeRegistry(componentPaths) {
  componentPaths.forEach(p => {
    registerComponent({
      path: p,
      name: path.basename(p, path.extname(p)),
      status: COMPONENT_STATUS.IMPLEMENTED,
    });
  });

  return getRegistrySummary();
}
