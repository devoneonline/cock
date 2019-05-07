/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiProject = require('../api/projectAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {

    app.get('/cockpit/v1/projects/:id/img', apiProject.selectProjectImage);
    app.get('/cockpit/v1/projects',permissions.any('SEARCH_PROJECT'), apiProject.selectUserProjects);
    app.get('/cockpit/v1/projects/select-by-id/:id',permissions.any('SEARCH_PROJECT'), apiProject.selectProjectById);
    app.get('/cockpit/v1/projects/select-by-userid/:userid',permissions.any('SEARCH_PROJECT'), apiProject.selectProjectsByUserId);
    app.post('/cockpit/v1/projects',permissions.any('CREATE_PROJECT'), apiProject.createProject);
    app.put('/cockpit/v1/projects/:id',permissions.any('ALTER_PROJECT'), apiProject.updateProject);
    app.delete('/cockpit/v1/projects/:id',permissions.any('REMOVE_PROJECT'), apiProject.deleteProject);
};