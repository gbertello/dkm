#!/usr/bin/env python3
import os
import subprocess as sp
import json

CWD = os.path.dirname(os.path.abspath(__file__))

for component in json.load(open(os.path.join(CWD, "dkm.json"), 'r'))["components"]:
  print(component)
  script_name = os.path.join(CWD, component, "test.py")
  if os.path.exists(script_name):
    sp.run([script_name])
