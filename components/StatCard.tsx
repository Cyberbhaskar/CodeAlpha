
import React from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-gray-800/50 p-6 rounded-xl flex items-center justify-between shadow-lg border border-gray-700 hover:bg-gray-800 transition-colors duration-300">
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            {icon}
        </div>
    );
};

export default StatCard;
