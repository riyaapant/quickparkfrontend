from ultralytics import YOLO
from ultralytics.models.yolo.detect.predict import DetectionPredictor
import cv2

model=YOLO("C:/Users/user/Boeing_I3C/quickpark/detection.pt")
model.predict(source="0", show=True, conf=0.5)

