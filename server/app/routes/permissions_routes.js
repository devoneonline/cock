/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiPermission = require('../api/permissionAPI');

module.exports = function(app) {

    app.get('/cockpit/v1/permissions', apiPermission.selectAllPermissions);
    app.get('/cockpit/v1/permissions/:id', apiPermission.selectPermissionById);

};