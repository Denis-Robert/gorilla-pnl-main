from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi # To access certificate files on system

uri = "mongodb+srv://denisr:WtthcSalp1`@cluster0.omtnf6w.mongodb.net/?appName=cluster0"
client = MongoClient(uri, server_api=ServerApi('1'),tlsCAFile=certifi.where())

db=client['gorilla-pnl']
collection=db['quote-listing']

def mongo_write(data):  
    collection.insert_one(data)
    return 1


def mongo_del(data):
    deal=data.get('deal_id', '')
    collection.delete_one({'deal_id':deal})
    return 1

def mongo_find(data):
    #deal=data.get('deal_id', '')
    return collection.find_one({'deal_id':data},{'_id':0})


def mongo_find_all():
    data = list(collection.find({}))
    return data