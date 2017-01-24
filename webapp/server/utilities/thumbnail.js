var lwip = require('lwip');

exports.createSquareThumbnail = function(sourceLocation,targetLocation,sourceFileName,size) {
    var sourceImage = sourceLocation + '/' + sourceFileName;
    var targetImage = targetLocation + '/' + size + '_' + sourceFileName;
    lwip.open(sourceImage, function(err, image){
       if(err)  {
           console.log('Image Open error');
       }
       if(image) {
           image.resize(size, size, function(err, image) {
               image.writeFile(targetImage, function(err) {
                   if(err) console.log('Error in writing file :' + targetImage);
               })
           })
       }
    });
};