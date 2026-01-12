/**
 * Model Tester Utility
 * Tests all AI models with minimal token usage
 */

import { generateText } from 'ai';
import { getGateway, openaiModels, anthropicModels, googleModels } from './provider.js';

const TEST_PROMPT = 'Say "ok" and nothing else.';  // Minimal tokens

/**
 * Test a single model
 * @param {string} modelId - The model ID to test
 * @returns {Promise<object>} Test result
 */
async function testModel(modelId) {
  const gateway = getGateway();
  const startTime = Date.now();

  try {
    const result = await generateText({
      model: gateway(modelId),
      prompt: TEST_PROMPT,
      maxTokens: 5,  // Limit output
    });

    return {
      modelId,
      success: true,
      response: result.text?.substring(0, 50),
      latency: Date.now() - startTime,
      usage: result.usage,
    };
  } catch (error) {
    return {
      modelId,
      success: false,
      error: error.message,
      latency: Date.now() - startTime,
    };
  }
}

/**
 * Get list of all testable text models
 */
export function getTestableModels() {
  const models = [];

  // OpenAI text models
  Object.values(openaiModels.text).forEach(m => {
    models.push({ id: m.id, name: m.name, provider: 'openai', type: 'text' });
  });

  // OpenAI reasoning models
  Object.values(openaiModels.reasoning).forEach(m => {
    models.push({ id: m.id, name: m.name, provider: 'openai', type: 'reasoning' });
  });

  // Anthropic models
  Object.values(anthropicModels.text).forEach(m => {
    models.push({ id: m.id, name: m.name, provider: 'anthropic', type: 'text' });
  });

  // Google models
  Object.values(googleModels.text).forEach(m => {
    if (!m.id.includes('thinking')) {  // Skip thinking variant (same model)
      models.push({ id: m.id, name: m.name, provider: 'google', type: 'text' });
    }
  });

  return models;
}

/**
 * Test all models and return results
 * @param {function} onProgress - Progress callback (model, result)
 * @returns {Promise<object[]>} All test results
 */
export async function testAllModels(onProgress) {
  const models = getTestableModels();
  const results = [];

  for (const model of models) {
    const result = await testModel(model.id);
    const fullResult = { ...model, ...result };
    results.push(fullResult);

    if (onProgress) {
      onProgress(model, fullResult);
    }

    // Small delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}

/**
 * Test a specific provider's models
 * @param {string} provider - Provider name
 * @param {function} onProgress - Progress callback
 */
export async function testProviderModels(provider, onProgress) {
  const models = getTestableModels().filter(m => m.provider === provider);
  const results = [];

  for (const model of models) {
    const result = await testModel(model.id);
    const fullResult = { ...model, ...result };
    results.push(fullResult);

    if (onProgress) {
      onProgress(model, fullResult);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return results;
}

/**
 * Quick health check - test one model from each provider
 * @returns {Promise<object>} Health check results
 */
export async function quickHealthCheck() {
  const testModels = [
    { id: 'anthropic/claude-haiku-4.5', name: 'Claude Haiku', provider: 'anthropic' },
    { id: 'openai/gpt-5.2-chat', name: 'GPT-5.2 Chat', provider: 'openai' },
    { id: 'google/gemini-3-flash', name: 'Gemini 3 Flash', provider: 'google' },
  ];

  const results = {
    timestamp: new Date().toISOString(),
    providers: {},
    allHealthy: true,
  };

  for (const model of testModels) {
    const result = await testModel(model.id);
    results.providers[model.provider] = {
      model: model.name,
      healthy: result.success,
      latency: result.latency,
      error: result.error,
    };

    if (!result.success) {
      results.allHealthy = false;
    }
  }

  return results;
}

/**
 * Estimate test costs
 * Based on ~10 input tokens + ~5 output tokens per test
 */
export function estimateTestCosts() {
  const models = getTestableModels();
  let totalCost = 0;

  // Estimate ~15 tokens per test (10 in, 5 out)
  const inputTokens = 10;
  const outputTokens = 5;

  models.forEach(model => {
    // Get rough cost estimates
    let inputCost = 0;
    let outputCost = 0;

    if (model.provider === 'anthropic') {
      inputCost = 1;    // ~$1/1M for Haiku
      outputCost = 5;
    } else if (model.provider === 'openai') {
      inputCost = 1.75; // ~$1.75/1M for GPT-5.2
      outputCost = 14;
    } else if (model.provider === 'google') {
      inputCost = 0.5;  // ~$0.50/1M for Flash
      outputCost = 3;
    }

    const cost = (inputTokens / 1_000_000) * inputCost + (outputTokens / 1_000_000) * outputCost;
    totalCost += cost;
  });

  return {
    modelCount: models.length,
    estimatedCost: totalCost,
    formatted: `~$${totalCost.toFixed(4)}`,
    note: 'Actual cost may vary slightly based on exact model pricing',
  };
}

export default {
  testModel,
  testAllModels,
  testProviderModels,
  quickHealthCheck,
  getTestableModels,
  estimateTestCosts,
};
