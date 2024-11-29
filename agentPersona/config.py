# Flask 설정
import os

# SQLALCHEMY_DATABASE_URI = 'sqlite:///../data/testdb.sqlite'

BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # 현재 파일의 절대경로
SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "../data/testdb.sqlite")}'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
PERMANENT_SESSION_LIFETIME = 3600  # 1시간
