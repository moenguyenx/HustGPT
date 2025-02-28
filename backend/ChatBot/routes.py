import json
from ChatBot import api, db, client
from ChatBot.models import User, Chatbox, Message
from datetime import datetime, timezone, timedelta
from flask import jsonify, request
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required


'''
Authentication Reference: 
"https://dev.to/nagatodev/how-to-add-login-authentication-to-a-flask-and-react-application-23i7"
'''
# @api.after_request
# def refresh_expiring_jwts(response):
#     """
#     Refresh expiring JWT after 30mins
#     """
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
#         if target_timestamp > exp_timestamp:
#             access_token = create_access_token(identity=get_jwt_identity())
#             data = response.get_json()
#             if type(data) is dict:
#                 data["access_token"] = access_token
#                 response.data = json.dumps(data)
#         return response
#     except (RuntimeError, KeyError):
#         # Case where there is not a valid JWT. Just return the original response
#         return response


@api.route('/token', methods=["POST"])
def create_token():
    """
    Handle create JWT Token

    params: None
    returns: Access token if user valid
    """
    username = request.json.get("username")
    password = request.json.get("password")

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"msg": "Invalid username or password"}), 401
    elif not user.check_password(password):
        return jsonify({"msg": "Invalid username or password"}), 401


    access_token = create_access_token(identity=user.id)
    response = {"access_token":access_token,
                "username": user.username.title()}
    return response


@api.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "LoggedOut successfully!"})
    unset_jwt_cookies(response)
    return response


#################################################################################
# Create User 
#################################################################################
def create_user(username, password, email):
    """
    Create user from Frontend request

    params: Username, Password and Email
    return: JSON msg if Succeed for Fail 
    """
    exist = User.query.filter_by(username=username).first()
    if not exist:
        new_user = User(username=username, email=email)
        new_user.set_password(password=password)
        db.session.add(new_user)
        db.session.commit()
        response = jsonify({"msg": "Successfully Created New User!"}), 201
    else:
        response = jsonify({"msg": "User already existed!"}), 409

    return response 


@api.route("/register", methods=["POST"])
def register():
    """
    Call create_user() function to perform user creation

    params: None
    returns: Boolean (succeed or failed)
    """
    data = request.json
    input_username = data.get("username")
    input_password = data.get("password")
    input_email = data.get("email")
    return create_user(input_username, input_password, input_email)


#################################################################################
# Query Chatboxes & Messages
#################################################################################
@api.route("/chatboxes", methods=["GET"])
@jwt_required()
def get_user_chatboxes():
    """
    Extract userID from JWT to query user's chatboxes
    """
    user_id = get_jwt_identity()
    chatboxes = Chatbox.query.filter_by(user_id=user_id).order_by(Chatbox.created_at.desc()).all()
    data = []
    for chatbox in chatboxes:
        chatbox_data = {
            "id": chatbox.id,
            "topic": chatbox.topic
        }
        data.append(chatbox_data)

    response = jsonify(data), 200

    return response


@api.route("/chat/<int:chatbox_id>", methods=["GET"])
@jwt_required()
def get_user_messages(chatbox_id):
    """
    Extract chatboxID from URL to query user's message
    """
    messages = Message.query.filter_by(chatbox_id=chatbox_id).order_by(Message.created_at).all()
    messages_data = []
    for message in messages:
        msg = {
            'id': message.id,
            'message': message.message,
            'from_bot': message.from_bot,
            'img_url': message.img_url
        }
        messages_data.append(msg)
    response = jsonify(messages_data), 200
    return response


#################################################################################
# POST Chatboxes & Messages 
#################################################################################
@api.route("/create_chatbox", methods=["POST"])
@jwt_required()
def create_chatbox():
    """
    Extract UserID from JWT then create chatbox 
    """
    user_id = get_jwt_identity()
    topic = request.json.get("topic")
    new_chatbox = Chatbox(user_id=user_id, topic=topic)
    db.session.add(new_chatbox)
    db.session.commit()

    response = jsonify({"msg": f"Created {topic} chatbox",
                        "id": new_chatbox.id}), 201
    return response


@api.route("/message/<int:chatbox_id>", methods=["POST"])
@jwt_required()
def post_message(chatbox_id):
    """
    Asynchronous function handle prompt requests then process using AI model

    params: ChatboxID
    returns: Processed Image URL as prompt request
    """
    new_msg = request.json.get("message", None)
    img_url = request.json.get("img_url", None)

    user_msg = Message(chatbox_id=chatbox_id, message=new_msg, img_url=img_url, from_bot=False)
    db.session.add(user_msg)
    db.session.commit()

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": new_msg}
        ]
    )

    bot_reply = completion.choices[0].message.content

    bot_msg = Message(chatbox_id=chatbox_id, message=bot_reply, from_bot=True)
    db.session.add(bot_msg)
    db.session.commit()

    response = jsonify({
        "msg": bot_reply,
        "img_url": None
    }), 200

    return response

