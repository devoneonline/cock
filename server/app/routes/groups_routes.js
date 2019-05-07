/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiGroup = require('../api/groupAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {

    app.get('/cockpit/v1/groups',permissions.any('SEARCH_GROUP'), apiGroup.selectAllGroups);
    app.get('/cockpit/v1/groups/:id', apiGroup.selectGroupById);   
    app.post('/cockpit/v1/groups', apiGroup.createGroup);
    app.put('/cockpit/v1/groups/:id', apiGroup.updateGroup);
    app.delete('/cockpit/v1/groups/:id', apiGroup.deleteGroup);

};