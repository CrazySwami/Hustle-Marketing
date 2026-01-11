/**
 * Model Selector Component
 * Allows users to choose between AI providers
 */

import React from 'react';
import { providerInfo, isProviderConfigured } from '../../services/ai/provider.js';

const ModelSelector = ({ value, onChange, compact = false }) => {
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
          </button>
        ))}
      </div>
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
      `}</style>
    </div>
  );
};

export default ModelSelector;
