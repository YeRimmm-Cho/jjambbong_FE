from db import db

class TravelPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # travel_date = db.Column(db.String(20))
    # travel_days = db.Column(db.Integer)
    # travel_mate = db.Column(db.String(50))
    # travel_theme = db.Column(db.String(100))
    plan_response = db.Column(db.Text)
