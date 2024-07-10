import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_secure_key'
    SQLALCHEMY_DATABASE_URI = 'oracle+cx_oracle://gpupiales:gpupiales@localhost:1522/?service_name=orcl'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    with app.app_context():
        from . import views
        return app
