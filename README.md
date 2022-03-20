# What is dkm?
A user-friendly executable to manage docker deployments in NodeJS

# Usage:
Install dkm as a npm package:

    npm install -g dkm

Create application directory:

    mkdir app
    cd app

Create component directory:

    mkdir comp
    cd comp

Create Dockerfile:

    FROM node:latest

Create file dkm.json with docker configuration:

    {
        "dev": {
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

Run container:

    dkm start dev
