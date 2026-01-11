// Animation preset definitions
export const ANIMATION_PRESETS = {
    fadeIn: { property: 'opacity', from: 0, to: 1, ease: 'power2.out', duration: 500 },
    fadeOut: { property: 'opacity', from: 1, to: 0, ease: 'power2.in', duration: 500 },
    slideInLeft: { property: 'x', from: -200, to: 0, ease: 'power3.out', duration: 600 },
    slideInRight: { property: 'x', from: 200, to: 0, ease: 'power3.out', duration: 600 },
    slideInUp: { property: 'y', from: 200, to: 0, ease: 'power3.out', duration: 600 },
    slideInDown: { property: 'y', from: -200, to: 0, ease: 'power3.out', duration: 600 },
    scaleIn: { property: 'scale', from: 0, to: 1, ease: 'back.out(1.7)', duration: 500 },
    bounceIn: { property: 'scale', from: 0, to: 1, ease: 'elastic.out(1, 0.5)', duration: 800 },
    rotateIn: { property: 'rotation', from: -180, to: 0, ease: 'power2.out', duration: 600 },
};
