# app/utils/database.py
import mysql.connector
from ..config import Config

def get_db_connection():
    connection = mysql.connector.connect(
        host=Config.MYSQL_HOST,
        port=Config.MYSQL_PORT,  # เพิ่ม port ที่นี่
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB
    )

    return connection
