import React, { useState, useReducer, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Plus, Download, Share2, Layers, Type, Image, Square, Circle, Sparkles, ChevronLeft, ChevronRight, Trash2, Eye, EyeOff, Lock, Unlock, Palette, Upload, Send, Loader2, Check, X, AlignLeft, AlignCenter, AlignRight, Zap, Music, MousePointer2 } from 'lucide-react';

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

const CANVAS_PRESETS = {
  'ig-story': { name: 'Instagram Story', width: 1080, height: 1920, icon: '📱' },
  'ig-post': { name: 'Instagram Post', width: 1080, height: 1080, icon: '📸' },
  'ig-reel': { name: 'Instagram Reel', width: 1080, height: 1920, icon: '🎬' },
  'fb-post': { name: 'Facebook Post', width: 1200, height: 630, icon: '👍' },
  'tiktok': { name: 'TikTok', width: 1080, height: 1920, icon: '🎵' },
  'youtube-thumb': { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: '▶️' },
  'twitter': { name: 'Twitter/X Post', width: 1600, height: 900, icon: '🐦' },
  'linkedin': { name: 'LinkedIn Post', width: 1200, height: 627, icon: '💼' },
};

const DEFAULT_BRAND = {
  id: 'brand-demo',
  name: 'Neon Studios',
  logo: null,
  colors: {
    primary: '#00D4FF',
    secondary: '#7B2CBF',
    accent: '#FF006E',
    background: '#0A0A0F',
    text: '#FFFFFF',
    textMuted: '#A0A0B0',
  },
  fonts: {
    heading: 'Space Grotesk',
    body: 'DM Sans',
  },
  personality: 'Bold, innovative, tech-forward',
  tone: 'Energetic and confident',
};

const ANIMATION_PRESETS = {
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

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const createNewProject = (preset = 'ig-story', brand = DEFAULT_BRAND) => ({
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

const projectReducer = (state, action) => {
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

// ============================================================================
// ANIMATION ENGINE - Custom easing and interpolation
// ============================================================================

// Easing functions
const easings = {
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

const getEasing = (easeName) => {
  return easings[easeName] || easings['power2.out'];
};

// Calculate animated value for an element at a given time
const getAnimatedValues = (element, currentTime) => {
  const values = {
    x: element.x || 0,
    y: element.y || 0,
    scale: 1,
    rotation: element.rotation || 0,
    opacity: element.opacity ?? 1,
  };
  
  // Check if element should be visible at current time
  const elementStart = element.startTime || 0;
  const elementEnd = element.endTime || 5000;
  
  if (currentTime < elementStart || currentTime > elementEnd) {
    values.opacity = 0;
    return values;
  }
  
  // Apply each animation
  const animations = element.animations || [];
  animations.forEach(anim => {
    const animStart = elementStart + (anim.startTime || 0);
    const animDuration = anim.duration || 500;
    const animEnd = animStart + animDuration;
    
    if (currentTime < animStart) {
      // Before animation starts - use "from" value
      if (anim.from !== undefined) {
        values[anim.property] = anim.from;
      }
    } else if (currentTime >= animEnd) {
      // After animation ends - use "to" value
      if (anim.to !== undefined) {
        values[anim.property] = anim.to;
      }
    } else {
      // During animation - interpolate
      const progress = (currentTime - animStart) / animDuration;
      const easedProgress = getEasing(anim.ease || 'power2.out')(progress);
      const from = anim.from ?? values[anim.property];
      const to = anim.to ?? values[anim.property];
      values[anim.property] = from + (to - from) * easedProgress;
    }
  });
  
  return values;
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Loading Screen
const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-content">
      <div className="loading-logo">
        <Zap size={48} />
      </div>
      <h1>Social Canvas AI</h1>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  </div>
);

// Library View
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

// Brand Guide Generator
const BrandGuideGenerator = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState({
    name: '',
    colors: { primary: '#00D4FF', secondary: '#7B2CBF', accent: '#FF006E', background: '#0A0A0F', text: '#FFFFFF' },
    fonts: { heading: 'Space Grotesk', body: 'DM Sans' },
    personality: '',
    tone: '',
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  
  const generateBrandSuggestions = async () => {
    setAiLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Based on this brand name: "${brand.name}", suggest:
1. A brand personality (2-3 adjectives)
2. A tone of voice (1 sentence)
3. A primary color (hex code) that matches the personality
4. A secondary color (hex code) that complements it
5. An accent color (hex code) for CTAs

Respond in JSON format only:
{
  "personality": "...",
  "tone": "...",
  "colors": { "primary": "#...", "secondary": "#...", "accent": "#..." }
}`
          }],
        })
      });
      
      const data = await response.json();
      const text = data.content.map(c => c.text || '').join('');
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setAiSuggestions(JSON.parse(jsonMatch[0]));
      }
    } catch (err) {
      console.error('AI suggestion error:', err);
    }
    setAiLoading(false);
  };
  
  const applyAiSuggestions = () => {
    if (aiSuggestions) {
      setBrand(prev => ({
        ...prev,
        personality: aiSuggestions.personality,
        tone: aiSuggestions.tone,
        colors: { ...prev.colors, ...aiSuggestions.colors },
      }));
      setStep(2);
    }
  };
  
  const steps = [
    <div key="name" className="brand-step">
      <h2>What's your brand called?</h2>
      <input
        type="text"
        value={brand.name}
        onChange={e => setBrand(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Enter brand name..."
        autoFocus
      />
      <button 
        className="btn-primary" 
        disabled={!brand.name}
        onClick={() => {
          generateBrandSuggestions();
          setStep(1);
        }}
      >
        Continue
        <ChevronRight size={18} />
      </button>
    </div>,
    
    <div key="ai" className="brand-step">
      <h2>AI Brand Suggestions</h2>
      {aiLoading ? (
        <div className="ai-loading">
          <Loader2 className="spin" size={32} />
          <p>Generating brand suggestions...</p>
        </div>
      ) : aiSuggestions ? (
        <div className="ai-suggestions">
          <div className="suggestion-card">
            <h3>Personality</h3>
            <p>{aiSuggestions.personality}</p>
          </div>
          <div className="suggestion-card">
            <h3>Tone of Voice</h3>
            <p>{aiSuggestions.tone}</p>
          </div>
          <div className="suggestion-card">
            <h3>Color Palette</h3>
            <div className="color-preview">
              <div style={{ background: aiSuggestions.colors.primary }}></div>
              <div style={{ background: aiSuggestions.colors.secondary }}></div>
              <div style={{ background: aiSuggestions.colors.accent }}></div>
            </div>
          </div>
          <div className="button-row">
            <button className="btn-ghost" onClick={() => setStep(2)}>Customize Instead</button>
            <button className="btn-primary" onClick={applyAiSuggestions}>Use Suggestions</button>
          </div>
        </div>
      ) : (
        <div className="ai-error">
          <p>Couldn't generate suggestions. Let's customize manually!</p>
          <button className="btn-primary" onClick={() => setStep(2)}>Continue</button>
        </div>
      )}
    </div>,
    
    <div key="colors" className="brand-step">
      <h2>Choose your colors</h2>
      <div className="color-inputs">
        {Object.entries(brand.colors).map(([key, value]) => (
          <div key={key} className="color-input">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <div className="color-field">
              <input
                type="color"
                value={value}
                onChange={e => setBrand(prev => ({
                  ...prev,
                  colors: { ...prev.colors, [key]: e.target.value }
                }))}
              />
              <input
                type="text"
                value={value}
                onChange={e => setBrand(prev => ({
                  ...prev,
                  colors: { ...prev.colors, [key]: e.target.value }
                }))}
              />
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={() => setStep(3)}>
        Continue
        <ChevronRight size={18} />
      </button>
    </div>,
    
    <div key="personality" className="brand-step">
      <h2>Define your brand voice</h2>
      <div className="form-group">
        <label>Brand Personality</label>
        <input
          type="text"
          value={brand.personality}
          onChange={e => setBrand(prev => ({ ...prev, personality: e.target.value }))}
          placeholder="e.g., Bold, innovative, approachable"
        />
      </div>
      <div className="form-group">
        <label>Tone of Voice</label>
        <textarea
          value={brand.tone}
          onChange={e => setBrand(prev => ({ ...prev, tone: e.target.value }))}
          placeholder="Describe how your brand communicates..."
          rows={3}
        />
      </div>
      <button 
        className="btn-primary" 
        onClick={() => onComplete({ ...brand, id: `brand-${Date.now()}` })}
      >
        <Check size={18} />
        Create Brand Guide
      </button>
    </div>,
  ];
  
  return (
    <div className="brand-generator">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={20} />
        Back to Library
      </button>
      <div className="brand-progress">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`progress-dot ${i <= step ? 'active' : ''}`} />
        ))}
      </div>
      {steps[step]}
    </div>
  );
};

// Left Sidebar Panel
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

// Canvas Element Component - Now with animation support
const CanvasElement = ({ element, isSelected, onSelect, onUpdate, scale, currentTime, isPlaying }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  
  // Get animated values
  const animatedValues = getAnimatedValues(element, currentTime);
  
  const handleMouseDown = (e) => {
    if (element.locked || isPlaying) return;
    e.stopPropagation();
    onSelect(element.id);
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

// Properties Panel
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

// AI Chat Panel
const AIChatPanel = ({ project, selectedElement, dispatch, brand }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm your creative AI assistant. I can help you design your ${project.canvas.name}. Try asking me to:\n\n• "Add a bold headline"\n• "Create a CTA button"\n• "Add a background gradient"\n\nWhat would you like to create?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      const systemPrompt = `You are a creative AI assistant helping design social media content. You control a canvas editor by returning JSON operations.

CANVAS: ${project.canvas.width}x${project.canvas.height} pixels
DURATION: ${project.duration}ms
CURRENT ELEMENTS: ${project.elements.length} elements
${selectedElement ? `SELECTED: ${selectedElement.name} (${selectedElement.type})` : 'No element selected'}

BRAND COLORS:
- Primary: ${brand.colors.primary}
- Secondary: ${brand.colors.secondary}
- Accent: ${brand.colors.accent}
- Background: ${brand.colors.background}
- Text: ${brand.colors.text}
- Heading Font: ${brand.fonts.heading}
- Body Font: ${brand.fonts.body}

AVAILABLE ANIMATIONS (use these exact names):
- fadeIn: opacity 0→1 (great for text)
- fadeOut: opacity 1→0
- slideInLeft: x from -200 to 0
- slideInRight: x from 200 to 0
- slideInUp: y from 200 to 0
- slideInDown: y from -200 to 0
- scaleIn: scale 0→1 (great for shapes)
- bounceIn: scale 0→1 with bounce
- rotateIn: rotation -180→0

OPERATIONS YOU CAN PERFORM:
1. addElement - Add text, shapes, or images
2. updateElement - Modify existing elements (need id)
3. deleteElement - Remove elements (need id)

IMPORTANT POSITIONING:
- Canvas is ${project.canvas.width}x${project.canvas.height}
- Center X: ${Math.round(project.canvas.width / 2)}
- Center Y: ${Math.round(project.canvas.height / 2)}

RESPOND WITH a brief explanation, then a JSON block:

\`\`\`json
{
  "operations": [
    {
      "type": "addElement",
      "element": {
        "type": "text",
        "name": "Main Heading",
        "content": "Your Text",
        "x": ${Math.round((project.canvas.width - 400) / 2)},
        "y": ${Math.round((project.canvas.height - 80) / 2)},
        "width": 400,
        "height": 80,
        "fontSize": 72,
        "fontFamily": "${brand.fonts.heading}",
        "fontWeight": 700,
        "color": "${brand.colors.text}",
        "textAlign": "center",
        "rotation": 0,
        "opacity": 1,
        "animations": [
          { "property": "opacity", "from": 0, "to": 1, "duration": 500, "ease": "power2.out", "startTime": 0 }
        ]
      }
    }
  ]
}
\`\`\`

For shapes:
{
  "type": "shape",
  "shapeType": "rectangle" or "circle",
  "name": "Shape Name",
  "x": 0, "y": 0,
  "width": 200, "height": 200,
  "fill": "#hexcolor",
  "borderRadius": 0 (use 9999 for circles),
  "opacity": 1,
  "animations": [{ "property": "scale", "from": 0, "to": 1, "duration": 500, "ease": "back.out(1.7)", "startTime": 0 }]
}

ALWAYS include at least one animation for visual interest. Stagger animations with different startTime values (e.g., 0, 200, 400ms).`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        })
      });
      
      const data = await response.json();
      const assistantMessage = data.content?.map(c => c.text || '').join('') || '';
      
      // Parse and execute operations
      const jsonMatch = assistantMessage.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const { operations } = JSON.parse(jsonMatch[1]);
          if (operations && Array.isArray(operations)) {
            operations.forEach(op => {
              if (op.type === 'addElement' && op.element) {
                dispatch({ type: 'ADD_ELEMENT', element: op.element });
              } else if (op.type === 'updateElement' && op.id) {
                dispatch({ type: 'UPDATE_ELEMENT', id: op.id, updates: op.updates });
              } else if (op.type === 'deleteElement' && op.id) {
                dispatch({ type: 'DELETE_ELEMENT', id: op.id });
              }
            });
          }
        } catch (e) {
          console.error('Failed to parse AI operations:', e);
        }
      }
      
      const cleanMessage = assistantMessage.replace(/```json[\s\S]*?```/g, '').trim();
      setMessages(prev => [...prev, { role: 'assistant', content: cleanMessage || 'Done! Hit play to see your animations.' }]);
      
    } catch (err) {
      console.error('AI error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
    
    setIsLoading(false);
  };
  
  return (
    <div className="ai-chat-panel">
      <div className="chat-header">
        <Sparkles size={18} />
        <span>AI Assistant</span>
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-content loading">
              <Loader2 className="spin" size={16} />
              <span>Creating...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me to create something..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// Timeline Component
const Timeline = ({ project, dispatch, selectedId, onSelect, currentTime, onTimeChange, isPlaying, onPlayPause }) => {
  const rulerRef = useRef(null);
  const duration = project.duration;
  
  const formatTime = (ms) => (ms / 1000).toFixed(2);
  
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
              className={`track-label ${selectedId === element.id ? 'selected' : ''}`}
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
                className={`timeline-track ${selectedId === element.id ? 'selected' : ''}`}
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

// Export Modal
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

// Main Editor View
const EditorView = ({ project, dispatch, onBack, onSave }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [activePanel, setActivePanel] = useState('elements');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [canvasScale, setCanvasScale] = useState(0.4);
  const canvasContainerRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);
  
  const selectedElement = project.elements.find(el => el.id === selectedId);
  
  // Calculate canvas scale
  useEffect(() => {
    const updateScale = () => {
      if (canvasContainerRef.current) {
        const container = canvasContainerRef.current;
        const padding = 60;
        const availableWidth = container.clientWidth - padding;
        const availableHeight = container.clientHeight - padding;
        const scaleX = availableWidth / project.canvas.width;
        const scaleY = availableHeight / project.canvas.height;
        setCanvasScale(Math.min(scaleX, scaleY, 0.8));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [project.canvas.width, project.canvas.height]);
  
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
  
  const handleUpdateElement = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_ELEMENT', id, updates });
  }, [dispatch]);
  
  const handleDeleteElement = (id) => {
    dispatch({ type: 'DELETE_ELEMENT', id });
    if (selectedId === id) setSelectedId(null);
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
          <span>{project.canvas.name} • {project.canvas.width}×{project.canvas.height}</span>
        </div>
        <div className="header-right">
          <button className="btn-ghost" onClick={onSave}><Check size={16} /> Save</button>
          <button className="btn-ghost" onClick={() => setShowExport(true)}><Download size={16} /> Export</button>
          <button className="btn-primary"><Share2 size={16} /> Share</button>
        </div>
      </header>
      
      <div className="editor-body">
        <LeftSidebar 
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          project={project}
          dispatch={dispatch}
          brand={project.brandGuide}
        />
        
        <div className="canvas-container" ref={canvasContainerRef} onClick={() => !isPlaying && setSelectedId(null)}>
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
                isSelected={selectedId === element.id}
                onSelect={setSelectedId}
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
          <PropertiesPanel 
            element={selectedElement}
            onUpdate={handleUpdateElement}
            onDelete={handleDeleteElement}
            brand={project.brandGuide}
          />
        </div>
      </div>
      
      <Timeline 
        project={project}
        dispatch={dispatch}
        selectedId={selectedId}
        onSelect={setSelectedId}
        currentTime={currentTime}
        onTimeChange={handleTimeChange}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
      
      {showExport && <ExportModal project={project} onClose={() => setShowExport(false)} />}
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

export default function SocialCanvasAI() {
  const [view, setView] = useState('loading');
  const [projects, setProjects] = useState([]);
  const [brandGuides, setBrandGuides] = useState([DEFAULT_BRAND]);
  const [currentProject, dispatch] = useReducer(projectReducer, null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProjects = await window.storage?.get('social-canvas-projects');
        const savedBrands = await window.storage?.get('social-canvas-brands');
        if (savedProjects?.value) setProjects(JSON.parse(savedProjects.value));
        if (savedBrands?.value) setBrandGuides(JSON.parse(savedBrands.value));
      } catch (err) {
        console.log('No saved data');
      }
      setTimeout(() => setView('library'), 1200);
    };
    loadData();
  }, []);
  
  const saveData = async () => {
    try {
      await window.storage?.set('social-canvas-projects', JSON.stringify(projects));
      await window.storage?.set('social-canvas-brands', JSON.stringify(brandGuides));
    } catch (err) {
      console.error('Save failed:', err);
    }
  };
  
  const handleCreateProject = (preset) => {
    const newProject = createNewProject(preset, brandGuides[0]);
    dispatch({ type: 'SET_PROJECT', project: newProject });
    setView('editor');
  };
  
  const handleOpenProject = (project) => {
    dispatch({ type: 'SET_PROJECT', project });
    setView('editor');
  };
  
  const handleSaveProject = () => {
    if (currentProject) {
      setProjects(prev => {
        const idx = prev.findIndex(p => p.id === currentProject.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = currentProject;
          return updated;
        }
        return [...prev, currentProject];
      });
      saveData();
    }
  };
  
  const handleBackToLibrary = () => {
    handleSaveProject();
    setView('library');
  };
  
  const handleBrandComplete = (brand) => {
    setBrandGuides(prev => [...prev, brand]);
    saveData();
    setView('library');
  };
  
  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        
        .app {
          width: 100vw;
          height: 100vh;
          background: #08080C;
          color: #fff;
          font-family: 'DM Sans', -apple-system, sans-serif;
          overflow: hidden;
        }
        
        /* Loading */
        .loading-screen {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(180deg, #08080C 0%, #0f0f15 100%);
        }
        .loading-content { text-align: center; }
        .loading-logo {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #00D4FF, #7B2CBF);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        .loading-content h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px; font-weight: 700;
          background: linear-gradient(90deg, #00D4FF, #7B2CBF);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 20px;
        }
        .loading-bar { width: 180px; height: 3px; background: #1a1a24; border-radius: 2px; overflow: hidden; }
        .loading-progress { height: 100%; background: linear-gradient(90deg, #00D4FF, #7B2CBF); animation: load 1.2s ease-out forwards; }
        @keyframes load { from { width: 0; } to { width: 100%; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Buttons */
        button { cursor: pointer; border: none; outline: none; font-family: inherit; transition: all 0.15s; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 18px; background: linear-gradient(135deg, #00D4FF, #7B2CBF);
          color: #fff; border-radius: 8px; font-weight: 600; font-size: 14px;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,212,255,0.25); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; background: transparent; color: #888; border-radius: 6px; font-size: 13px;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .btn-icon {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; background: transparent; color: #888; border-radius: 8px;
        }
        .btn-icon:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .btn-icon-sm {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; background: transparent; color: #666; border-radius: 6px;
        }
        .btn-icon-sm:hover { background: rgba(255,255,255,0.08); color: #fff; }
        
        /* Library */
        .library-view { width: 100%; height: 100%; display: flex; flex-direction: column; }
        .library-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 28px; border-bottom: 1px solid #1a1a24;
        }
        .logo { display: flex; align-items: center; gap: 10px; color: #00D4FF; font-family: 'Space Grotesk'; font-weight: 700; font-size: 18px; }
        .library-content { flex: 1; overflow-y: auto; padding: 28px; }
        .library-section { margin-bottom: 36px; }
        .library-section h2 { font-family: 'Space Grotesk'; font-size: 18px; font-weight: 600; margin-bottom: 16px; }
        .project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .project-card, .empty-state {
          background: #111118; border-radius: 12px; overflow: hidden; cursor: pointer;
          border: 1px solid #1a1a24; transition: all 0.15s;
        }
        .project-card:hover, .empty-state:hover { border-color: #00D4FF; transform: translateY(-2px); }
        .project-thumbnail { height: 140px; display: flex; align-items: center; justify-content: center; color: #333; }
        .project-info { padding: 14px; }
        .project-info h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .project-info span { font-size: 11px; color: #666; }
        .empty-state { height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #444; }
        .brand-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
        .brand-card {
          background: #111118; border-radius: 10px; padding: 14px; cursor: pointer;
          border: 1px solid #1a1a24; text-align: center; transition: all 0.15s;
        }
        .brand-card:hover { border-color: #7B2CBF; }
        .brand-colors { display: flex; gap: 6px; margin-bottom: 10px; justify-content: center; align-items: center; height: 32px; }
        .brand-colors > div { width: 28px; height: 28px; border-radius: 6px; }
        .brand-card span { font-size: 13px; font-weight: 500; }
        
        /* Modal */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal { background: #111118; border-radius: 16px; padding: 28px; max-width: 560px; width: 90%; max-height: 80vh; overflow-y: auto; }
        .modal h2 { font-family: 'Space Grotesk'; font-size: 22px; font-weight: 700; margin-bottom: 20px; text-align: center; }
        .preset-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
        .preset-option {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 16px; background: #1a1a24; border-radius: 10px; color: #fff;
        }
        .preset-option:hover { background: #222230; }
        .preset-icon { font-size: 24px; }
        .preset-name { font-weight: 600; font-size: 13px; }
        .preset-size { font-size: 11px; color: #666; }
        .close-modal { width: 100%; justify-content: center; }
        
        /* Brand Generator */
        .brand-generator {
          width: 100%; height: 100%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding: 40px; position: relative;
        }
        .back-btn {
          position: absolute; top: 20px; left: 20px;
          display: flex; align-items: center; gap: 6px;
          background: transparent; color: #888; font-size: 13px;
        }
        .back-btn:hover { color: #fff; }
        .brand-progress { display: flex; gap: 10px; margin-bottom: 32px; }
        .progress-dot { width: 8px; height: 8px; border-radius: 50%; background: #2a2a34; }
        .progress-dot.active { background: #00D4FF; }
        .brand-step { max-width: 460px; width: 100%; text-align: center; }
        .brand-step h2 { font-family: 'Space Grotesk'; font-size: 28px; font-weight: 700; margin-bottom: 28px; }
        .brand-step input[type="text"], .brand-step textarea {
          width: 100%; padding: 14px 18px; background: #111118;
          border: 2px solid #2a2a34; border-radius: 10px; color: #fff; font-size: 16px;
          font-family: inherit; margin-bottom: 20px;
        }
        .brand-step input:focus, .brand-step textarea:focus { border-color: #00D4FF; outline: none; }
        .brand-step .btn-primary { margin: 0 auto; }
        .ai-loading { padding: 48px; color: #666; }
        .ai-loading p { margin-top: 12px; }
        .ai-suggestions { text-align: left; }
        .suggestion-card { background: #111118; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
        .suggestion-card h3 { font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 6px; }
        .suggestion-card p { font-size: 14px; }
        .color-preview { display: flex; gap: 10px; }
        .color-preview > div { width: 40px; height: 40px; border-radius: 10px; }
        .button-row { display: flex; gap: 10px; margin-top: 20px; justify-content: center; }
        .color-inputs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; text-align: left; margin-bottom: 24px; }
        .color-input label { display: block; font-size: 11px; color: #666; margin-bottom: 6px; }
        .color-field { display: flex; gap: 8px; }
        .color-field input[type="color"] { width: 44px; height: 44px; border: none; border-radius: 8px; cursor: pointer; }
        .color-field input[type="text"] {
          flex: 1; padding: 10px; background: #1a1a24; border: 1px solid #2a2a34;
          border-radius: 8px; color: #fff; font-family: monospace; font-size: 13px;
        }
        .form-group { text-align: left; margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; color: #aaa; margin-bottom: 6px; }
        .ai-error { padding: 24px; color: #888; }
        
        /* Editor */
        .editor-view { width: 100%; height: 100%; display: flex; flex-direction: column; background: #0a0a0f; }
        .editor-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px; background: #111118; border-bottom: 1px solid #1a1a24; flex-shrink: 0;
        }
        .header-left, .header-right { display: flex; align-items: center; gap: 8px; }
        .header-center { font-size: 12px; color: #666; }
        .project-name {
          background: transparent; border: none; color: #fff;
          font-size: 15px; font-weight: 600; padding: 6px 10px; border-radius: 4px;
        }
        .project-name:focus { background: #1a1a24; outline: none; }
        .editor-body { flex: 1; display: flex; overflow: hidden; min-height: 0; }
        
        /* Left Sidebar */
        .left-sidebar { display: flex; background: #111118; border-right: 1px solid #1a1a24; flex-shrink: 0; }
        .sidebar-icons {
          display: flex; flex-direction: column; padding: 8px; gap: 2px;
          border-right: 1px solid #1a1a24; width: 64px;
        }
        .sidebar-icon {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 10px 4px; background: transparent; color: #666; border-radius: 6px; font-size: 9px;
        }
        .sidebar-icon:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .sidebar-icon.active { color: #00D4FF; background: rgba(0,212,255,0.1); }
        .sidebar-panel { width: 240px; padding: 16px; overflow-y: auto; }
        .panel-content h3 { font-size: 14px; font-weight: 600; margin-bottom: 14px; }
        .element-buttons { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
        .element-buttons button {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 14px 8px; background: #1a1a24; color: #888; border-radius: 8px; font-size: 11px;
        }
        .element-buttons button:hover { background: #222230; color: #fff; }
        .text-presets { display: flex; flex-direction: column; gap: 6px; }
        .text-presets button { padding: 12px; background: #1a1a24; color: #fff; border-radius: 8px; text-align: left; }
        .text-presets button:hover { background: #222230; }
        .brand-section { margin-bottom: 16px; }
        .brand-section h4 { font-size: 10px; color: #666; margin-bottom: 6px; text-transform: uppercase; }
        .brand-section p { font-size: 12px; color: #888; }
        .brand-colors-grid { display: flex; gap: 6px; flex-wrap: wrap; }
        .brand-color-btn { width: 32px; height: 32px; border-radius: 6px; border: 2px solid transparent; }
        .brand-color-btn:hover { border-color: #fff; }
        .upload-zone {
          padding: 32px; border: 2px dashed #2a2a34; border-radius: 10px;
          text-align: center; color: #555; cursor: pointer;
        }
        .upload-zone:hover { border-color: #00D4FF; color: #00D4FF; }
        .upload-zone p { margin: 10px 0 4px; font-weight: 500; font-size: 13px; }
        .upload-zone span { font-size: 11px; }
        .upload-note { margin-top: 12px; font-size: 10px; color: #444; font-style: italic; }
        
        /* Canvas */
        .canvas-container {
          flex: 1; display: flex; align-items: center; justify-content: center;
          background: #08080c; overflow: hidden; position: relative; min-width: 0;
        }
        .canvas {
          position: relative; box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          border-radius: 2px; overflow: hidden;
        }
        .canvas-element { position: absolute; user-select: none; }
        .canvas-element.selected { outline: 2px solid #00D4FF; outline-offset: 1px; }
        .canvas-element.locked { opacity: 0.7; }
        .resize-handle {
          position: absolute; width: 8px; height: 8px;
          background: #00D4FF; border-radius: 2px; z-index: 10;
        }
        .resize-handle.nw { top: -4px; left: -4px; cursor: nw-resize; }
        .resize-handle.ne { top: -4px; right: -4px; cursor: ne-resize; }
        .resize-handle.sw { bottom: -4px; left: -4px; cursor: sw-resize; }
        .resize-handle.se { bottom: -4px; right: -4px; cursor: se-resize; }
        
        /* Right Panel */
        .right-panel {
          width: 300px; background: #111118; border-left: 1px solid #1a1a24;
          display: flex; flex-direction: column; flex-shrink: 0; overflow: hidden;
        }
        
        /* AI Chat */
        .ai-chat-panel { flex: 1; display: flex; flex-direction: column; min-height: 200px; border-bottom: 1px solid #1a1a24; }
        .chat-header {
          display: flex; align-items: center; gap: 6px;
          padding: 12px 14px; border-bottom: 1px solid #1a1a24; color: #00D4FF; font-weight: 600; font-size: 13px; flex-shrink: 0;
        }
        .chat-messages { flex: 1; overflow-y: auto; padding: 12px; }
        .chat-message { margin-bottom: 12px; }
        .chat-message.user .message-content { background: #7B2CBF; margin-left: auto; border-radius: 12px 12px 4px 12px; }
        .chat-message.assistant .message-content { background: #1a1a24; border-radius: 12px 12px 12px 4px; }
        .message-content { padding: 10px 14px; font-size: 13px; line-height: 1.45; max-width: 90%; white-space: pre-wrap; }
        .message-content.loading { display: flex; align-items: center; gap: 8px; }
        .chat-input { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #1a1a24; flex-shrink: 0; }
        .chat-input input {
          flex: 1; padding: 10px 14px; background: #1a1a24; border: none;
          border-radius: 20px; color: #fff; font-size: 13px;
        }
        .chat-input input:focus { outline: none; box-shadow: 0 0 0 2px #00D4FF; }
        .chat-input button {
          width: 40px; height: 40px; background: linear-gradient(135deg, #00D4FF, #7B2CBF);
          border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;
        }
        .chat-input button:disabled { opacity: 0.4; }
        
        /* Properties */
        .properties-panel { padding: 14px; overflow-y: auto; flex: 1; }
        .properties-panel.empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: #444; text-align: center; padding: 32px;
        }
        .properties-panel.empty p { margin-top: 10px; font-size: 12px; }
        .prop-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .prop-header h3 { font-size: 13px; font-weight: 600; }
        .prop-section { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid #1a1a24; }
        .prop-section:last-child { border-bottom: none; }
        .prop-section h4 { font-size: 10px; text-transform: uppercase; color: #666; margin-bottom: 10px; }
        .prop-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
        .prop-row { display: flex; gap: 10px; margin-top: 10px; }
        .prop-field { flex: 1; }
        .prop-field.full { flex: unset; width: 100%; }
        .prop-field label { display: block; font-size: 9px; color: #666; margin-bottom: 3px; }
        .prop-field input[type="number"], .prop-field input[type="text"] {
          width: 100%; padding: 7px; background: #1a1a24; border: 1px solid #2a2a34;
          border-radius: 5px; color: #fff; font-size: 11px;
        }
        .prop-field input[type="color"] { width: 100%; height: 28px; border: none; border-radius: 5px; cursor: pointer; }
        .prop-section textarea {
          width: 100%; padding: 8px; background: #1a1a24; border: 1px solid #2a2a34;
          border-radius: 6px; color: #fff; font-size: 12px; font-family: inherit; resize: vertical;
        }
        .text-align-buttons { display: flex; gap: 4px; margin-top: 10px; }
        .text-align-buttons button { flex: 1; padding: 6px; background: #1a1a24; color: #666; border-radius: 5px; }
        .text-align-buttons button:hover { color: #fff; }
        .text-align-buttons button.active { background: #00D4FF; color: #08080C; }
        .brand-color-quick { display: flex; gap: 4px; margin-top: 8px; }
        .brand-color-quick button { width: 22px; height: 22px; border-radius: 4px; border: 2px solid transparent; }
        .brand-color-quick button:hover { border-color: #fff; }
        .animation-list { margin-bottom: 8px; }
        .animation-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 6px 8px; background: #1a1a24; border-radius: 5px; margin-bottom: 4px; font-size: 11px;
        }
        .animation-item button { background: transparent; color: #666; padding: 2px; border-radius: 3px; }
        .animation-item button:hover { color: #FF006E; }
        .prop-section select {
          width: 100%; padding: 8px; background: #1a1a24; border: 1px solid #2a2a34;
          border-radius: 6px; color: #888; font-size: 12px;
        }
        
        /* Timeline */
        .timeline {
          background: #111118; border-top: 1px solid #1a1a24;
          display: flex; flex-direction: column; flex-shrink: 0;
        }
        .timeline-controls {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; border-bottom: 1px solid #1a1a24;
        }
        .play-btn {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #00D4FF, #7B2CBF);
          border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;
        }
        .time-display { font-family: monospace; font-size: 13px; color: #888; }
        .time-sep { color: #444; }
        .timeline-content { display: flex; height: 160px; overflow: hidden; }
        .track-labels {
          width: 180px; flex-shrink: 0; border-right: 1px solid #1a1a24;
          display: flex; flex-direction: column; padding-top: 28px; overflow-y: auto;
        }
        .track-label {
          display: flex; align-items: center; gap: 6px;
          height: 32px; padding: 0 10px; cursor: pointer; flex-shrink: 0;
        }
        .track-label:hover { background: rgba(255,255,255,0.03); }
        .track-label.selected { background: rgba(0,212,255,0.1); }
        .icon-btn { background: transparent; color: #555; padding: 2px; border-radius: 3px; }
        .icon-btn:hover { color: #fff; }
        .label-text { font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
        .timeline-tracks-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .timeline-ruler { height: 28px; background: #0a0a0f; position: relative; flex-shrink: 0; cursor: pointer; }
        .ruler-mark { position: absolute; top: 0; height: 100%; border-left: 1px solid #2a2a34; }
        .ruler-mark span { position: absolute; top: 6px; left: 4px; font-size: 9px; color: #555; }
        .playhead {
          position: absolute; top: 0; width: 2px; height: 100%; background: #FF006E; z-index: 10;
        }
        .playhead::before {
          content: ''; position: absolute; top: 0; left: -5px;
          border-left: 6px solid transparent; border-right: 6px solid transparent;
          border-top: 8px solid #FF006E;
        }
        .timeline-tracks { flex: 1; overflow-y: auto; }
        .timeline-track {
          height: 32px; position: relative; cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .timeline-track:hover { background: rgba(255,255,255,0.02); }
        .timeline-track.selected { background: rgba(0,212,255,0.08); }
        .track-bar { position: absolute; top: 4px; height: 24px; border-radius: 4px; opacity: 0.85; }
        .anim-marker {
          position: absolute; top: 0; width: 6px; height: 100%;
          background: rgba(255,255,255,0.4); border-radius: 2px;
        }
        .timeline-footer { padding: 10px 16px; border-top: 1px solid #1a1a24; }
        .add-audio-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent; color: #555; font-size: 12px;
        }
        .add-audio-btn:hover { color: #fff; }
        
        /* Export Modal */
        .export-modal { max-width: 380px; }
        .export-modal .modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .export-modal .modal-header h2 { margin-bottom: 0; text-align: left; flex: 1; }
        .back-icon { background: transparent; color: #666; padding: 4px; border-radius: 6px; }
        .back-icon:hover { color: #fff; background: rgba(255,255,255,0.1); }
        .format-options { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
        .format-option {
          display: flex; align-items: center; gap: 10px;
          padding: 14px; background: #1a1a24; border-radius: 10px; color: #fff; text-align: left;
        }
        .format-option:hover { background: #222230; }
        .format-option.selected { background: rgba(0,212,255,0.1); outline: 1px solid #00D4FF; }
        .format-icon { font-size: 18px; }
        .format-info { flex: 1; display: flex; flex-direction: column; }
        .format-name { font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; }
        .format-desc { font-size: 11px; color: #666; }
        .badge {
          background: linear-gradient(135deg, #00D4FF, #7B2CBF);
          padding: 2px 6px; border-radius: 8px; font-size: 9px; font-weight: 600;
        }
        .check-icon { color: #00D4FF; }
        .export-btn { width: 100%; justify-content: center; padding: 12px; }
      `}</style>
      
      {view === 'loading' && <LoadingScreen />}
      {view === 'library' && (
        <LibraryView 
          projects={projects} brandGuides={brandGuides}
          onCreateProject={handleCreateProject} onOpenProject={handleOpenProject}
          onCreateBrand={() => setView('brand-generator')}
        />
      )}
      {view === 'brand-generator' && (
        <BrandGuideGenerator onComplete={handleBrandComplete} onBack={() => setView('library')} />
      )}
      {view === 'editor' && currentProject && (
        <EditorView project={currentProject} dispatch={dispatch} onBack={handleBackToLibrary} onSave={handleSaveProject} />
      )}
    </div>
  );
}
