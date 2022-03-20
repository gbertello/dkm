# What is ndk?
A user-friendly executable to manage docker deployments in NodeJS

# Usage:
Install ndk as a npm package:

    npm install -g ndk

Create file ndk.json with docker configuration:

    {
        "dev": {
            "network": "toto",
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

Run container:

    ndk start dev
