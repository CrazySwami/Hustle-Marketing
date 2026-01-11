/**
 * Model Selector Component
 * Allows users to choose between AI providers and model tiers
 *
 * Latest Models (January 2026):
 * - Claude 4.5: Haiku (fast), Sonnet (smart), Opus (reasoning)
 * - OpenAI: o4-mini (fast), GPT-5.2 (smart), o3 (reasoning)
 * - Gemini 3: Flash (fast), Pro (smart), Deep Think (reasoning)
 */

import React from 'react';
import { providerInfo, isProviderConfigured, modelRegistry, getModelInfo } from '../../services/ai/provider.js';

const tierInfo = {
  fast: { name: 'Fast', icon: '⚡', description: 'Quick & cost-effective' },
  smart: { name: 'Smart', icon: '🎯', description: 'Balanced (recommended)' },
  reasoning: { name: 'Reasoning', icon: '🧠', description: 'Complex tasks' },
};

const ModelSelector = ({ value, onChange, tier = 'smart', onTierChange, compact = false, showTier = false }) => {
  const configuredProviders = ['anthropic', 'openai', 'google'].filter(isProviderConfigured);

  // If only one provider is configured, don't show selector
  if (configuredProviders.length <= 1) {
    return null;
  }

  if (compact) {
    return (
      <div className="model-selector compact">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="model-select"
        >
          {configuredProviders.map((p) => (
            <option key={p} value={p}>
              {providerInfo[p].icon} {providerInfo[p].name}
            </option>
          ))}
        </select>
        <style>{`
          .model-selector.compact {
            display: inline-block;
          }
          .model-select {
            padding: 4px 8px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px;
            color: inherit;
            font-size: 12px;
            cursor: pointer;
          }
          .model-select:hover {
            background: rgba(255,255,255,0.1);
          }
        `}</style>
      </div>
    );
  }

  // Get current model info for display
  const currentModelInfo = getModelInfo(value, tier);

  return (
    <div className="model-selector">
      <label>AI Model</label>
      <div className="model-options">
        {configuredProviders.map((p) => (
          <button
            key={p}
            className={`model-option ${value === p ? 'active' : ''}`}
            onClick={() => onChange(p)}
            title={providerInfo[p].description}
          >
            <span className="model-icon">{providerInfo[p].icon}</span>
            <span className="model-name">{providerInfo[p].name}</span>
            {providerInfo[p].recommended && <span className="recommended">★</span>}
          </button>
        ))}
      </div>

      {showTier && onTierChange && (
        <>
          <label style={{ marginTop: '12px' }}>Model Tier</label>
          <div className="tier-options">
            {['fast', 'smart', 'reasoning'].map((t) => (
              <button
                key={t}
                className={`tier-option ${tier === t ? 'active' : ''}`}
                onClick={() => onTierChange(t)}
                title={tierInfo[t].description}
              >
                <span className="tier-icon">{tierInfo[t].icon}</span>
                <span className="tier-name">{tierInfo[t].name}</span>
              </button>
            ))}
          </div>
          <div className="current-model-info">
            Using: <strong>{currentModelInfo.name}</strong>
            <span className="model-description"> - {currentModelInfo.description}</span>
          </div>
        </>
      )}
      <style>{`
        .model-selector {
          margin-bottom: 12px;
        }
        .model-selector label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-bottom: 6px;
        }
        .model-options {
          display: flex;
          gap: 6px;
        }
        .model-option {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .model-option:hover {
          background: rgba(255,255,255,0.1);
        }
        .model-option.active {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.3);
        }
        .model-icon {
          font-size: 14px;
        }
        .model-name {
          font-weight: 500;
        }
        .recommended {
          font-size: 10px;
          color: #fbbf24;
          margin-left: 2px;
        }
        .tier-options {
          display: flex;
          gap: 6px;
        }
        .tier-option {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tier-option:hover {
          background: rgba(255,255,255,0.1);
        }
        .tier-option.active {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.3);
        }
        .tier-icon {
          font-size: 12px;
        }
        .tier-name {
          font-weight: 500;
        }
        .current-model-info {
          margin-top: 8px;
          font-size: 11px;
          opacity: 0.7;
        }
        .model-description {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default ModelSelector;
