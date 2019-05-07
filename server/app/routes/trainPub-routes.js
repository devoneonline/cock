/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
const trainPubAPI = require('../api/trainPubAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {
    app.get('/cockpit/v1/train-pub/:nlpId/trainings/:isEnable', trainPubAPI.loadTrainings);
    app.get('/cockpit/v1/train-pub/:nlpId/get-last-training', trainPubAPI.getLastTraining);
    app.get('/cockpit/v1/train-pub/:nlpId/count/:isEnable', trainPubAPI.countTrainings);
    app.get('/cockpit/v1/train-pub/:nlpId/search-trainings', trainPubAPI.selectNewIntents);
    app.get('/cockpit/v1/train-pub/:nlpId/:page/list', trainPubAPI.listAllTrainings);
    app.get('/cockpit/v1/train-pub/:nlpId/on-Training', trainPubAPI.selectOnTraining);
    app.post('/cockpit/v1/train-pub/:nlpId/:projectName/:locale/:version/start-training', trainPubAPI.startTraining);
    app.post('/cockpit/v1/train-pub/:nlpId/:version/:uuid/:projectName/:locale/:firstTrain/publish-training', trainPubAPI.publishTraining);
    app.put('/cockpit/v1/train-pub/:nlpId/:uuid/:status/:accuracy/:user/finish-training', trainPubAPI.finishTraining);
    app.get('/cockpit/v1/train-pub/:nlpId/published-training', trainPubAPI.selectPublishedTraining);

};