
import React, { useState } from 'react';
import { TrafficLog } from '../types';

interface LogAnalyzerProps {
    onAnalyze: (logs: TrafficLog[]) => Promise<void>;
    isAnalyzing: boolean;
}

const LogAnalyzer: React.FC<LogAnalyzerProps> = ({ onAnalyze, isAnalyzing }) => {
    const [logInput, setLogInput] = useState('');

    const handleAnalyzeClick = () => {
        if (!logInput.trim()) return;

        // The Gemini model is capable of parsing the raw log line.
        // We pass the entire line as the payload for a more robust analysis,
        // letting the model extract the relevant fields itself.
        const parsedLogs: TrafficLog[] = logInput.trim().split('\n').map((line, index) => ({
            id: `manual-${Date.now()}-${index}`,
            timestamp: new Date().toISOString(),
            sourceIp: 'N/A',
            destinationIp: 'N/A',
            protocol: 'N/A',
            port: 0,
            payload: line.trim(),
        }));

        onAnalyze(parsedLogs);
        setLogInput(''); // Clear input after analysis
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-blue-300">Manual Log Analyzer</h2>
            <p className="text-sm text-gray-400 mb-4">
                Paste raw network logs below for on-demand analysis by Gemini. Each line will be treated as a separate log entry.
            </p>
            <textarea
                value={logInput}
                onChange={(e) => setLogInput(e.target.value)}
                placeholder="Example: 12:34:56 192.168.1.105 -> 10.0.0.22 TCP 80 GET /login.php?user=' OR 1=1"
                className="w-full h-40 bg-gray-900 border border-gray-600 rounded-md p-3 text-sm font-mono focus:ring-blue-500 focus:border-blue-500"
                rows={8}
            />
            <button
                onClick={handleAnalyzeClick}
                disabled={isAnalyzing || !logInput.trim()}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
            >
                {isAnalyzing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                ) : 'Analyze Logs'}
            </button>
        </div>
    );
};

export default LogAnalyzer;