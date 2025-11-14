import React from 'react';

const Header = () => (
    <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex-1">
                <span className="text-xl font-bold text-blue-600">LoanCalc</span>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 text-sm font-medium">
                    <li><a>คู่มือ</a></li>
                    <li><a>เกี่ยวกับเรา</a></li>
                </ul>
            </div>
        </div>
    </header>
);

export default Header;
