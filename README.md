# What is dkm?
A user-friendly executable to manage docker deployments in NodeJS

# Prerequites
Install docker for your platform

    > docker --version
    Docker version X.Y.Z, build ---

# Usage
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
        "network": "dev",
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
        }
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
        "Name": "dev",
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

# The restart parameter
Set this parameter to "true" to enable docker restart when container stops. This is especially useful for production environment.

# The dockerFile parameter
This parameter is used to specify a Dockerfile for a specific configuration

# The command parameter
The file dkm.json can contain another argument called "command". This was implemented because some docker images like mongo do not work immediately after contain start. dkm will run an infinite loop with the command "docker exec IMAGE command" and break until this command returns an OK status code.

See example/mongo/dkm.json for an illustration.

# Start and stop application with multiple components
Multiple components can be started and stopped at once with one single command. The application directory should contain a dkm.json file with the following contents:

    {
      "components": [
        "comp1",
        "comp2"
      ]
    }

# Use environment variables
Sometimes, environment variables need to be used in dkm.json files. In this case, use the following syntax:

    "variables": {
      "SECRET": "$ENV"
    }

# Try the example
The example directory contains example of our this program works, with various technologies. Each container can be started with the command:

    > dkm start dev

The application itself can also be run with this command. 
