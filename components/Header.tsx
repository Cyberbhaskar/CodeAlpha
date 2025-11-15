import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                         <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    <h1 className="text-2xl font-bold text-white tracking-wider">
                        Code<span className="text-blue-400">Alpha</span>
                    </h1>
                </div>
                <div className="text-sm text-gray-400">Cyber Security Internship</div>
            </div>
        </header>
    );
};

export default Header;