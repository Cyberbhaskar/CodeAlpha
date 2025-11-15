
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, Severity } from '../types';

interface AlertsChartProps {
    alerts: Alert[];
}

const AlertsChart: React.FC<AlertsChartProps> = ({ alerts }) => {
    const data = useMemo(() => {
        const counts = {
            [Severity.Low]: 0,
            [Severity.Medium]: 0,
            [Severity.High]: 0,
            [Severity.Critical]: 0,
        };
        alerts.forEach(alert => {
            if (counts[alert.severity] !== undefined) {
                counts[alert.severity]++;
            }
        });
        return Object.entries(counts).map(([name, value]) => ({ name, count: value }));
    }, [alerts]);

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="name" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1A202C', 
                            border: '1px solid #4A5568',
                            color: '#E2E8F0'
                        }} 
                        cursor={{fill: 'rgba(74, 85, 104, 0.3)'}}
                    />
                    <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                    <Bar dataKey="count" name="Alerts" fill="#4299E1" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AlertsChart;
