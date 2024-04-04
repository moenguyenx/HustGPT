from flask import Flask
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import timedelta

api = Flask(__name__)

api.config['SECRET_KEY'] = 'e5ff79a61007b916057540a1'
api.config['JWT_SECRET_KEY'] = '78P&Wd&iQq~A4LE9E4XnSf}s8*mIOL'
api.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
api.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///chatapp.db"

bcrypt = Bcrypt(api)
jwt = JWTManager(api)
db = SQLAlchemy(api)
CORS(api)

from ChatBot import routes