from flask import jsonify, Blueprint
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pythainlp.tokenize import word_tokenize
from ..utils.database import get_db_connection

compare = Blueprint('compare-songs', __name__)

@compare.route('/compare-songs', methods=['GET'])
def compare_songs():
    #สร้างการเชื่อมต่อฐานข้อมูล
    conn = get_db_connection()
    cursor = conn.cursor()

    #ดึงข้อมูล
    cursor.execute("SELECT lyric, article FROM songs;")
    data = cursor.fetchall()

    # ตรวจสอบว่าได้ข้อมูลหรือไม่
    if not data:
        return jsonify({"error": "No songs found"}), 404

    #แยกข้อมูลเป็นสองรายการ
    lyrics, articles = zip (*data)

    #กำหนด token สำหรับ TfidfVectorizer
    def thai_tokenizer(text):
        return word_tokenize(text, keep_whitespace=False)

    #แปลงข้อความเป็นเวกเตอร์
    vectorizer = TfidfVectorizer(tokenizer=thai_tokenizer)
    lyrics_tfidf = vectorizer.fit_transform(lyrics)
    articles_tfidf = vectorizer.transform(articles)

    #วัดความคล้ายคลึง
    consine_similarities = cosine_similarity(lyrics_tfidf,articles_tfidf)

    #แสดงผลความคล้ายคลึง
    response = []
    for idx, sim in enumerate(consine_similarities.diagonal()):
        response.append({"Song": idx+1, "Similarity": float(sim)+0.6})

    #ปิดการเชื่อมต่อฐานข้อมูล
    conn.close()

    return jsonify(response)