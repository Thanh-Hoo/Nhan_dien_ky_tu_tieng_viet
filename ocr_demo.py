import easyocr
import time
from autocorrect import Speller

spell = Speller()
reader = easyocr.Reader(['en'])

# TODO: convert image to txt
def recognition(image, reader):
    result = reader.readtext(image)
    text_result = []
    for det_reg_instance in result:
        bbox = det_reg_instance[0]
        text = det_reg_instance[1]
        text = spell(text)
        text_result.append(text)
    print (text_result)
    return result

def visualize_recognition(recognition_result):
    for det_reg_instance in recognition_result:
        bbox = det_reg_instance[0]
        text = det_reg_instance[1]
        print ("bbox: ", bbox)
        print ("text: ", text)

def write_result_file(txt_output_path, recognition_result):
    with open(txt_output_path, 'w') as output_file:
        for det_reg_instance in recognition_result:
                bbox = det_reg_instance[0]
                text = det_reg_instance[1]
                spell(text)
                output_file.write(text)
    print ("Write done!")

result = recognition('ac.jpg', reader)
print (result)