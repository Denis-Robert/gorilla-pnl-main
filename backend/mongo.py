from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = 'gorilla-pnl'
COLLECTION_NAME = 'quote-listing'

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

def ensure_db_and_collection():
    """Ensure the database and collection exist."""
    db_list = client.list_database_names()
    if DB_NAME not in db_list:
        print(f"Creating database: {DB_NAME}")
        db.create_collection("temp")
        db.drop_collection("temp")
    
    collection_list = db.list_collection_names()
    if COLLECTION_NAME not in collection_list:
        print(f"Creating collection: {COLLECTION_NAME}")
        db.create_collection(COLLECTION_NAME)


def mongo_write(data):
    deal_id = data.get('deal_id')
    if not deal_id:
        raise ValueError("deal_id is required to upsert the document")
    
    result = collection.update_one({'deal_id': deal_id}, {'$set': data}, upsert=True)
    return result

def mongo_del(data):
    """Delete a document based on deal_id."""
    deal = data.get('deal_id', '')
    collection.delete_one({'deal_id': deal})
    return 1

def mongo_find(data):
    """Find a document based on deal_id."""
    return collection.find_one({'deal_id': data}, {'_id': 0})

def mongo_find_all():
    """Retrieve all documents from the collection."""
    return list(collection.find({}))


<<<<<<< Updated upstream
ensure_db_and_collection()

=======
ensure_db_and_collection()
>>>>>>> Stashed changes
