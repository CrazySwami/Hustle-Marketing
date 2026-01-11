/**
 * AI Fallback Service
 * Provides automatic fallback between AI providers
 */

import { generateObject, generateText } from 'ai';
import { models, isProviderConfigured } from './provider.js';

/**
 * Default fallback order
 * Claude first (best for creative tasks), then GPT-4, then Gemini
 */
const DEFAULT_FALLBACK_ORDER = ['anthropic', 'openai', 'google'];

/**
 * Execute generateObject with automatic fallback
 * @param {object} options - Options for generateObject (excluding model)
 * @param {string[]} fallbackOrder - Order of providers to try
 * @returns {Promise<object>} Result from first successful provider
 */
export async function generateObjectWithFallback(options, fallbackOrder = DEFAULT_FALLBACK_ORDER) {
  const configuredProviders = fallbackOrder.filter(isProviderConfigured);

  if (configuredProviders.length === 0) {
    throw new Error('No AI providers configured. Please add API keys to .env file.');
  }

  const errors = [];

  for (const provider of configuredProviders) {
    try {
      const model = models[provider]?.smart;
      if (!model) continue;

      const result = await generateObject({
        ...options,
        model,
      });

      return {
        ...result,
        provider,
        fallbackUsed: provider !== configuredProviders[0],
      };
    } catch (error) {
      console.warn(`Provider ${provider} failed:`, error.message);
      errors.push({ provider, error: error.message });
      continue;
    }
  }

  throw new Error(`All AI providers failed: ${errors.map(e => `${e.provider}: ${e.error}`).join('; ')}`);
}

/**
 * Execute generateText with automatic fallback
 * @param {object} options - Options for generateText (excluding model)
 * @param {string[]} fallbackOrder - Order of providers to try
 * @returns {Promise<object>} Result from first successful provider
 */
export async function generateTextWithFallback(options, fallbackOrder = DEFAULT_FALLBACK_ORDER) {
  const configuredProviders = fallbackOrder.filter(isProviderConfigured);

  if (configuredProviders.length === 0) {
    throw new Error('No AI providers configured. Please add API keys to .env file.');
  }

  const errors = [];

  for (const provider of configuredProviders) {
    try {
      const model = models[provider]?.smart;
      if (!model) continue;

      const result = await generateText({
        ...options,
        model,
      });

      return {
        ...result,
        provider,
        fallbackUsed: provider !== configuredProviders[0],
      };
    } catch (error) {
      console.warn(`Provider ${provider} failed:`, error.message);
      errors.push({ provider, error: error.message });
      continue;
    }
  }

  throw new Error(`All AI providers failed: ${errors.map(e => `${e.provider}: ${e.error}`).join('; ')}`);
}

/**
 * Retry wrapper with exponential backoff
 * @param {function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise<any>} Result from function
 */
export async function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export default {
  generateObjectWithFallback,
  generateTextWithFallback,
  withRetry,
};
