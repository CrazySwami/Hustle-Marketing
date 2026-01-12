/**
 * Session Cost Tracker Hook
 * Tracks AI API usage costs during a session
 */

import { useState, useCallback, useEffect } from 'react';
import { getModelInfo } from '../services/ai/provider.js';

const STORAGE_KEY = 'ai_session_costs';

export function useCostTracker() {
  const [sessionCosts, setSessionCosts] = useState(() => {
    // Load from sessionStorage on mount
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load session costs:', e);
    }
    return {
      totalCost: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      requests: [],
      startTime: Date.now(),
    };
  });

  // Save to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionCosts));
    } catch (e) {
      console.warn('Failed to save session costs:', e);
    }
  }, [sessionCosts]);

  /**
   * Track a completed request
   * @param {object} params - Request parameters
   * @param {string} params.provider - Provider name
   * @param {string} params.tier - Model tier
   * @param {string} params.modelId - Model ID used
   * @param {number} params.inputTokens - Input tokens used
   * @param {number} params.outputTokens - Output tokens used
   * @param {string} params.type - Request type (text, image, audio, etc.)
   */
  const trackRequest = useCallback((params) => {
    const {
      provider,
      tier,
      modelId,
      inputTokens = 0,
      outputTokens = 0,
      type = 'text',
      imageCost = 0,
      audioCost = 0,
    } = params;

    const modelInfo = getModelInfo(provider, tier);
    const inputCost = (inputTokens / 1_000_000) * (modelInfo?.inputCost || 0);
    const outputCost = (outputTokens / 1_000_000) * (modelInfo?.outputCost || 0);
    const totalRequestCost = inputCost + outputCost + imageCost + audioCost;

    const request = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      provider,
      tier,
      modelId,
      type,
      inputTokens,
      outputTokens,
      inputCost,
      outputCost,
      imageCost,
      audioCost,
      totalCost: totalRequestCost,
    };

    setSessionCosts(prev => ({
      ...prev,
      totalCost: prev.totalCost + totalRequestCost,
      totalInputTokens: prev.totalInputTokens + inputTokens,
      totalOutputTokens: prev.totalOutputTokens + outputTokens,
      requests: [...prev.requests, request],
    }));

    return request;
  }, []);

  /**
   * Get costs grouped by provider
   */
  const getCostsByProvider = useCallback(() => {
    const byProvider = {};
    sessionCosts.requests.forEach(req => {
      if (!byProvider[req.provider]) {
        byProvider[req.provider] = {
          totalCost: 0,
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
        };
      }
      byProvider[req.provider].totalCost += req.totalCost;
      byProvider[req.provider].requests += 1;
      byProvider[req.provider].inputTokens += req.inputTokens;
      byProvider[req.provider].outputTokens += req.outputTokens;
    });
    return byProvider;
  }, [sessionCosts.requests]);

  /**
   * Get costs grouped by model tier
   */
  const getCostsByTier = useCallback(() => {
    const byTier = {};
    sessionCosts.requests.forEach(req => {
      if (!byTier[req.tier]) {
        byTier[req.tier] = { totalCost: 0, requests: 0 };
      }
      byTier[req.tier].totalCost += req.totalCost;
      byTier[req.tier].requests += 1;
    });
    return byTier;
  }, [sessionCosts.requests]);

  /**
   * Reset session costs
   */
  const resetSession = useCallback(() => {
    setSessionCosts({
      totalCost: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      requests: [],
      startTime: Date.now(),
    });
  }, []);

  /**
   * Format cost for display
   */
  const formatCost = useCallback((cost) => {
    if (cost < 0.01) {
      return `$${cost.toFixed(4)}`;
    }
    return `$${cost.toFixed(2)}`;
  }, []);

  /**
   * Get session duration
   */
  const getSessionDuration = useCallback(() => {
    const ms = Date.now() - sessionCosts.startTime;
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }, [sessionCosts.startTime]);

  return {
    // Data
    totalCost: sessionCosts.totalCost,
    totalInputTokens: sessionCosts.totalInputTokens,
    totalOutputTokens: sessionCosts.totalOutputTokens,
    requestCount: sessionCosts.requests.length,
    requests: sessionCosts.requests,

    // Actions
    trackRequest,
    resetSession,

    // Computed
    getCostsByProvider,
    getCostsByTier,
    formatCost,
    getSessionDuration,
  };
}

export default useCostTracker;
