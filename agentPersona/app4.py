from flask import Flask
from flask_cors import CORS

from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from db import db
from routes import main_bp
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

# 환경 변수 로드
load_dotenv()

# Flask 애플리케이션 생성
app = Flask(__name__)
CORS(app)
secret_key = os.getenv("SECRET_KEY")
app.secret_key = secret_key

# 설정 로드
app.config.from_pyfile("config.py")

# Sqlite 설정
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

# DB 초기화
db.init_app(app)  # Flask 앱과 연결

# 기존 테이블 메타데이터 반영
with app.app_context():
    db.Model.metadata.reflect(bind=db.engine)  # Spring Boot에서 관리하는 테이블 메타데이터 반영

# Blueprint 등록
app.register_blueprint(main_bp, url_prefix="/api")

# langsmith 변경
os.environ['LANGCHAIN_PROJECT'] = 'agentPersona'

# 테이블 생성
with app.app_context():  # 앱 컨텍스트를 생성
    db.create_all()  # 테이블 생성

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
