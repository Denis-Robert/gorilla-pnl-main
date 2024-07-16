import psycopg2
from datetime import date
conn = psycopg2.connect(database="pnl", user="denis", password="123",host="localhost", port="5432") 
cur = conn.cursor()

cur.execute('''create table kif(
            deal_id bigint primary key,
            customer_name varchar(75) not null,
            customer_type varchar(15) not null check (customer_type in ('New','Existing')),
            business_type varchar(15) not null check (business_type in ('Government','Private')),
            guarantee boolean not null,
            opportunity varchar(15) not null check (opportunity in ('New','Renewal')),
            software boolean not null,
            hardware boolean not null,
            license boolean not null,
            customization boolean not null,
            enhancement boolean not null,
            deployment boolean not null,
            support boolean not null,
            professional_service boolean not null,
            bidding boolean not null,
            start_date date not null,
            end_date date not null,
            total_contract varchar(10) not null,
            region varchar(20) not null check (region in ('Taiwan','UK','Egypt','Thailand','Columbia','India','US','Singapore')),
            domain varchar(10) not null check (domain in ('IoT','Video','Security','Telecom')),
            direct_sale boolean not null,
            partner boolean not null,
            third_party boolean not null,
            penalty boolean not null,
            sla boolean not null,
            acc_manager varchar(50) not null,
            presales_spoc varchar(50) not null,
            currency varchar(5) not null check (currency in ('EGP','THB','USD','NTD')),
            cust_budget int,
            travel_expense int,
            tool_license boolean not null,
            shift_allowance boolean not null,
            weekend_allowance boolean not null,
            on_call_allowance boolean not null,
            one_time_cost boolean not null,
            vat decimal(5,2) not null,
            misc text
);''')


cur.execute('''insert into kif (deal_id,customer_name,customer_type,business_type,guarantee,opportunity,software,hardware,license,customization,enhancement,deployment,support,professional_service,bidding,start_date,end_date,total_contract,region,domain,direct_sale,partner,third_party,penalty,sla,acc_manager,presales_spoc,currency,cust_budget,travel_expense,tool_license,shift_allowance,weekend_allowance,on_call_allowance,one_time_cost,vat,misc) values (2024051701,'xyz','New','Government',True,'New','1','no','t','yes','on',False,False,True,False,'2024-06-01','2025-06-01','1 year','Taiwan','Security','No','No','No','Yes','Yes','Sujan','denis','USD',1000000,500,True,False,True,True,True,5.2,'test data');''')


cur.execute('''create table rate_card(
            s_no serial,
            level varchar(10) not null check(level in ('L0','L1','L2','L3','L4','L5')),
            region varchar(15) not null check (region in ('india','taiwan','egypt','us','singapore','thailand')),
            cost int not null
        );''')

cur.execute('''insert into rate_card (level,region,cost) values ('L0','india',4000);''')
cur.execute('''insert into rate_card (level,region,cost) values ('L0','egypt',4500);''')

cur.execute('''create table pricelist(
            domain varchar(20) not null,
            part_no varchar(50) not null,
            name varchar(100) not null,
            part_type varchar(50) not null,
            price int not null check (price>0),
            status varchar(10) not null check (status in ('Active','Inactive'))
);''')

cur.execute('''insert into pricelist (domain,part_no,name,part_type,price,status) values ('video','1234','test1,'appliance',10000,'Active');''')
cur.execute('''insert into pricelist (domain,part_no,name,part_type,price,status) values ('iot','1235','test2,'sw',15000,'Active');''')
cur.execute('''insert into pricelist (domain,part_no,name,part_type,price,status) values ('video','1236','test3,'appliance',20000,'Active');''')
cur.execute('''insert into pricelist (domain,part_no,name,part_type,price,status) values ('iot','1237','test4,'sw',25000,'Active');''')

conn.commit() 
cur.close() 
conn.close()