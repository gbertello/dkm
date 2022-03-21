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

sp.run(["docker", "exec", f"learny_mongo_{SYSTEM}", "mongo", db, "--eval", "db.dropDatabase()"], stdout=open(os.devnull, 'w'))

for collection in collections:
  filename = os.path.join(CWD, "data", SYSTEM, f"{collection}")
  target_filename = f"/tmp/{collection}_import"

  sp.run(["docker", "cp", filename, f"{IMAGE}:{target_filename}"])
  sp.run(["docker", "exec", f"{IMAGE}", "mongoimport", "--db", db, "--collection", collection, "--file", target_filename])
  sp.run(["docker", "exec", f"{IMAGE}", "rm", target_filename])
