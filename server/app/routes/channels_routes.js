/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiChannel = require('../api/channelAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {

    app.get('/cockpit/v1/projects/:projectId/channels',permissions.any('SEARCH_CHANNEL'), permissions.projectParam(), apiChannel.selectAllChannels);
    app.get('/cockpit/v1/projects/:projectId/channels/:id',permissions.any('SEARCH_CHANNEL'), permissions.projectParam(), apiChannel.selectChannelById);
    app.post('/cockpit/v1/projects/:projectId/channels',permissions.any('CREATE_CHANNEL'), permissions.projectParam(), apiChannel.createChannel);
    app.put('/cockpit/v1/projects/:projectId/channels/:id',permissions.any('ALTER_CHANNEL'), permissions.projectParam(), apiChannel.updateChannel);
    app.delete('/cockpit/v1/projects/:projectId/channels/:id',permissions.any('REMOVE_CHANNEL'), permissions.projectParam(), apiChannel.deleteChannel);

};
