import React from 'react';
import { Zap } from 'lucide-react';

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

export default LoadingScreen;
