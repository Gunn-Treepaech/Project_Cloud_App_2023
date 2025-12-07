import React from 'react';
import { formatCurrency } from '../../utils';

const SummaryCard = ({ title, amount, unit, colorClass, icon, bankName }) => (
    <div className="card shadow-md border border-base-200 bg-white">
        <div className="card-body p-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
                <div className={`p-1 rounded-full ${colorClass}`}>{icon}</div>
            </div>
            {bankName && (
                <h4 className="text-xs font-medium text-gray-400 mt-1">{bankName}</h4>
            )}
            <p className="text-2xl font-bold mt-1 text-gray-800">
                {formatCurrency(amount)}
                <span className="text-base font-normal ml-1 text-gray-500">{unit}</span>
            </p>
        </div>
    </div>
);

export default SummaryCard;
