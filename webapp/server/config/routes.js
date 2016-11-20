var auth = require('./auth'),
    users = require('../controllers/users'),
    pages = require('../controllers/pages'),
    page = require('../controllers/page'),
    train = require('../controllers/train'),
    buildModel = require('../controllers/buildModel'),
    processWI = require('../controllers/processWI');

module.exports = function (app) {

    app.get('/api/users', auth.requiresApiLogin, users.getUsers);
    app.post('/api/users', users.createUser);
    app.put('/api/users', users.updateUser);

    app.get('/api/publicpages/:pageno/:limit', pages.getAllPublicPages);
    app.get('/api/page/detail/:id', page.getPageById);
    app.get('/api/page/image/:id', page.getImageById);
    app.get('/api/page/userPages/:pageno/:limit', auth.requiresApiLogin, pages.getUserPages);
    app.put('/api/page/removeWireframe/:id', auth.requiresApiLogin, page.removeWireframe);
    app.put('/api/process/createdownloadzip/:id',auth.requiresApiLogin, page.createZip);

    app.post('/api/contribute/upload', auth.requiresApiLogin, train.uploadCropedImage);
    app.get('/api/contribute/userImages/:pageno/:limit',auth.requiresApiLogin, train.getUserModelList);
    app.put('/api/contribute/removeControl/:id', auth.requiresApiLogin, train.deleteControl);
    app.get('/api/modeldownloadlist/:pageno/:limit',auth.requiresApiLogin, train.getModelDownloadList);
    app.put('/api/train/createdownloadzip',auth.requiresApiLogin, train.createZip);

    app.get('/api/build/modelList', auth.requiresRole('admin'), buildModel.getModelList);
    app.post('/api/build/rebuildModel', auth.requiresRole('admin'), buildModel.rebuildModel);

    app.post('/api/process/upload', auth.requiresApiLogin, processWI.uploadWireframeImage);
    app.put('/api/process/updatewireframe/:id', auth.requiresApiLogin, processWI.updatewireframeMetadata);
    app.post('/api/process/uploadcontrol/:id', auth.requiresApiLogin, processWI.uploadcontrol);
    app.put('/api/process/removeControl/:id', auth.requiresApiLogin, processWI.deleteControl);



    app.get('/partials/*', function (req, res) {
        res.render('../../public/app/modules/' + req.params[0]);
    });

    app.post('/login', auth.authenticate);
    // route to test if the user is logged in or not
    app.get('/getCurrentUser', auth.getLoginUser);

    app.post('/logout', function (req, res) {
        req.logout();
        res.end();
    });

    app.all('/api/*', function (req, res) {
        res.send(404);
    });

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
}