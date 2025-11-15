
import React from 'react';
import { TrafficLog } from '../types';

interface LiveTrafficLogProps {
    traffic: TrafficLog[];
}

const LiveTrafficLog: React.FC<LiveTrafficLogProps> = ({ traffic }) => {
    return (
        <div className="overflow-y-auto flex-grow font-mono text-xs bg-black/30 rounded-md p-3 border border-gray-700">
             {traffic.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 font-sans">Awaiting network traffic...</p>
                </div>
            ) : (
            <div className="space-y-1">
                {traffic.map((log) => (
                    <div key={log.id} className="flex items-center space-x-2 text-gray-400 whitespace-nowrap overflow-x-hidden">
                        <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className="text-cyan-400 w-32 truncate">{log.sourceIp}</span>
                        <span className="text-gray-500">&rarr;</span>
                        <span className="text-purple-400 w-32 truncate">{log.destinationIp}:{log.port}</span>
                        <span className="text-yellow-400 w-12">{log.protocol}</span>
                        <span className="text-gray-300 flex-grow truncate">{log.payload}</span>
                    </div>
                ))}
            </div>
             )}
        </div>
    );
};

export default LiveTrafficLog;
