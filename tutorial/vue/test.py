#!/usr/bin/env python3
import requests
import subprocess


def test_main():
  r = requests.get("http://localhost:5003/").text.strip()
  assert r.startswith("<!DOCTYPE html>")

if __name__ == "__main__":
  subprocess.run(["pytest", __file__])
