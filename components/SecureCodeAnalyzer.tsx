import React, { useState } from 'react';
import { analyzeCode } from '../services/geminiService';
import { CodeVulnerability } from '../types';

const severityColorMap: Record<CodeVulnerability['severity'], string> = {
    Low: 'bg-blue-500/20 text-blue-300 border-blue-500',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
    High: 'bg-orange-500/20 text-orange-300 border-orange-500',
    Critical: 'bg-red-500/20 text-red-300 border-red-500',
};

const SecureCodeAnalyzer: React.FC = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [results, setResults] = useState<CodeVulnerability[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!code.trim()) return;
        setIsAnalyzing(true);
        setError(null);
        setResults([]);
        try {
            const vulnerabilities = await analyzeCode(code, language);
            setResults(vulnerabilities);
        } catch (err) {
            setError('An error occurred during analysis. Please try again.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h1 className="text-2xl font-bold text-blue-300">Task 3: Secure Coding Review</h1>
                <p className="text-sm text-gray-400 mt-1">
                    This tool uses the Gemini API to perform a static analysis on code snippets to identify potential security vulnerabilities and suggest best practices for remediation.
                </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                <div className="flex items-center space-x-4 mb-4">
                    <h2 className="text-xl font-bold text-blue-300">Code Input</h2>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="go">Go</option>
                    </select>
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`Paste your ${language} code here...`}
                    className="w-full h-72 bg-gray-900 border border-gray-600 rounded-md p-3 text-sm font-mono focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !code.trim()}
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
                    ) : 'Analyze Code'}
                </button>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-blue-300">Analysis Results</h2>
                <div className="space-y-4">
                    {isAnalyzing && <p className="text-gray-400">Analysis in progress...</p>}
                    {error && <p className="text-red-400">{error}</p>}
                    {!isAnalyzing && results.length === 0 && !error && (
                        <p className="text-gray-500">No vulnerabilities found or no code analyzed yet.</p>
                    )}
                    {results.map((vuln) => (
                        <div key={vuln.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                             <div className="flex items-center space-x-3 mb-2">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full border ${severityColorMap[vuln.severity]}`}>
                                    {vuln.severity.toUpperCase()}
                                </span>
                                <p className="font-semibold text-gray-100">Line {vuln.line}</p>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{vuln.description}</p>
                             <p className="text-sm">
                                <span className="font-semibold text-yellow-400">Recommendation: </span> 
                                <span className="text-gray-300">{vuln.recommendation}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SecureCodeAnalyzer;