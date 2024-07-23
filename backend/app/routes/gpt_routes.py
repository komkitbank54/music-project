# ./app/routes/gpt_routes.py
from flask import Blueprint, request, jsonify
import requests
import os

# สร้าง blueprint สำหรับ Flask
gpt_routes = Blueprint('gpt_routes', __name__)

# ดึง API key จาก environment variables
api_key = os.getenv('OPENAI_API_KEY')

# สร้าง route สำหรับการ generate บทความ
@gpt_routes.route('/generate-article', methods=['POST'])
def generate_article():
    # ข้อมูลจาก request
    data = request.json

    # ส่วนส่งคำขอไปยัง OpenAI API
    headers = {
        'Authorization': f'Bearer {api_key}'
    }
    payload = {
        'model': 'gpt-4-0125-preview',
        'messages': [
            # {'role': 'system', 'content': 'คุณคือ AI เพศชาย. คุณคือนักเขียนคำอธิบายที่จะต้องเขียนบทความเพื่ออธิบายจากเนื้อเพลง. โดยคุณเป็นคนที่สามารถตีความเนื้อเพลงที่มีออกมาเป็นคำอธิบายให้ผู้อ่านเข้าใจเนื้อเพลงจากคำบรรยายได้, เขียนบทความที่รวบรัดและเข้าใจง่ายที่สุด เน้นเขียนบทความเข้าใจง่ายไม่ยืดเยื้อ หรือเขียนวนไปวนมาในโทปิคเดิมๆ. โดยจะเขียนบทความที่มีความยาวไม่เกิน 65 คำ แล้วจบ. มีตัวอย่างการเขียนอธิบายเนื้อเพลงให้ดู 3 ตัวอย่าง 1.บทเพลงที่พูดถึงการเดินทางที่จะสร้างความเข้าใจให้กับคนสองคนมากขึ้น นอกจากจะไพเราะและให้ข้อคิดที่ดีแล้ว ยังสร้างความรู้สึกซึ้งๆ ให้กับคู่รักได้เป็นอย่างดี สำหรับใครที่มักจะไปเที่ยวกับแฟนบ่อยๆ พลาดเพลงนี้ไม่ได้เลยนะคะ 2.เพลงนี้เป็นอีกหนึ่งเพลงที่เราอยากให้ได้ฟังกันตอนไปเที่ยวทะเล ด้วยทำนองเพลงฟังสบายๆจากเสียงกีตาร์ และจังหวะของดนตรีที่ละมุน รวมกับเนื้อหาในบทเพลง ที่เล่าถึงความสวยงามของท้องทะเล เมื่อมีใครสักคนหนึ่งไปด้วยกัน ทำให้เพลงนี้เหมาะแก่การเปิดฟังตอนนอนเล่นชิลล์ๆอยู่ริมทะเล หรือจะส่งเพลงนี้ไปให้คนที่อยากชวนไปทะเลก็ได้น้า 3.เริ่มต้นการเดินทางด้วยการเก็บกระเป๋ากัน เพลงนี้พูดถึงจุดเริ่มต้น ที่จะพาเราไปสู่จุดหมายที่เราต้องการไป ขอเพียงแค่มีเพื่อนอยู่ข้างๆ เราก็ออกเดินทางได้ โดยไม่ต้องกลัวอะไรเลย เพลงนี้ได้ฟังทีไรก็อยากเก็บกระเป๋าออกไปผจญในโลกกว้างทุกทีเลยค่ะ'},
            {'role': 'system', 'content': 'Write a description of the lyrics in Thai with an interesting tone, for inclusion on the song lyrics website. This description must not exceed 65 Thai words.'},
            {'role': 'user', 'content': f'เขียนบทความบรรยายเพลงที่ชื่อว่า "{data["title"]}", ซึ่งมี genre คือ "{data.get("genre")}" และเนื้อเพลงดังนี้: "{data.get("lyric", "")}"'}
        ],
        'max_tokens': 400
    }
    response = requests.post('https://api.openai.com/v1/chat/completions', json=payload, headers=headers)
    return jsonify(response.json())
