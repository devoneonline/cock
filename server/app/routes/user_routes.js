/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiChannel = require('../api/userAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {

    app.get('/cockpit/v1/users', permissions.any('SEARCH_USER'), apiChannel.selectAllUsers);
    app.get('/cockpit/v1/users/:id',permissions.any('SEARCH_USER'), apiChannel.selectUserById);
    app.post('/cockpit/v1/users',permissions.any('CREATE_USER'), apiChannel.createUser);
    app.put('/cockpit/v1/users/:id',permissions.any('ALTER_USER'), apiChannel.updateUser);
    app.delete('/cockpit/v1/users/:id', permissions.any('REMOVE_USER'),apiChannel.deleteUser);
    app.post('/cockpit/v1/users/changePassword',apiChannel.changePassword);

};
