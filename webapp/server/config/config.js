var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/wireframe-tagging',
    rootPath: rootPath,
    port: process.env.PORT || 6060,
    imageRepo: '/home/subhasis/data/WIEImageRepo',
    tempDirectory: '/home/subhasis/data/WIETemp',
    awsAcessKey: 'XXX',
    awssec: 'XXX',
    awsBucket: 'wie-zip',
    s3Url: 'https://s3-us-west-2.amazonaws.com',
    googleVisionKey : 'XXX',
    ibmBlumixKey : 'XXX'
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://localhost/wireframe-tagging', //TODO: find the correct string to connect to staging server
    port: process.env.PORT || 6060,  //TODO: Change the Port Number to 80
    imageRepo: '/home/subhasis/data/WIEImageRepo', //TODO : Chenge this paths
    tempDirectory: '/home/subhasis/data/WIETemp'
  }
}