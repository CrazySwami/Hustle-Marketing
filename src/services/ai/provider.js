/**
 * Vercel AI Gateway Provider
 *
 * Uses a single AI Gateway API key to access 100+ models from multiple providers.
 * No need for individual provider API keys - the gateway handles routing.
 *
 * Model format: "provider/model-name"
 * Docs: https://vercel.com/docs/ai-gateway
 *
 * Latest Models (January 2026):
 * - Anthropic: claude-opus-4.5, claude-sonnet-4.5, claude-haiku-4.5
 * - OpenAI: gpt-5.2, o3, o4-mini
 * - Google: gemini-3-pro, gemini-3-flash
 */

import { createGateway } from 'ai';

// Create the AI Gateway instance with your API key
const gateway = createGateway({
  apiKey: import.meta.env.VITE_AI_GATEWAY_API_KEY || '',
  // Optional: custom base URL if self-hosting
  // baseURL: 'https://ai-gateway.vercel.sh/v1',
});

/**
 * Model registry with AI Gateway model strings
 * Format: "provider/model-name"
 *
 * Tiers:
 * - fast: Quick, cost-effective for simple tasks
 * - smart: Balanced for most design/creative tasks
 * - reasoning: Advanced models for complex tasks
 */
export const modelRegistry = {
  // Anthropic Claude 4.5 Series
  anthropic: {
    fast: {
      id: 'anthropic/claude-haiku-4.5',
      name: 'Claude Haiku 4.5',
      description: 'Fast & efficient for quick tasks',
      inputCost: 0.80,
      outputCost: 4.00,
    },
    smart: {
      id: 'anthropic/claude-sonnet-4.5',
      name: 'Claude Sonnet 4.5',
      description: 'Balanced for creative design work',
      inputCost: 3.00,
      outputCost: 15.00,
    },
    reasoning: {
      id: 'anthropic/claude-opus-4.5',
      name: 'Claude Opus 4.5',
      description: 'Most capable for complex reasoning',
      inputCost: 15.00,
      outputCost: 75.00,
    },
  },

  // OpenAI GPT-5.2 & o-series
  openai: {
    fast: {
      id: 'openai/o4-mini',
      name: 'o4-mini',
      description: 'Fast reasoning model',
      inputCost: 1.10,
      outputCost: 4.40,
    },
    smart: {
      id: 'openai/gpt-5.2',
      name: 'GPT-5.2',
      description: 'Latest GPT for balanced performance',
      inputCost: 2.50,
      outputCost: 10.00,
    },
    reasoning: {
      id: 'openai/o3',
      name: 'o3',
      description: 'Advanced reasoning capabilities',
      inputCost: 10.00,
      outputCost: 40.00,
    },
  },

  // Google Gemini 3 Series
  google: {
    fast: {
      id: 'google/gemini-3-flash',
      name: 'Gemini 3 Flash',
      description: 'Ultra-fast multimodal model',
      inputCost: 0.50,
      outputCost: 1.50,
    },
    smart: {
      id: 'google/gemini-3-pro',
      name: 'Gemini 3 Pro',
      description: 'Balanced multimodal performance',
      inputCost: 1.25,
      outputCost: 5.00,
    },
    reasoning: {
      id: 'google/gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: 'Extended thinking for complex problems',
      inputCost: 3.50,
      outputCost: 14.00,
    },
  },
};

/**
 * Create model instances using the gateway
 * The gateway routes requests to the appropriate provider
 */
export const models = {
  anthropic: {
    fast: gateway(modelRegistry.anthropic.fast.id),
    smart: gateway(modelRegistry.anthropic.smart.id),
    reasoning: gateway(modelRegistry.anthropic.reasoning.id),
  },
  openai: {
    fast: gateway(modelRegistry.openai.fast.id),
    smart: gateway(modelRegistry.openai.smart.id),
    reasoning: gateway(modelRegistry.openai.reasoning.id),
  },
  google: {
    fast: gateway(modelRegistry.google.fast.id),
    smart: gateway(modelRegistry.google.smart.id),
    reasoning: gateway(modelRegistry.google.reasoning.id),
  },
};

/**
 * Provider metadata for UI display
 */
export const providerInfo = {
  anthropic: {
    id: 'anthropic',
    name: 'Claude 4.5',
    icon: '🟣',
    description: 'Best for creative & design tasks',
    color: '#7C3AED',
    recommended: true,
  },
  openai: {
    id: 'openai',
    name: 'GPT-5.2 / o3',
    icon: '🟢',
    description: 'Best for general & reasoning tasks',
    color: '#10B981',
  },
  google: {
    id: 'google',
    name: 'Gemini 3',
    icon: '🔵',
    description: 'Best for multimodal & fast tasks',
    color: '#3B82F6',
  },
};

/**
 * Get the gateway instance for direct use
 * @returns {function} The gateway function
 */
export function getGateway() {
  return gateway;
}

/**
 * Get a model by provider and tier
 * @param {string} provider - 'openai' | 'anthropic' | 'google'
 * @param {string} tier - 'fast' | 'smart' | 'reasoning'
 * @returns {object} The gateway model instance
 */
export function getModel(provider = 'anthropic', tier = 'smart') {
  const providerModels = models[provider];
  if (!providerModels) {
    console.warn(`Unknown provider: ${provider}, falling back to anthropic`);
    return models.anthropic[tier] || models.anthropic.smart;
  }
  return providerModels[tier] || providerModels.smart;
}

/**
 * Get model ID string for direct gateway calls
 * @param {string} provider - Provider name
 * @param {string} tier - Model tier
 * @returns {string} The model ID string (e.g., "anthropic/claude-sonnet-4.5")
 */
export function getModelId(provider = 'anthropic', tier = 'smart') {
  const registry = modelRegistry[provider];
  if (!registry) return modelRegistry.anthropic[tier]?.id || modelRegistry.anthropic.smart.id;
  return registry[tier]?.id || registry.smart.id;
}

/**
 * Get model metadata by provider and tier
 * @param {string} provider - Provider ID
 * @param {string} tier - Model tier
 * @returns {object} Model metadata including name, description, costs
 */
export function getModelInfo(provider = 'anthropic', tier = 'smart') {
  const registry = modelRegistry[provider];
  if (!registry) return modelRegistry.anthropic[tier];
  return registry[tier] || registry.smart;
}

/**
 * Get the default provider from environment or fallback
 * @returns {string} The default provider ID
 */
export function getDefaultProvider() {
  return import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'anthropic';
}

/**
 * Check if the AI Gateway is configured
 * @returns {boolean} Whether the gateway API key is set
 */
export function isGatewayConfigured() {
  return !!import.meta.env.VITE_AI_GATEWAY_API_KEY;
}

/**
 * Check if a provider is available (gateway configured = all providers available)
 * @param {string} provider - The provider ID
 * @returns {boolean} Whether the provider is available
 */
export function isProviderConfigured(provider) {
  // With AI Gateway, all providers are available if the gateway key is set
  if (isGatewayConfigured()) {
    return ['anthropic', 'openai', 'google'].includes(provider);
  }
  return false;
}

/**
 * Get list of configured providers
 * @returns {string[]} Array of configured provider IDs
 */
export function getConfiguredProviders() {
  if (isGatewayConfigured()) {
    return ['anthropic', 'openai', 'google'];
  }
  return [];
}

/**
 * Get all available model tiers
 * @returns {string[]} Array of tier names
 */
export function getModelTiers() {
  return ['fast', 'smart', 'reasoning'];
}

/**
 * Estimate cost for a request
 * @param {string} provider - Provider ID
 * @param {string} tier - Model tier
 * @param {number} inputTokens - Estimated input tokens
 * @param {number} outputTokens - Estimated output tokens
 * @returns {number} Estimated cost in dollars
 */
export function estimateCost(provider, tier, inputTokens, outputTokens) {
  const info = getModelInfo(provider, tier);
  const inputCost = (inputTokens / 1_000_000) * info.inputCost;
  const outputCost = (outputTokens / 1_000_000) * info.outputCost;
  return inputCost + outputCost;
}

/**
 * Get all available models as a flat list
 * @returns {Array} List of all models with provider and tier info
 */
export function getAllModels() {
  const allModels = [];
  for (const [provider, tiers] of Object.entries(modelRegistry)) {
    for (const [tier, info] of Object.entries(tiers)) {
      allModels.push({
        provider,
        tier,
        ...info,
      });
    }
  }
  return allModels;
}

export default {
  gateway,
  models,
  modelRegistry,
  providerInfo,
  getGateway,
  getModel,
  getModelId,
  getModelInfo,
  getDefaultProvider,
  isGatewayConfigured,
  isProviderConfigured,
  getConfiguredProviders,
  getModelTiers,
  estimateCost,
  getAllModels,
};
