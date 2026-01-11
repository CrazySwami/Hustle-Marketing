import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';

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

    const generateBrandSuggestions = async () => {
        setAiLoading(true);
        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || '',
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true"
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [{
                        role: "user",
                        content: `Based on this brand name: "${brand.name}", suggest:
1. A brand personality (2-3 adjectives)
2. A tone of voice (1 sentence)
3. A primary color (hex code) that matches the personality
4. A secondary color (hex code) that complements it
5. An accent color (hex code) for CTAs

Respond in JSON format only:
{
  "personality": "...",
  "tone": "...",
  "colors": { "primary": "#...", "secondary": "#...", "accent": "#..." }
}`
                    }],
                })
            });

            const data = await response.json();
            const text = data.content.map(c => c.text || '').join('');
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                setAiSuggestions(JSON.parse(jsonMatch[0]));
            }
        } catch (err) {
            console.error('AI suggestion error:', err);
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
            }));
            setStep(2);
        }
    };

    const steps = [
        <div key="name" className="brand-step">
            <h2>What's your brand called?</h2>
            <input
                type="text"
                value={brand.name}
                onChange={e => setBrand(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter brand name..."
                autoFocus
            />
            <button
                className="btn-primary"
                disabled={!brand.name}
                onClick={() => {
                    generateBrandSuggestions();
                    setStep(1);
                }}
            >
                Continue
                <ChevronRight size={18} />
            </button>
        </div>,

        <div key="ai" className="brand-step">
            <h2>AI Brand Suggestions</h2>
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
                            <div style={{ background: aiSuggestions.colors.primary }}></div>
                            <div style={{ background: aiSuggestions.colors.secondary }}></div>
                            <div style={{ background: aiSuggestions.colors.accent }}></div>
                        </div>
                    </div>
                    <div className="button-row">
                        <button className="btn-ghost" onClick={() => setStep(2)}>Customize Instead</button>
                        <button className="btn-primary" onClick={applyAiSuggestions}>Use Suggestions</button>
                    </div>
                </div>
            ) : (
                <div className="ai-error">
                    <p>Couldn't generate suggestions. Let's customize manually!</p>
                    <button className="btn-primary" onClick={() => setStep(2)}>Continue</button>
                </div>
            )}
        </div>,

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
        </div>
    );
};

export default BrandGuideGenerator;
