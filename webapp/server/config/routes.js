var auth = require('./auth'),
    users = require('../controllers/users'),
    pages = require('../controllers/pages'),
    page = require('../controllers/page'),
    train = require('../controllers/train'),
    buildModel = require('../controllers/buildModel'),
    processWI = require('../controllers/processWI');

module.exports = function (app) {

    app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
    app.post('/api/users', users.createUser);
    app.put('/api/users', users.updateUser);

    app.get('/api/public-pages', pages.getAllPublicPages);
    app.get('/api/page/detail/:id', page.getPageById);
    app.get('/api/page/image/:id', page.getImageById);
    app.get('/api/page/userPages', pages.getUserPages);

    app.post('/api/contribute/upload', auth.requiresApiLogin, train.uploadCropedImage);
    //app.post('/api/train/imageLabel/:id', auth.requiresApiLogin, train.markImageLabel);

    app.get('/api/build/modelList', auth.requiresRole('admin'), buildModel.getModelList);
    app.post('/api/build/rebuildModel', auth.requiresRole('admin'), buildModel.rebuildModel);

    app.post('/api/process/upload', auth.requiresApiLogin, processWI.uploadWireframeImage);
    app.post('/api/process/crop/:id', auth.requiresApiLogin, processWI.uploadWireframeCropedImage);
    app.post('/api/process/identify/:id', auth.requiresApiLogin, processWI.identifyWireframe);
    app.post('/api/process/annotate/:id', auth.requiresApiLogin, processWI.annotateWireframe);
    app.post('/api/process/startWireframeAnalysis/:id', auth.requiresApiLogin, processWI.startIdentification);

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