import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Send, RefreshCw } from 'lucide-react';
import { executeDesignPrompt, executeOperations } from '../services/ai/design-agent.js';
import { getDefaultProvider, providerInfo } from '../services/ai/provider.js';
import ModelSelector from './ai/ModelSelector.jsx';

const AIChatPanel = ({ project, selectedElement, dispatch, brand }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hi! I'm your creative AI assistant. I can help you design your ${project.canvas.name}. Try asking me to:\n\n• "Add a bold headline"\n• "Create a CTA button"\n• "Add a background gradient"\n\nWhat would you like to create?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [provider, setProvider] = useState(getDefaultProvider());
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Persist provider selection
    useEffect(() => {
        const saved = localStorage.getItem('ai-provider');
        if (saved) setProvider(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem('ai-provider', provider);
    }, [provider]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Build context for the design agent
            const context = {
                canvas: project.canvas,
                duration: project.duration,
                elements: project.elements,
                selectedElement,
                brand: brand || project.brandGuide,
            };

            // Execute the design prompt
            const result = await executeDesignPrompt(userMessage, context, provider);

            if (result.success) {
                // Execute the operations on the canvas
                if (result.operations && result.operations.length > 0) {
                    executeOperations(result.operations, dispatch);
                }

                // Add the assistant's response
                const responseMessage = result.message ||
                    `Done! I've made ${result.operations?.length || 0} change(s) to your canvas. Hit play to see your animations.`;

                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: responseMessage,
                    operations: result.operations,
                    provider: result.provider,
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Sorry, I encountered an error: ${result.error}. Please try again.`,
                    error: true,
                }]);
            }
        } catch (err) {
            console.error('AI error:', err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                error: true,
            }]);
        }

        setIsLoading(false);
    };

    const clearChat = () => {
        setMessages([{
            role: 'assistant',
            content: `Chat cleared. I'm ready to help you design your ${project.canvas.name}. What would you like to create?`
        }]);
    };

    return (
        <div className="ai-chat-panel">
            <div className="chat-header">
                <div className="header-left">
                    <Sparkles size={18} />
                    <span>AI Assistant</span>
                </div>
                <div className="header-right">
                    <ModelSelector value={provider} onChange={setProvider} compact />
                    <button className="clear-btn" onClick={clearChat} title="Clear chat">
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.role} ${msg.error ? 'error' : ''}`}>
                        <div className="message-content">{msg.content}</div>
                        {msg.operations && msg.operations.length > 0 && (
                            <div className="operations-badge">
                                {msg.operations.length} operation{msg.operations.length !== 1 ? 's' : ''} applied
                            </div>
                        )}
                        {msg.provider && (
                            <div className="provider-tag">
                                {providerInfo[msg.provider]?.icon}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message assistant">
                        <div className="message-content loading">
                            <Loader2 className="spin" size={16} />
                            <span>Creating with {providerInfo[provider]?.name}...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me to create something..."
                    disabled={isLoading}
                />
                <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                    <Send size={18} />
                </button>
            </div>

            <style>{`
                .chat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                }
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .clear-btn {
                    padding: 4px;
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.5);
                    cursor: pointer;
                    border-radius: 4px;
                    transition: all 0.15s;
                }
                .clear-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.8);
                }
                .chat-message.error .message-content {
                    color: #f87171;
                }
                .operations-badge {
                    font-size: 10px;
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-top: 6px;
                    display: inline-block;
                }
                .provider-tag {
                    position: absolute;
                    top: 4px;
                    right: 8px;
                    font-size: 12px;
                    opacity: 0.5;
                }
                .chat-message {
                    position: relative;
                }
                .message-content.loading {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            `}</style>
        </div>
    );
};

export default AIChatPanel;
