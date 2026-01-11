import React, { useState } from 'react';
import { ChevronLeft, Download, Loader2, Check } from 'lucide-react';

const ExportModal = ({ project, onClose }) => {
    const [format, setFormat] = useState('mp4');
    const [isExporting, setIsExporting] = useState(false);

    const formats = [
        { id: 'png', name: 'PNG', desc: 'Static image', icon: '🖼️' },
        { id: 'jpg', name: 'JPG', desc: 'Compressed image', icon: '📷' },
        { id: 'gif', name: 'GIF', desc: 'Animated image', icon: '🎞️' },
        { id: 'mp4', name: 'MP4', desc: 'Video file', icon: '🎬', suggested: true },
        { id: 'json', name: 'JSON', desc: 'Project data', icon: '📄' },
    ];

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            if (format === 'json') {
                const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${project.name}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
            setIsExporting(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal export-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="back-icon" onClick={onClose}><ChevronLeft size={20} /></button>
                    <h2>Download</h2>
                </div>
                <div className="format-options">
                    {formats.map(f => (
                        <button
                            key={f.id}
                            className={`format-option ${format === f.id ? 'selected' : ''}`}
                            onClick={() => setFormat(f.id)}
                        >
                            <span className="format-icon">{f.icon}</span>
                            <div className="format-info">
                                <span className="format-name">
                                    {f.name}
                                    {f.suggested && <span className="badge">Suggested</span>}
                                </span>
                                <span className="format-desc">{f.desc}</span>
                            </div>
                            {format === f.id && <Check size={18} className="check-icon" />}
                        </button>
                    ))}
                </div>
                <button className="btn-primary export-btn" onClick={handleExport} disabled={isExporting}>
                    {isExporting ? <><Loader2 className="spin" size={18} /> Exporting...</> : <><Download size={18} /> Download {format.toUpperCase()}</>}
                </button>
            </div>
        </div>
    );
};

export default ExportModal;
