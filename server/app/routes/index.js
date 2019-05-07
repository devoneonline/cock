/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var https = require('https');

module.exports = function(app) {

    require('./permissions_routes')(app);
    require('./permissionsgroup_routes')(app);
    require('./groups_routes')(app);
    require('./channels_routes')(app);
    require('./projects_routes')(app);
    require('./user_routes')(app);
    require('./projectsuser_routes')(app);
    require('./channelclassification_routes')(app);
    require('./answerStatus_routes')(app);
    require('./configuration_routes')(app);
    require('./answerdirectory_routes')(app);
    require('./answer_routes')(app);
    require('./session_routes')(app);
    require('./sample_routes')(app);
    require('./ivr_routes')(app);
    require('./user_interaction_routes')(app);
    require('./mail_routes')(app);
    require('./recaptcha_routes')(app);
    require('./login_routes')(app);
    require('./cache_routes')(app);
    require('./intent_routes')(app);
    require('./trainPub-routes')(app);
    require('./try_it_routes')(app);
    require('./entity_routes')(app);

    require('./automatization_routes')(app);

    app.get('/cockpit/v1/user', function(req, res) {
        if (req.user)
            res.status(200).jsonp(req.user);
        else
            res.status(204).end();
    });

};

