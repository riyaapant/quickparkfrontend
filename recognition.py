from ultralytics import YOLO
from ultralytics.models.yolo.detect.predict import DetectionPredictor


import easyocr
import cv2

from ultralytics.engine.predictor import BasePredictor
from ultralytics.engine.results import Results
from ultralytics.utils import ops

reader=easyocr.Reader(['en'],gpu=True)

def perform_ocr(img,coordinates):
    x,y,w,h=map(int, coordinates)
    cropped_img=img[y:h,x:w]

    gray_img=cv2.cvtColor(cropped_img,cv2.COLOR_BGR2GRAY)
    res=reader.readtext(gray_img)

    text=""
    for result in res:
        if len(res)==1 or (len(result[1])<6 and len(result[2])>0.2):
            text=result[1]

    return str(text)        





class DetectionPredictor(BasePredictor):
    """
    A class extending the BasePredictor class for prediction based on a detection model.

    Example:
        ```python
        from ultralytics.utils import ASSETS
        from ultralytics.models.yolo.detect import DetectionPredictor

        args = dict(model='yolov8n.pt', source=ASSETS)
        predictor = DetectionPredictor(overrides=args)
        predictor.predict_cli()
        ```
    """

    def postprocess(self, preds, img, orig_imgs):
        """Post-processes predictions and returns a list of Results objects."""
        preds = ops.non_max_suppression(
            preds,
            self.args.conf,
            self.args.iou,
            agnostic=self.args.agnostic_nms,
            max_det=self.args.max_det,
            classes=self.args.classes,
        )

        if not isinstance(orig_imgs, list):  # input images are a torch.Tensor, not a list
            orig_imgs = ops.convert_torch2numpy_batch(orig_imgs)

        results = []
        for i, pred in enumerate(preds):
            orig_img = orig_imgs[i]
            pred[:, :4] = ops.scale_boxes(img.shape[2:], pred[:, :4], orig_img.shape)
            img_path = self.batch[0][i]


             # Perform OCR for each bounding box
            ocr_results = []
            for bbox in pred:
                x1, y1, x2, y2, conf, class_id = bbox
                # Assuming class_id corresponds to the license plate class
                if int(class_id) == YOUR_LICENSE_PLATE_CLASS_ID:
                    # Extract the bounding box coordinates
                    bbox_coordinates = [x1, y1, x2, y2]
                    # Call perform_ocr function
                    ocr_text = perform_ocr(orig_img, bbox_coordinates)
                    ocr_results.append((bbox_coordinates, ocr_text))

            results.append(Results(orig_img, path=img_path, names=self.model.names, boxes=pred))
        return results
