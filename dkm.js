const path = require('path');
const { execSync } = require('child_process');
const fs = require("fs");

var argv = require('yargs')
  .scriptName("dkm")
  .command('$0 <action> <system> [clean]', 'Use docker manager', (yargs) => {
    yargs.positional('action', {
            description: 'start/stop',
            type: 'string',
          })
          .positional('system', {
            description: 'dev/prod',
            type: 'string',
          })
          .option('clean', {
            description: 'Force reload when building docker container',
            default: false,
            type: "boolean"
          });
  })
  .version()
  .help()
  .argv

function dkm(process) {
  let action = argv.action;
  if (action == "start")
    start(process);
  else if (action == "stop")
    stop(process);
}

function start() {
  let system = argv.system;
  let clean = argv.clean;
  let image = (path.basename(path.dirname(process.cwd())) + "_" + path.basename(process.cwd()) + "_" + system).toLowerCase();
  let network = system;
  let volumes = {};
  let variables = {};
  let buildArgs = {};
  let ports = {};
  let restart = false;
  let script = "";
  let dockerFile = "Dockerfile";

  if (fs.existsSync("dkm.json")) {
    let config = JSON.parse(fs.readFileSync('dkm.json'));
    if (system in config) {
      if ("components" in config[system]) {
        for (let i in config[system]["components"]) {
          process.chdir(config[system]["components"][i]);
          dkm(process);
          process.chdir("../");
        }
      }
      if ("network" in config[system])
        network = config[system]["network"];
      if ("volumes" in config[system])
        volumes = config[system]["volumes"];
      if ("variables" in config[system])
        variables = config[system]["variables"];
      if ("build-args" in config[system])
        buildArgs = config[system]["build-args"];
      if ("ports" in config[system])
        ports = config[system]["ports"];
      if ("restart" in config[system])
        restart = config[system]["restart"];
      if ("script" in config[system])
        script = config[system]["script"];
      if ("dockerFile" in config[system])
        dockerFile = config[system]["dockerFile"]
    }
  }

  if (!fs.existsSync(dockerFile))
    return

  if (execSync("docker ps -a").toString().search(new RegExp(image)) != -1) {
    console.log("*** Stopping container " + image + "...");
    execSync("docker stop " + image, {stdio: "inherit"});
    execSync("docker rm " + image, {stdio: "inherit"});
    console.log("\n");
  }

  console.log("*** Building container " + image + "...");

  let buildOptions = ""
  if (clean)
    buildOptions = "--no-cache "

  let buildArgOptions = ""
  for (k in buildArgs) {
    let v = buildArgs[k];
    buildArgOptions += "--build-arg " + k + "=" + v + " ";
  }
  execSync("docker build -t " + image + " " + buildArgOptions + " -f " + dockerFile + " " + buildOptions + process.cwd(), {stdio: "inherit"});

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
    if (v == "$ENV") {
      v = eval("process.env." + k)
      if (v === undefined) {
        console.log('Specify environment variable: ' + k)
        process.exit()
      }
    }
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

  if (script != "")
    execSync("./" + script, { stdio: "inherit" });
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

module.exports = dkm;
