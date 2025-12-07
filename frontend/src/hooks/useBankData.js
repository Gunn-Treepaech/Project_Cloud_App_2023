import { useState, useCallback } from 'react';
import { API_CONFIG } from '../constants';

export const useBankData = () => {
    const [bankInfo, setBankInfo] = useState({ update_MRR: '' });
    const [isLoading, setIsLoading] = useState(false);

    const fetchBankData = useCallback(async (bankName) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BANK_INFO}?bank=${encodeURIComponent(bankName)}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching bank data:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        bankInfo,
        setBankInfo,
        fetchBankData,
        isLoading
    };
};