/**
 * Vercel AI Gateway Provider - Comprehensive Model Registry
 *
 * Single API key for 100+ models across all providers.
 * Model format: "provider/model-name"
 * Docs: https://vercel.com/docs/ai-gateway
 * Browse models: https://vercel.com/ai-gateway/models
 *
 * Capabilities:
 * - Text generation (GPT, Claude, Gemini)
 * - Image generation (GPT-Image, DALL-E, Gemini Image)
 * - Audio transcription (Whisper)
 * - Text-to-speech (TTS)
 * - Embeddings
 */

import { createGateway } from 'ai';

// Create the AI Gateway instance
const gateway = createGateway({
  apiKey: import.meta.env.VITE_AI_GATEWAY_API_KEY || '',
});

// ============================================================================
// OPENAI MODELS
// ============================================================================
export const openaiModels = {
  // GPT-5.2 Series (Released Dec 2025)
  text: {
    'gpt-5.2-chat': {
      id: 'openai/gpt-5.2-chat',
      name: 'GPT-5.2 Chat',
      description: 'Everyday work and learning (used in ChatGPT)',
      inputCost: 1.75,
      outputCost: 14.00,
      contextWindow: 128000,
      tier: 'fast',
    },
    'gpt-5.2': {
      id: 'openai/gpt-5.2',
      name: 'GPT-5.2',
      description: 'Deep work, coding, and long documents',
      inputCost: 1.75,
      outputCost: 14.00,
      contextWindow: 128000,
      tier: 'smart',
    },
    'gpt-5.2-pro': {
      id: 'openai/gpt-5.2-pro',
      name: 'GPT-5.2 Pro',
      description: 'Most difficult reasoning and complex tasks',
      inputCost: 21.00,
      outputCost: 168.00,
      contextWindow: 128000,
      tier: 'reasoning',
    },
  },

  // o-Series (Reasoning models)
  reasoning: {
    'o4-mini': {
      id: 'openai/o4-mini',
      name: 'o4-mini',
      description: 'Fast reasoning, cost-effective',
      inputCost: 1.10,
      outputCost: 4.40,
      contextWindow: 128000,
      tier: 'fast',
    },
    'o3': {
      id: 'openai/o3',
      name: 'o3',
      description: 'Advanced reasoning capabilities',
      inputCost: 2.00,  // Standard pricing
      outputCost: 8.00,
      contextWindow: 200000,
      tier: 'smart',
    },
    'o3-pro': {
      id: 'openai/o3-pro',
      name: 'o3 Pro',
      description: 'Maximum reasoning depth',
      inputCost: 10.00,
      outputCost: 40.00,
      contextWindow: 200000,
      tier: 'reasoning',
    },
  },

  // Image Generation
  image: {
    'gpt-image-1': {
      id: 'openai/gpt-image-1',
      name: 'GPT Image',
      description: 'Latest image generation with text rendering',
      inputCost: 10.00,  // per 1M tokens
      outputCostLow: 0.011,    // per image 1024x1024
      outputCostMedium: 0.042,
      outputCostHigh: 0.167,
      capabilities: ['generate', 'edit', 'inpaint'],
    },
    'dall-e-3': {
      id: 'openai/dall-e-3',
      name: 'DALL-E 3',
      description: 'High-quality image generation',
      costStandard1024: 0.04,
      costStandard1792: 0.08,
      costHD1024: 0.08,
      costHD1792: 0.12,
      capabilities: ['generate'],
    },
    'dall-e-2': {
      id: 'openai/dall-e-2',
      name: 'DALL-E 2',
      description: 'Budget-friendly image generation',
      cost256: 0.016,
      cost512: 0.018,
      cost1024: 0.020,
      capabilities: ['generate', 'edit', 'variations'],
    },
  },

  // Audio
  audio: {
    'whisper-1': {
      id: 'openai/whisper-1',
      name: 'Whisper',
      description: 'Speech-to-text transcription',
      costPerMinute: 0.006,
      capabilities: ['transcribe', 'translate'],
    },
    'tts-1': {
      id: 'openai/tts-1',
      name: 'TTS',
      description: 'Text-to-speech (speed optimized)',
      costPer1MChars: 15.00,
      voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    },
    'tts-1-hd': {
      id: 'openai/tts-1-hd',
      name: 'TTS HD',
      description: 'Text-to-speech (quality optimized)',
      costPer1MChars: 30.00,
      voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    },
  },

  // Embeddings
  embeddings: {
    'text-embedding-3-small': {
      id: 'openai/text-embedding-3-small',
      name: 'Embedding Small',
      description: 'Efficient embeddings',
      inputCost: 0.02,
      dimensions: 1536,
    },
    'text-embedding-3-large': {
      id: 'openai/text-embedding-3-large',
      name: 'Embedding Large',
      description: 'High-quality embeddings',
      inputCost: 0.13,
      dimensions: 3072,
    },
  },
};

// ============================================================================
// ANTHROPIC MODELS
// ============================================================================
export const anthropicModels = {
  text: {
    'claude-haiku-4.5': {
      id: 'anthropic/claude-haiku-4.5',
      name: 'Claude Haiku 4.5',
      description: 'Fast & efficient, great for simple tasks',
      inputCost: 1.00,
      outputCost: 5.00,
      contextWindow: 200000,
      tier: 'fast',
    },
    'claude-sonnet-4.5': {
      id: 'anthropic/claude-sonnet-4.5',
      name: 'Claude Sonnet 4.5',
      description: 'Balanced for creative and design work',
      inputCost: 3.00,
      outputCost: 15.00,
      contextWindow: 200000,
      tier: 'smart',
    },
    'claude-opus-4.5': {
      id: 'anthropic/claude-opus-4.5',
      name: 'Claude Opus 4.5',
      description: 'Most capable, complex reasoning',
      inputCost: 5.00,
      outputCost: 25.00,
      contextWindow: 200000,
      tier: 'reasoning',
    },
  },

  // Legacy models (still available)
  legacy: {
    'claude-opus-4': {
      id: 'anthropic/claude-opus-4',
      name: 'Claude Opus 4',
      description: 'Previous flagship (legacy)',
      inputCost: 15.00,
      outputCost: 75.00,
      contextWindow: 200000,
    },
    'claude-sonnet-4': {
      id: 'anthropic/claude-sonnet-4',
      name: 'Claude Sonnet 4',
      description: 'Previous balanced model',
      inputCost: 3.00,
      outputCost: 15.00,
      contextWindow: 200000,
    },
    'claude-3.7-sonnet': {
      id: 'anthropic/claude-3.7-sonnet',
      name: 'Claude 3.7 Sonnet',
      description: 'Still popular for coding',
      inputCost: 3.00,
      outputCost: 15.00,
      contextWindow: 200000,
    },
  },
};

// ============================================================================
// GOOGLE MODELS
// ============================================================================
export const googleModels = {
  text: {
    'gemini-3-flash': {
      id: 'google/gemini-3-flash',
      name: 'Gemini 3 Flash',
      description: 'Ultra-fast, great for simple tasks',
      inputCost: 0.50,
      outputCost: 3.00,
      audioInputCost: 1.00,
      contextWindow: 1000000,
      tier: 'fast',
      thinkingLevels: ['minimal', 'low', 'medium', 'high'],
    },
    'gemini-3-pro': {
      id: 'google/gemini-3-pro',
      name: 'Gemini 3 Pro',
      description: 'Balanced multimodal performance',
      inputCost: 2.00,
      outputCost: 12.00,
      inputCostLongContext: 4.00,  // >200K tokens
      outputCostLongContext: 18.00,
      contextWindow: 2000000,
      tier: 'smart',
      thinkingLevels: ['low', 'high'],
    },
    'gemini-3-pro-thinking': {
      id: 'google/gemini-3-pro',  // Same model, different config
      name: 'Gemini 3 Pro (Deep Think)',
      description: 'Extended reasoning with thinking_level: high',
      inputCost: 2.00,
      outputCost: 12.00,
      contextWindow: 2000000,
      tier: 'reasoning',
      defaultThinkingLevel: 'high',
      note: 'Deep Think evaluates multiple hypotheses simultaneously',
    },
  },

  // Image Generation (Nano Banana series)
  image: {
    'gemini-3-pro-image': {
      id: 'google/gemini-3-pro-image',
      name: 'Nano Banana Pro',
      description: 'Advanced image generation with diagrams & labels',
      capabilities: ['generate', 'edit', 'diagrams', 'web-search-images'],
      note: 'Uses generateText for multimodal image generation',
    },
    'gemini-2.5-flash-image': {
      id: 'google/gemini-2.5-flash-image',
      name: 'Nano Banana',
      description: 'Fast image generation',
      capabilities: ['generate', 'edit'],
    },
  },

  // Legacy
  legacy: {
    'gemini-2.5-pro': {
      id: 'google/gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: 'Previous generation pro model',
      inputCost: 1.25,
      outputCost: 5.00,
      contextWindow: 1000000,
    },
    'gemini-2.5-flash': {
      id: 'google/gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: 'Previous generation flash',
      inputCost: 0.075,
      outputCost: 0.30,
      contextWindow: 1000000,
    },
  },
};

// ============================================================================
// SIMPLIFIED MODEL REGISTRY (For UI)
// ============================================================================
export const modelRegistry = {
  anthropic: {
    fast: anthropicModels.text['claude-haiku-4.5'],
    smart: anthropicModels.text['claude-sonnet-4.5'],
    reasoning: anthropicModels.text['claude-opus-4.5'],
  },
  openai: {
    fast: openaiModels.text['gpt-5.2-chat'],
    smart: openaiModels.text['gpt-5.2'],
    reasoning: openaiModels.text['gpt-5.2-pro'],
  },
  google: {
    fast: googleModels.text['gemini-3-flash'],
    smart: googleModels.text['gemini-3-pro'],
    reasoning: googleModels.text['gemini-3-pro-thinking'],
  },
};

// Alternative registry using o-series for OpenAI reasoning
export const modelRegistryOSeries = {
  anthropic: modelRegistry.anthropic,
  openai: {
    fast: openaiModels.reasoning['o4-mini'],
    smart: openaiModels.reasoning['o3'],
    reasoning: openaiModels.reasoning['o3-pro'],
  },
  google: modelRegistry.google,
};

// ============================================================================
// MODEL INSTANCES
// ============================================================================
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

// ============================================================================
// PROVIDER INFO (For UI)
// ============================================================================
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
    name: 'GPT-5.2',
    icon: '🟢',
    description: 'Best for general tasks & coding',
    color: '#10B981',
  },
  google: {
    id: 'google',
    name: 'Gemini 3',
    icon: '🔵',
    description: 'Best for multimodal & long context',
    color: '#3B82F6',
  },
};

// ============================================================================
// CAPABILITY FLAGS
// ============================================================================
export const capabilities = {
  imageGeneration: {
    openai: ['gpt-image-1', 'dall-e-3', 'dall-e-2'],
    google: ['gemini-3-pro-image', 'gemini-2.5-flash-image'],
  },
  audioTranscription: {
    openai: ['whisper-1'],
  },
  textToSpeech: {
    openai: ['tts-1', 'tts-1-hd'],
  },
  embeddings: {
    openai: ['text-embedding-3-small', 'text-embedding-3-large'],
  },
  longContext: {
    google: ['gemini-3-pro', 'gemini-3-flash'],  // Up to 2M tokens
    anthropic: ['claude-opus-4.5', 'claude-sonnet-4.5', 'claude-haiku-4.5'],  // 200K
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getGateway() {
  return gateway;
}

export function getModel(provider = 'anthropic', tier = 'smart') {
  const providerModels = models[provider];
  if (!providerModels) {
    console.warn(`Unknown provider: ${provider}, falling back to anthropic`);
    return models.anthropic[tier] || models.anthropic.smart;
  }
  return providerModels[tier] || providerModels.smart;
}

export function getModelId(provider = 'anthropic', tier = 'smart') {
  const registry = modelRegistry[provider];
  if (!registry) return modelRegistry.anthropic[tier]?.id;
  return registry[tier]?.id || registry.smart.id;
}

export function getModelInfo(provider = 'anthropic', tier = 'smart') {
  const registry = modelRegistry[provider];
  if (!registry) return modelRegistry.anthropic[tier];
  return registry[tier] || registry.smart;
}

export function getDefaultProvider() {
  return import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'anthropic';
}

export function isGatewayConfigured() {
  return !!import.meta.env.VITE_AI_GATEWAY_API_KEY;
}

export function isProviderConfigured(provider) {
  if (isGatewayConfigured()) {
    return ['anthropic', 'openai', 'google'].includes(provider);
  }
  return false;
}

export function getConfiguredProviders() {
  if (isGatewayConfigured()) {
    return ['anthropic', 'openai', 'google'];
  }
  return [];
}

export function getModelTiers() {
  return ['fast', 'smart', 'reasoning'];
}

export function estimateCost(provider, tier, inputTokens, outputTokens) {
  const info = getModelInfo(provider, tier);
  const inputCost = (inputTokens / 1_000_000) * info.inputCost;
  const outputCost = (outputTokens / 1_000_000) * info.outputCost;
  return inputCost + outputCost;
}

export function getAllModels() {
  return {
    openai: openaiModels,
    anthropic: anthropicModels,
    google: googleModels,
  };
}

export function getImageModels() {
  return {
    openai: openaiModels.image,
    google: googleModels.image,
  };
}

export function getAudioModels() {
  return openaiModels.audio;
}

export function getEmbeddingModels() {
  return openaiModels.embeddings;
}

export default {
  gateway,
  models,
  modelRegistry,
  modelRegistryOSeries,
  providerInfo,
  capabilities,
  openaiModels,
  anthropicModels,
  googleModels,
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
  getImageModels,
  getAudioModels,
  getEmbeddingModels,
};
