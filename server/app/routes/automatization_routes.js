/*
* eVA
* Version: 2.0
* copyright (c) 2018 everis Spain S.A
* Date: 06 February 2019
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Oscar Carantón, Aric Gutierrez.
* All rights reserved
*/ 

var automatizationApi = require('../api/automatizationAPI');
var multer  = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: './server/uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({ storage: storage })

module.exports = function(app) {
    app.post('/cockpit/v1/upload/excel/', upload.single('file'), automatizationApi.saveFile);
    app.get('/cockpit/v1/pagination/:service/:id/:page/:filter/', automatizationApi.pagination);
    app.post('/cockpit/v1/execute/test/', automatizationApi.executeTest);
    app.post('/cockpit/v1/execute/duplicate/', automatizationApi.duplicateTest);
    app.get('/cockpit/v1/execute/automatization/', automatizationApi.automatizationTest);
    app.post('/cockpit/v1/view/graphic/', automatizationApi.searchDataGraphicsOnly);
    app.post('/cockpit/v1/update/automatization/', automatizationApi.updateAutomatization);
};
