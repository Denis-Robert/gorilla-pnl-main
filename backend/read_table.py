import psycopg2
from json import dumps
from datetime import date
from decimal import Decimal
from json import dumps
from datetime import date

conn = psycopg2.connect(database="pnl", user="test", password="test",host="localhost", port="5432") 
cur = conn.cursor()

def json_serial(obj):
    if isinstance(obj, (date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

def read_kif(data):
    try:
        cur.execute('select * from kif where deal_id=%s;', [data])
        r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        return dumps(r, default=json_serial)
    finally:
        close()

def read_pricelist():
    try:
        cur.execute('''select * from pricelist where status='Active';''')
        rows = cur.fetchall()
        result = []
        for row in rows:
            d = {}
            for i, col in enumerate(cur.description): #type: ignore
                d[col[0]] = row[i]
            result.append(d)
    finally:
        close()
    return result

def read_rls():
    try:
        cur.execute('''select * from rate_card;''')
        rows = cur.fetchall()
        result = []
        for row in rows:
            d = {}
            for i, col in enumerate(cur.description): #type: ignore
                d[col[0]] = row[i]
            result.append(d)
    finally:
        close()
    return result

def homepage_read():
    try:
        cur.execute('''select deal_id,customer_name,customer_type,business_type,region,domain from kif;''')
        r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]# type: ignore
    finally:
        close()
    return dumps(r)

def close():
    conn.commit()
    # cur.close() 
    # conn.close()
