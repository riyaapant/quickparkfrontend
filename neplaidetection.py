from ultralytics import YOLO
from ultralytics.models.yolo.detect.predict import DetectionPredictor
import cv2

model=YOLO("C:/Users/user/Boeing_I3C/quickpark/best.pt")
model.predict(source="0", conf=0.5, show=True)