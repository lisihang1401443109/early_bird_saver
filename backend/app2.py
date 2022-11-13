from flask import Flask
from flask import request
from flask import jsonify
import requests
import itertools
from demo_data import school, students
from database import *

app = Flask(__name__)



@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)