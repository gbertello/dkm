#!/usr/bin/env python3
import argparse
import os
import subprocess as sp

CWD = os.path.dirname(os.path.abspath(__file__))

parser = argparse.ArgumentParser()
parser.add_argument("-s", "--system", default="dev", help="Specify system")
args = parser.parse_args()
SYSTEM = args.system

IMAGE = os.path.basename(os.path.dirname(CWD)) + "_" + os.path.basename(CWD) + "_" + SYSTEM

db = "test_db"
collections = ["collection"]

for collection in collections:
  filename = os.path.join(CWD, "data", f"{collection}_export")
  target_filename = f"/tmp/{collection}_export"

  sp.run(["docker", "exec", IMAGE, "mongoexport", "--db", db, "--collection", collection, f"--out={target_filename}"])
  sp.run(["docker", "cp", f"{IMAGE}:{target_filename}", filename])
  sp.run(["docker", "exec", IMAGE, "rm", target_filename])
