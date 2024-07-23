from flask import Blueprint, request, jsonify
import bcrypt
from ..utils.database import get_db_connection

accounts = Blueprint('account_routes', __name__)

#
@accounts.route('/register', methods=['POST'])
def register():
    data = request.json
    # Hash the password using bcrypt
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    cursor = conn.cursor()
    tags = data.get('tags', [])  # tags นี้เป็น list ของ string
    tags_str = ','.join(tags)
    genre = data.get('genre', []) # genre เป็น list ของ string
    genre_str = ','.join(genre)
    try:
        cursor.execute("INSERT INTO accounts (username, password, email, firstname, surname, role, genre, tags) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                    (data['username'], hashed_password, data['email'], data['firstname'], data['surname'], 'user', genre_str, tags_str))
        conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        print(f"Error inserting into database: {e}")  # Debugging line
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@accounts.route('/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM accounts WHERE username = %s", (data['username'],))
    account = cursor.fetchone()
    cursor.close()
    conn.close()

    if account and bcrypt.checkpw(data['password'].encode('utf-8'), account['password'].encode('utf-8')):
        # สมมติว่า 'your_jwt_token' คือ logic การสร้าง token ของคุณ
        token = 'your_jwt_token'
        return jsonify({'token': token, 'role': account['role'], 'user_id': account['user_id'], 'genre': account['genre'], 'tags': account['tags']}), 200
    else:
        return jsonify({'message': 'Incorrect username or password'}), 401
