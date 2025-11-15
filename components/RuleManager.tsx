
import React, { useState } from 'react';
import { Rule } from '../types';

interface RuleManagerProps {
    rules: Rule[];
    setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
}

const RuleManager: React.FC<RuleManagerProps> = ({ rules, setRules }) => {
    const [newRule, setNewRule] = useState('');

    const addRule = () => {
        if (newRule.trim() === '') return;
        const rule: Rule = {
            id: new Date().toISOString(),
            description: newRule.trim(),
            enabled: true,
        };
        setRules([rule, ...rules]);
        setNewRule('');
    };

    const toggleRule = (id: string) => {
        setRules(rules.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule));
    };
    
    const deleteRule = (id: string) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-blue-300">Detection Rules</h2>
            <div className="flex space-x-2 mb-4">
                <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    placeholder="Add a new rule..."
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={addRule}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
                >
                    Add
                </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {rules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md">
                        <p className={`text-sm flex-grow ${rule.enabled ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
                            {rule.description}
                        </p>
                        <div className="flex items-center space-x-2 ml-4">
                             <button onClick={() => deleteRule(rule.id)} className="text-gray-500 hover:text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                            <label className="switch relative inline-block w-10 h-5">
                                <input
                                    type="checkbox"
                                    checked={rule.enabled}
                                    onChange={() => toggleRule(rule.id)}
                                    className="opacity-0 w-0 h-0"
                                />
                                <span className={`slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${rule.enabled ? 'bg-blue-600' : 'bg-gray-600'}`}></span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
             <style>{`
                .switch .slider:before {
                    position: absolute;
                    content: "";
                    height: 14px;
                    width: 14px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    -webkit-transition: .4s;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider:before {
                    -webkit-transform: translateX(20px);
                    -ms-transform: translateX(20px);
                    transform: translateX(20px);
                }
            `}</style>
        </div>
    );
};

export default RuleManager;
