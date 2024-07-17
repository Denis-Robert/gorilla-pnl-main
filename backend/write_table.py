# import psycopg2
# import deal_id as di

# conn = psycopg2.connect(database="pnl", user="denis", password="123",host="localhost", port="5432") 
# cur = conn.cursor()

# def write_deal(data):
#     software,hardware,license,customization,enhancement,deployment,support,professional_service = [v for _, v in data.get('workNature', {}).items()]
#     deal_id=di.deal_creation()
#     customer_name=data.get('customer_name', '')
#     customer_type=data.get('customer_type', '')
#     business_type=data.get('business_type', '')
#     guarantee=data.get('guarantee', '')
#     opportunity=data.get('opportunity', '')
#     bidding=data.get('bidding', '')
#     start_date=data.get('start_date', '')
#     end_date=data.get('end_date', '')
#     total_contract=data.get('total_contract', '')
#     region=data.get('region', '')
#     domain=data.get('domain', '')
#     direct_sale=data.get('direct_sale', '')
#     partner=data.get('partner', '')
#     third_party=data.get('third_party', '')
#     penalty=data.get('penalty', '')
#     acc_manager=data.get('acc_manager', '')
#     presales_spoc=data.get('presales_spoc', '')
#     currency=data.get('currency', '')
#     cust_budget=data.get('cust_budget', '')
#     travel_expense=data.get('travel_expense', '')
#     tool_license=data.get('tool_license', '')
#     shift_allowance=data.get('shift_allowance', '')
#     weekend_allowance=data.get('weekend_allowance', '')
#     on_call_allowance=data.get('on_call_allowance', '')
#     one_time_cost=data.get('one_time_cost', '')
#     vat=data.get('vat', '')
#     misc=data.get('misc', '')

#     try:
#         cur.execute('''insert into kif (deal_id,customer_name,customer_type,business_type,guarantee,opportunity,software,hardware,license,customization,enhancement,deployment,support,professional_service,bidding,start_date,end_date,total_contract,region,domain,direct_sale,partner,third_party,penalty,acc_manager,presales_spoc,currency,cust_budget,travel_expense,tool_license,shift_allowance,weekend_allowance,on_call_allowance,one_time_cost,vat,misc) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);''',(deal_id,customer_name,customer_type,business_type,guarantee,opportunity,software,hardware,license,customization,enhancement,deployment,support,professional_service,bidding,start_date,end_date,total_contract,region,domain,direct_sale,partner,third_party,penalty,acc_manager,presales_spoc,currency,cust_budget,travel_expense,tool_license,shift_allowance,weekend_allowance,on_call_allowance,one_time_cost,vat,misc))
#     finally:
#         conn.commit()
#         # cur.close()
#         # conn.close()
#     return deal_id



# def del_deal(data):
#     deal_id=data.get('deal_id', '')
#     try:
#         cur.execute('''delete from kif where deal_id=%s;''',[deal_id])
#     finally:
#         conn.commit()
#     return "1"



import psycopg2
import deal_id as di

conn = psycopg2.connect(database="pnl", user="denis", password="123", host="localhost", port="5432")
cur = conn.cursor()

def to_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in ('true', 't', 'yes', 'y', '1')
    return bool(value)

def write_deal(data):
    # Initialize workNature values with defaults
    work_nature = data.get('workNature', {})
    software = to_bool(work_nature.get('Software', False))
    hardware = to_bool(work_nature.get('Hardware', False))
    license = to_bool(work_nature.get('License', False))
    customization = to_bool(work_nature.get('Customization', False))
    enhancement = to_bool(work_nature.get('Enhancement', False))
    deployment = to_bool(work_nature.get('Deployment', False))
    support = to_bool(work_nature.get('Support', False))
    professional_service = to_bool(work_nature.get('Professional Services', False))
    
    deal_id = data.get('deal', {}).get('deal_id')
    if not deal_id:
        deal_id = di.deal_creation()
    
    # Extract other fields from data
    customer_name = data.get('customer_name', '') or None
    customer_type = data.get('customer_type', '') or None
    business_type = data.get('business_type', '') or None
    guarantee = to_bool(data.get('guarantee', False))
    opportunity = data.get('opportunity', '') or None
    bidding = to_bool(data.get('bidding', False))
    start_date = data.get('start_date', '') or None
    end_date = data.get('end_date', '') or None
    total_contract = data.get('total_contract', '') or None
    region = data.get('region', '') or None
    domain = data.get('domain', '') or None
    direct_sale = to_bool(data.get('direct_sale', False))
    partner = data.get('partner', '') or None
    third_party = data.get('third_party', '') or None
    penalty = data.get('penalty', '') or None
    acc_manager = data.get('acc_manager', '') or None
    presales_spoc = data.get('presales_spoc', '') or None
    currency = data.get('currency', '') or None
    cust_budget = data.get('cust_budget', '') or None
    travel_expense = data.get('travel_expense', '') or None
    tool_license = data.get('tool_license', '') or None
    shift_allowance = data.get('shift_allowance', '') or None
    weekend_allowance = data.get('weekend_allowance', '') or None
    on_call_allowance = data.get('on_call_allowance', '') or None
    one_time_cost = data.get('one_time_cost', '') or None
    vat = data.get('vat', '') or None
    misc = data.get('misc', '') or None

    try:
        # Check if the deal already exists
        cur.execute("SELECT * FROM kif WHERE deal_id = %s", (deal_id,))
        existing_deal = cur.fetchone()

        if existing_deal:
            # Update existing deal
            cur.execute('''
                UPDATE kif SET
                customer_name=%s, customer_type=%s, business_type=%s, guarantee=%s, opportunity=%s,
                software=%s, hardware=%s, license=%s, customization=%s, enhancement=%s, deployment=%s,
                support=%s, professional_service=%s, bidding=%s, start_date=%s, end_date=%s,
                total_contract=%s, region=%s, domain=%s, direct_sale=%s, partner=%s, third_party=%s,
                penalty=%s, acc_manager=%s, presales_spoc=%s, currency=%s, cust_budget=%s,
                travel_expense=%s, tool_license=%s, shift_allowance=%s, weekend_allowance=%s,
                on_call_allowance=%s, one_time_cost=%s, vat=%s, misc=%s
                WHERE deal_id=%s
            ''', (customer_name, customer_type, business_type, guarantee, opportunity,
                  software, hardware, license, customization, enhancement, deployment,
                  support, professional_service, bidding, start_date, end_date,
                  total_contract, region, domain, direct_sale, partner, third_party,
                  penalty, acc_manager, presales_spoc, currency, cust_budget,
                  travel_expense, tool_license, shift_allowance, weekend_allowance,
                  on_call_allowance, one_time_cost, vat, misc, deal_id))
        else:
            # Insert new deal
            cur.execute('''
                INSERT INTO kif (deal_id, customer_name, customer_type, business_type, guarantee, opportunity,
                software, hardware, license, customization, enhancement, deployment, support,
                professional_service, bidding, start_date, end_date, total_contract, region, domain,
                direct_sale, partner, third_party, penalty, acc_manager, presales_spoc, currency,
                cust_budget, travel_expense, tool_license, shift_allowance, weekend_allowance,
                on_call_allowance, one_time_cost, vat, misc)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ''', (deal_id, customer_name, customer_type, business_type, guarantee, opportunity,
                  software, hardware, license, customization, enhancement, deployment, support,
                  professional_service, bidding, start_date, end_date, total_contract, region, domain,
                  direct_sale, partner, third_party, penalty, acc_manager, presales_spoc, currency,
                  cust_budget, travel_expense, tool_license, shift_allowance, weekend_allowance,
                  on_call_allowance, one_time_cost, vat, misc))
    except Exception as e:
        conn.rollback()
        print(f"An error occurred: {e}")
        raise
    else:
        conn.commit()
    
    return deal_id



def del_deal(data):
    deal_id = data.get('deal_id', '')
    try:
        cur.execute('''DELETE FROM kif WHERE deal_id=%s;''', [deal_id])
    finally:
        conn.commit()
    return "1"