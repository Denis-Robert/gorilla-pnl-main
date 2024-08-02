import psycopg2
import deal_id as di

conn = psycopg2.connect(database="pnl", user="test", password="test",host="localhost", port="5432") 
cur = conn.cursor()

def write_deal(data):
    software,hardware,license,customization,enhancement,deployment,support,professional_service = [v for _, v in data.get('workNature', {}).items()]
    deal_id=di.deal_creation()
    customer_name=data.get('customer_name', '')
    customer_type=data.get('customer_type', '')
    business_type=data.get('business_type', '')
    guarantee=data.get('guarantee', '')
    opportunity=data.get('opportunity', '')
    bidding=data.get('bidding', '')
    start_date=data.get('start_date', '')
    end_date=data.get('end_date', '')
    total_contract=data.get('total_contract', '')
    region=data.get('region', '')
    domain=data.get('domain', '')
    direct_sale=data.get('direct_sale', '')
    partner=data.get('partner', '')
    third_party=data.get('third_party', '')
    penalty=data.get('penalty', '')
    acc_manager=data.get('acc_manager', '')
    presales_spoc=data.get('presales_spoc', '')
    currency=data.get('currency', '')
    cust_budget=data.get('cust_budget', '')
    travel_expense=data.get('travel_expense', '')
    tool_license=data.get('tool_license', '')
    shift_allowance=data.get('shift_allowance', '')
    weekend_allowance=data.get('weekend_allowance', '')
    on_call_allowance=data.get('on_call_allowance', '')
    one_time_cost=data.get('one_time_cost', '')
    vat=data.get('vat', '')
    misc=data.get('misc', '')

    try:
        cur.execute('''insert into kif (deal_id,customer_name,customer_type,business_type,guarantee,opportunity,software,hardware,license,customization,enhancement,deployment,support,professional_service,bidding,start_date,end_date,total_contract,region,domain,direct_sale,partner,third_party,penalty,acc_manager,presales_spoc,currency,cust_budget,travel_expense,tool_license,shift_allowance,weekend_allowance,on_call_allowance,one_time_cost,vat,misc) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);''',(deal_id,customer_name,customer_type,business_type,guarantee,opportunity,software,hardware,license,customization,enhancement,deployment,support,professional_service,bidding,start_date,end_date,total_contract,region,domain,direct_sale,partner,third_party,penalty,acc_manager,presales_spoc,currency,cust_budget,travel_expense,tool_license,shift_allowance,weekend_allowance,on_call_allowance,one_time_cost,vat,misc))
    finally:
        conn.commit()
        # cur.close()
        # conn.close()
    return deal_id



def del_deal(data):
    deal_id=data.get('deal_id', '')
    try:
        cur.execute('''delete from kif where deal_id=%s;''',[deal_id])
    finally:
        conn.commit()
    return "1"
