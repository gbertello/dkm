#!/usr/bin/env python3
import os
import subprocess as sp

CWD = os.path.dirname(os.path.abspath(__file__))
print(CWD)
for dirname in os.listdir(CWD):
  print(dirname)
  script_name = os.path.join(os.path.join(CWD, dirname), "test.py")
  if os.path.exists(script_name):
    sp.run([script_name])
