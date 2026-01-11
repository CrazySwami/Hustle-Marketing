/**
 * AI Provider Abstraction Layer
 * Unified interface for OpenAI, Anthropic, and Google AI models
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
 * Model configurations by provider and tier
 * - fast: Quick, cheap models for simple tasks
 * - smart: Balanced models for most tasks
 * - reasoning: Advanced models for complex reasoning
 */
export const models = {
  openai: {
    fast: openai('gpt-4o-mini'),
    smart: openai('gpt-4o'),
    reasoning: openai('o1'),
  },
  anthropic: {
    fast: anthropic('claude-3-5-haiku-20241022'),
    smart: anthropic('claude-sonnet-4-20250514'),
    reasoning: anthropic('claude-sonnet-4-20250514'), // Use Sonnet for reasoning too
  },
  google: {
    fast: google('gemini-1.5-flash'),
    smart: google('gemini-1.5-pro'),
    reasoning: google('gemini-2.0-flash-thinking-exp'),
  },
};

/**
 * Provider metadata for UI display
 */
export const providerInfo = {
  anthropic: {
    id: 'anthropic',
    name: 'Claude',
    icon: '🟣',
    description: 'Best for creative & design tasks',
    color: '#7C3AED',
  },
  openai: {
    id: 'openai',
    name: 'GPT-4',
    icon: '🟢',
    description: 'Best for general tasks',
    color: '#10B981',
  },
  google: {
    id: 'google',
    name: 'Gemini',
    icon: '🔵',
    description: 'Best for multimodal tasks',
    color: '#3B82F6',
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

export default {
  models,
  providerInfo,
  getModel,
  getDefaultProvider,
  isProviderConfigured,
  getConfiguredProviders,
};
