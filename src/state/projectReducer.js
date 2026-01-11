import { CANVAS_PRESETS } from '../constants/index.js';

/**
 * Create a new project with default values
 * @param {string} preset - Canvas preset key (e.g., 'ig-story')
 * @param {Object} brand - Brand guide to associate with project
 * @returns {Object} - New project object
 */
export const createNewProject = (preset = 'ig-story', brand) => ({
    id: `proj-${Date.now()}`,
    name: 'Untitled Project',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    brandGuide: brand,
    canvas: {
        preset,
        ...CANVAS_PRESETS[preset],
    },
    duration: 5000,
    elements: [],
});

/**
 * Project state reducer
 * Handles all project-related state updates
 */
export const projectReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PROJECT':
            return action.project;

        case 'UPDATE_PROJECT':
            return { ...state, ...action.updates, updatedAt: Date.now() };

        case 'ADD_ELEMENT': {
            const newElement = {
                ...action.element,
                id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: action.element.name || `${action.element.type} ${state.elements.length + 1}`,
                locked: false,
                visible: true,
                startTime: 0,
                endTime: state.duration,
            };
            return {
                ...state,
                updatedAt: Date.now(),
                elements: [...state.elements, newElement],
            };
        }

        case 'UPDATE_ELEMENT':
            return {
                ...state,
                updatedAt: Date.now(),
                elements: state.elements.map(el =>
                    el.id === action.id ? { ...el, ...action.updates } : el
                ),
            };

        case 'DELETE_ELEMENT':
            return {
                ...state,
                updatedAt: Date.now(),
                elements: state.elements.filter(el => el.id !== action.id),
            };

        default:
            return state;
    }
};
