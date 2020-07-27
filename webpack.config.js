var path = require('path');
var APP_DIR = path.resolve(__dirname, './src');
var BUILD_DIR = path.resolve(__dirname, './dist');
const configDirs = {
  APP_DIR: APP_DIR,
  BUILD_DIR: BUILD_DIR
}
function buildConfig(env) {
  if (env === 'dev' || env === 'prod') {
    return require('./config/webpack/webpack.' + env + '.config.js')(configDirs, env.API_URL);
  } else {
    return require('./config/webpack/webpack.dev.config.js')(configDirs, env.API_URL);
  }
};

module.exports = buildConfig;
