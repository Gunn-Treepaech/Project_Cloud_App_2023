def set_up_before_calculating(**config):
    fixed_year = config['fixed_year']
    match fixed_year:
        case 1:
            print("fixed interest 1 year")

        case 2:
            print("fixed interest 2 year")

        case 3:
            print("fixed interest 3 year")
    return 


# print(config['start_month'])


config = {
    'start_month': 11, 
    'start_year': 2024, 
    'initial_loan': 10000, 
    'fixed_interest': 2.95, 
    'fixed_year': 2, 
    'MRR': 8.8, 
    'monthly_payment': 15000
}

set_up_before_calculating(**config)