/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiConfiguration = require('../api/configurationAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {

    app.get('/cockpit/v1/configurations',permissions.any('SEARCH_CONFIG', 'CREATE_STATUS'), apiConfiguration.selectAllConfigurations);
    app.get('/cockpit/v1/configurations/version', apiConfiguration.selectVersion);
    app.post('/cockpit/v1/configurations',permissions.any('CREATE_CONFIG'), apiConfiguration.createConfiguration);
    app.put('/cockpit/v1/configurations/:configKey',permissions.any('ALTER_CONFIG'), apiConfiguration.updateConfiguration);
    app.delete('/cockpit/v1/configurations/:configKey',permissions.any('REMOVE_CONFIG'), apiConfiguration.deleteConfiguration);

};
