import cv2
import pandas as pd
from ultralytics import YOLO
import numpy as np
import pytesseract
from datetime import datetime

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

model = YOLO('C:/Users/user/Boeing_I3C/quickpark/computervision/cars.pt')

def RGB(event, x, y, flags, param):
    if event == cv2.EVENT_MOUSEMOVE:
        point = [x, y]
        print(point)

cv2.namedWindow('RGB')
cv2.setMouseCallback('RGB', RGB)

cap = cv2.VideoCapture(0)

my_file = open("C:/Users/user/Boeing_I3C/quickpark/computervision/coco1.txt", "r")
data = my_file.read()
class_list = data.split("\n") 

area = [(27, 417), (16, 503), (1015, 503), (992, 417)]

count = 0
list1 = []
processed_numbers = set()

# Open file for writing car plate data
with open("C:/Users/user/Boeing_I3C/quickpark/computervision/text.txt", "a") as file:
    file.write("NumberPlate        Date      Time\n") 

def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    edged = cv2.Canny(gray, 170, 200)
    cv2.imshow("Canny Edges", edged)
    return gray

def post_process_text(text):
    text = text.replace('G', '0')  # Replace 'O' with '0'
    text = text.replace('I', '1')  # Replace 'I' with '1'
    text = text.replace('S', '5')  # Replace 'S' with '5'
    text = ''.join([c for c in text if c.isalnum()])  # Remove non-alphanumeric characters
    return text

def display_feedback(frame, message):
    cv2.putText(frame, message, (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

def is_valid_license_plate(text):
    # Assuming license plate format is three letters followed by four digits (e.g., BAA1234)
    return len(text) == 7 and text[:3].isalpha() and text[3:].isdigit()

while True:    
    ret, frame = cap.read()
    count += 1
    if count % 3 != 0:
        continue
    if not ret:
       break
   
    frame = cv2.resize(frame, (1020, 500))
    results = model.predict(frame)
    a = results[0].boxes.data
    px = pd.DataFrame(a).astype("float")
   
    for index, row in px.iterrows():
        x1 = int(row[0])
        y1 = int(row[1])
        x2 = int(row[2])
        y2 = int(row[3])
        
        d = int(row[5])
        c = class_list[d]
        cx = int(x1 + x2) // 2
        cy = int(y1 + y2) // 2
        result = cv2.pointPolygonTest(np.array(area, np.int32), ((cx, cy)), False)
        if result >= 0:
           crop = frame[y1:y2, x1:x2]
           gray = preprocess_image(crop)
          
           text = pytesseract.image_to_string(gray).strip()
           processed_text = post_process_text(text)
           cv2.putText(frame, processed_text, (x1, y1), cv2.FONT_HERSHEY_COMPLEX, 0.5, (0, 0, 255), 1)
            
           # Feedback mechanism
           if not is_valid_license_plate(processed_text):  
               display_feedback(frame, "Zoom in or reposition license plate")
           else:
               display_feedback(frame, "License plate recognized")
                
               if processed_text not in processed_numbers:
                   processed_numbers.add(processed_text) 
                   list1.append(processed_text)
                   current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                   with open("C:/Users/user/Boeing_I3C/quickpark/computervision/text.txt", "a") as file:
                       file.write(f"{processed_text}\t{current_datetime}\n")
                       cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 1)
                       cv2.imshow('crop', crop)

    cv2.polylines(frame, [np.array(area, np.int32)], True, (0, 255, 0), 2)
    cv2.imshow("RGB", frame)
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()    
cv2.destroyAllWindows()

