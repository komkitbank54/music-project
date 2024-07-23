# ./routes/song_routes.py
from flask import Blueprint, request, jsonify, send_from_directory
from ..utils.database import get_db_connection

import os

songs = Blueprint('songs', __name__)

# แสดงข้อมูลเพลง
@songs.route('/songs', methods=['GET'])
def get_songs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT songs.*, artists.name AS artist_name , artists.artist_pic
        FROM songs
        JOIN artists ON songs.artist_id = artists.artist_id
    """)
    songs = cursor.fetchall()
    for song in songs:
        song['tags'] = song['tags'] if song.get('tags') else []  # แปลงเป็น list หากมี tags
    cursor.close()
    conn.close()
    return jsonify(songs)

# Fetch song details by ID
@songs.route('/songs/<int:song_id>', methods=['GET'])
def get_song_details(song_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT songs.*, artists.name AS artist_name, artists.artist_pic
        FROM songs
        JOIN artists ON songs.artist_id = artists.artist_id
        WHERE songs.song_id = %s
    """, (song_id,))
    song_details = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if song_details:
        song_details['tags'] = song_details['tags'] if song_details.get('tags') else []  # Convert to list if tags exist
        return jsonify(song_details)
    else:
        return jsonify({"message": "Song not found"}), 404


# เพิ่มเพลงใหม่
@songs.route('/songs', methods=['POST'])
def add_song():
    new_song = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    tags = new_song.get('tags', [])  # สมมติว่า tags นี้เป็น list ของ string
    tags_str = ','.join(tags)
    cursor.execute("""
        INSERT INTO songs (title, artist_id, release_date, genre, duration, album, lyric, yt_link, article, tags) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (new_song['title'], new_song['artist_id'], new_song['release_date'], new_song['genre'], new_song['duration'], new_song['album'], new_song['lyric'], new_song['yt_link'], new_song['article'], tags_str))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Song added"}), 201

# ลบเพลง
@songs.route('/songs/<int:song_id>', methods=['DELETE'])
def delete_song(song_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM songs WHERE song_id = %s", (song_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Song deleted"}), 200

# แก้ไขเพลง
@songs.route('/songs/<int:song_id>', methods=['PUT'])
def update_song(song_id):
    updated_song = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    tags = updated_song.get('tags', [])
    tags_str = ','.join(tags)
    cursor.execute("""
        UPDATE songs 
        SET title = %s, artist_id = %s, release_date = %s, genre = %s, duration = %s, album = %s, lyric = %s, yt_link = %s, article = %s, tags = %s 
        WHERE song_id = %s
    """, (updated_song['title'], updated_song['artist_id'], updated_song['release_date'], updated_song['genre'], updated_song['duration'], updated_song['album'], updated_song['lyric'], updated_song['yt_link'], updated_song['article'], tags_str, song_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Song updated"}), 200

# แสดงข้อมูลเพลงตามชื่อศิลปิน
@songs.route('/songs/by_artist/<artist_name>', methods=['GET'])
def get_songs_by_artist(artist_name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT songs.*, artists.name AS artist_name, artists.artist_pic 
        FROM songs
        JOIN artists ON songs.artist_id = artists.artist_id
        WHERE artists.name = %s
    """
    cursor.execute(query, (artist_name,))
    songs = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(songs)

# กำหนด path ที่เก็บไฟล์รูปภาพ
PIC_FOLDER = os.path.join(os.path.dirname(__file__), 'pic')

# Route สำหรับ serve รูปภาพ
@songs.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(PIC_FOLDER, filename)

# ค้นหาเพลงจากชื่อเพลงหรือชื่อศิลปิน
@songs.route('/search', methods=['GET'])
def search_songs():
    search_query = request.args.get('query', '')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT songs.*, artists.name AS artist_name, artists.artist_pic
        FROM songs
        JOIN artists ON songs.artist_id = artists.artist_id
        WHERE songs.title LIKE %s OR artists.name LIKE %s
    """
    like_query = f"%{search_query}%"
    cursor.execute(query, (like_query, like_query))
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

# Fetch top songs based on click_count
@songs.route('/top_songs', methods=['GET'])
def get_top_songs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT songs.song_id, songs.title, artists.name AS artist_name, artists.artist_pic, SUM(play_counts.click_count) as click_count
        FROM play_counts
        JOIN songs ON play_counts.song_id = songs.song_id
        JOIN artists ON songs.artist_id = artists.artist_id
        GROUP BY songs.song_id, artists.name, artists.artist_pic
        ORDER BY click_count DESC
        LIMIT 12;
    """)
    top_songs = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(top_songs)

# นับข้อมูลทั้งหมด
@songs.route('/dashboard/overview', methods=['GET'])
def get_dashboard_overview():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # จำนวนศิลปิน
    cursor.execute("SELECT COUNT(*) AS total_artists FROM artists")
    total_artists = cursor.fetchone()['total_artists']

    # จำนวนเพลง
    cursor.execute("SELECT COUNT(*) AS total_songs FROM songs")
    total_songs = cursor.fetchone()['total_songs']

    # จำนวนบัญชีผู้ใช้
    cursor.execute("SELECT COUNT(*) AS total_accounts FROM accounts")
    total_accounts = cursor.fetchone()['total_accounts']

    # สามารถเพิ่มการคำนวณกิจกรรมผู้ใช้งานอื่นๆ ได้ที่นี่

    cursor.close()
    conn.close()

    return jsonify({
        'total_artists': total_artists,
        'total_songs': total_songs,
        'total_accounts': total_accounts,
        # กิจกรรมผู้ใช้งานอื่นๆ
    })

