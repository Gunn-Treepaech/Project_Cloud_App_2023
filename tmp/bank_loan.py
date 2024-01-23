def days_in_month(month, year):
    if month == 2 and ((year % 4 == 0) or ((year % 100 == 0) and (year % 400 == 0))):
        day = 29
    elif month == 2:
        day = 28
    elif month in [1, 3, 5, 7, 8, 10, 12]:
        day = 31
    else:
        day = 30
    return day

def calculate_loan_schedule(**config):
    result_list = []
    overpayment = 0
    
   #------------------------------------------------------------
    start_month = config['start_month']
    current_year = config['start_year']
    remaining_principal = config['initial_loan']
    fixed_interest = config['fixed_interest']
    fixed_year = config['fixed_year']
    MRR = config['MRR']
    monthly_payment = config['monthly_payment']
    chang_interest = config['chang_interest']
   #------------------------------------------------------------
    

    for month in range(start_month, start_month + 36):
        
        until_the_day = days_in_month(start_month, current_year)

        display_month = month % 12
        if month % 12 == 0:
            display_month = 12
            
        if fixed_year is not None:
            if fixed_year == 1:
                if month == start_month + 12:
                    fixed_interest = MRR - chang_interest[0]
                if month == start_month + 24:
                    fixed_interest = MRR - chang_interest[1]
            if fixed_year == 2:
                if month == start_month + 24:
                    fixed_interest = MRR - chang_interest[0]
            
        print(f'Month ({display_month}, {current_year}): interest == {fixed_interest}')
            
        if remaining_principal <= 0:
            print(f"Loan fully repaid. Exiting calculation.")
            break

        interest = (remaining_principal * fixed_interest) / 36500
        interest_money = until_the_day * interest
        balance = monthly_payment - interest_money
        remaining_principal = remaining_principal - balance
        initial_loan = remaining_principal

        if initial_loan <= 0:
            overpayment = abs(remaining_principal)
            remaining_principal = 0
            result = f"Month ({display_month}, {current_year}): Remaining Principal = {remaining_principal:.2f}, Interest Paid = {interest_money:.2f}, Balance = {balance:.2f}, Overpayment = {overpayment:.2f}"
            result_list.append(result)
            #print(result)
            break

        result = f"Month ({display_month}, {current_year}): Remaining Principal = {remaining_principal:.2f}, Interest Paid = {interest_money:.2f}, Balance = {balance:.2f}, Overpayment = {overpayment:.2f}"
        result_list.append(result)
        #print(result)

        if month % 12 == 0:
            current_year += 1
            
    return result_list
# -----------------------------------------------------------------------------------------------
config = {
    'start_month': 11, 
    'start_year': 2024, 
    'initial_loan': 100000000, 
    'fixed_interest': 2.95, 
    'fixed_year': 1, 
    'MRR': 8.8, 
    'monthly_payment': 15000,
    'chang_interest': (2.95, 1.95)
}
# ------------------------------------------------------------------------------------------------
x = calculate_loan_schedule(**config)
print(x)
