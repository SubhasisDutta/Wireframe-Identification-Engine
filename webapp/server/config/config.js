var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/wireframe-tagging',
    rootPath: rootPath,
    port: process.env.PORT || 6060,
    imageRepo: '/home/subhasis/data/WIEImageRepo'
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://localhost/wireframe-tagging', //TODO: find the correct string to connect to staging server
    port: process.env.PORT || 6060,  //TODO: Change the Port Number to 80
    imageRepo: '/home/subhasis/data/WIEImageRepo' //TODO: Change this Path
  }
}