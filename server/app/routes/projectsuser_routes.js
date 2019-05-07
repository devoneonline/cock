/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiProjectUser = require('../api/projectsuserAPI');

module.exports = function(app) {

    app.get('/cockpit/v1/projectsuser', apiProjectUser.selectAllProjectUser);
    app.get('/cockpit/v1/projectsuser/:id', apiProjectUser.selectProjectUserById);
    app.post('/cockpit/v1/projectsuser', apiProjectUser.createProjectUser);
    app.put('/cockpit/v1/projectsuser/:projectIdKey/:userIdKey', apiProjectUser.updateProjectUser);
    app.delete('/cockpit/v1/projectsuser/:projectIdKey/:userIdKey', apiProjectUser.deleteProjectUser);

};

