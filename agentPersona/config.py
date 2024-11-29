# Flask 설정
import os

SQLALCHEMY_DATABASE_URI = 'sqlite:///C:/codespace/projects/Capstone/data/testdb.sqlite'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
PERMANENT_SESSION_LIFETIME = 3600  # 1시간
