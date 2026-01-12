/**
 * Test Registry - Maps file patterns to required test types
 * Used by Claude Code hooks to automatically run appropriate tests
 */

export const TEST_TYPES = {
  UNIT: 'unit',
  E2E: 'e2e',
  VISUAL: 'visual',
  VISUAL_QA: 'visual-qa',
  API: 'api',
};

/**
 * File pattern matchers and their required tests
 * Priority order - first match wins for primary test type
 */
export const TEST_TRIGGERS = [
  // API Routes - need E2E and API tests
  {
    pattern: /^src\/app\/api\//,
    name: 'API Routes',
    tests: [TEST_TYPES.E2E, TEST_TYPES.API],
    primary: TEST_TYPES.E2E,
    description: 'API endpoints require E2E testing for integration',
  },

  // UI Components - need Visual and Unit tests
  {
    pattern: /^src\/components\/ui\//,
    name: 'UI Components',
    tests: [TEST_TYPES.VISUAL, TEST_TYPES.VISUAL_QA, TEST_TYPES.UNIT],
    primary: TEST_TYPES.VISUAL,
    description: 'UI components require Storybook visual testing + Haiku QA',
  },

  // AI Elements - need Visual and E2E tests
  {
    pattern: /^src\/components\/ai-elements\//,
    name: 'AI Elements',
    tests: [TEST_TYPES.VISUAL, TEST_TYPES.E2E, TEST_TYPES.VISUAL_QA],
    primary: TEST_TYPES.VISUAL,
    description: 'AI chat components need visual + integration testing',
  },

  // Tool UI - need Visual and Unit tests
  {
    pattern: /^src\/components\/tool-ui\//,
    name: 'Tool UI',
    tests: [TEST_TYPES.VISUAL, TEST_TYPES.UNIT],
    primary: TEST_TYPES.VISUAL,
    description: 'Tool renderers need visual verification',
  },

  // Library/Utils - need Unit tests
  {
    pattern: /^src\/lib\//,
    name: 'Library Code',
    tests: [TEST_TYPES.UNIT],
    primary: TEST_TYPES.UNIT,
    description: 'Utility functions require unit testing',
  },

  // Hooks - need Unit tests
  {
    pattern: /^src\/hooks\//,
    name: 'React Hooks',
    tests: [TEST_TYPES.UNIT],
    primary: TEST_TYPES.UNIT,
    description: 'Custom hooks require unit testing',
  },

  // Pages - need E2E tests
  {
    pattern: /^src\/app\/(?!api)/,
    name: 'Pages',
    tests: [TEST_TYPES.E2E, TEST_TYPES.VISUAL],
    primary: TEST_TYPES.E2E,
    description: 'Pages require E2E user flow testing',
  },

  // Storybook stories - need Visual QA
  {
    pattern: /\.stories\.(jsx?|tsx?)$/,
    name: 'Storybook Stories',
    tests: [TEST_TYPES.VISUAL_QA],
    primary: TEST_TYPES.VISUAL_QA,
    description: 'Stories need Haiku visual QA audit',
  },

  // Test files - run the tests
  {
    pattern: /\.(test|spec)\.(jsx?|tsx?)$/,
    name: 'Test Files',
    tests: [TEST_TYPES.UNIT],
    primary: TEST_TYPES.UNIT,
    description: 'Test file changes should run the tests',
  },

  // E2E test files
  {
    pattern: /^e2e\//,
    name: 'E2E Tests',
    tests: [TEST_TYPES.E2E],
    primary: TEST_TYPES.E2E,
    description: 'E2E test changes should run E2E suite',
  },
];

/**
 * Get required tests for a file path
 * @param {string} filePath - Relative path from project root
 * @returns {Object} Test requirements for this file
 */
export function getTestsForFile(filePath) {
  // Normalize path
  const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\//, '');

  for (const trigger of TEST_TRIGGERS) {
    if (trigger.pattern.test(normalizedPath)) {
      return {
        file: normalizedPath,
        category: trigger.name,
        tests: trigger.tests,
        primary: trigger.primary,
        description: trigger.description,
      };
    }
  }

  // Default - no specific tests required
  return {
    file: normalizedPath,
    category: 'Other',
    tests: [],
    primary: null,
    description: 'No specific tests configured for this file type',
  };
}

/**
 * Get required tests for multiple files
 * @param {string[]} filePaths - Array of file paths
 * @returns {Object} Aggregated test requirements
 */
export function getTestsForFiles(filePaths) {
  const results = filePaths.map(getTestsForFile);

  // Aggregate unique tests needed
  const allTests = new Set();
  const categories = new Set();

  results.forEach(result => {
    result.tests.forEach(test => allTests.add(test));
    if (result.category !== 'Other') {
      categories.add(result.category);
    }
  });

  // Determine primary test type by priority
  const testPriority = [TEST_TYPES.E2E, TEST_TYPES.VISUAL_QA, TEST_TYPES.VISUAL, TEST_TYPES.UNIT, TEST_TYPES.API];
  const primary = testPriority.find(t => allTests.has(t)) || null;

  return {
    files: results,
    tests: Array.from(allTests),
    primary,
    categories: Array.from(categories),
    commands: getTestCommands(Array.from(allTests)),
  };
}

/**
 * Get CLI commands for test types
 * @param {string[]} testTypes - Array of test types
 * @returns {Object} Commands to run
 */
export function getTestCommands(testTypes) {
  const commands = {};

  if (testTypes.includes(TEST_TYPES.UNIT)) {
    commands.unit = 'npm run test:run';
  }
  if (testTypes.includes(TEST_TYPES.E2E)) {
    commands.e2e = 'npm run e2e';
  }
  if (testTypes.includes(TEST_TYPES.VISUAL)) {
    commands.visual = 'npm run storybook:build && npm run test:visual';
  }
  if (testTypes.includes(TEST_TYPES.VISUAL_QA)) {
    commands.visualQa = 'node scripts/visual-qa.mjs';
  }
  if (testTypes.includes(TEST_TYPES.API)) {
    commands.api = 'npm run test-reasoning';
  }

  return commands;
}

/**
 * Claude Code skill mappings
 */
export const SKILL_MAPPINGS = {
  [TEST_TYPES.UNIT]: 'test-unit',
  [TEST_TYPES.E2E]: 'test-e2e',
  [TEST_TYPES.VISUAL]: 'test-visual',
  [TEST_TYPES.VISUAL_QA]: 'visual-qa',
  [TEST_TYPES.API]: 'test-e2e', // API tests run via E2E
};

/**
 * Get Claude Code skills to run for test types
 * @param {string[]} testTypes - Array of test types
 * @returns {string[]} Skills to invoke
 */
export function getSkillsForTests(testTypes) {
  const skills = new Set();
  testTypes.forEach(type => {
    if (SKILL_MAPPINGS[type]) {
      skills.add(SKILL_MAPPINGS[type]);
    }
  });
  return Array.from(skills);
}
