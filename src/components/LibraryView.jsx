import React, { useState } from 'react';
import { Plus, Zap, Layers } from 'lucide-react';
import { CANVAS_PRESETS } from '../constants/index.js';

const LibraryView = ({ projects, brandGuides, onCreateProject, onOpenProject, onCreateBrand }) => {
    const [showPresetModal, setShowPresetModal] = useState(false);

    return (
        <div className="library-view">
            <header className="library-header">
                <div className="logo">
                    <Zap size={28} />
                    <span>Social Canvas AI</span>
                </div>
                <button className="btn-primary" onClick={() => setShowPresetModal(true)}>
                    <Plus size={18} />
                    Create New
                </button>
            </header>

            <main className="library-content">
                <section className="library-section">
                    <h2>Recent Projects</h2>
                    <div className="project-grid">
                        {projects.length === 0 ? (
                            <div className="empty-state" onClick={() => setShowPresetModal(true)}>
                                <Plus size={32} />
                                <p>Create your first project</p>
                            </div>
                        ) : (
                            projects.map(proj => (
                                <div key={proj.id} className="project-card" onClick={() => onOpenProject(proj)}>
                                    <div className="project-thumbnail" style={{ background: proj.brandGuide?.colors?.background || '#1a1a2e' }}>
                                        <Layers size={24} />
                                    </div>
                                    <div className="project-info">
                                        <h3>{proj.name}</h3>
                                        <span>{proj.canvas?.name} • {new Date(proj.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="library-section">
                    <h2>Brand Guides</h2>
                    <div className="brand-grid">
                        <div className="brand-card" onClick={onCreateBrand}>
                            <div className="brand-colors">
                                <Plus size={24} />
                            </div>
                            <span>Create New Brand</span>
                        </div>
                        {brandGuides.map(brand => (
                            <div key={brand.id} className="brand-card">
                                <div className="brand-colors">
                                    <div style={{ background: brand.colors.primary }}></div>
                                    <div style={{ background: brand.colors.secondary }}></div>
                                    <div style={{ background: brand.colors.accent }}></div>
                                </div>
                                <span>{brand.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {showPresetModal && (
                <div className="modal-overlay" onClick={() => setShowPresetModal(false)}>
                    <div className="modal preset-modal" onClick={e => e.stopPropagation()}>
                        <h2>Choose Canvas Size</h2>
                        <div className="preset-grid">
                            {Object.entries(CANVAS_PRESETS).map(([key, preset]) => (
                                <button
                                    key={key}
                                    className="preset-option"
                                    onClick={() => {
                                        onCreateProject(key);
                                        setShowPresetModal(false);
                                    }}
                                >
                                    <span className="preset-icon">{preset.icon}</span>
                                    <span className="preset-name">{preset.name}</span>
                                    <span className="preset-size">{preset.width} × {preset.height}</span>
                                </button>
                            ))}
                        </div>
                        <button className="btn-ghost close-modal" onClick={() => setShowPresetModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LibraryView;
