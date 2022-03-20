# What is dkm?
A user-friendly executable to manage docker deployments in NodeJS

# Prerequites
Install docker for your platform

    > docker --version
    Docker version X.Y.Z, build ---

# Usage:
Install dkm as a npm package:

    > npm install -g dkm

This docker manager is intended to be used for an application made of several components, each component being a dedicated container. All containers will be interconnected on the same docker network.

Create application directory:

    > mkdir app
    > cd app

Create component directory:

    > mkdir comp
    > cd comp

Create Dockerfile:

    FROM node:latest

Create file dkm.json with docker configuration:

    {
      "dev": {
        "network": "local",
        "volumes": {
          "disk": "/disk"
        },
        "variables": {
          "var1": "123",
          "var2": "456"
        },
        "ports": {
          "8080": "80",
          "8181": "81"
        },
        "restart": true
      }
    }  

Create volume

    > mkdir disk
    > touch disk/hello.txt

Run container:

    > dkm start dev

Check that container runs with all expected parameters:

    > docker ps
    CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS                  PORTS                                        NAMES
    cb4c19aeeb24   app_comp_dev   "docker-entrypoint.s…"   1 second ago   Up Less than a second   0.0.0.0:8080->80/tcp, 0.0.0.0:8181->81/tcp   app_comp_dev

    > docker exec -it app_comp_dev sh
    # echo $var1 
    123
    # echo $var2
    456
    # ls /disk
    hello.txt
    # exit

    > docker network inspect
    [
      {
        "Name": "local",
        "Containers": { 
          "...": {
            "Name": "app_comp_dev",
            "..."
          }
        }
        "..."
      }
    ]

Stop container:

    > dkm stop dev
