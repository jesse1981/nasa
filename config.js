var fs = require('fs');
//var _ = require('lodash');

var currentFolder = __dirname + "/";

var env = "dev";
try {
  env = fs.readFileSync(currentFolder + ".env");
} catch (e) {
  env = process.env.ENV;
  if(env === undefined) {
    env = "dev";
    console.error("Config: ERROR: Unable to determine the environment - .env file missing. Starting as '" + env + "'");
  }
}

// we make sure we trim the env string
env = ("" + env).trim();

console.log("Config: Environment: '" + env + "'");

var commonConfig;
var envConfig;
try {
  commonConfig = fs.readFileSync(currentFolder + "conf/config.all.json");
  envConfig = fs.readFileSync(currentFolder + "conf/config."+env+".json");
} catch (e) {
  console.error("Unable to read config file(s): " + e);
  throw e;
}

console.log("Config: Successfully parsed common config file " + commonConfig.length + " bytes");
console.log("Config: Successfully parsed env config file " + envConfig.length + " bytes");

// we export the config for this environment
var parsedCommonConfig;
var parsedEnvConfig;
try {
  parsedEnvConfig = JSON.parse(envConfig);
  parsedCommonConfig = JSON.parse(commonConfig);
} catch (e) {
  console.error("Config: ERROR: Unable to parse config file(s) - " + e.stack);
  throw e;
}

// we add the environment value
parsedEnvConfig.env = env;

// we merge the 2 objects
//module.exports = _.merge(parsedCommonConfig, parsedEnvConfig);
