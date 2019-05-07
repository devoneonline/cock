/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiPermissionGroup = require('../api/permission_groupAPI');

module.exports = function(app) {

    app.get('/cockpit/v1/permissionsgroup/:id', apiPermissionGroup.selectPermissionGroupByGroupId);
    app.put('/cockpit/v1/permissionsgroup', apiPermissionGroup.updatePermissionGroup);
    
};