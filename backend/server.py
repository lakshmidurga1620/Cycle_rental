from flask import Flask, jsonify, request, abort
from flask_cors import CORS  # type: ignore
from pymongo import MongoClient  # type: ignore
from bson import ObjectId  # type: ignore
from werkzeug.security import generate_password_hash, check_password_hash
import jwt # type: ignore
import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['cycle_rental_db']
cycles_collection = db['cycles']
users_collection = db['users']

# Secret key for JWT
app.config['SECRET_KEY'] = 'your_secret_key'

# User signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    if users_collection.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 400
    
    hashed_password = generate_password_hash(password)
    user = {
        'username': username,
        'password': hashed_password
    }
    users_collection.insert_one(user)
    
    return jsonify({'message': 'User created successfully'}), 201

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = users_collection.find_one({'username': username})
    
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    token = jwt.encode({
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'])
    
    return jsonify({'token': token}), 200

# Middleware to check for valid token
def token_required(f):
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({'username': data['username']})
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Update the rent_cycle route to require authentication
# ... previous code ...

@app.route('/cycles/rent/<cycleId>', methods=['PATCH'])
@token_required
def rent_cycle(current_user, cycleId):
    # Find the cycle by ID
    cycle = cycles_collection.find_one({'_id': ObjectId(cycleId)})
    if not cycle:
        abort(404, description=f"Cycle with ID {cycleId} not found")
    
    # Check if cycle is available
    if cycle.get('count', 0) <= 0:
        return jsonify({'error': 'Cycle not available'}), 400
    
    # Decrement count by 1
    new_count = cycle.get('count', 0) - 1
    result = cycles_collection.update_one({'_id': ObjectId(cycleId)}, {'$set': {'count': new_count}})
    
    if result.modified_count == 1:
        return jsonify({'message': f"Cycle {cycleId} rented successfully", 'new_count': new_count}), 200
    else:
        return jsonify({'error': 'Failed to rent cycle'}), 500

# Get all cycles
@app.route('/cycles', methods=['GET'])
def get_cycles():
    cycles = list(cycles_collection.find())
    for cycle in cycles:
        cycle['_id'] = str(cycle['_id'])  # Convert ObjectId to string
    return jsonify(cycles)

# ... rest of your code ...

if __name__ == '__main__':
    app.run(debug=True, port=8080)