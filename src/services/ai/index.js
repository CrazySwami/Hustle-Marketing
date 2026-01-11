/**
 * AI Services Index
 * Central export for all AI-related services
 */

// Provider and model management
export {
  models,
  providerInfo,
  getModel,
  getDefaultProvider,
  isProviderConfigured,
  getConfiguredProviders,
} from './provider.js';

// Brand generation
export {
  generateBrandSuggestions,
  generateBrandSuggestionsWithFallback,
} from './brand-generator.js';

// Design agent
export {
  executeDesignPrompt,
  executeOperations,
  executeDesignPromptWithFallback,
} from './design-agent.js';

// Fallback utilities
export {
  generateObjectWithFallback,
  generateTextWithFallback,
  withRetry,
} from './fallback.js';

// Schemas
export * from './schemas/index.js';
