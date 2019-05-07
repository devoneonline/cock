/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiChannelClassification = require('../api/channelClassificationAPI');

module.exports = function(app) {

    app.get('/cockpit/v1/channelClassifications', apiChannelClassification.selectAllChannelClassification);  //select all
    // // app.get('/cockpit/v1/channelClassifications/channelGroup',    apiChannelClassification.selectChannelClassificationByGroup);  //select by channel group
    app.get('/cockpit/v1/channelClassifications/:id', apiChannelClassification.selectChannelClassificationById);
};