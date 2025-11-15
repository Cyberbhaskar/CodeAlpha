import React, { useState } from 'react';
import { Alert, Severity } from '../types';

interface RecentAlertsProps {
    alerts: Alert[];
    onBlockIp: (ip: string) => void;
}

const severityColorMap: Record<Severity, string> = {
    [Severity.Low]: 'bg-blue-500/20 text-blue-300 border-blue-500',
    [Severity.Medium]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
    [Severity.High]: 'bg-orange-500/20 text-orange-300 border-orange-500',
    [Severity.Critical]: 'bg-red-500/20 text-red-300 border-red-500',
};

const RecommendationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
        <path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
    </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts, onBlockIp }) => {
    const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

    const highPriorityAlerts = alerts
        .filter(a => a.severity === Severity.High || a.severity === Severity.Critical)
        .slice(0, 20);

    const handleSelectAlert = (id: string) => {
        setSelectedAlertId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="overflow-y-auto flex-grow pr-2">
             {highPriorityAlerts.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No high-priority alerts detected.</p>
                </div>
            ) : (
            <div className="space-y-3">
                {highPriorityAlerts.map((alert) => (
                    <div key={alert.id} className="bg-gray-900/50 rounded-lg border border-gray-700 hover:border-red-500 transition-colors duration-300 ease-in-out">
                        <div className="p-4 cursor-pointer" onClick={() => handleSelectAlert(alert.id)}>
                            <div className="flex justify-between items-start">
                                <div className="flex-grow pr-4">
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${severityColorMap[alert.severity]}`}>
                                            {alert.severity.toUpperCase()}
                                        </span>
                                        <p className="font-semibold text-gray-100">{alert.type}</p>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {alert.description}
                                    </p>
                                     <p className="text-xs text-gray-500 mt-2 font-mono">
                                        {alert.sourceIp} &rarr; {alert.destinationIp}
                                    </p>
                                </div>
                                <div className="flex flex-shrink-0 items-center space-x-4">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onBlockIp(alert.sourceIp);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded-md transition-colors"
                                        title={`Block IP: ${alert.sourceIp}`}
                                    >
                                        Block IP
                                    </button>
                                    <ChevronDownIcon open={selectedAlertId === alert.id} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-start text-xs">
                                <RecommendationIcon />
                                <p className="ml-2">
                                    <span className="font-semibold text-yellow-400">Recommendation:</span>
                                    <span className="ml-1.5 text-gray-300">{alert.recommendation}</span>
                                </p>
                            </div>
                        </div>

                        <div className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${selectedAlertId === alert.id ? 'max-h-48' : 'max-h-0'}`}>
                             <div className="bg-black/30 px-4 pb-4 pt-3 border-t border-gray-600">
                                <h4 className="font-bold text-gray-200 mb-2 text-sm">Alert Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs">
                                    <div className="col-span-1 md:col-span-2"><span className="text-gray-400 w-24 inline-block">Timestamp:</span><span className="text-gray-200">{new Date(alert.timestamp).toLocaleString()}</span></div>
                                    <div><span className="text-gray-400 w-24 inline-block">Source IP:</span><span className="text-cyan-300">{alert.sourceIp}</span></div>
                                    <div><span className="text-gray-400 w-24 inline-block">Dest. IP:</span><span className="text-purple-300">{alert.destinationIp}</span></div>
                                    <div><span className="text-gray-400 w-24 inline-block">Protocol:</span><span className="text-yellow-300">{alert.protocol}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             )}
        </div>
    );
};

export default RecentAlerts;