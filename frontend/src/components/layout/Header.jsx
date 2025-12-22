import React, { useState } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand Section */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                {/* Logo Icon */}
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M12 14l4-4m0 0l4-4M4 20l3.536-3.536M20.485 7.515L17 11l-3.536-3.536M16 11a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                </div>
                                {/* Brand Name */}
                                <div>
                                    <h1 className="text-xl font-bold text-white">เครื่องมือคำนวณสินเชื่อบ้าน</h1>
                                    <p className="text-xs text-blue-100">เครื่องมือคำนวณสินเชื่อ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a
                                href="#calculator"
                                className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out"
                            >
                                คำนวณเงินผ่อน
                            </a>
                            <a
                                href="#guide"
                                className="text-blue-100 hover:text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out"
                            >
                                คู่มือการใช้งาน
                            </a>
                            <a
                                href="#about"
                                className="text-blue-100 hover:text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out"
                            >
                                เกี่ยวกับเรา
                            </a>
                            <a
                                href="#contact"
                                className="text-blue-100 hover:text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out"
                            >
                                ติดต่อ
                            </a>
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <button className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out backdrop-blur-sm">
                                <span className="flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    ข้อมูลเพิ่มเติม
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition-all duration-200"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-blue-700 bg-opacity-95 backdrop-blur-sm">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a
                                href="#calculator"
                                onClick={closeMenu}
                                className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                คำนวณเงินผ่อน
                            </a>
                            <a
                                href="#guide"
                                onClick={closeMenu}
                                className="text-blue-100 hover:text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                คู่มือการใช้งาน
                            </a>
                            <a
                                href="#about"
                                onClick={closeMenu}
                                className="text-blue-100 hover:text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                เกี่ยวกับเรา
                            </a>
                            <a
                                href="#contact"
                                onClick={closeMenu}
                                className="text-blue-100 hover:text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                ติดต่อ
                            </a>
                        </div>
                        <div className="pt-4 pb-3 border-t border-blue-600">
                            <div className="px-2">
                                <button className="w-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 px-4 py-2 rounded-lg text-base font-medium backdrop-blur-sm">
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        ข้อมูลเพิ่มเติม
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
