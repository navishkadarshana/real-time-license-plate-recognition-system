import pytesseract
import cv2
import easyocr
from PIL import Image
from dataclasses import dataclass
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
import boto3
import base64
import PIL
from datetime import datetime, timedelta
import string
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps

application = Flask(__name__)
cors = CORS(application)
application.config[
    'SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:root@localhost:3306/car_park_system"
db = SQLAlchemy(application)
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
application.config['CORS_HEADERS'] = 'Content-Type'
application.config['SECRET_KEY'] = 'my_secret_Ml'

plateCascade = cv2.CascadeClassifier("comp/number_plate.xml")
minArea = 500

s3 = boto3.client('s3', region_name='ap-southeast-1')


@dataclass
class Vehicle(db.Model):
    id: int
    vehicleNumberPlateUrl: str
    vehicleNo: str
    parkDateTime: str
    exitDateTime: str
    status: str

    id = db.Column(db.Integer, primary_key=True)
    vehicleNumberPlateUrl = db.Column(db.String(500), unique=False, nullable=False)
    vehicleNo = db.Column(db.String(120), unique=False, nullable=False)
    parkDateTime = db.Column(db.String(200), unique=False, nullable=True)
    exitDateTime = db.Column(db.String(200), unique=False, nullable=True)
    status = db.Column(db.String(50), unique=False, nullable=False)

    def __init__(self, vehicleNumberPlateUrl, vehicleNo, parkDateTime, exitDateTime, status):
        self.vehicleNumberPlateUrl = vehicleNumberPlateUrl
        self.vehicleNo = vehicleNo
        self.parkDateTime = parkDateTime
        self.exitDateTime = exitDateTime
        self.status = status

    def __repr__(self):
        return f"['vehicleNumberPlateUrl'=>{self.vehicleNumberPlateUrl}, 'vehicleNo'=>{self.vehicleNo}, 'parkDateTime'=>{self.parkDateTime}, 'exitDateTime'=>{self.exitDateTime}, 'status'=>{self.status}] "


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)

    def __init__(self, userName, password):
        self.userName = userName
        self.password = password


db.create_all()
db.session.commit()

frameWidth = 640
franeHeight = 480
cap = cv2.VideoCapture(0)
cap.set(3, frameWidth)
cap.set(4, franeHeight)
cap.set(10, 150)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message': 'Token is missing !!'}), 401

        try:
            # decoding the payload to fetch the stored details

            data = jwt.decode(token, application.config['SECRET_KEY'], algorithms=["HS256"])
            print(data)
            current_user = User.query.filter_by(id=data['public_id']).first()
        except:
            return jsonify({
                'message': 'Token is invalid !!'
            }), 401
        # returns the current logged-in users contex to the routes
        return f(current_user, *args, **kwargs)

    return decorated


@application.route('/vehicle/add', methods=['POST'])
@token_required
def addVehicle(current_user):
    print(current_user)
    while True:
        success, img = cap.read()
        imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        numberPlates = plateCascade.detectMultiScale(imgGray, 1.1, 4)

        for (x, y, w, h) in numberPlates:
            area = w * h
            if area > minArea:
                cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
                cv2.putText(img, "Number Plate Identified", (x, y - 5), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 0, 255), 2)
                carNumberPlate = img[y:y + h, x:x + w]
        cv2.imshow("Result", img)
        if cv2.waitKey(1) & 0xFF == ord('s'):
            text = pytesseract.image_to_string(carNumberPlate).translate({ord(c): None for c in string.whitespace})
            carNumberPlateText = ''.join(e for e in text if e.isalnum())
            print(carNumberPlateText)
            if carNumberPlateText != "" and carNumberPlateText is not None:
                image_bytes = cv2.imencode('.jpg', carNumberPlate)[1].tobytes()
                s3.put_object(Bucket="ml-car-number-plate-detection", Key=carNumberPlateText + ".jpg", Body=image_bytes)
                vehicle = Vehicle(
                    vehicleNumberPlateUrl="https://ml-car-number-plate-detection.s3.ap-southeast-1.amazonaws.com/" + carNumberPlateText + ".jpg",
                    vehicleNo=carNumberPlateText,
                    parkDateTime=datetime.now(),
                    exitDateTime=None,
                    status="PARKED"
                )
                print(vehicle)
                db.session.add(vehicle)
                db.session.commit()
                cv2.imshow("Detected Number Plate --> " + carNumberPlateText, carNumberPlate)
                cv2.waitKey(1)
                return make_response(jsonify({
                    "success": "true",
                    "msg": "Vehicle successfully added!",
                    "status": "200"
                }), 200)
            else:
                brokImage = cv2.imread("saved-images/brockeImage.jpg")
                cv2.imshow("The characters in this image unrecognizable", brokImage)
                cv2.waitKey(1)
                return make_response(jsonify({
                    "success": "false",
                    "msg": "The characters in this image Unrecognizable. Please try again",
                    "status": "200"
                }), 200)


@application.route('/signup', methods=['POST'])
def addUser():
    try:
        data = request.form
        user = User(
            userName=data.get('userName'),
            password=generate_password_hash(data.get('password')),
        )
        print(user)
        db.session.add(user)
        db.session.commit()

        return make_response(jsonify({
            "success": "true",
            "msg": "Vehicle update successfully!",
            "status": "200"
        }), 200)
    except:
        return errorResponse()


def errorResponse():
    return make_response(jsonify({
        "success": "false",
        "msg": "Something went wrong",
        "status": "500"
    }), 500)


@application.route('/login', methods=['POST'])
def login():
    auth = request.form

    if not auth or not auth.get('username') or not auth.get('password'):
        return make_response(
            'Could not verify',
            401,
            {'WWW-Authenticate': 'Basic realm ="Login required !!"'}
        )

    user = User.query.filter_by(userName=auth.get('username')).first()

    if not user:
        # returns 401 if user does not exist
        return make_response(
            'Could not verify',
            401,
            {'WWW-Authenticate': 'Basic realm ="User does not exist !!"'}
        )

    if check_password_hash(user.password, auth.get('password')):
        # generates the JWT Token
        encoded_jwt = jwt.encode({
            'public_id': user.id,
            'exp': datetime.utcnow() + timedelta(minutes=30)},
            application.config['SECRET_KEY'],
            algorithm="HS256")

        return make_response(jsonify({'token': encoded_jwt}), 201)
    # returns 403 if password is wrong
    return make_response(
        'Could not verify',
        403,
        {'WWW-Authenticate': 'Basic realm ="Wrong Password !!"'}
    )


@application.route("/")
def hello_world():
    return "<p>Welcome Navishka!</p>"
