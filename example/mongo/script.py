#!/usr/bin/env python3
import subprocess
import sys

status = False
while status == False:
  p = subprocess.run(["docker", "exec", sys.argv[1], "mongo"])
  status = (p.returncode == 0)
