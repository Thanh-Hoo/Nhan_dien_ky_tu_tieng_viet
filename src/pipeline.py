import os 
import time

import numpy as np
import torch
import cv2
from ISR.models import RDN, RRDN

from .utils import get_config
from .libs.CRAFT.craft import CRAFT
from .libs.DeepText.Deeptext_pred import Deeptext_predict, load_model_Deeptext
from .libs.super_resolution.improve_resolution import improve_resolution

from .src import craft_text_detect, load_model_Craft
from .src import yolo_detect
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# setup config
cfg = get_config()
cfg.merge_from_file('./src/configs/pipeline.yaml')
cfg.merge_from_file('./src/configs/craft.yaml')
cfg.merge_from_file('./src/configs/faster.yaml')
cfg.merge_from_file('./src/configs/yolo.yaml')
cfg.merge_from_file('./src/configs/Deeptext.yaml')

DEEPTEXT_CONFIG = cfg.DEEPTEXT
CRAFT_CONFIG = cfg.CRAFT
NET_CRAFT = CRAFT()
PIPELINE_CFG = cfg.PIPELINE

# load all model
# model text detct
print ('[LOADING] Text detecttion model')
CRAFT_MODEL = load_model_Craft(CRAFT_CONFIG, NET_CRAFT)
print ('[LOADING SUCESS] Text detection model')
# model regconition
print ('[LOADING] Text regconition model')
DEEPTEXT_MODEL, DEEPTEXT_CONVERTER = load_model_Deeptext(DEEPTEXT_CONFIG)
print ('[LOADING SUCESS] Text regconition model')
print ('[LOADING] Super resolution model')
super_resolution_model = RRDN(weights='gans')
print ('[LOADING SUCESS] Super resolution model')

def text_recog(cfg, opt, image_path, model, converter):
    text = 'None'
    if cfg.PIPELINE.DEEPTEXT:
        list_image_path = [image_path]
        for img in list_image_path:
            text = Deeptext_predict(img, opt, model, converter)
    elif cfg.PIPELINE.MORAN:
        text = MORAN_predict(cfg.PIPELINE.MORAN_MODEL_PATH, image_path, MORAN)
    return text

def text_detect_CRAFT(img, craft_config, CRAFT_MODEL, Y_DIST_FOR_MERGE_BBOX, EXPAND_FOR_BBOX):
    # img = loadImage(image_path)
    bboxes, polys, score_text = craft_text_detect(img, craft_config, CRAFT_MODEL)
    return bboxes, polys, score_text

def regconition(cfg, img, YOLO_NET):

    # predict region of text bounding box
    bboxes, polys, score_text = text_detect_CRAFT(img, CRAFT_CONFIG, CRAFT_MODEL, PIPELINE_CFG.Y_DIST_FOR_MERGE_BBOX,  PIPELINE_CFG.EXPAND_FOR_BBOX)
    LP_reg = []
    # count = 1
    for index, bbox in enumerate(bboxes):
        # merge bbox on a line
        if bbox[0][0] < 0: bbox[0][0] = 0
        if bbox[0][1] < 0: bbox[0][1] = 0
        if bbox[1][0] < 0: bbox[1][0] = 0
        if bbox[1][1] < 0: bbox[1][1] = 0
        img_reg = img[int(bbox[0][1]):int(bbox[2][1]), int(bbox[0][0]):int(bbox[2][0])]
        img_reg = improve_resolution(img_reg, super_resolution_model)
        cv2.imwrite('./reg/img_reg.jpg', img_reg)
        text = text_recog(cfg, DEEPTEXT_CONFIG, './reg/img_reg.jpg', DEEPTEXT_MODEL, DEEPTEXT_CONVERTER)
        # text = text_recog (cfg, './reg/img_reg.jpg', DEEPTEXT_MODEL, DEEPTEXT_PREDICTION, DEEPTEXT_CONVERTER)
        LP_reg.append(text)
        # cv2.rectangle(new_img, (int(bbox[0][0]), int(bbox[0][1])), (int(bbox[2][0]), int(bbox[2][1])), (0,255,0), 1)
        # cv2.putText(new_img, str(count), (int(bbox[0][0]), int(bbox[0][1])), cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.5, color=(255,0,0), thickness=1)
        # count += 1
    LP_reg_text = ''.join(LP_reg)
    LP_reg_text = LP_reg_text.upper()
    print (LP_reg)
    cv2.putText(img, str(LP_reg_text), (int(i[0]), int(i[1])), cv2.FONT_HERSHEY_SIMPLEX, fontScale=3, color=(255,255,0), thickness=3)
    return img
    


if __name__ == '__main__':
    source = './data'
    for i in os.listdir(source):
        if (i.endswith('.jpg')):
            print (i)
            img_path = os.path.join(source, i)
            img = cv2.imread(img_path)
            img = LP_regconition(cfg, img, YOLO_NET, img_path)

            cv2.imwrite(os.path.join('result', i), img)
            

