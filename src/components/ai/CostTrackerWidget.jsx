/**
 * Cost Tracker Widget
 * Floating widget showing session costs
 */

import React, { useState } from 'react';
import { DollarSign, ChevronDown, ChevronUp, RotateCcw, X } from 'lucide-react';

const CostTrackerWidget = ({
  totalCost,
  requestCount,
  totalInputTokens,
  totalOutputTokens,
  getCostsByProvider,
  formatCost,
  getSessionDuration,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        className="cost-tracker-show"
        onClick={() => setIsVisible(true)}
        title="Show cost tracker"
      >
        <DollarSign size={14} />
      </button>
    );
  }

  const costsByProvider = getCostsByProvider();

  return (
    <div className={`cost-tracker-widget ${isExpanded ? 'expanded' : ''}`}>
      <div className="tracker-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="tracker-main">
          <DollarSign size={14} />
          <span className="total-cost">{formatCost(totalCost)}</span>
          <span className="request-count">({requestCount} req)</span>
        </div>
        <div className="tracker-actions">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          <button
            className="hide-btn"
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
            title="Hide"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="tracker-details">
          <div className="detail-row">
            <span>Session:</span>
            <span>{getSessionDuration()}</span>
          </div>
          <div className="detail-row">
            <span>Input tokens:</span>
            <span>{totalInputTokens.toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span>Output tokens:</span>
            <span>{totalOutputTokens.toLocaleString()}</span>
          </div>

          {Object.keys(costsByProvider).length > 0 && (
            <>
              <div className="divider" />
              <div className="provider-breakdown">
                <div className="section-title">By Provider</div>
                {Object.entries(costsByProvider).map(([provider, data]) => (
                  <div key={provider} className="provider-row">
                    <span className={`provider-name ${provider}`}>{provider}</span>
                    <span>{formatCost(data.totalCost)} ({data.requests})</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <button className="reset-btn" onClick={onReset}>
            <RotateCcw size={12} />
            Reset Session
          </button>
        </div>
      )}

      <style>{`
        .cost-tracker-show {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.1);
          color: #10B981;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .cost-tracker-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          min-width: 160px;
          font-size: 12px;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          cursor: pointer;
        }
        .tracker-header:hover {
          background: rgba(255,255,255,0.03);
        }
        .tracker-main {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tracker-main svg {
          color: #10B981;
        }
        .total-cost {
          font-weight: 600;
          color: #10B981;
          font-family: monospace;
        }
        .request-count {
          color: #666;
        }
        .tracker-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #666;
        }
        .hide-btn {
          background: none;
          border: none;
          padding: 2px;
          cursor: pointer;
          color: #666;
          display: flex;
        }
        .hide-btn:hover { color: #fff; }
        .tracker-details {
          padding: 8px 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          color: #888;
        }
        .divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 8px 0;
        }
        .section-title {
          font-size: 10px;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 6px;
        }
        .provider-row {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
        }
        .provider-name {
          font-weight: 500;
        }
        .provider-name.anthropic { color: #7C3AED; }
        .provider-name.openai { color: #10B981; }
        .provider-name.google { color: #3B82F6; }
        .reset-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 6px;
          margin-top: 8px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 4px;
          color: #EF4444;
          cursor: pointer;
          font-size: 11px;
        }
        .reset-btn:hover {
          background: rgba(239,68,68,0.2);
        }
      `}</style>
    </div>
  );
};

export default CostTrackerWidget;
