/**
 * Brand Generation Service
 * Uses Vercel AI SDK for structured brand suggestions
 */

import { generateObject } from 'ai';
import { getModel, getDefaultProvider } from './provider.js';
import { BrandSuggestionSchema } from './schemas/brand-suggestions.js';

/**
 * Generate brand suggestions based on brand name
 * @param {string} brandName - The name of the brand
 * @param {string} provider - AI provider to use (anthropic, openai, google)
 * @returns {Promise<object>} Brand suggestions with personality, tone, colors, fonts
 */
export async function generateBrandSuggestions(brandName, provider = null) {
  const selectedProvider = provider || getDefaultProvider();

  try {
    const result = await generateObject({
      model: getModel(selectedProvider, 'smart'),
      schema: BrandSuggestionSchema,
      prompt: `You are a brand strategist helping create a cohesive brand identity.

Based on the brand name "${brandName}", generate a complete brand identity including:

1. **Personality**: 2-3 adjectives that capture the brand's essence
2. **Tone**: A single sentence describing how the brand communicates
3. **Colors**: A harmonious color palette with:
   - Primary: The main brand color
   - Secondary: A complementary color
   - Accent: A vibrant color for CTAs and highlights
   - Background: A suitable background color
   - Text: Primary text color that contrasts well with the background
4. **Fonts**: Google Font recommendations for headings and body text

Consider the brand name's meaning, sound, and potential industry associations.
Make the colors work well together and ensure good contrast ratios.
Choose modern, readable fonts that match the brand personality.`,
    });

    return {
      success: true,
      data: result.object,
      provider: selectedProvider,
    };
  } catch (error) {
    console.error('Brand generation error:', error);
    return {
      success: false,
      error: error.message,
      provider: selectedProvider,
    };
  }
}

/**
 * Generate brand suggestions with fallback to other providers
 * @param {string} brandName - The name of the brand
 * @returns {Promise<object>} Brand suggestions or error
 */
export async function generateBrandSuggestionsWithFallback(brandName) {
  const providers = ['anthropic', 'openai', 'google'];

  for (const provider of providers) {
    const result = await generateBrandSuggestions(brandName, provider);
    if (result.success) {
      return result;
    }
    console.warn(`Provider ${provider} failed, trying next...`);
  }

  return {
    success: false,
    error: 'All AI providers failed to generate suggestions',
  };
}

export default generateBrandSuggestions;
