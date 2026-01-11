import React, { useState, useEffect } from 'react';
import { getAnimatedValues } from '../engine/index.js';

const CanvasElement = ({ element, isSelected, onSelect, onUpdate, scale, currentTime, isPlaying }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [elementStart, setElementStart] = useState({ x: 0, y: 0 });

    // Get animated values
    const animatedValues = getAnimatedValues(element, currentTime);

    const handleMouseDown = (e) => {
        if (element.locked || isPlaying) return;
        e.stopPropagation();
        onSelect(element.id, e);
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setElementStart({ x: element.x, y: element.y });
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e) => {
            const deltaX = (e.clientX - dragStart.x) / scale;
            const deltaY = (e.clientY - dragStart.y) / scale;
            onUpdate(element.id, {
                x: Math.round(elementStart.x + deltaX),
                y: Math.round(elementStart.y + deltaY)
            });
        };

        const handleMouseUp = () => setIsDragging(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart, elementStart, scale, element.id, onUpdate]);

    const handleResize = (e, corner) => {
        e.stopPropagation();
        if (element.locked || isPlaying) return;

        const startWidth = element.width;
        const startHeight = element.height;
        const startX = e.clientX;
        const startY = e.clientY;

        const onMove = (moveE) => {
            const deltaX = (moveE.clientX - startX) / scale;
            const deltaY = (moveE.clientY - startY) / scale;

            let newWidth = startWidth;
            let newHeight = startHeight;

            if (corner.includes('e')) newWidth = Math.max(20, startWidth + deltaX);
            if (corner.includes('s')) newHeight = Math.max(20, startHeight + deltaY);

            onUpdate(element.id, { width: newWidth, height: newHeight });
        };

        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    if (!element.visible || animatedValues.opacity === 0) return null;

    // Apply animated position (base position + animation offset)
    const animX = (element.x + (animatedValues.x - element.x)) * scale;
    const animY = (element.y + (animatedValues.y - element.y)) * scale;

    const style = {
        position: 'absolute',
        left: animX,
        top: animY,
        width: element.width * scale,
        height: element.height * scale,
        transform: `rotate(${animatedValues.rotation}deg) scale(${animatedValues.scale})`,
        opacity: animatedValues.opacity,
        cursor: element.locked || isPlaying ? 'default' : isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 1000 : 1,
        transformOrigin: 'center center',
    };

    const renderContent = () => {
        switch (element.type) {
            case 'text':
                return (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            fontSize: element.fontSize * scale,
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            color: element.color,
                            textAlign: element.textAlign,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            lineHeight: 1.2,
                            userSelect: 'none',
                        }}
                    >
                        {element.content}
                    </div>
                );
            case 'shape':
                return (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: element.fill,
                            borderRadius: element.shapeType === 'circle' ? '50%' : (element.borderRadius || 0) * scale,
                            border: element.stroke !== 'none' ? `${(element.strokeWidth || 0) * scale}px solid ${element.stroke}` : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: element.textColor || '#fff',
                            fontSize: (element.fontSize || 24) * scale,
                            fontWeight: 600,
                            userSelect: 'none',
                        }}
                    >
                        {element.hasText && element.textContent}
                    </div>
                );
            case 'image':
                return (
                    <img
                        src={element.src}
                        alt=""
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: element.objectFit || 'cover',
                            borderRadius: (element.borderRadius || 0) * scale,
                            userSelect: 'none',
                            pointerEvents: 'none',
                        }}
                        draggable={false}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`canvas-element ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
            style={style}
            onMouseDown={handleMouseDown}
        >
            {renderContent()}
            {isSelected && !element.locked && !isPlaying && (
                <>
                    <div className="resize-handle nw" onMouseDown={(e) => handleResize(e, 'nw')} />
                    <div className="resize-handle ne" onMouseDown={(e) => handleResize(e, 'ne')} />
                    <div className="resize-handle sw" onMouseDown={(e) => handleResize(e, 'sw')} />
                    <div className="resize-handle se" onMouseDown={(e) => handleResize(e, 'se')} />
                </>
            )}
        </div>
    );
};

export default CanvasElement;
