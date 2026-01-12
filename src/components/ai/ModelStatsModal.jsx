/**
 * Model Stats Modal
 * Displays comprehensive model information, pricing, and capabilities
 */

import React, { useState } from 'react';
import { X, Zap, Brain, Sparkles, Image, Mic, Volume2, Database } from 'lucide-react';
import {
  openaiModels,
  anthropicModels,
  googleModels,
  capabilities,
} from '../../services/ai/provider.js';

const ModelStatsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [activeProvider, setActiveProvider] = useState('all');

  if (!isOpen) return null;

  const tabs = [
    { id: 'text', label: 'Text Models', icon: Brain },
    { id: 'image', label: 'Image', icon: Image },
    { id: 'audio', label: 'Audio', icon: Mic },
    { id: 'embeddings', label: 'Embeddings', icon: Database },
  ];

  const providers = [
    { id: 'all', label: 'All', color: '#888' },
    { id: 'openai', label: 'OpenAI', color: '#10B981' },
    { id: 'anthropic', label: 'Anthropic', color: '#7C3AED' },
    { id: 'google', label: 'Google', color: '#3B82F6' },
  ];

  const renderTextModels = () => {
    const allModels = [];

    // OpenAI Text Models
    if (activeProvider === 'all' || activeProvider === 'openai') {
      Object.values(openaiModels.text).forEach(m => {
        allModels.push({ ...m, provider: 'OpenAI', providerColor: '#10B981' });
      });
      Object.values(openaiModels.reasoning).forEach(m => {
        allModels.push({ ...m, provider: 'OpenAI', providerColor: '#10B981', isReasoning: true });
      });
    }

    // Anthropic Models
    if (activeProvider === 'all' || activeProvider === 'anthropic') {
      Object.values(anthropicModels.text).forEach(m => {
        allModels.push({ ...m, provider: 'Anthropic', providerColor: '#7C3AED' });
      });
    }

    // Google Models
    if (activeProvider === 'all' || activeProvider === 'google') {
      Object.values(googleModels.text).forEach(m => {
        allModels.push({ ...m, provider: 'Google', providerColor: '#3B82F6' });
      });
    }

    return (
      <div className="model-table">
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Provider</th>
              <th>Input/1M</th>
              <th>Output/1M</th>
              <th>Context</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            {allModels.map((model, idx) => (
              <tr key={idx} className={model.isReasoning ? 'reasoning-model' : ''}>
                <td>
                  <div className="model-name">
                    {model.isReasoning && <Brain size={14} />}
                    {model.name}
                  </div>
                  <div className="model-desc">{model.description}</div>
                </td>
                <td>
                  <span className="provider-badge" style={{ background: model.providerColor }}>
                    {model.provider}
                  </span>
                </td>
                <td className="price">${model.inputCost?.toFixed(2) || '-'}</td>
                <td className="price">${model.outputCost?.toFixed(2) || '-'}</td>
                <td className="context">{model.contextWindow ? `${(model.contextWindow / 1000)}K` : '-'}</td>
                <td>
                  <span className={`tier-badge tier-${model.tier}`}>
                    {model.tier === 'fast' && <Zap size={12} />}
                    {model.tier === 'smart' && <Sparkles size={12} />}
                    {model.tier === 'reasoning' && <Brain size={12} />}
                    {model.tier || 'standard'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderImageModels = () => {
    const imageModels = [];

    if (activeProvider === 'all' || activeProvider === 'openai') {
      Object.values(openaiModels.image).forEach(m => {
        imageModels.push({ ...m, provider: 'OpenAI', providerColor: '#10B981' });
      });
    }

    if (activeProvider === 'all' || activeProvider === 'google') {
      Object.values(googleModels.image).forEach(m => {
        imageModels.push({ ...m, provider: 'Google', providerColor: '#3B82F6' });
      });
    }

    return (
      <div className="model-cards">
        {imageModels.map((model, idx) => (
          <div key={idx} className="model-card">
            <div className="card-header">
              <Image size={20} />
              <span className="provider-badge" style={{ background: model.providerColor }}>
                {model.provider}
              </span>
            </div>
            <h3>{model.name}</h3>
            <p>{model.description}</p>
            <div className="card-details">
              <div className="capabilities">
                {model.capabilities?.map((cap, i) => (
                  <span key={i} className="cap-badge">{cap}</span>
                ))}
              </div>
              {model.costStandard1024 && (
                <div className="pricing">
                  <div>Standard: ${model.costStandard1024}/img</div>
                  <div>HD: ${model.costHD1024}/img</div>
                </div>
              )}
              {model.outputCostLow && (
                <div className="pricing">
                  <div>Low: ${model.outputCostLow}/img</div>
                  <div>Med: ${model.outputCostMedium}/img</div>
                  <div>High: ${model.outputCostHigh}/img</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAudioModels = () => {
    return (
      <div className="model-cards">
        {Object.values(openaiModels.audio).map((model, idx) => (
          <div key={idx} className="model-card">
            <div className="card-header">
              {model.id.includes('whisper') ? <Mic size={20} /> : <Volume2 size={20} />}
              <span className="provider-badge" style={{ background: '#10B981' }}>
                OpenAI
              </span>
            </div>
            <h3>{model.name}</h3>
            <p>{model.description}</p>
            <div className="card-details">
              {model.costPerMinute && (
                <div className="pricing">${model.costPerMinute}/minute</div>
              )}
              {model.costPer1MChars && (
                <div className="pricing">${model.costPer1MChars}/1M chars</div>
              )}
              {model.voices && (
                <div className="voices">
                  Voices: {model.voices.join(', ')}
                </div>
              )}
              {model.capabilities && (
                <div className="capabilities">
                  {model.capabilities.map((cap, i) => (
                    <span key={i} className="cap-badge">{cap}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEmbeddings = () => {
    return (
      <div className="model-cards">
        {Object.values(openaiModels.embeddings).map((model, idx) => (
          <div key={idx} className="model-card">
            <div className="card-header">
              <Database size={20} />
              <span className="provider-badge" style={{ background: '#10B981' }}>
                OpenAI
              </span>
            </div>
            <h3>{model.name}</h3>
            <p>{model.description}</p>
            <div className="card-details">
              <div className="pricing">${model.inputCost}/1M tokens</div>
              <div className="dimensions">{model.dimensions} dimensions</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="model-stats-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>AI Model Statistics & Pricing</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'text' && (
          <div className="provider-filters">
            {providers.map(p => (
              <button
                key={p.id}
                className={`filter-btn ${activeProvider === p.id ? 'active' : ''}`}
                onClick={() => setActiveProvider(p.id)}
                style={activeProvider === p.id ? { borderColor: p.color } : {}}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        <div className="modal-content">
          {activeTab === 'text' && renderTextModels()}
          {activeTab === 'image' && renderImageModels()}
          {activeTab === 'audio' && renderAudioModels()}
          {activeTab === 'embeddings' && renderEmbeddings()}
        </div>

        <div className="modal-footer">
          <div className="pricing-note">
            All prices via Vercel AI Gateway (no markup). Updated Jan 2026.
          </div>
          <a href="https://vercel.com/ai-gateway/models" target="_blank" rel="noopener noreferrer">
            View all models →
          </a>
        </div>

        <style>{`
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }
          .model-stats-modal {
            background: #1a1a2e;
            border-radius: 12px;
            width: 100%;
            max-width: 900px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          .modal-header h2 {
            margin: 0;
            font-size: 18px;
          }
          .close-btn {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            padding: 4px;
          }
          .close-btn:hover { color: #fff; }
          .modal-tabs {
            display: flex;
            gap: 4px;
            padding: 12px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          .tab {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: transparent;
            border: none;
            color: #888;
            cursor: pointer;
            border-radius: 6px;
            font-size: 13px;
          }
          .tab:hover { background: rgba(255,255,255,0.05); color: #fff; }
          .tab.active { background: rgba(255,255,255,0.1); color: #fff; }
          .provider-filters {
            display: flex;
            gap: 8px;
            padding: 12px 20px;
          }
          .filter-btn {
            padding: 6px 12px;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.2);
            color: #888;
            cursor: pointer;
            border-radius: 6px;
            font-size: 12px;
          }
          .filter-btn:hover { color: #fff; border-color: rgba(255,255,255,0.4); }
          .filter-btn.active { color: #fff; background: rgba(255,255,255,0.1); }
          .modal-content {
            flex: 1;
            overflow-y: auto;
            padding: 16px 20px;
          }
          .model-table {
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            text-align: left;
            padding: 10px 12px;
            background: rgba(255,255,255,0.05);
            font-weight: 500;
            color: #888;
            font-size: 11px;
            text-transform: uppercase;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          tr:hover td { background: rgba(255,255,255,0.02); }
          tr.reasoning-model td { background: rgba(147,51,234,0.05); }
          .model-name {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 500;
          }
          .model-desc {
            font-size: 11px;
            color: #666;
            margin-top: 2px;
          }
          .provider-badge {
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            color: #fff;
          }
          .price {
            font-family: monospace;
            color: #10B981;
          }
          .context {
            color: #888;
          }
          .tier-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            text-transform: uppercase;
          }
          .tier-fast { background: rgba(234,179,8,0.2); color: #EAB308; }
          .tier-smart { background: rgba(59,130,246,0.2); color: #3B82F6; }
          .tier-reasoning { background: rgba(147,51,234,0.2); color: #9333EA; }
          .model-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }
          .model-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 16px;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            color: #888;
          }
          .model-card h3 {
            margin: 0 0 6px;
            font-size: 15px;
          }
          .model-card p {
            margin: 0 0 12px;
            font-size: 12px;
            color: #666;
          }
          .card-details {
            font-size: 12px;
          }
          .capabilities {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 8px;
          }
          .cap-badge {
            padding: 2px 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
            font-size: 10px;
          }
          .pricing {
            color: #10B981;
            font-family: monospace;
          }
          .dimensions, .voices {
            color: #888;
            margin-top: 4px;
            font-size: 11px;
          }
          .modal-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            font-size: 12px;
          }
          .pricing-note { color: #666; }
          .modal-footer a {
            color: #3B82F6;
            text-decoration: none;
          }
          .modal-footer a:hover { text-decoration: underline; }
        `}</style>
      </div>
    </div>
  );
};

export default ModelStatsModal;
