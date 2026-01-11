import { getEasing } from './Easings.js';

/**
 * Calculate animated values for an element at a given time
 * @param {Object} element - The element with animations
 * @param {number} currentTime - Current playback time in milliseconds
 * @returns {Object} - Calculated values for x, y, scale, rotation, opacity
 */
export const getAnimatedValues = (element, currentTime) => {
    const values = {
        x: element.x || 0,
        y: element.y || 0,
        scale: 1,
        rotation: element.rotation || 0,
        opacity: element.opacity ?? 1,
    };

    // Check if element should be visible at current time
    const elementStart = element.startTime || 0;
    const elementEnd = element.endTime || 5000;

    if (currentTime < elementStart || currentTime > elementEnd) {
        values.opacity = 0;
        return values;
    }

    // Apply each animation
    const animations = element.animations || [];
    animations.forEach(anim => {
        const animStart = elementStart + (anim.startTime || 0);
        const animDuration = anim.duration || 500;
        const animEnd = animStart + animDuration;

        if (currentTime < animStart) {
            // Before animation starts - use "from" value
            if (anim.from !== undefined) {
                values[anim.property] = anim.from;
            }
        } else if (currentTime >= animEnd) {
            // After animation ends - use "to" value
            if (anim.to !== undefined) {
                values[anim.property] = anim.to;
            }
        } else {
            // During animation - interpolate
            const progress = (currentTime - animStart) / animDuration;
            const easedProgress = getEasing(anim.ease || 'power2.out')(progress);
            const from = anim.from ?? values[anim.property];
            const to = anim.to ?? values[anim.property];
            values[anim.property] = from + (to - from) * easedProgress;
        }
    });

    return values;
};
