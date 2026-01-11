/**
 * Design Agent Service
 * Handles AI-powered design operations using Vercel AI SDK
 */

import { generateObject } from 'ai';
import { getModel, getDefaultProvider } from './provider.js';
import { DesignOperationsSchema } from './schemas/design-operations.js';

/**
 * Build the system prompt for the design agent
 * @param {object} context - Canvas and project context
 * @returns {string} The system prompt
 */
function buildDesignSystemPrompt(context) {
  const { canvas, duration, elements, selectedElement, brand } = context;

  return `You are a creative AI assistant helping design social media content.
You control a canvas editor by returning structured operations.

CANVAS: ${canvas.width}x${canvas.height} pixels (${canvas.name})
DURATION: ${duration}ms
CURRENT ELEMENTS: ${elements.length} elements
${selectedElement ? `SELECTED: ${selectedElement.name} (${selectedElement.type}, id: ${selectedElement.id})` : 'No element selected'}

BRAND COLORS:
- Primary: ${brand.colors.primary}
- Secondary: ${brand.colors.secondary}
- Accent: ${brand.colors.accent}
- Background: ${brand.colors.background}
- Text: ${brand.colors.text}

TYPOGRAPHY:
- Heading Font: ${brand.fonts.heading}
- Body Font: ${brand.fonts.body}

BRAND PERSONALITY: ${brand.personality || 'Not defined'}

AVAILABLE ANIMATIONS (use these names in the ease field):
- power2.out, power2.in, power2.inOut - Standard easing
- back.out(1.7) - Overshoot effect
- elastic.out(1, 0.5) - Bouncy effect
- power3.out - Snappy easing

POSITIONING GUIDELINES:
- Canvas center X: ${Math.round(canvas.width / 2)}
- Canvas center Y: ${Math.round(canvas.height / 2)}
- To center an element: x = (${canvas.width} - elementWidth) / 2

DESIGN BEST PRACTICES:
1. Always include at least one animation for visual interest
2. Stagger animations using different startTime values (0, 200, 400ms)
3. Use brand colors for consistency
4. Keep text readable (min 24px for body, 48px+ for headlines)
5. Leave padding from edges (at least 40px)

When asked to create designs, return operations that modify the canvas.
Include a brief message explaining what you created.`;
}

/**
 * Execute a design prompt and return structured operations
 * @param {string} userMessage - The user's design request
 * @param {object} context - Canvas context (canvas, duration, elements, selectedElement, brand)
 * @param {string} provider - AI provider to use
 * @returns {Promise<object>} Result with operations or error
 */
export async function executeDesignPrompt(userMessage, context, provider = null) {
  const selectedProvider = provider || getDefaultProvider();
  const systemPrompt = buildDesignSystemPrompt(context);

  try {
    const result = await generateObject({
      model: getModel(selectedProvider, 'smart'),
      schema: DesignOperationsSchema,
      system: systemPrompt,
      prompt: userMessage,
    });

    return {
      success: true,
      operations: result.object.operations,
      message: result.object.message,
      thinking: result.object.thinking,
      provider: selectedProvider,
    };
  } catch (error) {
    console.error('Design agent error:', error);
    return {
      success: false,
      error: error.message,
      provider: selectedProvider,
    };
  }
}

/**
 * Execute design operations on the canvas via dispatch
 * @param {object[]} operations - Operations to execute
 * @param {function} dispatch - React dispatch function
 */
export function executeOperations(operations, dispatch) {
  if (!operations || !Array.isArray(operations)) return;

  operations.forEach(op => {
    switch (op.type) {
      case 'addElement':
        if (op.element) {
          dispatch({ type: 'ADD_ELEMENT', element: op.element });
        }
        break;
      case 'updateElement':
        if (op.id && op.updates) {
          dispatch({ type: 'UPDATE_ELEMENT', id: op.id, updates: op.updates });
        }
        break;
      case 'deleteElement':
        if (op.id) {
          dispatch({ type: 'DELETE_ELEMENT', id: op.id });
        }
        break;
      case 'updateCanvas':
        if (op.updates) {
          dispatch({ type: 'UPDATE_PROJECT', updates: { canvas: op.updates } });
        }
        break;
      default:
        console.warn('Unknown operation type:', op.type);
    }
  });
}

/**
 * Execute design prompt with fallback to other providers
 * @param {string} userMessage - The user's design request
 * @param {object} context - Canvas context
 * @returns {Promise<object>} Result with operations or error
 */
export async function executeDesignPromptWithFallback(userMessage, context) {
  const providers = ['anthropic', 'openai', 'google'];

  for (const provider of providers) {
    const result = await executeDesignPrompt(userMessage, context, provider);
    if (result.success) {
      return result;
    }
    console.warn(`Provider ${provider} failed, trying next...`);
  }

  return {
    success: false,
    error: 'All AI providers failed',
  };
}

export default {
  executeDesignPrompt,
  executeOperations,
  executeDesignPromptWithFallback,
};
