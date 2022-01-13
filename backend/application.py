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
from datetime import datetime

application = Flask(__name__)
cors = CORS(application)
application.config[
    'SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:root@localhost:3306/car_park_system"
db = SQLAlchemy(application)
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
application.config['CORS_HEADERS'] = 'Content-Type'

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

    def __init__(self, id, userName, password):
        self.id = id
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
count = 0

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
        text = pytesseract.image_to_string(carNumberPlate)
        carNumberPlateText = text.translate({ord(i): None for i in '[-|/+\\s^%@<>!#*.,~$]'}).strip()
        print(carNumberPlateText is None)
        if carNumberPlateText != "" and carNumberPlateText is not None:
            image_bytes = cv2.imencode('.jpg', carNumberPlate)[1].tobytes()
            s3.put_object(Bucket="ml-car-number-plate-detection", Key=carNumberPlateText + ".jpg", Body=image_bytes)
            vehicle = Vehicle(
                vehicleNumberPlateUrl="test",
                vehicleNo=carNumberPlateText,
                parkDateTime=datetime.now(),
                exitDateTime=None,
                status="PARKED"
            )
            print(vehicle)
            cv2.waitKey(500)
            db.session.add(vehicle)
            db.session.commit()
        else:
            cv2.imshow("ROI", carNumberPlate)
