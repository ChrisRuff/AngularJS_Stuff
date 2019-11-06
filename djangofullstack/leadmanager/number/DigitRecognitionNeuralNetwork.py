import os
import random
import tensorflow as tf
import numpy as np    #CPP WRAPER TO PARSE MATRIX'S
from PIL import Image #IMAGE VIEWER

data = tf.keras.datasets.mnist.load_data()

train, test = data[0], data[1]

train_examples, train_labels = train[0], train[1]
test_examples, test_labels = test

cnn = tf.keras.Sequential([
    tf.keras.layers.Conv2D(27, (3,3), padding='same', activation='relu', input_shape=(28,28,1)), # (3,3) is kernal size, 27 neurons, padding retains the shape of the shape-- dummy values around edge of image, input shape is 28 by 28 with 1 
    tf.keras.layers.Conv2D(31, (3,3), padding='same', activation='relu'), #larger kernal size for input, smaller for output
    tf.keras.layers.AvgPool2D(pool_size=(2,2)),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(10, activation='softmax')
])

cnn.compile(
    optimizer='adam',                       # Choosing optimizer function
    loss='sparse_categorical_crossentropy', # Loss function is cross entropy -- Better than Mean Loss Square
    metrics=['accuracy']                    # Showing the accuracy of the machine
)

reshape_train = train_examples.reshape((60000, 28, 28, 1))
reshape_train.shape

cnn.fit(reshape_train, train_labels, epochs=10)

cnn.save("NeuralNetwork.h5")
