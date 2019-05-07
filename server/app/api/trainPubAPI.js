/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
'use strict'

const trainPubDAO = require('../DAO/trainPubDAO');
const error = require('../error/error');
const uuidv4 = require('uuid/v4')
const axios = require('axios');

const wsServer = require('../../../server');

let api = {};

const CLEVER_BASE_URL = 'http://35.224.10.52:9993/api/';

api.selectOnTraining = (req, res) => {
    let nlpId = req.params['nlpId'];
    trainPubDAO.selectOnTraining(nlpId)
        .then(
            result => {
                return error.responseReturnXHR(res,null,result)

            },
            err => {
                return error.responseReturnXHR(res,err);
            },
        )
}

api.loadTrainings = (req, res) => {
    let nlpId = req.params['nlpId'];
    let page = req.query['page'];
    let isEnable = req.params['isEnable'];

    trainPubDAO.loadTrainings(nlpId, page, isEnable)
        .then(
            result => {
                return error.responseReturnXHR(res, null, result);
            },
            err => {
                return error.responseReturnXHR(res, err);
            }
        )
}

api.getLastTraining = (req, res) => {
    let nlpId = req.params['nlpId'];

    trainPubDAO.getLastTraining(nlpId)
        .then(
            result => {
                return error.responseReturnXHR(res, null, result);
            },
            err => {
                return error.responseReturnXHR(res, err);
            }
        )
}

api.countTrainings = (req, res) => { //count number of trainings
    let nlpId = req.params['nlpId'];
    let isEnable = req.params['isEnable'];

    trainPubDAO.countTrainings(nlpId, isEnable)
        .then(
            result => {
                return error.responseReturnXHR(res, null, result);
            },
            err => {
                return error.responseReturnXHR(res, err);
            }
        )
}

api.listAllTrainings = (req, res) => { //list trainings according to the page 
    let nlpId = req.params['nlpId'];
    let page = req.params['page'];
    let min = (page - 1) * 7;
    let max = (page * 7);

    trainPubDAO.loadTrainings(nlpId)
    .then(
        result => {
            let interval = result.slice(min, max);
                return error.responseReturnXHR(res, null, interval);
            },
            err => {
                return error.responseReturnXHR(res, err);
            }
        )
}

api.listValidTrainings = (req, res) => { //list only valid trainings
    let nlpId = req.params['nlpId'];
    let page = req.params['page'];
    min = (page - 1) * 7;
    max = (page * 7) - 1;

    trainPubDAO.loadValidTrainings(nlpId)
        .then(
            result => {
                let interval = result.slice(min, max);
                return error.responseReturnXHR(res, null, interval);
            },
            err => {
                return error.responseReturnXHR(res, err);
            },
        )
}

api.selectNewIntents = (req, res) =>{
    let nlpId = req.params['nlpId'];
    trainPubDAO.selectNewIntents(nlpId)
        .then(
            result => {
                return error.responseReturnXHR(res,null,result)
            },
            err => {
                return error.responseReturnXHR(res,err);
            },
        )
}

api.startTraining = (req, res) => { //start training
    let nlpId = req.params['nlpId'];
    let projectName = req.params['projectName'];
    let locale = req.params['locale'];
    let version = req.params['version'];
    let uuid = uuidv4();
    trainPubDAO.startTraining(nlpId)
        .then(
            result => { //get infos from db and build Clever's JSON
                
                var arr = {
                    "parameters": {
                        "uuid": uuid,
                        "lang": locale,
                        "name": projectName,
                        "version": version,
                        "use_corpora": "true"
                    },
                    "intents": [],
                }
                var name, intent;
                for(var i = 0; i < result.length; i++) {
                    if(name != result[i].name) {
                        intent = {
                            label:result[i].name,
                            examples:[],
                            previous:["0"]
                        }
                        arr.intents.push(intent);
                    }
                    intent.examples.push(result[i].text);
                    name = result[i].name;
                }
                return arr;
                
            },
            err => {
                return error.responseReturnXHR(res,err);
            }
        ).then( //send JSON to Clever
            result => {
                var data = JSON.stringify(result);
                var headers = {'Content-Type': 'application/json',
                                'Accept-Type': 'application/json'
                            } 
                var url = CLEVER_BASE_URL + 'trainTextModel';
                axios.post(url, data, {headers: headers} )
                    .then( response => {
                        if(response.statusText == 'OK') {
                            trainPubDAO.insertTraining(nlpId, version, uuid)
                                .then(
                                    response => {
                                        trainPubDAO.resetModified(nlpId) //reset modified flags from db
                                            .then(
                                                response => {
                                                    // res.status(200).send('ok');
                                                    error.responseReturnXHR(res,null,{result: result, uuid: uuid});
                                                },
                                                err => console.log(err)
                                            )
                                            .catch(
                                                err => console.log(err)
                                            )
                                    },
                                    err => console.log(err)
                                )
                                .catch(
                                    err => console.log(err)
                                )
                        }
                        })
                    .catch( err => {
                        return error.responseReturnXHR(res,err);
                    });
            },
            err => {
                return error.responseReturnXHR(res,err);
            }
        )
        .catch( err => {
            console.log(err);
        });
}

api.selectPublishedTraining = (req, res) =>{
    let nlpId = req.params['nlpId'];
    trainPubDAO.selectPublishedTraining(nlpId)
        .then(
            result => {
                return error.responseReturnXHR(res,null,result)
            },
            err => {
                return error.responseReturnXHR(res,err);
            },
        )
}

api.publishTraining = (req, res) => {
    let nlpId = req['params'].nlpId;
    let version = req['params'].version;
    let uuid = req['params'].uuid;
    let projectName = req.params['projectName'];
    let locale = req.params['locale'];
    let firstTrain = req.params['firstTrain'];
    
    var json = {
        "parameters" : {
            "model_name" : projectName,
            "model_version" : version,
            "uuid" : uuid,
            "lang": locale,
            "env" : "prod"
        }
    }
    var data = JSON.stringify(json);
    var headers = {'Content-Type': 'application/json',
                    'Accept-Type': 'application/json'
    }
    var url = CLEVER_BASE_URL + 'setModelEnv';
    axios.post(url, data, {headers:headers})
 
    let uuid2 = JSON.stringify(uuid);

    trainPubDAO.updatePublished(nlpId, uuid2, 'prod')
        .then(
            result => {
                if (firstTrain){
  
                    
                    trainPubDAO.updatePublished(nlpId, uuid, 'homolog')
                        .then(
                            result => {
                                error.responseReturnXHR(res, null, result)
                            },
                            err => {
                                error.responseReturnXHR(res, { "status": 400 })
                                console.log('err, ', err);
                            }
                        ).catch(
                            err => console.log('erro: ', err)
                        )
                }
                
            },
            err => {
                return error.responseReturnXHR(res,err);
            }
        )
        .catch( err => {
            console.log(err);
        });
}

api.getTrainingResult = (req, res) => {
    
    var headers = {'Content-Type': 'application/json',
                    'Accept-Type': 'application/json'
                }
    
    const urlGetResult = CLEVER_BASE_URL + 'getResult';
    let uuid = (typeof req == 'string') ? req : req.params['uuid'];
    const uuid2 = JSON.stringify({"uuid":uuid});
    
    return axios.post(urlGetResult, uuid2, {headers : headers}); //return Promise to cockpitWebSocket.js and handle it there
}

api.finishTraining = (req, res) => { //finish on going training
    const nlpId = req.params['nlpId'];
    const uuid = req.params['uuid'];
    const status = req.params['status'];
    const accuracy = req.params['accuracy'];
    const user = req.params['user'];

    trainPubDAO.finishTraining(nlpId, uuid, status, accuracy, user)
        .then(
            response => {
                error.responseReturnXHR(res, null, response);
            },
            err => {
                error.responseReturnXHR(res, err);
            }
        ).catch(
            err => console.log(err)
        )
}

module.exports = api;
