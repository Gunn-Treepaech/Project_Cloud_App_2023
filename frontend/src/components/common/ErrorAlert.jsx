import React from 'react';

const ErrorAlert = ({ error, onRetry, showRetry = false }) => {
    if (!error) return null;

    // Determine error type and styling
    const getErrorType = (errorMessage) => {
        const lowerError = errorMessage.toLowerCase();

        if (lowerError.includes('เซิร์ฟเวอร์') || lowerError.includes('server')) {
            return {
                type: 'server',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                ),
                className: 'alert-warning'
            };
        }

        if (lowerError.includes('เชื่อมต่อ') || lowerError.includes('connection') || lowerError.includes('network')) {
            return {
                type: 'network',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                className: 'alert-error'
            };
        }

        if (lowerError.includes('คำนวณ') || lowerError.includes('calculate')) {
            return {
                type: 'calculation',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                ),
                className: 'alert-info'
            };
        }

        return {
            type: 'general',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-4 4l2-2m0 0l2 2m-2-2h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            className: 'alert-error'
        };
    };

    const errorType = getErrorType(error);

    return (
        <div className="max-w-4xl mx-auto mb-6">
            <div role="alert" className={`alert ${errorType.className} shadow-lg`}>
                {errorType.icon}
                <div className="flex-1">
                    <h3 className="font-bold">เกิดข้อผิดพลาด</h3>
                    <div className="text-sm">
                        {error}
                        {errorType.type === 'network' && (
                            <div className="mt-2 text-xs">
                                <strong>คำแนะนำ:</strong> กรุณาตรวจสอบว่าเซิร์ฟเวอร์ทำงานอยู่และอินเทอร์เน็ตของคุณเชื่อมต่ออยู่
                            </div>
                        )}
                        {errorType.type === 'server' && (
                            <div className="mt-2 text-xs">
                                <strong>คำแนะนำ:</strong> ลองรีเฟรชหน้าเว็บหรือลองใหม่ภายหลังสักครู่
                            </div>
                        )}
                    </div>
                </div>
                {showRetry && onRetry && (
                    <button
                        onClick={onRetry}
                        className="btn btn-sm btn-outline btn-error"
                    >
                        ลองใหม่
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorAlert;
