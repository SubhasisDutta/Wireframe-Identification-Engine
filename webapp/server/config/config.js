var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/wireframe-tagging',
    rootPath: rootPath,
    port: process.env.PORT || 6060
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://localhost/wireframe-tagging', //TODO: find the correct string to connect to staging server
    port: process.env.PORT || 6060
  }
}