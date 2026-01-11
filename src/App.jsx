import React, { useState, useReducer, useEffect } from 'react';
import { projectReducer, createNewProject } from './state/index.js';
import { DEFAULT_BRAND } from './constants/index.js';
import LoadingScreen from './components/LoadingScreen.jsx';
import LibraryView from './components/LibraryView.jsx';
import BrandGuideGenerator from './components/BrandGuideGenerator.jsx';
import EditorView from './components/EditorView.jsx';
import './styles/index.css';

export default function App() {
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
