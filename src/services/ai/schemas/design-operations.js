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
  duration: z.number().describe('Animation duration in milliseconds'),
  startTime: z.number().describe('When animation starts relative to element appearance'),
  ease: z.string().describe('Easing function name'),
});

/**
 * Element schema - unified for all element types
 */
export const ElementSchema = z.object({
  type: z.enum(['text', 'shape', 'image']).describe('Type of element'),
  name: z.string().describe('Display name for the element'),
  x: z.number().describe('X position on canvas'),
  y: z.number().describe('Y position on canvas'),
  width: z.number().describe('Element width in pixels'),
  height: z.number().describe('Element height in pixels'),
  rotation: z.number().describe('Rotation in degrees'),
  opacity: z.number().describe('Opacity from 0 to 1'),
  // Text properties (set these for text elements)
  content: z.string().describe('Text content').nullable(),
  fontSize: z.number().describe('Font size in pixels').nullable(),
  fontFamily: z.string().describe('Font family name').nullable(),
  fontWeight: z.number().describe('Font weight 100-900').nullable(),
  color: z.string().describe('Text color as hex').nullable(),
  textAlign: z.string().describe('Text alignment: left, center, or right').nullable(),
  // Shape properties (set these for shape elements)
  shapeType: z.string().describe('Shape type: rectangle or circle').nullable(),
  fill: z.string().describe('Fill color as hex').nullable(),
  borderRadius: z.number().describe('Border radius in pixels').nullable(),
  // Image properties (set these for image elements)
  src: z.string().describe('Image source URL').nullable(),
  objectFit: z.string().describe('Image fit: cover, contain, or fill').nullable(),
});

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
  x: z.number().describe('New X position').nullable(),
  y: z.number().describe('New Y position').nullable(),
  width: z.number().describe('New width').nullable(),
  height: z.number().describe('New height').nullable(),
  rotation: z.number().describe('New rotation').nullable(),
  opacity: z.number().describe('New opacity').nullable(),
  content: z.string().describe('New text content').nullable(),
  fontSize: z.number().describe('New font size').nullable(),
  color: z.string().describe('New color').nullable(),
  fill: z.string().describe('New fill color').nullable(),
});

/**
 * Delete element operation
 */
export const DeleteOperationSchema = z.object({
  type: z.literal('deleteElement'),
  id: z.string().describe('ID of element to delete'),
});

/**
 * Main schema for design operations response
 * Using a simpler structure for Zod v4 compatibility
 */
export const DesignOperationsSchema = z.object({
  operationType: z.enum(['add', 'update', 'delete']).describe('Type of operation to perform'),
  // For add operations
  addElement: ElementSchema.nullable().describe('Element to add (only for add operations)'),
  // For update operations
  updateElementId: z.string().describe('ID of element to update').nullable(),
  updateProperties: z.object({
    x: z.number().nullable(),
    y: z.number().nullable(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    rotation: z.number().nullable(),
    opacity: z.number().nullable(),
    content: z.string().nullable(),
    fontSize: z.number().nullable(),
    color: z.string().nullable(),
    fill: z.string().nullable(),
  }).describe('Properties to update').nullable(),
  // For delete operations
  deleteElementId: z.string().describe('ID of element to delete').nullable(),
  // Response message
  message: z.string().describe('Message to display to user'),
});

export default DesignOperationsSchema;
