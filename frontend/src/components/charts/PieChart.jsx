import React from 'react';

const PieChart = ({ principalPercent, interestPercent }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const principalDashArray = (principalPercent / 100) * circumference;
    const interestDashArray = (interestPercent / 100) * circumference;

    return (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="20"
                    strokeDasharray={`${interestDashArray} ${circumference}`}
                    strokeDashoffset={0}
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="20"
                    strokeDasharray={`${principalDashArray} ${circumference}`}
                    strokeDashoffset={-interestDashArray}
                />
            </svg>
            <div className="absolute text-center text-sm font-bold text-gray-700">
            </div>
        </div>
    );
};

export default PieChart;
