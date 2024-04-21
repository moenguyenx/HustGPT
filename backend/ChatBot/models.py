from ChatBot import bcrypt, db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50))
    chatboxes = db.relationship('Chatbox', backref='user', lazy=True)

    def set_password(self, password):
        """
        Password hash function before saving into db.

        params: Input password from user
        """
        self.password = bcrypt.generate_password_hash(password=password)

    def check_password(self, password):
        """
        Check password hash vs input password.

        params: Input password
        returns: Boolean
        """
        return bcrypt.check_password_hash(pw_hash=self.password, password=password)
    

class Chatbox(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    messages = db.relationship('Message', backref='chatbox', lazy=True)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chatbox_id = db.Column(db.Integer, db.ForeignKey('chatbox.id'), nullable=False)
    message = db.Column(db.String(255))
    img_url = db.Column(db.String(300))
    from_bot = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)