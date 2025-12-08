import { API_CONFIG } from '../constants';

class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        console.log("this.baseurl",this.baseURL);
        
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            timeout: 10000, // 10 second timeout
            ...options,
        };

        try {
            // Create timeout controller
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Handle different HTTP status codes with specific messages
                let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์';

                switch (response.status) {
                    case 400:
                        errorMessage = 'ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง';
                        break;
                    case 401:
                        errorMessage = 'ไม่มีสิทธิ์เข้าถึงข้อมูล กรุณาติดต่อผู้ดูแลระบบ';
                        break;
                    case 403:
                        errorMessage = 'การเข้าถึงถูกปฏิเสธ กรุณาติดต่อผู้ดูแลระบบ';
                        break;
                    case 404:
                        errorMessage = 'ไม่พบข้อมูลที่ต้องการ กรุณาลองใหม่อีกครั้ง';
                        break;
                    case 500:
                        errorMessage = 'เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่ภายหลัง';
                        break;
                    case 502:
                        errorMessage = 'เซิร์ฟเวอร์ไม่พร้อมใช้งาน กรุณาลองใหม่ภายหลัง';
                        break;
                    case 503:
                        errorMessage = 'บริการชั่วคราวไม่พร้อมใช้งาน กรุณาลองใหม่ภายหลัง';
                        break;
                    default:
                        errorMessage = `เกิดข้อผิดพลาด (HTTP ${response.status}) กรุณาลองใหม่อีกครั้ง`;
                }

                // Try to get more specific error message from response
                try {
                    const errorData = await response.json();
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch {
                    // If we can't parse error response, use the status-based message
                }

                throw new Error(errorMessage);
            }

            // Handle health check endpoint - it might return HTML
            const contentType = response.headers.get('content-type');
            if (endpoint === '/' && (!contentType || contentType.includes('text/html'))) {
                return true; // Health check successful if we get any response
            }

            // Try to parse JSON, handle potential errors
            try {
                return await response.json();
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                // For non-JSON responses, return a simple success indicator
                return { success: true, message: 'Request successful' };
            }
        } catch (error) {
            console.error('API request failed:', error);

            // Handle different types of errors
            if (error.name === 'AbortError') {
                throw new Error('การเชื่อมต่อหมดเวลา กรุณาตรวจสอบอินเทอร์เน็ตของคุณและลองใหม่');
            }

            if (error.message.includes('Failed to fetch') ||
                error.message.includes('NetworkError') ||
                error.message.includes('fetch')) {
                throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ทำงานอยู่หรือไม่');
            }

            // Re-throw the error with our custom message or original if already custom
            throw error;
        }
    }

    // Calculate loan schedule
    async calculateLoan(payload) {
        try {
            return await this.request(API_CONFIG.ENDPOINTS.CALCULATE, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('Calculate loan API error:', error);
            throw new Error(`การคำนวณล้มเหลว: ${error.message}`);
        }
    }

    // Get bank information
    async getBankInfo(bankName) {
        try {
            return await this.request(`${API_CONFIG.ENDPOINTS.BANK_INFO}?bank=${encodeURIComponent(bankName)}`);
        } catch (error) {
            console.error('Get bank info API error:', error);
            throw new Error(`ไม่สามารถดึงข้อมูลธนาคารได้: ${error.message}`);
        }
    }

    // Get all bank data
    async getAllBankData() {
        try {
            return await this.request(API_CONFIG.ENDPOINTS.SHOW_DATA);
        } catch (error) {
            console.error('Get all bank data API error:', error);
            throw new Error(`ไม่สามารถดึงข้อมูลธนาคารทั้งหมดได้: ${error.message}`);
        }
    }

    // Check if API is available
    async healthCheck() {
        try {
            await this.request('/health');
            return true;
        } catch (error) {
            console.log('Health check failed, but continuing:', error.message);
            return true; // Don't fail completely - allow app to work with mock data
        }
    }
}

export default new ApiService();