import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Loader2, RefreshCw } from 'lucide-react';
import { generateBrandSuggestions } from '../services/ai/brand-generator.js';
import { providerInfo, getDefaultProvider, isProviderConfigured } from '../services/ai/provider.js';

const BrandGuideGenerator = ({ onComplete, onBack }) => {
    const [step, setStep] = useState(0);
    const [brand, setBrand] = useState({
        name: '',
        colors: { primary: '#00D4FF', secondary: '#7B2CBF', accent: '#FF006E', background: '#0A0A0F', text: '#FFFFFF' },
        fonts: { heading: 'Space Grotesk', body: 'DM Sans' },
        personality: '',
        tone: '',
    });
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState(null);
    const [aiError, setAiError] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(getDefaultProvider());

    const handleGenerateSuggestions = async () => {
        setAiLoading(true);
        setAiError(null);
        setAiSuggestions(null);

        const result = await generateBrandSuggestions(brand.name, selectedProvider);

        if (result.success) {
            setAiSuggestions(result.data);
        } else {
            setAiError(result.error || 'Failed to generate suggestions');
        }

        setAiLoading(false);
    };

    const applyAiSuggestions = () => {
        if (aiSuggestions) {
            setBrand(prev => ({
                ...prev,
                personality: aiSuggestions.personality,
                tone: aiSuggestions.tone,
                colors: { ...prev.colors, ...aiSuggestions.colors },
                fonts: aiSuggestions.fonts || prev.fonts,
            }));
            setStep(2);
        }
    };

    const configuredProviders = ['anthropic', 'openai', 'google'].filter(isProviderConfigured);

    const steps = [
        // Step 0: Brand Name
        <div key="name" className="brand-step">
            <h2>What's your brand called?</h2>
            <input
                type="text"
                value={brand.name}
                onChange={e => setBrand(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter brand name..."
                autoFocus
            />

            {/* Provider Selection */}
            {configuredProviders.length > 1 && (
                <div className="provider-selection">
                    <label>AI Model:</label>
                    <div className="provider-buttons">
                        {configuredProviders.map(p => (
                            <button
                                key={p}
                                className={`provider-btn ${selectedProvider === p ? 'active' : ''}`}
                                onClick={() => setSelectedProvider(p)}
                                title={providerInfo[p].description}
                            >
                                <span>{providerInfo[p].icon}</span>
                                <span>{providerInfo[p].name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                className="btn-primary"
                disabled={!brand.name}
                onClick={() => {
                    handleGenerateSuggestions();
                    setStep(1);
                }}
            >
                Continue
                <ChevronRight size={18} />
            </button>
        </div>,

        // Step 1: AI Suggestions
        <div key="ai" className="brand-step">
            <h2>AI Brand Suggestions</h2>
            <p className="provider-badge">
                {providerInfo[selectedProvider]?.icon} Powered by {providerInfo[selectedProvider]?.name}
            </p>

            {aiLoading ? (
                <div className="ai-loading">
                    <Loader2 className="spin" size={32} />
                    <p>Generating brand suggestions...</p>
                </div>
            ) : aiSuggestions ? (
                <div className="ai-suggestions">
                    <div className="suggestion-card">
                        <h3>Personality</h3>
                        <p>{aiSuggestions.personality}</p>
                    </div>
                    <div className="suggestion-card">
                        <h3>Tone of Voice</h3>
                        <p>{aiSuggestions.tone}</p>
                    </div>
                    <div className="suggestion-card">
                        <h3>Color Palette</h3>
                        <div className="color-preview">
                            <div style={{ background: aiSuggestions.colors.primary }} title="Primary"></div>
                            <div style={{ background: aiSuggestions.colors.secondary }} title="Secondary"></div>
                            <div style={{ background: aiSuggestions.colors.accent }} title="Accent"></div>
                            {aiSuggestions.colors.background && (
                                <div style={{ background: aiSuggestions.colors.background }} title="Background"></div>
                            )}
                        </div>
                    </div>
                    {aiSuggestions.fonts && (
                        <div className="suggestion-card">
                            <h3>Typography</h3>
                            <p>Heading: {aiSuggestions.fonts.heading}</p>
                            <p>Body: {aiSuggestions.fonts.body}</p>
                        </div>
                    )}
                    {aiSuggestions.visualStyle && (
                        <div className="suggestion-card">
                            <h3>Visual Style</h3>
                            <p>{aiSuggestions.visualStyle}</p>
                        </div>
                    )}
                    <div className="button-row">
                        <button className="btn-ghost" onClick={handleGenerateSuggestions}>
                            <RefreshCw size={16} />
                            Regenerate
                        </button>
                        <button className="btn-ghost" onClick={() => setStep(2)}>Customize Instead</button>
                        <button className="btn-primary" onClick={applyAiSuggestions}>Use Suggestions</button>
                    </div>
                </div>
            ) : aiError ? (
                <div className="ai-error">
                    <p>Couldn't generate suggestions: {aiError}</p>
                    <p>Let's customize manually!</p>
                    <div className="button-row">
                        <button className="btn-ghost" onClick={handleGenerateSuggestions}>
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                        <button className="btn-primary" onClick={() => setStep(2)}>Continue</button>
                    </div>
                </div>
            ) : (
                <div className="ai-error">
                    <p>Something went wrong. Let's customize manually!</p>
                    <button className="btn-primary" onClick={() => setStep(2)}>Continue</button>
                </div>
            )}
        </div>,

        // Step 2: Colors
        <div key="colors" className="brand-step">
            <h2>Choose your colors</h2>
            <div className="color-inputs">
                {Object.entries(brand.colors).map(([key, value]) => (
                    <div key={key} className="color-input">
                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <div className="color-field">
                            <input
                                type="color"
                                value={value}
                                onChange={e => setBrand(prev => ({
                                    ...prev,
                                    colors: { ...prev.colors, [key]: e.target.value }
                                }))}
                            />
                            <input
                                type="text"
                                value={value}
                                onChange={e => setBrand(prev => ({
                                    ...prev,
                                    colors: { ...prev.colors, [key]: e.target.value }
                                }))}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn-primary" onClick={() => setStep(3)}>
                Continue
                <ChevronRight size={18} />
            </button>
        </div>,

        // Step 3: Personality
        <div key="personality" className="brand-step">
            <h2>Define your brand voice</h2>
            <div className="form-group">
                <label>Brand Personality</label>
                <input
                    type="text"
                    value={brand.personality}
                    onChange={e => setBrand(prev => ({ ...prev, personality: e.target.value }))}
                    placeholder="e.g., Bold, innovative, approachable"
                />
            </div>
            <div className="form-group">
                <label>Tone of Voice</label>
                <textarea
                    value={brand.tone}
                    onChange={e => setBrand(prev => ({ ...prev, tone: e.target.value }))}
                    placeholder="Describe how your brand communicates..."
                    rows={3}
                />
            </div>
            <button
                className="btn-primary"
                onClick={() => onComplete({ ...brand, id: `brand-${Date.now()}` })}
            >
                <Check size={18} />
                Create Brand Guide
            </button>
        </div>,
    ];

    return (
        <div className="brand-generator">
            <button className="back-btn" onClick={onBack}>
                <ChevronLeft size={20} />
                Back to Library
            </button>
            <div className="brand-progress">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`progress-dot ${i <= step ? 'active' : ''}`} />
                ))}
            </div>
            {steps[step]}

            <style>{`
                .provider-selection {
                    margin: 16px 0;
                }
                .provider-selection label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 14px;
                    opacity: 0.7;
                }
                .provider-buttons {
                    display: flex;
                    gap: 8px;
                }
                .provider-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 12px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: inherit;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .provider-btn:hover {
                    background: rgba(255,255,255,0.1);
                }
                .provider-btn.active {
                    background: rgba(255,255,255,0.15);
                    border-color: rgba(255,255,255,0.3);
                }
                .provider-badge {
                    font-size: 12px;
                    opacity: 0.6;
                    margin-bottom: 16px;
                }
                .button-row {
                    display: flex;
                    gap: 12px;
                    margin-top: 16px;
                }
                .btn-ghost svg {
                    margin-right: 4px;
                }
            `}</style>
        </div>
    );
};

export default BrandGuideGenerator;
