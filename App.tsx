import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NidsDashboard from './components/NidsDashboard';
import PhishingTraining from './components/PhishingTraining';
import SecureCodeAnalyzer from './components/SecureCodeAnalyzer';

type View = 'nids' | 'phishing' | 'code';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('nids');

    const renderView = () => {
        switch (activeView) {
            case 'nids':
                return <NidsDashboard />;
            case 'phishing':
                return <PhishingTraining />;
            case 'code':
                return <SecureCodeAnalyzer />;
            default:
                return <NidsDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-200 font-sans">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;