/**
 * Zod Schemas for Design Operations
 * Defines structured output for the AI design agent
 */

import { z } from 'zod';

/**
 * Animation keyframe schema
 */
export const AnimationSchema = z.object({
  property: z.enum(['opacity', 'scale', 'x', 'y', 'rotation']).describe('CSS property to animate'),
  from: z.number().describe('Starting value'),
  to: z.number().describe('Ending value'),
  duration: z.number().default(500).describe('Animation duration in milliseconds'),
  startTime: z.number().default(0).describe('When animation starts relative to element appearance'),
  ease: z.string().default('power2.out').describe('Easing function name'),
});

/**
 * Base element schema - common properties for all elements
 */
export const BaseElementSchema = z.object({
  name: z.string().describe('Display name for the element'),
  x: z.number().describe('X position on canvas'),
  y: z.number().describe('Y position on canvas'),
  width: z.number().describe('Element width in pixels'),
  height: z.number().describe('Element height in pixels'),
  rotation: z.number().default(0).describe('Rotation in degrees'),
  opacity: z.number().default(1).describe('Opacity from 0 to 1'),
  animations: z.array(AnimationSchema).default([]).describe('Animations to apply'),
});

/**
 * Text element schema
 */
export const TextElementSchema = BaseElementSchema.extend({
  type: z.literal('text'),
  content: z.string().describe('The text content'),
  fontSize: z.number().describe('Font size in pixels'),
  fontFamily: z.string().describe('Font family name'),
  fontWeight: z.number().default(400).describe('Font weight (100-900)'),
  color: z.string().describe('Text color as hex code'),
  textAlign: z.enum(['left', 'center', 'right']).default('center'),
});

/**
 * Shape element schema
 */
export const ShapeElementSchema = BaseElementSchema.extend({
  type: z.literal('shape'),
  shapeType: z.enum(['rectangle', 'circle']).describe('Type of shape'),
  fill: z.string().describe('Fill color as hex code'),
  borderRadius: z.number().default(0).describe('Border radius in pixels'),
  stroke: z.string().optional().describe('Stroke color as hex code'),
  strokeWidth: z.number().optional().describe('Stroke width in pixels'),
});

/**
 * Image element schema
 */
export const ImageElementSchema = BaseElementSchema.extend({
  type: z.literal('image'),
  src: z.string().describe('Image source URL or placeholder'),
  objectFit: z.enum(['cover', 'contain', 'fill']).default('cover'),
});

/**
 * Union of all element types
 */
export const ElementSchema = z.discriminatedUnion('type', [
  TextElementSchema,
  ShapeElementSchema,
  ImageElementSchema,
]);

/**
 * Add element operation
 */
export const AddOperationSchema = z.object({
  type: z.literal('addElement'),
  element: ElementSchema,
});

/**
 * Update element operation
 */
export const UpdateOperationSchema = z.object({
  type: z.literal('updateElement'),
  id: z.string().describe('ID of element to update'),
  updates: z.record(z.any()).describe('Properties to update'),
});

/**
 * Delete element operation
 */
export const DeleteOperationSchema = z.object({
  type: z.literal('deleteElement'),
  id: z.string().describe('ID of element to delete'),
});

/**
 * Update canvas operation
 */
export const UpdateCanvasSchema = z.object({
  type: z.literal('updateCanvas'),
  updates: z.object({
    preset: z.string().optional(),
    duration: z.number().optional(),
  }),
});

/**
 * Main schema for design operations response
 */
export const DesignOperationsSchema = z.object({
  operations: z.array(
    z.discriminatedUnion('type', [
      AddOperationSchema,
      UpdateOperationSchema,
      DeleteOperationSchema,
      UpdateCanvasSchema,
    ])
  ).describe('List of operations to perform on the canvas'),
  message: z.string().optional().describe('Optional message to display to user'),
  thinking: z.string().optional().describe('AI reasoning about the design choices'),
});

export default DesignOperationsSchema;
