import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 text-gray-600 py-8 px-4 border-t border-gray-200">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* App Name */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            M
                        </div>
                        <span className="font-medium text-gray-800">
                            Mortgage Calculator Pro
                        </span>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-gray-500">
                        © 2024 All rights reserved.
                    </div>

                    {/* Simple Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <a href="#" className="hover:text-gray-800 transition-colors">
                            เงื่อนไข
                        </a>
                        <a href="#" className="hover:text-gray-800 transition-colors">
                            ความเป็นส่วนตัว
                        </a>
                        <a href="#" className="hover:text-gray-800 transition-colors">
                            ติดต่อ
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;