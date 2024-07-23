from flask import Blueprint, request, jsonify
from ..utils.database import get_db_connection
import pandas as pd
from sklearn.neighbors import NearestNeighbors

rec = Blueprint('rec', __name__)

from flask import Blueprint, request, jsonify
from ..utils.database import get_db_connection
import pandas as pd
from sklearn.neighbors import NearestNeighbors

rec = Blueprint('rec', __name__)

def get_recommendations(user_id):
    db_connection = get_db_connection()
    cursor = db_connection.cursor()
    
    cursor.execute("""
    SELECT pc.song_id, s.title, pc.user_id, pc.click_count
    FROM play_counts pc
    JOIN songs s ON pc.song_id = s.song_id
    WHERE pc.user_id != 0
    """)
    rows = cursor.fetchall()
    song_data = pd.DataFrame(rows, columns=['song_id', 'title', 'user_id', 'click_count'])

    song_pivot = song_data.pivot_table(index='user_id', columns='song_id', values='click_count', fill_value=0)

    knn = NearestNeighbors(n_neighbors=25, metric='cosine', algorithm='brute')
    model = knn.fit(song_pivot)

    recommended_song_ids = set()  # ใช้เซตเพื่อเก็บ song_id ที่ไม่ซ้ำ
    if user_id in song_pivot.index:
        user_vector = song_pivot.loc[[user_id]]
        distances, indices = model.kneighbors(user_vector)

        for index in indices.flatten()[1:]:  # ข้าม index แรกเนื่องจากเป็นตัวเอง
            user_id = song_pivot.index[index]
            user_songs = song_data[(song_data['user_id'] == user_id) & (song_data['click_count'] == 1)]
            for _, row in user_songs.iterrows():
                # ตรวจสอบก่อนเพิ่มเข้าเซตเพื่อหลีกเลี่ยงการเพิ่ม song_id ที่ซ้ำ
                recommended_song_ids.add(row['song_id'])

                # จำกัดจำนวนเพลงแนะนำหากต้องการ
                if len(recommended_song_ids) >= 10:
                    break
            if len(recommended_song_ids) >= 10:
                break

        recommended_songs = list(recommended_song_ids)[:10]  # แปลงเซตกลับเป็นลิสต์และเลือก 10 เพลงแรกหากมีมากกว่านั้น
    else:
        recommended_songs = ["No recommendation available due to insufficient data"]

    return recommended_songs


@rec.route('/recommendations/<int:user_id>', methods=['GET'])
def recommendations(user_id):
    recommended_songs = get_recommendations(user_id)
    return jsonify(recommended_songs)
