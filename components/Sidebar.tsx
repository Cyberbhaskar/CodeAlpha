import React from 'react';

type View = 'nids' | 'phishing' | 'code';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

// FIX: Changed JSX.Element to React.ReactElement to resolve the "Cannot find namespace 'JSX'" error.
const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactElement, label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${
            isActive 
                ? 'bg-blue-500/20 text-blue-300 border-r-4 border-blue-400' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        }`}
    >
        {React.cloneElement(icon, { className: 'h-6 w-6 mr-4 flex-shrink-0' })}
        <span className="font-medium">{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    return (
        <aside className="w-64 bg-gray-800/80 border-r border-gray-700 flex-shrink-0 flex flex-col">
            <div className="h-20 flex items-center justify-center border-b border-gray-700">
                <h2 className="text-xl font-bold text-white tracking-wide">Internship Tasks</h2>
            </div>
            <nav className="flex-grow">
                <NavItem 
                    label="NIDS Dashboard" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
                    isActive={activeView === 'nids'} 
                    onClick={() => setActiveView('nids')} 
                />
                <NavItem 
                    label="Phishing Training" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8.5c.92 0 1.58.26 2.5.51 1.42.4 2.5.99 2.5 2.49v2c0 2-2.5 3.5-5 3.5-1.76 0-3.23-1.08-4.23-2.56"/><path d="M2.5 12.5c4.5-5 14-5 16.5 0"/><path d="M20 18.5c-1.5-1.5-3.5-2.5-5.5-2.5s-4 1-5.5 2.5"/><path d="M17.5 10.5c1.5-1.5 3.5-2.5 5.5-2.5s4 1 5.5 2.5"/><path d="M20 18.5c1.5-1.5 3.5-2.5 5.5-2.5s4 1 5.5 2.5"/><line x1="12" y1="2" x2="12" y2="12"/></svg>}
                    isActive={activeView === 'phishing'} 
                    onClick={() => setActiveView('phishing')} 
                />
                <NavItem 
                    label="Secure Code Analyzer" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline><line x1="10" y1="4" x2="14" y2="20"></line></svg>}
                    isActive={activeView === 'code'} 
                    onClick={() => setActiveView('code')} 
                />
            </nav>
            <div className="p-4 border-t border-gray-700 text-center">
                <p className="text-xs text-gray-500">&copy; CodeAlpha Project</p>
            </div>
        </aside>
    );
};

export default Sidebar;