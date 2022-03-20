const path = require('path');
const { execSync } = require('child_process');
const fs = require("fs")

function ndk(process) {
  let action = process.argv[2];
  if (action == "start")
    start(process);
  else if (action == "stop")
    stop(process);
}

function start() {
  let system = process.argv[3];
  let image = (path.basename(path.dirname(process.cwd())) + "_" + path.basename(process.cwd()) + "_" + system).toLowerCase();

  let network = system;
  let volumes = {};
  let variables = {};
  let ports = {};
  let restart = false;
  
  if (fs.existsSync("ndk.json")) {
    let config = JSON.parse(fs.readFileSync('ndk.json'));
    if (system in config) {
      if ("network" in config[system])
        network = config[system]["network"];
      if ("volumes" in config[system])
        volumes = config[system]["volumes"];
      if ("variables" in config[system])
        variables = config[system]["variables"];
      if ("ports" in config[system])
        ports = config[system]["ports"];
      if ("restart" in config[system])
        restart = config[system]["restart"];
    }
  }

  if (execSync("docker ps").toString().search(new RegExp(image)) != -1) {
    console.log("*** Stopping container " + image + "...");
    execSync("docker stop " + image, {stdio: "inherit"});
    execSync("docker rm " + image, {stdio: "inherit"});
    console.log("\n");
  }

  console.log("*** Building container " + image + "...");
  execSync("docker build -t " + image + " " + process.cwd(), {stdio: "inherit"});
  
  if (execSync("docker network ls").toString().search(new RegExp(network)) == -1) {
    console.log("*** Creating network " + network + "...");
    execSync("docker network create --driver bridge " + network, {stdio: "inherit"});
    console.log("\n");
  }

  let options = "";

  if (restart)
    options += "--restart always ";

  for (let k in variables) {
    let v = variables[k];
    options += "-e " + k + "=" + v + " ";
  }

  for (let k in ports) {
    let v = ports[k];
    options += "-p " + k + ":" + v + " ";
  }

  for (let k in volumes) {
    let v = volumes[k];
    if (!fs.existsSync(k))
      fs.mkdirSync(k, { recursive: true });
    options += "-v " + process.cwd() + "/" + k + ":" + v + " ";
  }

  options = options.trim();

  console.log("*** Starting container " + image + "...");
  execSync("docker run -dit --name " + image + " --network " + network + " -e IMAGE=" + image + " -e SYSTEM=" + system + " " + options + " " + image, {stdio: "inherit"});
  execSync("docker ps", { stdio: "inherit" });
}

function stop(process) {
  let system = process.argv[3];
  let image = (path.basename(path.dirname(process.cwd())) + "_" + path.basename(process.cwd()) + "_" + system).toLowerCase();
  
  if (execSync("docker ps").toString().search(new RegExp(image)) != -1) {
    console.log("*** Stopping container " + image + "...");
    execSync("docker stop " + image, {stdio: "inherit"});
    execSync("docker rm " + image, {stdio: "inherit"});
    console.log("\n");
  }
}

module.exports = ndk;