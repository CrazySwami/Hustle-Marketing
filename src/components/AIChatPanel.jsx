import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';

const AIChatPanel = ({ project, selectedElement, dispatch, brand }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hi! I'm your creative AI assistant. I can help you design your ${project.canvas.name}. Try asking me to:\n\n• "Add a bold headline"\n• "Create a CTA button"\n• "Add a background gradient"\n\nWhat would you like to create?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const systemPrompt = `You are a creative AI assistant helping design social media content. You control a canvas editor by returning JSON operations.

CANVAS: ${project.canvas.width}x${project.canvas.height} pixels
DURATION: ${project.duration}ms
CURRENT ELEMENTS: ${project.elements.length} elements
${selectedElement ? `SELECTED: ${selectedElement.name} (${selectedElement.type})` : 'No element selected'}

BRAND COLORS:
- Primary: ${brand.colors.primary}
- Secondary: ${brand.colors.secondary}
- Accent: ${brand.colors.accent}
- Background: ${brand.colors.background}
- Text: ${brand.colors.text}
- Heading Font: ${brand.fonts.heading}
- Body Font: ${brand.fonts.body}

AVAILABLE ANIMATIONS (use these exact names):
- fadeIn: opacity 0→1 (great for text)
- fadeOut: opacity 1→0
- slideInLeft: x from -200 to 0
- slideInRight: x from 200 to 0
- slideInUp: y from 200 to 0
- slideInDown: y from -200 to 0
- scaleIn: scale 0→1 (great for shapes)
- bounceIn: scale 0→1 with bounce
- rotateIn: rotation -180→0

OPERATIONS YOU CAN PERFORM:
1. addElement - Add text, shapes, or images
2. updateElement - Modify existing elements (need id)
3. deleteElement - Remove elements (need id)

IMPORTANT POSITIONING:
- Canvas is ${project.canvas.width}x${project.canvas.height}
- Center X: ${Math.round(project.canvas.width / 2)}
- Center Y: ${Math.round(project.canvas.height / 2)}

RESPOND WITH a brief explanation, then a JSON block:

\`\`\`json
{
  "operations": [
    {
      "type": "addElement",
      "element": {
        "type": "text",
        "name": "Main Heading",
        "content": "Your Text",
        "x": ${Math.round((project.canvas.width - 400) / 2)},
        "y": ${Math.round((project.canvas.height - 80) / 2)},
        "width": 400,
        "height": 80,
        "fontSize": 72,
        "fontFamily": "${brand.fonts.heading}",
        "fontWeight": 700,
        "color": "${brand.colors.text}",
        "textAlign": "center",
        "rotation": 0,
        "opacity": 1,
        "animations": [
          { "property": "opacity", "from": 0, "to": 1, "duration": 500, "ease": "power2.out", "startTime": 0 }
        ]
      }
    }
  ]
}
\`\`\`

For shapes:
{
  "type": "shape",
  "shapeType": "rectangle" or "circle",
  "name": "Shape Name",
  "x": 0, "y": 0,
  "width": 200, "height": 200,
  "fill": "#hexcolor",
  "borderRadius": 0 (use 9999 for circles),
  "opacity": 1,
  "animations": [{ "property": "scale", "from": 0, "to": 1, "duration": 500, "ease": "back.out(1.7)", "startTime": 0 }]
}

ALWAYS include at least one animation for visual interest. Stagger animations with different startTime values (e.g., 0, 200, 400ms).`;

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
                    max_tokens: 2000,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: userMessage }],
                })
            });

            const data = await response.json();
            const assistantMessage = data.content?.map(c => c.text || '').join('') || '';

            // Parse and execute operations
            const jsonMatch = assistantMessage.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                try {
                    const { operations } = JSON.parse(jsonMatch[1]);
                    if (operations && Array.isArray(operations)) {
                        operations.forEach(op => {
                            if (op.type === 'addElement' && op.element) {
                                dispatch({ type: 'ADD_ELEMENT', element: op.element });
                            } else if (op.type === 'updateElement' && op.id) {
                                dispatch({ type: 'UPDATE_ELEMENT', id: op.id, updates: op.updates });
                            } else if (op.type === 'deleteElement' && op.id) {
                                dispatch({ type: 'DELETE_ELEMENT', id: op.id });
                            }
                        });
                    }
                } catch (e) {
                    console.error('Failed to parse AI operations:', e);
                }
            }

            const cleanMessage = assistantMessage.replace(/```json[\s\S]*?```/g, '').trim();
            setMessages(prev => [...prev, { role: 'assistant', content: cleanMessage || 'Done! Hit play to see your animations.' }]);

        } catch (err) {
            console.error('AI error:', err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }

        setIsLoading(false);
    };

    return (
        <div className="ai-chat-panel">
            <div className="chat-header">
                <Sparkles size={18} />
                <span>AI Assistant</span>
            </div>
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.role}`}>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message assistant">
                        <div className="message-content loading">
                            <Loader2 className="spin" size={16} />
                            <span>Creating...</span>
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
        </div>
    );
};

export default AIChatPanel;
