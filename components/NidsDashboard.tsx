import React, { useState, useEffect, useCallback } from 'react';
import { Alert, TrafficLog, Rule, Severity } from '../types';
import { generateMockTraffic } from '../utils/mockData';
import { analyzeLogs } from '../services/geminiService';
import StatCard from './StatCard';
import AlertsChart from './AlertsChart';
import RecentAlerts from './RecentAlerts';
import LiveTrafficLog from './LiveTrafficLog';
import RuleManager from './RuleManager';
import LogAnalyzer from './LogAnalyzer';

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-400">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-red-400">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>
    </svg>
);
const BanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-400">
        <circle cx="12" cy="12" r="10"></circle><path d="m4.9 4.9 14.2 14.2"></path>
    </svg>
);


const NidsDashboard: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [traffic, setTraffic] = useState<TrafficLog[]>([]);
    const [rules, setRules] = useState<Rule[]>([
        { id: '1', description: 'Alert on multiple failed login attempts from the same IP.', enabled: true },
        { id: '2', description: 'Identify potential SQL injection attempts.', enabled: true },
        { id: '3', description: 'Detect port scanning activity.', enabled: true },
        { id: '4', description: 'Identify Cross-Site Scripting (XSS) payloads.', enabled: true },
    ]);
    const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [isAutoAnalyze, setIsAutoAnalyze] = useState<boolean>(false);

    const handleAnalysis = useCallback(async (logsToAnalyze: TrafficLog[]) => {
        if (isAnalyzing || logsToAnalyze.length === 0) return;
        setIsAnalyzing(true);
        try {
            const newAlerts = await analyzeLogs(logsToAnalyze, rules.filter(r => r.enabled));
            setAlerts(prevAlerts => [...newAlerts, ...prevAlerts].slice(0, 100)); // Keep last 100 alerts
        } catch (error) {
            console.error("Error analyzing logs:", error);
        } finally {
            setIsAnalyzing(false);
        }
    }, [isAnalyzing, rules]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newTrafficEntry = generateMockTraffic(blockedIPs);
            setTraffic(prevTraffic => [newTrafficEntry, ...prevTraffic].slice(0, 50));
            
            if (isAutoAnalyze && traffic.length > 0 && traffic.length % 15 === 0) {
               handleAnalysis(traffic.slice(0, 15));
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [traffic, blockedIPs, handleAnalysis, isAutoAnalyze]);

    const handleBlockIp = (ip: string) => {
        if (!blockedIPs.includes(ip)) {
            setBlockedIPs(prev => [...prev, ip]);
        }
    };
    
    const highPriorityAlerts = alerts.filter(a => a.severity === Severity.High || a.severity === Severity.Critical).length;

    return (
        <div className="space-y-8">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h1 className="text-2xl font-bold text-blue-300">Task 4: Network Intrusion Detection System</h1>
                <p className="text-sm text-gray-400 mt-1">This dashboard provides a real-time simulation of a NIDS. It captures and analyzes network traffic (Task 1) to detect threats based on configurable rules, implements response mechanisms (IP blocking), and visualizes security alerts.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Alerts" value={alerts.length} icon={<ShieldIcon />} />
                <StatCard title="High Priority Alerts" value={highPriorityAlerts} icon={<AlertTriangleIcon />} />
                <StatCard title="IPs Blocked" value={blockedIPs.length} icon={<BanIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-300">Alert Severity Distribution</h2>
                    <AlertsChart alerts={alerts} />
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                    <RuleManager rules={rules} setRules={setRules} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700 h-[600px] flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-blue-300">Recent Alerts</h2>
                    <RecentAlerts alerts={alerts} onBlockIp={handleBlockIp} />
                </div>
                 <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700 h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-blue-300">Live Network Traffic</h2>
                        <label className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={isAutoAnalyze} onChange={() => setIsAutoAnalyze(!isAutoAnalyze)} className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500" />
                            <span>Auto-Analyze</span>
                        </label>
                    </div>
                    <LiveTrafficLog traffic={traffic} />
                </div>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                 <LogAnalyzer onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
            </div>
        </div>
    );
};

export default NidsDashboard;