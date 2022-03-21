#!/usr/bin/env python3
from pymongo import MongoClient
import subprocess
import os
import json

CWD = os.path.dirname(os.path.abspath(__file__))
port = list(json.load(open(os.path.join(CWD, "dkm.json"), 'r'))["dev"]["ports"])[0]


def test_main():
  client = MongoClient("mongodb://localhost:" + port + "/", serverSelectionTimeoutMS=1)
  db = client.test_database
  collection = db.test_collection
  collection.insert_one({"input": "Hello"})

  assert collection.count_documents({}) == 1

  client.drop_database("test_database")

if __name__ == "__main__":
  subprocess.run(["pytest", __file__])
