// Easing functions for animations
export const easings = {
    linear: t => t,
    'power1.out': t => 1 - Math.pow(1 - t, 1),
    'power2.out': t => 1 - Math.pow(1 - t, 2),
    'power3.out': t => 1 - Math.pow(1 - t, 3),
    'power2.in': t => Math.pow(t, 2),
    'power3.in': t => Math.pow(t, 3),
    'power2.inOut': t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    'back.out(1.7)': t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    'elastic.out(1, 0.5)': t => {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
    },
};

/**
 * Get an easing function by name
 * @param {string} easeName - Name of the easing function
 * @returns {function} - The easing function
 */
export const getEasing = (easeName) => {
    return easings[easeName] || easings['power2.out'];
};
