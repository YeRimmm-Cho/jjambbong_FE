# gunicorn_config.py

bind = "0.0.0.0:5000"  # 애플리케이션 바인딩
workers = 4            # 워커 프로세스 수
timeout = 120          # 요청 타임아웃
accesslog = "/var/log/gunicorn/access.log"  # 접근 로그
errorlog = "/var/log/gunicorn/error.log"    # 에러 로그
loglevel = "info"      # 로그 레벨
