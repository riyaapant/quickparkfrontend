from ultralytics import YOLO
from ultralytics.models.yolo.detect.predict import DetectionPredictor
import cv2

model=YOLO("C:/Users/user/Boeing_I3C/quickpark/vehicles.pt")
model.predict(source="C:/Users/user/Boeing_I3C/quickpark/MOVIE.mp4", conf=0.2, save=True)