# app/__init__.py
from flask import Flask
from flask_cors import CORS
from .config import Config
from .routes.song_routes import songs
from .routes.artist_routes import artists
from .routes.gpt_routes import gpt_routes
from .routes.acount_routes import accounts
from .routes.play_routes import plays
from .routes.recommend_routes import rec
from .models.compare_songs import compare

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app)

    app.register_blueprint(songs)
    app.register_blueprint(artists)
    app.register_blueprint(gpt_routes)
    app.register_blueprint(accounts)
    app.register_blueprint(rec)
    app.register_blueprint(plays)
    app.register_blueprint(compare)

    return app
