from flask import Flask, jsonify, request
from flask_cors import CORS


application = Flask(__name__)
application.config["JSONIFY_PRETTYPRINT_REGULAR"] = True
CORS(application)


@application.route('/')
def index():
  return "Hello World!\n"


if __name__ == "__main__":
  application.run()
