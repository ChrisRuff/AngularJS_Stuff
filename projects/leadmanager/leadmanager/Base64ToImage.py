from PIL import Image
from io import BytesIO
import cv2
import base64
import tensorflow as tf
import numpy as np


myModel = tf.keras.models.load_model("simplenetowrk.h5")


def convert(base64Data):
    base64Data = base64Data[22:]
    im = Image.open(BytesIO(base64.b64decode(base64Data)))
    im.save("./image.png")


def predict(file_dir):
 
    data = cv2.imread(file_dir, cv2.IMREAD_UNCHANGED)
    data = data[:, :, 3]
    resized = cv2.resize(data, dsize=(28, 28))
    test_data = np.asarray(resized)
    cv2.imshow('ImageWindow', test_data)
    cv2.waitKey(0)
    test_data = test_data.reshape((1, 28, 28))   
    # test_data = np.expand_dims(test_data, axis=0)
    # test_data = tf.image.decode_png(reshaped, dtype=tf.dtypes.float32)
    test_data = tf.dtypes.cast(test_data, dtype=tf.float32) 
    for x in test_data:
        print(x)
    predictions = myModel.predict(test_data)
    print(predictions)
    predictions_argmax = np.argmax(predictions, axis=-1)
    return predictions_argmax


convert("data:image/png;base64,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")
print(predict("./image.png"))
