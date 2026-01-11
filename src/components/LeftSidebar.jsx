import React from 'react';
import { Layers, Type, Palette, Upload, Square, Circle, Image } from 'lucide-react';
import { ANIMATION_PRESETS } from '../constants/index.js';

const LeftSidebar = ({ activePanel, setActivePanel, project, dispatch, brand }) => {
    const canvasWidth = project.canvas.width;
    const canvasHeight = project.canvas.height;

    const addText = (preset) => {
        const defaults = {
            type: 'text',
            content: preset.content || 'Your Text Here',
            x: (canvasWidth - (preset.width || 400)) / 2,
            y: (canvasHeight - (preset.height || 80)) / 2,
            width: preset.width || 400,
            height: preset.height || 80,
            rotation: 0,
            opacity: 1,
            fontSize: preset.fontSize || 48,
            fontFamily: preset.fontFamily || brand.fonts.heading,
            fontWeight: preset.fontWeight || 700,
            color: preset.color || brand.colors.text,
            textAlign: preset.textAlign || 'center',
            animations: [{ id: `anim-${Date.now()}`, ...ANIMATION_PRESETS.fadeIn, startTime: 0 }],
        };
        dispatch({ type: 'ADD_ELEMENT', element: { ...defaults, name: preset.name } });
    };

    const addShape = (shapeType, overrides = {}) => {
        const size = shapeType === 'circle' ? 200 : 200;
        const defaults = {
            type: 'shape',
            shapeType,
            x: (canvasWidth - size) / 2,
            y: (canvasHeight - size) / 2,
            width: size,
            height: size,
            rotation: 0,
            opacity: 1,
            fill: shapeType === 'circle' ? brand.colors.secondary : brand.colors.primary,
            stroke: 'none',
            strokeWidth: 0,
            borderRadius: shapeType === 'circle' ? 9999 : 0,
            animations: [{ id: `anim-${Date.now()}`, ...ANIMATION_PRESETS.scaleIn, startTime: 0 }],
            ...overrides,
        };
        dispatch({ type: 'ADD_ELEMENT', element: defaults });
    };

    const addImage = () => {
        const defaults = {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            x: (canvasWidth - 400) / 2,
            y: (canvasHeight - 300) / 2,
            width: 400,
            height: 300,
            rotation: 0,
            opacity: 1,
            objectFit: 'cover',
            borderRadius: 0,
            animations: [{ id: `anim-${Date.now()}`, ...ANIMATION_PRESETS.fadeIn, startTime: 0 }],
        };
        dispatch({ type: 'ADD_ELEMENT', element: defaults });
    };

    const panels = {
        elements: {
            icon: <Layers size={20} />,
            label: 'Elements',
            content: (
                <div className="panel-content">
                    <h3>Add Elements</h3>
                    <div className="element-buttons">
                        <button onClick={() => addText({ content: 'Text', fontSize: 48 })}>
                            <Type size={20} />
                            <span>Text</span>
                        </button>
                        <button onClick={() => addShape('rectangle')}>
                            <Square size={20} />
                            <span>Rectangle</span>
                        </button>
                        <button onClick={() => addShape('circle')}>
                            <Circle size={20} />
                            <span>Circle</span>
                        </button>
                        <button onClick={addImage}>
                            <Image size={20} />
                            <span>Image</span>
                        </button>
                    </div>
                </div>
            ),
        },
        text: {
            icon: <Type size={20} />,
            label: 'Text',
            content: (
                <div className="panel-content">
                    <h3>Text Styles</h3>
                    <div className="text-presets">
                        <button onClick={() => addText({ name: 'Heading', content: 'Heading', fontSize: 96, fontWeight: 800, width: 600, height: 120 })}>
                            <span style={{ fontSize: 24, fontWeight: 800 }}>Heading</span>
                        </button>
                        <button onClick={() => addText({ name: 'Subheading', content: 'Subheading', fontSize: 56, fontWeight: 600, width: 500, height: 80 })}>
                            <span style={{ fontSize: 18, fontWeight: 600 }}>Subheading</span>
                        </button>
                        <button onClick={() => addText({ name: 'Body Text', content: 'Body text goes here', fontSize: 32, fontWeight: 400, width: 500, height: 60, fontFamily: brand.fonts.body })}>
                            <span style={{ fontSize: 14, fontWeight: 400 }}>Body Text</span>
                        </button>
                        <button onClick={() => addShape('rectangle', {
                            name: 'Button',
                            width: 280,
                            height: 70,
                            fill: brand.colors.accent,
                            borderRadius: 35,
                            hasText: true,
                            textContent: 'Click Here',
                            textColor: '#FFFFFF',
                            fontSize: 24,
                        })}>
                            <span style={{ background: brand.colors.accent, padding: '8px 20px', borderRadius: 20, color: '#fff', fontSize: 14, fontWeight: 600 }}>Button</span>
                        </button>
                    </div>
                </div>
            ),
        },
        brand: {
            icon: <Palette size={20} />,
            label: 'Brand',
            content: (
                <div className="panel-content">
                    <h3>{brand.name}</h3>
                    <div className="brand-section">
                        <h4>Colors</h4>
                        <div className="brand-colors-grid">
                            {Object.entries(brand.colors).map(([name, color]) => (
                                <button
                                    key={name}
                                    className="brand-color-btn"
                                    style={{ background: color }}
                                    title={name}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="brand-section">
                        <h4>Personality</h4>
                        <p>{brand.personality || 'Not defined'}</p>
                    </div>
                </div>
            ),
        },
        uploads: {
            icon: <Upload size={20} />,
            label: 'Uploads',
            content: (
                <div className="panel-content">
                    <h3>Upload Media</h3>
                    <div className="upload-zone">
                        <Upload size={32} />
                        <p>Drag & drop files here</p>
                        <span>or click to browse</span>
                    </div>
                    <p className="upload-note">Image generation coming soon via Nano Banana API</p>
                </div>
            ),
        },
    };

    return (
        <div className="left-sidebar">
            <div className="sidebar-icons">
                {Object.entries(panels).map(([key, panel]) => (
                    <button
                        key={key}
                        className={`sidebar-icon ${activePanel === key ? 'active' : ''}`}
                        onClick={() => setActivePanel(activePanel === key ? null : key)}
                        title={panel.label}
                    >
                        {panel.icon}
                        <span>{panel.label}</span>
                    </button>
                ))}
            </div>
            {activePanel && (
                <div className="sidebar-panel">
                    {panels[activePanel].content}
                </div>
            )}
        </div>
    );
};

export default LeftSidebar;
