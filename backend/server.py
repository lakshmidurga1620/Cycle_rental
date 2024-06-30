from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['cycle_rental_db']
cycles_collection = db['cycles']

# Example route to rent a cycle
@app.route('/cycles/rent/<cycleId>', methods=['PATCH'])
def rent_cycle(cycleId):
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

if __name__ == '__main__':
    app.run(debug=True)
