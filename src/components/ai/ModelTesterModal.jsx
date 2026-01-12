/**
 * Model Tester Modal
 * UI for testing AI models with minimal token usage
 */

import React, { useState, useCallback } from 'react';
import { X, Play, CheckCircle, XCircle, Loader, AlertCircle, Zap } from 'lucide-react';
import {
  testAllModels,
  testProviderModels,
  quickHealthCheck,
  getTestableModels,
  estimateTestCosts,
  isSimulationMode,
} from '../../services/ai/model-tester.js';

const ModelTesterModal = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [healthCheck, setHealthCheck] = useState(null);
  const [currentTest, setCurrentTest] = useState(null);
  const [testType, setTestType] = useState(null);

  const handleProgress = useCallback((model, result) => {
    setCurrentTest(model.name);
    setResults(prev => [...prev, result]);
  }, []);

  // Early return AFTER all hooks
  if (!isOpen) return null;

  const testableModels = getTestableModels();
  const costEstimate = estimateTestCosts();
  const simulationMode = isSimulationMode();

  const runQuickHealthCheck = async () => {
    setIsRunning(true);
    setTestType('health');
    setResults([]);
    setHealthCheck(null);
    setCurrentTest('Running health check...');

    try {
      const result = await quickHealthCheck();
      setHealthCheck(result);
    } catch (error) {
      console.error('Health check failed:', error);
    }

    setIsRunning(false);
    setCurrentTest(null);
  };

  const runFullTest = async () => {
    setIsRunning(true);
    setTestType('full');
    setResults([]);
    setHealthCheck(null);

    try {
      await testAllModels(handleProgress);
    } catch (error) {
      console.error('Test failed:', error);
    }

    setIsRunning(false);
    setCurrentTest(null);
  };

  const runProviderTest = async (provider) => {
    setIsRunning(true);
    setTestType(provider);
    setResults([]);
    setHealthCheck(null);

    try {
      await testProviderModels(provider, handleProgress);
    } catch (error) {
      console.error('Test failed:', error);
    }

    setIsRunning(false);
    setCurrentTest(null);
  };

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="tester-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Model Tester</h2>
          <button className="close-btn" onClick={onClose} disabled={isRunning}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="test-info">
            <AlertCircle size={16} />
            <span>
              Tests {testableModels.length} models with minimal tokens.
              {simulationMode ? (
                <strong className="sim-badge"> Simulation Mode</strong>
              ) : (
                <>Estimated cost: <strong>{costEstimate.formatted}</strong></>
              )}
            </span>
          </div>

          {simulationMode && (
            <div className="simulation-notice">
              <span>Running in simulation mode. Real API testing requires a backend server to keep API keys secure. Results shown are simulated to demonstrate the UI.</span>
            </div>
          )}

          <div className="test-actions">
            <button
              className="test-btn health"
              onClick={runQuickHealthCheck}
              disabled={isRunning}
            >
              <Zap size={16} />
              Quick Health Check
              <span className="btn-desc">3 models, ~$0.0001</span>
            </button>

            <div className="provider-tests">
              <button
                className="test-btn anthropic"
                onClick={() => runProviderTest('anthropic')}
                disabled={isRunning}
              >
                Test Anthropic
              </button>
              <button
                className="test-btn openai"
                onClick={() => runProviderTest('openai')}
                disabled={isRunning}
              >
                Test OpenAI
              </button>
              <button
                className="test-btn google"
                onClick={() => runProviderTest('google')}
                disabled={isRunning}
              >
                Test Google
              </button>
            </div>

            <button
              className="test-btn full"
              onClick={runFullTest}
              disabled={isRunning}
            >
              <Play size={16} />
              Test All Models
              <span className="btn-desc">{testableModels.length} models</span>
            </button>
          </div>

          {isRunning && (
            <div className="running-status">
              <Loader size={16} className="spin" />
              <span>Testing: {currentTest}</span>
            </div>
          )}

          {healthCheck && (
            <div className="health-results">
              <h3>Health Check Results</h3>
              <div className={`health-status ${healthCheck.allHealthy ? 'healthy' : 'unhealthy'}`}>
                {healthCheck.allHealthy ? (
                  <>
                    <CheckCircle size={20} />
                    All Providers Healthy
                  </>
                ) : (
                  <>
                    <XCircle size={20} />
                    Some Providers Unavailable
                  </>
                )}
              </div>
              <div className="provider-health">
                {Object.entries(healthCheck.providers).map(([provider, data]) => (
                  <div key={provider} className={`provider-status ${data.healthy ? 'ok' : 'fail'}`}>
                    <span className="provider-name">{provider}</span>
                    <span className="model-name">{data.model}</span>
                    {data.healthy ? (
                      <span className="latency">{data.latency}ms</span>
                    ) : (
                      <span className="error">{data.error}</span>
                    )}
                    {data.healthy ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="test-results">
              <div className="results-header">
                <h3>Test Results</h3>
                <div className="results-summary">
                  <span className="success">{successCount} passed</span>
                  <span className="fail">{failCount} failed</span>
                </div>
              </div>
              <div className="results-list">
                {results.map((result, idx) => (
                  <div key={idx} className={`result-row ${result.success ? 'success' : 'fail'}`}>
                    <div className="result-icon">
                      {result.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    </div>
                    <div className="result-info">
                      <div className="result-name">{result.name}</div>
                      <div className="result-id">{result.id}</div>
                    </div>
                    <div className="result-meta">
                      {result.success ? (
                        <>
                          <span className="latency">{result.latency}ms</span>
                          {result.usage && (
                            <span className="tokens">
                              {result.usage.totalTokens} tokens
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="error">{result.error?.substring(0, 40)}...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          .tester-modal {
            background: #1a1a2e;
            border-radius: 12px;
            width: 100%;
            max-width: 600px;
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
          .modal-header h2 { margin: 0; font-size: 18px; }
          .close-btn {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
          }
          .close-btn:hover { color: #fff; }
          .close-btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .modal-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }
          .test-info {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px;
            background: rgba(59,130,246,0.1);
            border: 1px solid rgba(59,130,246,0.3);
            border-radius: 8px;
            margin-bottom: 12px;
            font-size: 13px;
            color: #93c5fd;
          }
          .sim-badge {
            background: rgba(234,179,8,0.2);
            color: #EAB308;
            padding: 2px 8px;
            border-radius: 4px;
            margin-left: 4px;
          }
          .simulation-notice {
            padding: 10px 12px;
            background: rgba(234,179,8,0.1);
            border: 1px solid rgba(234,179,8,0.3);
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 12px;
            color: #fcd34d;
            line-height: 1.4;
          }
          .test-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
          }
          .test-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s;
          }
          .test-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .test-btn .btn-desc {
            font-size: 11px;
            opacity: 0.7;
            margin-left: 8px;
          }
          .test-btn.health {
            background: rgba(234,179,8,0.2);
            color: #EAB308;
          }
          .test-btn.health:hover:not(:disabled) {
            background: rgba(234,179,8,0.3);
          }
          .test-btn.full {
            background: rgba(147,51,234,0.2);
            color: #A855F7;
          }
          .test-btn.full:hover:not(:disabled) {
            background: rgba(147,51,234,0.3);
          }
          .provider-tests {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          .test-btn.anthropic {
            background: rgba(124,58,237,0.2);
            color: #A78BFA;
          }
          .test-btn.openai {
            background: rgba(16,185,129,0.2);
            color: #34D399;
          }
          .test-btn.google {
            background: rgba(59,130,246,0.2);
            color: #60A5FA;
          }
          .running-status {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 13px;
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .health-results {
            margin-bottom: 20px;
          }
          .health-results h3 {
            font-size: 14px;
            margin: 0 0 12px;
          }
          .health-status {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
            font-weight: 500;
          }
          .health-status.healthy {
            background: rgba(16,185,129,0.2);
            color: #10B981;
          }
          .health-status.unhealthy {
            background: rgba(239,68,68,0.2);
            color: #EF4444;
          }
          .provider-health {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .provider-status {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            background: rgba(255,255,255,0.03);
            border-radius: 6px;
          }
          .provider-status.ok { border-left: 3px solid #10B981; }
          .provider-status.fail { border-left: 3px solid #EF4444; }
          .provider-status .provider-name {
            font-weight: 500;
            text-transform: capitalize;
            width: 80px;
          }
          .provider-status .model-name {
            flex: 1;
            color: #888;
            font-size: 12px;
          }
          .provider-status .latency {
            color: #10B981;
            font-family: monospace;
            font-size: 12px;
          }
          .provider-status .error {
            color: #EF4444;
            font-size: 11px;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .test-results h3 {
            font-size: 14px;
            margin: 0;
          }
          .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          .results-summary {
            display: flex;
            gap: 12px;
            font-size: 12px;
          }
          .results-summary .success { color: #10B981; }
          .results-summary .fail { color: #EF4444; }
          .results-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: 300px;
            overflow-y: auto;
          }
          .result-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            background: rgba(255,255,255,0.02);
            border-radius: 6px;
            font-size: 12px;
          }
          .result-row.success .result-icon { color: #10B981; }
          .result-row.fail .result-icon { color: #EF4444; }
          .result-info {
            flex: 1;
            min-width: 0;
          }
          .result-name {
            font-weight: 500;
          }
          .result-id {
            font-size: 10px;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .result-meta {
            display: flex;
            gap: 8px;
            align-items: center;
            font-size: 11px;
          }
          .result-meta .latency {
            color: #10B981;
            font-family: monospace;
          }
          .result-meta .tokens {
            color: #888;
          }
          .result-meta .error {
            color: #EF4444;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ModelTesterModal;
