/**
 * Zod Schema for Brand Suggestions
 * Used by the brand guide generator for structured AI output
 */

import { z } from 'zod';

/**
 * Schema for brand personality and style suggestions
 */
export const BrandSuggestionSchema = z.object({
  personality: z.string().describe('2-3 adjectives describing the brand personality'),
  tone: z.string().describe('One sentence describing the brand tone of voice'),
  colors: z.object({
    primary: z.string().describe('Primary brand color as hex code (e.g., #00D4FF)'),
    secondary: z.string().describe('Secondary brand color as hex code'),
    accent: z.string().describe('Accent color as hex code'),
    background: z.string().describe('Background color as hex code'),
    text: z.string().describe('Primary text color as hex code'),
  }).describe('Brand color palette'),
  fonts: z.object({
    heading: z.string().describe('Google Font name for headings'),
    body: z.string().describe('Google Font name for body text'),
  }).describe('Typography recommendations'),
  visualStyle: z.string().optional().describe('Brief description of visual style (e.g., "minimalist", "bold and vibrant")'),
});

/**
 * Extended schema with reasoning for why suggestions were made
 */
export const BrandSuggestionWithReasoningSchema = BrandSuggestionSchema.extend({
  reasoning: z.object({
    personalityReason: z.string().describe('Why this personality fits the brand'),
    colorReason: z.string().describe('Why these colors were chosen'),
    fontReason: z.string().describe('Why these fonts complement the brand'),
  }).optional(),
});

export default BrandSuggestionSchema;
