# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import read_table as rt
# import write_table as wd
# from mongo import mongo_write, mongo_del, mongo_find
# import json
# import ast

# app = Flask(__name__)
# CORS(app)

# region=""

# # Home Page DB Read
# @app.route('/api/deals', methods=['POST','GET'])
# def homepage_db_read():
#     data=rt.homepage_read()
#     return data

# # Create KIF
# @app.route('/api/submit', methods=['POST'])
# def submit():
#     data = request.get_json()
#     deal_id=wd.write_deal(data)
#     print(deal_id)
#     return jsonify(deal_id), 201

# @app.route('/edit-kif', methods=['POST'])
# def edit_kif():
#     data=request.get_json()
#     global region
#     kif=rt.read_kif(data)
#     return kif

# # Create Quote
# @app.route('/api/create-quote', methods=['POST','GET'])
# def create():
#     data=rt.read_pricelist() # Reads Pricelist from db and sends to frontend as json
#     # print(data)
#     return data


# @app.route('/api/read-rls', methods=['POST','GET'])
# def read_rls():
#     data=rt.read_rls()
#     # print(data)
#     return data


# @app.route('/api/writemongo', methods=['POST'])
# def write_mongo():
#     data = request.json
#     deal=data.get('deal')
#     miscdata=data.get('miscData')
#     shoppingcart=data.get('shoppingCart')
#     rlscart=data.get('rlsCart')
#     mongo_data=deal|{'shopping_cart':shoppingcart,'rls_cart':rlscart,'misc_data':miscdata}
    
#     mongo_write(mongo_data)

#     return jsonify({'message': 'Data received successfully'})


# @app.route('/api/delete',methods=['POST','GET'])
# def del_deal():
#     data=request.get_json()
#     wd.del_deal(data)
#     mongo_del(data)
#     return "1"


# @app.route('/api/edit/<deal_id>',methods=['POST','GET'])
# def test(deal_id):
#     # deal_id=request.json.get('deal_id')
#     # deal_id=request.args.get('deal_id')
#     # deal_id = 20240605765
#     deal_id=int(deal_id)
#     data1=mongo_find(deal_id)
#     data2=rt.read_kif(deal_id)
#     data2=json.loads(data2[1:-1]) 
#     return {'formData':data2}|data1

# if __name__ == '__main__':
#     app.run(debug=True,port=5000)




from flask import Flask, request, jsonify
from flask_cors import CORS
import read_table as rt
import write_table as wd
from mongo import mongo_write, mongo_del, mongo_find, mongo_find_all  # Import the new function
import json
import pdfkit
path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

app = Flask(__name__)
CORS(app)

region=""

# Home Page DB Read
@app.route('/api/deals', methods=['POST', 'GET'])
def homepage_db_read():
    data = rt.homepage_read()
    return data

# Create KIF
@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.get_json()
    deal_id = wd.write_deal(data)
    print(deal_id)
    return jsonify(deal_id), 201

@app.route('/edit-kif', methods=['POST'])
def edit_kif():
    data = request.get_json()
    global region
    kif = rt.read_kif(data)
    return kif

# Create Quote
@app.route('/api/create-quote', methods=['POST', 'GET'])
def create():
    data = rt.read_pricelist()  # Reads Pricelist from db and sends to frontend as json
    return data

@app.route('/api/read-rls', methods=['POST', 'GET'])
def read_rls():
    data = rt.read_rls()
    return data

@app.route('/api/writemongo', methods=['POST'])
def write_mongo():
    data = request.json
    deal = data.get('deal') #type:ignore
    miscdata = data.get('miscData')#type:ignore
    shoppingcart = data.get('shoppingCart') #type:ignore
    rlscart = data.get('rlsCart') #type:ignore
    mongo_data = deal  | {'shopping_cart': shoppingcart, 'rls_cart': rlscart, 'misc_data': miscdata}
    
    mongo_write(mongo_data)
    return jsonify({'message': 'Data received successfully'})

@app.route('/api/delete', methods=['POST', 'GET'])
def del_deal():
    data = request.get_json()
    wd.del_deal(data)
    mongo_del(data)
    return "1"

@app.route('/api/edit/<deal_id>', methods=['POST', 'GET'])
def test(deal_id):
    print("ingaaaaaaaaa")
    deal_id = int(deal_id)
    data1 = mongo_find(deal_id)
    data2 = rt.read_kif(deal_id)
    data2 = json.loads(data2[1:-1])
    workNature={'Software':data2['software'],'Hardware':data2['hardware'],'License':data2['license'],'Customization':data2['customization'],'Enhancement':data2['enhancement'],'Deployment':data2['deployment'],'Support':data2['support'],'Professional Services':data2['professional_service']}

    del [data2['software'],data2['hardware'],data2['license'],data2['customization'],data2['enhancement'],data2['deployment'],data2['support'],data2['professional_service']] #type:ignore
    print(workNature)
    print("\n\n",data2|{'workNature':workNature})
    #return "1" 
    return {'formData': data2|{'workNature':workNature}} | data1 #type:ignore

@app.route('/api/print-mongo-data', methods=['GET'])
def print_mongo_data():
    data = mongo_find_all()
    print(data)
    #return jsonify(data)
    return jsonify({'message': 'Data printed in the terminal'})

@app.route('/api/pdf',methods=['POST'])
def pdf():
    data = request.json
    comp_str=''
    count=1
    for i in data["shopping_cart"]:
        comp_str+='<tr><td>'+str(count)+'</td><td>'+i+'</td><td>'+data["shopping_cart"][i]['name']+'</td><td>'+str(data["shopping_cart"][i]['unit_price'])+'</td><td>'+str(data["shopping_cart"][i]['qty'])+'</td><td>'+str(data["shopping_cart"][i]['total_price'])+'</td></tr>'
        count+=1

    misc_str=''
    count=1
    for i in data["misc_data"]:
        if(data["misc_data"][i]):
            misc_str+='<tr><td>'+str(count)+'</td><td>'+ " ".join(i.split('_')).title()+'</td><td>'+str(data["misc_data"][i])+'</td></tr>'

    rls_str=''
    count=1
    for i in data["rls_cart"]:
        total=0
        for j in i['manDayQuantities']:
            total+=j['manDays']*j['quantities']
        rls_str+='<tr><td>'+str(count)+'</td><td>'+i['key']+'</td><td>'+str(total)+'</td></tr>'

    html='''
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quote</title>
  </head>

  <body>
   <style>
    p{
      justify-content: end;
      text-align: right;  
    }
   </style>
    <div style="margin: 20px 20px 20px 20px">
      <div style="text-align: center">
        <para style="text-align: center">
          Gorilla Technology Inc.
          <br />
          Quotation
        </para>
      </div>
      <div style="align-content: center">
        <img
          src="D:\\Denis\\Code\\Gorilla PNL\\Logo.png"
          alt="logo"
          align="right"
          style="width: 150px; height: 55px"
        />
        <br><br>
      </div>

      <div>
        <div style="display:flex; flex-direction: row; align-items: center;">
          <h3 style="width:100%">Quotation No.: '''+str(data["deal_id"])+'''</h3>
          <p style="text-align: right; width:100%;">7F, No.302, Ruey Kuang Rd., Neihu, Taipei, Taiwan</p>
        </div>
        <div>
          <h3>Project Name:</h3>
          <p>Prepared by: Gorilla Taiwan Quote House, Elsie Chen</p>
        </div>
        <div>
          <h3>Customer Name: '''+data['formData']['customer_name']+'''</h3>

          <p>TEL: 886-2-2627-7996</p>
        </div>

        Contact:
      </div>
      <table class="comp">
        <tr>
          <th>Item No.</th>
          <th>Item Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Cost</th>
        </tr>'''+comp_str+'''
      </table>
      <table class="misc">
        <tr>
          <th>Item No.</th>
          <th>Name</th>
          <th>Cost</th>
        </tr>'''+misc_str+'''
      </table>
      <table class="rls">
        <tr>
          <th>Item No.</th>
          <th>Resource</th>
          <th>Total Cost</th>
        </tr>'''+rls_str+'''
    </div>
  </body>
</html>

'''

    pdfkit.from_string(html,'out.pdf',configuration=config,verbose=True)
    return "1"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
