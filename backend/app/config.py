import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_secure_key'
    SQLALCHEMY_DATABASE_URI = 'oracle+cx_oracle://gpupiales:gpupiales@localhost:1522/?service_name=orcl'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
