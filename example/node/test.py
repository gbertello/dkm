#!/usr/bin/env python3
import requests
import subprocess
import json
import os

CWD = os.path.dirname(os.path.abspath(__file__))
port = list(json.load(open(os.path.join(CWD, "dkm.json"), 'r'))["dev"]["ports"])[0]


def test_main():
  r = requests.get("http://localhost:" + port + "/").text.strip()
  assert r == "Hello World!"

if __name__ == "__main__":
  subprocess.run(["pytest", __file__])
