from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = 'gorilla-pnl'
COLLECTION_NAME = 'quote-listing'

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

db=client['gorilla-pnl']
collection=db['quote-listing']

def mongo_write(data):
    deal_id=data.get('deal_id')
    if not deal_id:
        raise ValueError("Deal_id required")
    result=collection.update_one({'deal_id':deal_id}, {'$set': data}, upsert=True)
    return result


def mongo_del(data):
    deal=data.get('deal_id', '')
    collection.delete_one({'deal_id':deal})
    return 1

def mongo_find(data):
    #deal=data.get('deal_id', '')
    return collection.find_one({'deal_id':data},{'_id':0})


def mongo_find_all():
    return list(collection.find({}))
