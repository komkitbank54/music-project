# ./routes/artist_routes.py
import os
from flask import Flask, Blueprint, request, jsonify
from ..utils.database import get_db_connection
import mysql.connector
from werkzeug.utils import secure_filename

artists = Blueprint('artists', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pic')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ดึงข้อมูลศิลปินทั้งหมด
@artists.route('/artists', methods=['GET'])
def get_artists():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM artists")
    artists = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(artists)

# เพิ่มศิลปินใหม่
@artists.route('/artists', methods=['POST'])
def add_artist():
    # ตรวจสอบว่ามีไฟล์ถูกส่งมาใน request หรือไม่
    if 'artist_pic' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['artist_pic']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # ดำเนินการเพิ่มข้อมูลลงฐานข้อมูล โดยเก็บ path หรือชื่อไฟล์
        # ตัวอย่างนี้เก็บชื่อไฟล์
        new_artist = request.form.to_dict()  # สมมติว่าข้อมูลอื่นๆ ส่งมาใน form
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO artists (name, bio, artist_pic) VALUES (%s, %s, %s)",
                           (new_artist['name'], new_artist['bio'], filename))
            conn.commit()
            return jsonify({"message": "Artist added successfully"}), 201
        except mysql.connector.Error as err:
            print("Something went wrong: {}".format(err))
            return jsonify({"error": str(err)}), 500
        finally:
            cursor.close()
            conn.close()



# อัปเดตข้อมูลศิลปิน
@artists.route('/artists/<int:artist_id>', methods=['PUT'])
def update_artist(artist_id):
    updated_artist = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE artists SET name = %s, bio = %s, artist_pic = %s WHERE artist_id = %s",
                       (updated_artist['name'], updated_artist['bio'], updated_artist['artist_pic'], artist_id))
        conn.commit()
        return jsonify({"message": "Artist updated successfully"}), 200
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# ลบศิลปิน
@artists.route('/artists/<int:artist_id>', methods=['DELETE'])
def delete_artist(artist_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM artists WHERE artist_id = %s", (artist_id,))
        conn.commit()
        return jsonify({"message": "Artist deleted successfully"}), 200
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()
