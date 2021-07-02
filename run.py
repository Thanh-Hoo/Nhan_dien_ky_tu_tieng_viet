from flask import Flask, jsonify, request, json
from flask_cors import CORS
from PIL import Image
import numpy as np
import cv2
import base64
app = Flask(__name__)
CORS(app)

# Take in base64 string and return cv image
def stringToRGB(base64_string):
    imgdata = base64.b64decode(str(base64_string))
    image = Image.open(io.BytesIO(imgdata))
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)

@app.route('/')
def Home():
    return "hello"
    
@app.route('/api/predict/', methods=['POST'])
def predict():
    if request.method == 'POST':
        request_data = json.loads(request.get_data().decode('utf-8'))
        print(request_data)
        image = stringToRGB (request_data['src'])
        result_detect = predict_text(image)
        respone = []
        for instance in result_predict:
            respone.append(instance[1])
        respone = ' '.join(respone)
        print (respone)            
if __name__ == "__main__":
    app.run(host="0.0.0.0", port="3000", debug=True)