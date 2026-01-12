/**
 * Design Agent Service
 * Handles AI-powered design operations using Vercel AI SDK
 *
 * NOTE: Real AI calls require a backend server to keep API keys secure.
 * In client-side mode, this module provides simulated responses.
 */

import { generateObject } from 'ai';
import { getModel, getDefaultProvider, isGatewayConfigured } from './provider.js';
import { DesignOperationsSchema } from './schemas/design-operations.js';

/**
 * Check if we can make real API calls
 * (Only works with a backend server due to CORS)
 */
function canMakeRealCalls() {
  // In a browser-only app, we can't make secure AI API calls
  // due to CORS and API key exposure concerns
  return false;
}

/**
 * Check if running in simulation mode
 */
export function isSimulationMode() {
  return !canMakeRealCalls();
}

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
 * Generate a simulated response based on user message
 * @param {string} userMessage - The user's request
 * @param {object} context - Canvas context
 * @returns {object} Simulated response
 */
function generateSimulatedResponse(userMessage, context) {
  const { canvas, brand } = context;
  const message = userMessage.toLowerCase();

  // Default text element
  const defaultText = {
    type: 'text',
    name: 'AI Generated Text',
    x: Math.round((canvas.width - 300) / 2),
    y: Math.round(canvas.height / 3),
    width: 300,
    height: 60,
    rotation: 0,
    opacity: 1,
    content: 'Your Text Here',
    fontSize: 48,
    fontFamily: brand?.fonts?.heading || 'Inter',
    fontWeight: 700,
    color: brand?.colors?.text || '#FFFFFF',
    textAlign: 'center',
    shapeType: null,
    fill: null,
    borderRadius: null,
    src: null,
    objectFit: null,
  };

  // Default shape element
  const defaultShape = {
    type: 'shape',
    name: 'AI Generated Shape',
    x: Math.round((canvas.width - 200) / 2),
    y: Math.round((canvas.height - 100) / 2),
    width: 200,
    height: 100,
    rotation: 0,
    opacity: 1,
    content: null,
    fontSize: null,
    fontFamily: null,
    fontWeight: null,
    color: null,
    textAlign: null,
    shapeType: 'rectangle',
    fill: brand?.colors?.primary || '#6366F1',
    borderRadius: 12,
    src: null,
    objectFit: null,
  };

  // Parse user intent
  if (message.includes('headline') || message.includes('title') || message.includes('heading')) {
    return {
      operationType: 'add',
      addElement: {
        ...defaultText,
        name: 'Headline',
        content: 'Bold Headline',
        fontSize: 64,
        y: Math.round(canvas.height / 4),
      },
      updateElementId: null,
      updateProperties: null,
      deleteElementId: null,
      message: 'I added a bold headline to your canvas. You can edit the text by clicking on it!',
    };
  }

  if (message.includes('button') || message.includes('cta')) {
    return {
      operationType: 'add',
      addElement: {
        ...defaultShape,
        name: 'CTA Button',
        width: 160,
        height: 48,
        y: Math.round(canvas.height * 0.7),
        borderRadius: 24,
        fill: brand?.colors?.accent || '#22C55E',
      },
      updateElementId: null,
      updateProperties: null,
      deleteElementId: null,
      message: 'I created a CTA button for you. Add text on top to complete it!',
    };
  }

  if (message.includes('background') || message.includes('rectangle') || message.includes('shape')) {
    return {
      operationType: 'add',
      addElement: {
        ...defaultShape,
        name: 'Background Shape',
        x: Math.round(canvas.width * 0.1),
        y: Math.round(canvas.height * 0.1),
        width: Math.round(canvas.width * 0.8),
        height: Math.round(canvas.height * 0.3),
        borderRadius: 20,
      },
      updateElementId: null,
      updateProperties: null,
      deleteElementId: null,
      message: 'I added a background shape. You can adjust its size and position as needed.',
    };
  }

  if (message.includes('text') || message.includes('caption') || message.includes('subtitle')) {
    return {
      operationType: 'add',
      addElement: {
        ...defaultText,
        name: 'Caption',
        content: 'Your caption here',
        fontSize: 24,
        fontWeight: 400,
        y: Math.round(canvas.height * 0.6),
      },
      updateElementId: null,
      updateProperties: null,
      deleteElementId: null,
      message: 'I added a text caption. Click to edit the content!',
    };
  }

  // Default response: add a text element
  return {
    operationType: 'add',
    addElement: defaultText,
    updateElementId: null,
    updateProperties: null,
    deleteElementId: null,
    message: 'I added a text element to your canvas. This is a simulated response - real AI features require a backend server. Try asking for specific elements like "add a headline" or "create a button"!',
  };
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

  // Use simulation mode in client-side apps (no backend)
  if (!canMakeRealCalls()) {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const simulatedResult = generateSimulatedResponse(userMessage, context);
    const operation = convertSchemaToOperation(simulatedResult);

    return {
      success: true,
      operations: operation ? [operation] : [],
      message: simulatedResult.message,
      provider: selectedProvider,
      simulated: true,
    };
  }

  // Real API call (requires backend)
  const systemPrompt = buildDesignSystemPrompt(context);

  try {
    const result = await generateObject({
      model: getModel(selectedProvider, 'smart'),
      schema: DesignOperationsSchema,
      system: systemPrompt,
      prompt: userMessage,
    });

    // Convert flat schema response to operations array
    const operation = convertSchemaToOperation(result.object);

    return {
      success: true,
      operations: operation ? [operation] : [],
      message: result.object.message,
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
 * Convert flat schema response to operation object
 * @param {object} schemaResult - The result from generateObject
 * @returns {object|null} Operation object
 */
function convertSchemaToOperation(schemaResult) {
  const { operationType, addElement, updateElementId, updateProperties, deleteElementId } = schemaResult;

  switch (operationType) {
    case 'add':
      if (addElement) {
        return { type: 'addElement', element: addElement };
      }
      break;
    case 'update':
      if (updateElementId && updateProperties) {
        // Filter out null values from updates
        const updates = {};
        for (const [key, value] of Object.entries(updateProperties)) {
          if (value !== null) {
            updates[key] = value;
          }
        }
        return { type: 'updateElement', id: updateElementId, updates };
      }
      break;
    case 'delete':
      if (deleteElementId) {
        return { type: 'deleteElement', id: deleteElementId };
      }
      break;
  }

  return null;
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
  isSimulationMode,
};
