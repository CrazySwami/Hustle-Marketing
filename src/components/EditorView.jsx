import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Download, Share2, Check, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import LeftSidebar from './LeftSidebar.jsx';
import CanvasElement from './CanvasElement.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import AIChatPanel from './AIChatPanel.jsx';
import Timeline from './Timeline.jsx';
import ExportModal from './ExportModal.jsx';

const EditorView = ({ project, dispatch, onBack, onSave }) => {
    // Selection state - now supports multiple IDs
    const [selectedIds, setSelectedIds] = useState([]);
    const [activePanel, setActivePanel] = useState('elements');
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [canvasScale, setCanvasScale] = useState(0.4);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [clipboard, setClipboard] = useState(null);
    const canvasContainerRef = useRef(null);
    const animationRef = useRef(null);
    const lastTimeRef = useRef(null);

    // Get first selected element for properties panel
    const selectedElement = project.elements.find(el => selectedIds.includes(el.id));
    const selectedElements = project.elements.filter(el => selectedIds.includes(el.id));

    // Calculate canvas scale based on container and zoom
    useEffect(() => {
        const updateScale = () => {
            if (canvasContainerRef.current) {
                const container = canvasContainerRef.current;
                const padding = 60;
                const availableWidth = container.clientWidth - padding;
                const availableHeight = container.clientHeight - padding;
                const scaleX = availableWidth / project.canvas.width;
                const scaleY = availableHeight / project.canvas.height;
                setCanvasScale(Math.min(scaleX, scaleY, 0.8) * zoomLevel);
            }
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [project.canvas.width, project.canvas.height, zoomLevel]);

    // Animation playback loop
    useEffect(() => {
        if (isPlaying) {
            lastTimeRef.current = performance.now();

            const animate = (now) => {
                const delta = now - lastTimeRef.current;
                lastTimeRef.current = now;

                setCurrentTime(prev => {
                    const next = prev + delta;
                    if (next >= project.duration) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return next;
                });

                animationRef.current = requestAnimationFrame(animate);
            };

            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, project.duration]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const isMeta = e.metaKey || e.ctrlKey;

            // Delete selected elements
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
                e.preventDefault();
                selectedIds.forEach(id => dispatch({ type: 'DELETE_ELEMENT', id }));
                setSelectedIds([]);
            }

            // Duplicate (Cmd+D)
            if (isMeta && e.key === 'd' && selectedIds.length > 0) {
                e.preventDefault();
                handleDuplicate();
            }

            // Copy (Cmd+C)
            if (isMeta && e.key === 'c' && selectedIds.length > 0) {
                e.preventDefault();
                setClipboard(selectedElements.map(el => ({ ...el })));
            }

            // Paste (Cmd+V)
            if (isMeta && e.key === 'v' && clipboard) {
                e.preventDefault();
                handlePaste();
            }

            // Select All (Cmd+A)
            if (isMeta && e.key === 'a') {
                e.preventDefault();
                setSelectedIds(project.elements.map(el => el.id));
            }

            // Deselect (Escape)
            if (e.key === 'Escape') {
                setSelectedIds([]);
            }

            // Play/Pause (Space)
            if (e.key === ' ' && !e.target.closest('.chat-input')) {
                e.preventDefault();
                handlePlayPause();
            }

            // Zoom In (Cmd+Plus or =)
            if (isMeta && (e.key === '=' || e.key === '+')) {
                e.preventDefault();
                setZoomLevel(prev => Math.min(prev + 0.25, 3));
            }

            // Zoom Out (Cmd+Minus)
            if (isMeta && e.key === '-') {
                e.preventDefault();
                setZoomLevel(prev => Math.max(prev - 0.25, 0.25));
            }

            // Fit to Screen (Cmd+0)
            if (isMeta && e.key === '0') {
                e.preventDefault();
                setZoomLevel(1);
            }

            // Arrow key nudging
            if (selectedIds.length > 0 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const nudge = e.shiftKey ? 10 : 1;
                let deltaX = 0, deltaY = 0;
                if (e.key === 'ArrowUp') deltaY = -nudge;
                if (e.key === 'ArrowDown') deltaY = nudge;
                if (e.key === 'ArrowLeft') deltaX = -nudge;
                if (e.key === 'ArrowRight') deltaX = nudge;

                selectedIds.forEach(id => {
                    const el = project.elements.find(e => e.id === id);
                    if (el && !el.locked) {
                        dispatch({
                            type: 'UPDATE_ELEMENT',
                            id,
                            updates: { x: el.x + deltaX, y: el.y + deltaY }
                        });
                    }
                });
            }

            // Layer ordering: [ and ] keys
            if (e.key === '[' && selectedIds.length === 1) {
                e.preventDefault();
                handleSendBackward();
            }
            if (e.key === ']' && selectedIds.length === 1) {
                e.preventDefault();
                handleBringForward();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds, selectedElements, clipboard, project.elements, dispatch]);

    const handleUpdateElement = useCallback((id, updates) => {
        dispatch({ type: 'UPDATE_ELEMENT', id, updates });
    }, [dispatch]);

    const handleDeleteElement = (id) => {
        dispatch({ type: 'DELETE_ELEMENT', id });
        setSelectedIds(prev => prev.filter(sid => sid !== id));
    };

    const handlePlayPause = () => {
        if (!isPlaying && currentTime >= project.duration) {
            setCurrentTime(0);
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeChange = (time) => {
        setCurrentTime(time);
        setIsPlaying(false);
    };

    // Multi-select handler
    const handleSelect = (id, e) => {
        if (e?.shiftKey) {
            // Shift+click: toggle in selection
            setSelectedIds(prev =>
                prev.includes(id)
                    ? prev.filter(sid => sid !== id)
                    : [...prev, id]
            );
        } else {
            // Normal click: single select
            setSelectedIds([id]);
        }
    };

    // Duplicate selected elements
    const handleDuplicate = () => {
        const newIds = [];
        selectedElements.forEach(el => {
            const newElement = {
                ...el,
                x: el.x + 20,
                y: el.y + 20,
                name: `${el.name} copy`,
            };
            delete newElement.id; // Let reducer generate new ID
            dispatch({ type: 'ADD_ELEMENT', element: newElement });
            newIds.push(newElement.id);
        });
    };

    // Paste from clipboard
    const handlePaste = () => {
        if (!clipboard) return;
        const newIds = [];
        clipboard.forEach(el => {
            const newElement = {
                ...el,
                x: el.x + 40,
                y: el.y + 40,
                name: `${el.name} copy`,
            };
            delete newElement.id;
            dispatch({ type: 'ADD_ELEMENT', element: newElement });
        });
    };

    // Layer ordering
    const handleBringForward = () => {
        if (selectedIds.length !== 1) return;
        const idx = project.elements.findIndex(el => el.id === selectedIds[0]);
        if (idx < project.elements.length - 1) {
            const newElements = [...project.elements];
            [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
            dispatch({ type: 'UPDATE_PROJECT', updates: { elements: newElements } });
        }
    };

    const handleSendBackward = () => {
        if (selectedIds.length !== 1) return;
        const idx = project.elements.findIndex(el => el.id === selectedIds[0]);
        if (idx > 0) {
            const newElements = [...project.elements];
            [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
            dispatch({ type: 'UPDATE_PROJECT', updates: { elements: newElements } });
        }
    };

    return (
        <div className="editor-view">
            <header className="editor-header">
                <div className="header-left">
                    <button className="btn-icon" onClick={onBack}><ChevronLeft size={20} /></button>
                    <input
                        type="text"
                        className="project-name"
                        value={project.name}
                        onChange={e => dispatch({ type: 'UPDATE_PROJECT', updates: { name: e.target.value } })}
                    />
                </div>
                <div className="header-center">
                    <div className="zoom-controls">
                        <button className="btn-icon-sm" onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.25))} title="Zoom Out">
                            <ZoomOut size={16} />
                        </button>
                        <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
                        <button className="btn-icon-sm" onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))} title="Zoom In">
                            <ZoomIn size={16} />
                        </button>
                        <button className="btn-icon-sm" onClick={() => setZoomLevel(1)} title="Fit to Screen">
                            <Maximize size={16} />
                        </button>
                    </div>
                    <span className="canvas-info">{project.canvas.name} • {project.canvas.width}×{project.canvas.height}</span>
                </div>
                <div className="header-right">
                    <button className="btn-ghost" onClick={onSave}><Check size={16} /> Save</button>
                    <button className="btn-ghost" onClick={() => setShowExport(true)}><Download size={16} /> Export</button>
                    <button className="btn-primary"><Share2 size={16} /> Share</button>
                </div>
            </header>

            <div className="editor-body">
                <div className="left-panels">
                    <LeftSidebar
                        activePanel={activePanel}
                        setActivePanel={setActivePanel}
                        project={project}
                        dispatch={dispatch}
                        brand={project.brandGuide}
                    />
                    <PropertiesPanel
                        element={selectedElement}
                        selectedCount={selectedIds.length}
                        onUpdate={handleUpdateElement}
                        onDelete={handleDeleteElement}
                        brand={project.brandGuide}
                    />
                </div>

                <div className="canvas-container" ref={canvasContainerRef} onClick={() => !isPlaying && setSelectedIds([])}>
                    <div
                        className="canvas"
                        style={{
                            width: project.canvas.width * canvasScale,
                            height: project.canvas.height * canvasScale,
                            backgroundColor: project.brandGuide.colors.background,
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {project.elements.map(element => (
                            <CanvasElement
                                key={element.id}
                                element={element}
                                isSelected={selectedIds.includes(element.id)}
                                onSelect={handleSelect}
                                onUpdate={handleUpdateElement}
                                scale={canvasScale}
                                currentTime={currentTime}
                                isPlaying={isPlaying}
                            />
                        ))}
                    </div>
                </div>

                <div className="right-panel">
                    <AIChatPanel
                        project={project}
                        selectedElement={selectedElement}
                        dispatch={dispatch}
                        brand={project.brandGuide}
                    />
                </div>
            </div>

            <Timeline
                project={project}
                dispatch={dispatch}
                selectedIds={selectedIds}
                onSelect={(id) => setSelectedIds([id])}
                currentTime={currentTime}
                onTimeChange={handleTimeChange}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
            />

            {showExport && <ExportModal project={project} onClose={() => setShowExport(false)} />}
        </div>
    );
};

export default EditorView;
