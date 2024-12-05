from datetime import datetime

from db import db

class TravelPlan(db.Model):
    __tablename__ = 'travel_plans'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    travel_info = db.Column(db.Text, nullable=True)
    plan_response = db.Column(db.Text, nullable=True)
    location_info = db.Column(db.Text, nullable=True)
    # hash_tag = db.Column(db.Text, nullable=True)

    # user = db.relationship("", backref=db.backref('travel_plans', lazy=True))

class SavedPlan(db.Model):
    __tablename__ = 'saved_plans'
    travel_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    travel_name = db.Column(db.Text, nullable=True)
    travel_info = db.Column(db.Text, nullable=True)
    plan_response = db.Column(db.Text, nullable=True)
    location_info = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # 생성 시간 추가
    # hash_tag = db.Column(db.Text, nullable=True)

    # user = db.relationship('User', backref=db.backref('saved_plans', lazy=True))
    # travel_plan = db.relationship('TravelPlan', backref=db.backref('saved_in', lazy=True))