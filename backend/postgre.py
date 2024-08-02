import psycopg2
from datetime import date
conn = psycopg2.connect(database="pnl", user="denis", password="123",host="localhost", port="5432") 
cur = conn.cursor()

#KIF Table Creation
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

#Rate Card Table Creation
cur.execute('''create table rate_card(
            s_no serial,
            level varchar(10) not null check(level in ('L0','L1','L2','L3','L4','L5')),
            region varchar(15) not null check (region in ('india','taiwan','egypt','us','singapore','thailand')),
            cost int not null
        );''')

#Pricelist Table Creation
cur.execute('''create table pricelist(
            domain varchar(20) not null,
            part_no varchar(50) not null,
            name varchar(100) not null,
            part_type varchar(50) not null,
            price int not null check (price>0),
            status varchar(10) not null check (status in ('Active','Inactive'))
);''')

conn.commit() 
cur.close() 
conn.close()
