from flask import Blueprint, request, jsonify
from ..utils.database import get_db_connection

plays = Blueprint('plays', __name__)

@plays.route('/log_play', methods=['POST'])
def log_play():
    data = request.json
    # Check if 'song_id' is in the data
    if 'song_id' not in data:
        return jsonify({"error": "Missing song_id in request"}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        user_id = data.get('user_id', 0)
        song_id = data['song_id']
        
        # Check if there's already a record for this song and user
        cursor.execute("""
            SELECT play_id, click_count FROM play_counts 
            WHERE song_id = %s AND user_id = %s
        """, (song_id, user_id))
        play_record = cursor.fetchone()
        
        if play_record:
            # If record exists, update the click_count
            play_id, click_count = play_record
            new_click_count = click_count + 1
            cursor.execute("""
                UPDATE play_counts 
                SET click_count = %s
                WHERE play_id = %s
            """, (new_click_count, play_id))
            print(data)
        else:
            # If no record exists, create a new one with click_count = 1
            cursor.execute("""
                INSERT INTO play_counts (song_id, user_id, click_count) 
                VALUES (%s, %s, 1)
            """, (song_id, user_id))
            print(data)
        
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
    
    return jsonify({"message": "Play logged successfully"}), 200
