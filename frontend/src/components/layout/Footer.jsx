import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 py-8 px-4 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* App Name */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              <svg
                className="w-4 h-4"
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
            <span className="font-medium text-gray-800">
              เครื่องมือคำนวณสินเชื่อบ้าน
            </span>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-400 text-center tracking-wide">
            © {new Date().getFullYear()} All rights
            reserved.
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
