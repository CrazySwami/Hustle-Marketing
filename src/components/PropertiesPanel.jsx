import React from 'react';
import { Trash2, AlignLeft, AlignCenter, AlignRight, X, MousePointer2 } from 'lucide-react';
import { ANIMATION_PRESETS } from '../constants/index.js';

const PropertiesPanel = ({ element, onUpdate, onDelete, brand }) => {
    if (!element) {
        return (
            <div className="properties-panel empty">
                <MousePointer2 size={24} />
                <p>Select an element to edit its properties</p>
            </div>
        );
    }

    return (
        <div className="properties-panel">
            <div className="prop-header">
                <h3>{element.name}</h3>
                <button className="btn-icon-sm" onClick={() => onDelete(element.id)} title="Delete">
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="prop-section">
                <h4>Position & Size</h4>
                <div className="prop-grid">
                    <div className="prop-field">
                        <label>X</label>
                        <input
                            type="number"
                            value={Math.round(element.x)}
                            onChange={e => onUpdate(element.id, { x: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="prop-field">
                        <label>Y</label>
                        <input
                            type="number"
                            value={Math.round(element.y)}
                            onChange={e => onUpdate(element.id, { y: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="prop-field">
                        <label>W</label>
                        <input
                            type="number"
                            value={Math.round(element.width)}
                            onChange={e => onUpdate(element.id, { width: parseFloat(e.target.value) || 20 })}
                        />
                    </div>
                    <div className="prop-field">
                        <label>H</label>
                        <input
                            type="number"
                            value={Math.round(element.height)}
                            onChange={e => onUpdate(element.id, { height: parseFloat(e.target.value) || 20 })}
                        />
                    </div>
                </div>
            </div>

            {element.type === 'text' && (
                <div className="prop-section">
                    <h4>Text</h4>
                    <textarea
                        value={element.content}
                        onChange={e => onUpdate(element.id, { content: e.target.value })}
                        rows={2}
                    />
                    <div className="prop-row">
                        <div className="prop-field">
                            <label>Size</label>
                            <input
                                type="number"
                                value={element.fontSize}
                                onChange={e => onUpdate(element.id, { fontSize: parseFloat(e.target.value) || 12 })}
                            />
                        </div>
                        <div className="prop-field">
                            <label>Color</label>
                            <input
                                type="color"
                                value={element.color}
                                onChange={e => onUpdate(element.id, { color: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="text-align-buttons">
                        <button
                            className={element.textAlign === 'left' ? 'active' : ''}
                            onClick={() => onUpdate(element.id, { textAlign: 'left' })}
                        >
                            <AlignLeft size={16} />
                        </button>
                        <button
                            className={element.textAlign === 'center' ? 'active' : ''}
                            onClick={() => onUpdate(element.id, { textAlign: 'center' })}
                        >
                            <AlignCenter size={16} />
                        </button>
                        <button
                            className={element.textAlign === 'right' ? 'active' : ''}
                            onClick={() => onUpdate(element.id, { textAlign: 'right' })}
                        >
                            <AlignRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {element.type === 'shape' && (
                <div className="prop-section">
                    <h4>Fill</h4>
                    <div className="prop-row">
                        <div className="prop-field full">
                            <input
                                type="color"
                                value={element.fill}
                                onChange={e => onUpdate(element.id, { fill: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="brand-color-quick">
                        {Object.values(brand.colors).map((color, i) => (
                            <button
                                key={i}
                                style={{ background: color }}
                                onClick={() => onUpdate(element.id, { fill: color })}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="prop-section">
                <h4>Animations</h4>
                <div className="animation-list">
                    {(element.animations || []).map((anim, i) => (
                        <div key={anim.id || i} className="animation-item">
                            <span>{anim.property}: {anim.from} → {anim.to}</span>
                            <button onClick={() => onUpdate(element.id, {
                                animations: element.animations.filter((_, idx) => idx !== i)
                            })}>
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <select
                    onChange={e => {
                        if (e.target.value) {
                            const preset = ANIMATION_PRESETS[e.target.value];
                            const newAnim = { id: `anim-${Date.now()}`, ...preset, startTime: 0 };
                            onUpdate(element.id, {
                                animations: [...(element.animations || []), newAnim]
                            });
                            e.target.value = '';
                        }
                    }}
                    defaultValue=""
                >
                    <option value="">+ Add Animation</option>
                    {Object.keys(ANIMATION_PRESETS).map(key => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PropertiesPanel;
