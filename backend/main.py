import pytesseract
import cv2
import easyocr
import pprint
from PIL import Image

frameWidth = 640
franeHeight = 480

plateCascade = cv2.CascadeClassifier("comp/number_plate.xml")
minArea = 500

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
            cv2.putText(img, "NumberPlate", (x, y - 5), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 0, 255), 2)
            carNumberPlate = img[y:y + h, x:x + w]
            cv2.imshow("ROI", carNumberPlate)
    cv2.imshow("Result", img)
    if cv2.waitKey(1) & 0xFF == ord('s'):
        cv2.imwrite("saved-images/" + str(count) + ".jpg", carNumberPlate)
        img = Image.open("saved-images/" + str(count) + ".jpg")
        text = pytesseract.image_to_string(img)
        print(text)
        cv2.waitKey(500)
        count += 1

