/**
 * AI Provider Abstraction Layer - Vercel AI Gateway Ready
 *
 * This module provides a unified interface for multiple AI providers.
 * Currently uses direct provider SDKs for client-side Vite compatibility.
 * Architecture is designed to easily migrate to Vercel AI Gateway when
 * a backend proxy is added.
 *
 * Latest Models (January 2026):
 * - Claude 4.5: Opus, Sonnet, Haiku
 * - OpenAI: GPT-5.2, o3, o4-mini
 * - Google: Gemini 3 Flash, Pro, Deep Think
 */

import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Initialize providers with API keys from environment
const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
});

const anthropic = createAnthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
});

const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || '',
});

/**
 * Model registry with latest versions (January 2026)
 *
 * Tiers:
 * - fast: Quick, cost-effective models for simple tasks
 * - smart: Balanced models for most design/creative tasks
 * - reasoning: Advanced models for complex reasoning and planning
 */
export const modelRegistry = {
  // Claude 4.5 Series - Best for creative and design tasks
  anthropic: {
    fast: {
      id: 'claude-haiku-4-5-20251201',
      name: 'Claude Haiku 4.5',
      description: 'Fast & efficient for quick tasks',
      inputCost: 0.80,  // per 1M tokens
      outputCost: 4.00,
    },
    smart: {
      id: 'claude-sonnet-4-5-20251201',
      name: 'Claude Sonnet 4.5',
      description: 'Balanced for creative design work',
      inputCost: 3.00,
      outputCost: 15.00,
    },
    reasoning: {
      id: 'claude-opus-4-5-20251101',
      name: 'Claude Opus 4.5',
      description: 'Most capable for complex reasoning',
      inputCost: 15.00,
      outputCost: 75.00,
    },
  },

  // OpenAI GPT-5.2 & o-series - Best for general tasks
  openai: {
    fast: {
      id: 'o4-mini',
      name: 'o4-mini',
      description: 'Fast reasoning model',
      inputCost: 1.10,
      outputCost: 4.40,
    },
    smart: {
      id: 'gpt-5.2',
      name: 'GPT-5.2',
      description: 'Latest GPT for balanced performance',
      inputCost: 2.50,
      outputCost: 10.00,
    },
    reasoning: {
      id: 'o3',
      name: 'o3',
      description: 'Advanced reasoning capabilities',
      inputCost: 10.00,
      outputCost: 40.00,
    },
  },

  // Gemini 3 Series - Best for multimodal and fast tasks
  google: {
    fast: {
      id: 'gemini-3-flash',
      name: 'Gemini 3 Flash',
      description: 'Ultra-fast multimodal model',
      inputCost: 0.50,
      outputCost: 1.50,
    },
    smart: {
      id: 'gemini-3-pro',
      name: 'Gemini 3 Pro',
      description: 'Balanced multimodal performance',
      inputCost: 1.25,
      outputCost: 5.00,
    },
    reasoning: {
      id: 'gemini-3-deep-think',
      name: 'Gemini 3 Deep Think',
      description: 'Extended thinking for complex problems',
      inputCost: 3.50,
      outputCost: 14.00,
    },
  },
};

/**
 * Create model instances from registry
 */
export const models = {
  openai: {
    fast: openai(modelRegistry.openai.fast.id),
    smart: openai(modelRegistry.openai.smart.id),
    reasoning: openai(modelRegistry.openai.reasoning.id),
  },
  anthropic: {
    fast: anthropic(modelRegistry.anthropic.fast.id),
    smart: anthropic(modelRegistry.anthropic.smart.id),
    reasoning: anthropic(modelRegistry.anthropic.reasoning.id),
  },
  google: {
    fast: google(modelRegistry.google.fast.id),
    smart: google(modelRegistry.google.smart.id),
    reasoning: google(modelRegistry.google.reasoning.id),
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
 * AI Gateway model strings (for future backend integration)
 * Format: provider/model-name
 */
export const gatewayModels = {
  anthropic: {
    fast: 'anthropic/claude-haiku-4-5-20251201',
    smart: 'anthropic/claude-sonnet-4-5-20251201',
    reasoning: 'anthropic/claude-opus-4-5-20251101',
  },
  openai: {
    fast: 'openai/o4-mini',
    smart: 'openai/gpt-5.2',
    reasoning: 'openai/o3',
  },
  google: {
    fast: 'google/gemini-3-flash',
    smart: 'google/gemini-3-pro',
    reasoning: 'google/gemini-3-deep-think',
  },
};

/**
 * Get a model by provider and tier
 * @param {string} provider - 'openai' | 'anthropic' | 'google'
 * @param {string} tier - 'fast' | 'smart' | 'reasoning'
 * @returns {object} The model instance
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
 * Check if a provider is configured (has API key)
 * @param {string} provider - The provider ID
 * @returns {boolean} Whether the provider is configured
 */
export function isProviderConfigured(provider) {
  switch (provider) {
    case 'openai':
      return !!import.meta.env.VITE_OPENAI_API_KEY;
    case 'anthropic':
      return !!import.meta.env.VITE_ANTHROPIC_API_KEY;
    case 'google':
      return !!import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
    default:
      return false;
  }
}

/**
 * Get list of configured providers
 * @returns {string[]} Array of configured provider IDs
 */
export function getConfiguredProviders() {
  return ['anthropic', 'openai', 'google'].filter(isProviderConfigured);
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

export default {
  models,
  modelRegistry,
  providerInfo,
  gatewayModels,
  getModel,
  getModelInfo,
  getDefaultProvider,
  isProviderConfigured,
  getConfiguredProviders,
  getModelTiers,
  estimateCost,
};
