from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from config import Config
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from flask_session import Session
from flask_cors import CORS
import os

db = SQLAlchemy()
bcrypt = Bcrypt()
socketio = SocketIO()
jwt = JWTManager()  # ✅ Déclaré une seule fois ici
sess = Session()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configuration des sessions
    app.config["SESSION_TYPE"] = "filesystem"
    app.secret_key = "un_secret_aleatoire"

    # Configuration JWT
    app.config["JWT_SECRET_KEY"] = "super-secret"  # Choisir une seule valeur
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_SECURE'] = True  # True en production (HTTPS)
    app.config['JWT_COOKIE_HTTPONLY'] = True
    app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.config['JWT_CSRF_IN_COOKIES'] = True

    # CORS avec support credentials pour les cookies cross-origin
    CORS(app, supports_credentials=True, origins=["*"])

    # Initialisation des extensions
    sess.init_app(app)
    db.init_app(app)
    bcrypt.init_app(app)
    socketio.init_app(app)
    jwt.init_app(app)  # ✅ Initialisation correcte (pas de recréation)

    # Import des routes et modèles
    from .routers.auth import auth_bp
    from .routers.contact import google_bp
    from .routers.courrier import courrier_bp
    from .models import Utilisateur, Contact, Courrier, Document, Workflow  

    with app.app_context():
        db.create_all()
        app.register_blueprint(auth_bp, url_prefix="/auth")
        app.register_blueprint(google_bp)
        app.register_blueprint(courrier_bp, url_prefix="/courrier")
        print("✅ Tables créées avec succès !")

    @app.route("/")
    def set_test_session():
        return "hello to the app."

    return app
