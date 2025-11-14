export const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
    return amount.toLocaleString('th-TH', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
};

export const monthNames = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 
    'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 
    'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];
