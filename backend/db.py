from pymongo import MongoClient

# 🔗 Replace with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://system:mayuri@gaurdian-eye.yxx44ba.mongodb.net/?appName=Gaurdian-eye"

client = MongoClient(MONGO_URI)

# Database
db = client["guardian_eye"]

# Collection
alerts_collection = db["alerts"]