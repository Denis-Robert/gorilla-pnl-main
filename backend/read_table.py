import psycopg2
from json import dumps
from datetime import date

conn = psycopg2.connect(database="pnl", user="denis", password="123",host="localhost", port="5432") 
cur = conn.cursor()

def read_kif(data):
    try:
        # deal_id=data.get('deal_id', '')
        cur.execute('select * from kif where deal_id=%s;',[data])
        r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]# type: ignore
        def json_serial(obj): # JSON serializer for objects not serializable by default json code
            if isinstance(obj, (date)):
                return obj.isoformat()
            raise TypeError ("Type %s not serializable" % type(obj))
    finally:
        close()
    return dumps(r,default=json_serial)

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