import React, { useRef } from 'react';
import { Play, Pause, Eye, EyeOff, Lock, Unlock, Music } from 'lucide-react';
import { formatTime } from '../utils/helpers.js';

const Timeline = ({ project, dispatch, selectedIds = [], onSelect, currentTime, onTimeChange, isPlaying, onPlayPause }) => {
    const rulerRef = useRef(null);
    const duration = project.duration;

    const handleRulerClick = (e) => {
        if (!rulerRef.current) return;
        const rect = rulerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const progress = Math.max(0, Math.min(1, x / rect.width));
        onTimeChange(progress * duration);
    };

    const getTrackColor = (type) => {
        switch (type) {
            case 'text': return '#00D4FF';
            case 'shape': return '#7B2CBF';
            case 'image': return '#FF006E';
            default: return '#666';
        }
    };

    return (
        <div className="timeline">
            <div className="timeline-controls">
                <button className="play-btn" onClick={onPlayPause}>
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <span className="time-display">{formatTime(currentTime)}</span>
                <span className="time-sep">/</span>
                <span className="time-display">{formatTime(duration)}</span>
            </div>

            <div className="timeline-content">
                <div className="track-labels">
                    {project.elements.map((element) => (
                        <div
                            key={element.id}
                            className={`track-label ${selectedIds.includes(element.id) ? 'selected' : ''}`}
                            onClick={() => onSelect(element.id)}
                        >
                            <button
                                className="icon-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates: { visible: !element.visible } });
                                }}
                            >
                                {element.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                            </button>
                            <button
                                className="icon-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates: { locked: !element.locked } });
                                }}
                            >
                                {element.locked ? <Lock size={12} /> : <Unlock size={12} />}
                            </button>
                            <span className="label-text">{element.name}</span>
                        </div>
                    ))}
                </div>

                <div className="timeline-tracks-area">
                    <div className="timeline-ruler" ref={rulerRef} onClick={handleRulerClick}>
                        {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((sec) => (
                            <div key={sec} className="ruler-mark" style={{ left: `${(sec / 5) * 100}%` }}>
                                <span>{sec}s</span>
                            </div>
                        ))}
                        <div className="playhead" style={{ left: `${(currentTime / duration) * 100}%` }} />
                    </div>

                    <div className="timeline-tracks">
                        {project.elements.map((element) => (
                            <div
                                key={element.id}
                                className={`timeline-track ${selectedIds.includes(element.id) ? 'selected' : ''}`}
                                onClick={() => onSelect(element.id)}
                            >
                                <div
                                    className="track-bar"
                                    style={{
                                        left: `${((element.startTime || 0) / duration) * 100}%`,
                                        width: `${(((element.endTime || duration) - (element.startTime || 0)) / duration) * 100}%`,
                                        backgroundColor: getTrackColor(element.type),
                                    }}
                                >
                                    {(element.animations || []).map((anim, i) => (
                                        <div
                                            key={i}
                                            className="anim-marker"
                                            style={{ left: `${((anim.startTime || 0) / ((element.endTime || duration) - (element.startTime || 0))) * 100}%` }}
                                            title={`${anim.property}: ${anim.from} → ${anim.to}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="timeline-footer">
                <button className="add-audio-btn">
                    <Music size={14} />
                    <span>Add Audio</span>
                </button>
            </div>
        </div>
    );
};

export default Timeline;
