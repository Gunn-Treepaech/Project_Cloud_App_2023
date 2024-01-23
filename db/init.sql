USE financial_data;

CREATE TABLE IF NOT EXISTS interest_rates (
    bank_name VARCHAR(50),
    years_interest DECIMAL(4, 2),
    MRR DECIMAL(5, 2),
    PRIMARY KEY (bank_name)
);

INSERT INTO interest_rates (bank_name, years_interest, MRR) VALUES
    ('SCB', 0, 7.300),
    ('UOB', 0, 8.800),
    ('KTB', 0, 7.570),
    ('Kbank', 0, 7.300);
