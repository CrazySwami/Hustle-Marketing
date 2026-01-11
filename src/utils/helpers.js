/**
 * Generate a unique ID with optional prefix
 * @param {string} prefix - Prefix for the ID
 * @returns {string} - Unique ID string
 */
export const generateId = (prefix = 'id') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format time in milliseconds to seconds with 2 decimal places
 * @param {number} ms - Time in milliseconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (ms) => {
    return (ms / 1000).toFixed(2);
};

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
export const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
};
