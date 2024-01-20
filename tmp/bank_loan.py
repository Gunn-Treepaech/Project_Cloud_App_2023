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

def calculate_loan_schedule(initial_loan, years_interest, total_payment, MRR, start_year, start_month):
    result_list = []
    overpayment = 0
    remaining_principal = initial_loan
    current_year = start_year

    for month in range(start_month, start_month + 36):
        until_the_day = days_in_month(start_month, current_year)

        display_month = month % 12
        if month % 12 == 0:
            display_month = 12
        if month == start_month + 23:
            years_interest = MRR - years_interest
        if remaining_principal <= 0:
            print(f"Loan fully repaid. Exiting calculation.")
            break

        interest = (remaining_principal * years_interest) / 36500
        interest_money = until_the_day * interest
        balance = total_payment - interest_money
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
# ให้ผู้ใช้กรอก
initial_loan = 100000 # Replace with your initial loan amount
years_interest = 2.95
total_payment = 15000  # Replace with your total monthly payment
MRR = 8.8
start_month = 11
start_year = 2024
# ------------------------------------------------------------------------------------------------
x = calculate_loan_schedule(initial_loan, years_interest, total_payment, MRR, start_year, start_month)
print(x)
