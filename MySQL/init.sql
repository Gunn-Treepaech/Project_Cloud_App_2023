USE financial_data;

CREATE TABLE IF NOT EXISTS interest_rates (
    bank_name VARCHAR(50),
    years_interest DECIMAL(4, 2),
    MRR DECIMAL(5, 2),
    PRIMARY KEY (bank_name)
);

INSERT INTO interest_rates (bank_name, years_interest, MRR) VALUES
    ('SCB', 2.80, 5.98),
    ('UOB', 2.95, 8.8);
