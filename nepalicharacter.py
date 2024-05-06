from ultralytics.engine.predictor import BasePredictor
from ultralytics.engine.results import Results
from ultralytics.utils import ops

import os  
os.environ['KMP_DUPLICATE_LIB_OK']='True'
import cv2
import string
import easyocr
reader = easyocr.Reader(['en'], gpu=False)

class DetectionPredictor(BasePredictor):
    def postprocess(self, preds, img, orig_imgs):
        preds = ops.non_max_suppression(
            preds,
            self.args.conf,
            self.args.iou,
            agnostic=self.args.agnostic_nms,
            max_det=self.args.max_det,
            classes=self.args.classes,
        )

        if not isinstance(orig_imgs, list): 
            orig_imgs = ops.convert_torch2numpy_batch(orig_imgs)

        results = []
        for i, pred in enumerate(preds):
            orig_img = orig_imgs[i]
            pred[:, :4] = ops.scale_boxes(img.shape[2:], pred[:, :4], orig_img.shape)
            img_path = self.batch[0][i]
            results.append(Results(orig_img, path=img_path, names=self.model.names, boxes=pred))
        return results


# Load the YOLO model
model = DetectionPredictor(overrides=dict(model='C:/Users/user/Boeing_I3C/quickpark/detection.pt'))

# Open the webcam
cap = cv2.VideoCapture(0) 

while True:
    ret, frame = cap.read()
    if not ret:
        break

     
    results = model(0) 

    # Initialize an empty output string
    output_str = ""

    if results and isinstance(results, list):
        for res in results:
            if isinstance(res, Results):
                for obj in res.xyxy[0]:
                    xmin, ymin, xmax, ymax, conf, cls = [int(x) for x in obj]
                    output_str += f"{model.names[int(cls)]}: {conf:.2f}\n"

    # Show the frame with detections
    cv2.imshow("YOLO Object Detection", frame)

    # Display the concatenated output string
    print(output_str)
    
    # Press 'q' to exit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close all windows
cap.release()
cv2.destroyAllWindows()
