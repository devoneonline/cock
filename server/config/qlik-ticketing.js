/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var RESTURI = "https://qlik-everis.everisva.com:4243/qps/";
var fs = require('fs');
var url = require('url');
var https = require('https');

module.exports = function(app) {
    console.log('QLIK TICKETING MODULE LOADING');
    //Create endpoint for logout
    app.get('/qlik-logout', function (req, res) {
        deletesession(req,res);
    });

    //Create endpoint for login
    app.get('/qlik-login', function (req, res) {
         console.log('usuarioQlik',usuarioQlik);

        var usuarioQlik = '';
        

        usuarioQlik = 'user04';
        console.log('#### usuario comum',usuarioQlik);


        createsession(req, res, 'user04','QLIKSENSE');
    });

    //Create endpoint for user information
    app.get('/qlik-info', function (req, res) {
        info(req, res);
    });

    //Generates a random number that we use as the session token
    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };


    // Uses the session API to request information about the current user
    function info(req, res) {
        //Configure parameters for the user information request
        var options = {
            host: url.parse(RESTURI).hostname,
            port: url.parse(RESTURI).port,
            path: url.parse(RESTURI).path + '/session/' + req.cookies['X-Qlik-Session'] + '?xrfkey=aaaaaaaaaaaaaaaa',
            method: 'GET',
            pfx: fs.readFileSync('Client.pfx'),
            passphrase: 'vivi',
            headers: { 'x-qlik-xrfkey': 'aaaaaaaaaaaaaaaa', 'Content-Type': 'application/json' },
            rejectUnauthorized: false,
            agent: false
        };

        console.log("Path:", options.path.toString());
        //Send request to get information about the user
        var sessionreq = https.request(options, function (sessionres) {
            console.log("statusCode: ", sessionres.statusCode);
        
            sessionres.on('data', function (d) {
                if(d.toString()!="null" && req.cookies['X-Qlik-Session'] !== undefined ) {
                    var session = JSON.parse(d.toString());

                    console.log(session.UserId + " is using session " + session.SessionId);
                    var restext = "<HTML><HEAD></HEAD><BODY>" + session.UserId + " is using session " + session.SessionId + "<BR>"+
                        "<a href=' / '>Back to start page</a>"+
                        "<br/><br/><a href='https://104.197.164.100/hub/?QlikTicket="+session.UserId+"'>To Qlik!!!</a></BODY><HTML>";

                    res.send(restext);
                } else {
                    res.send("<HTML><HEAD></HEAD><BODY>No active user<BR><a href=' / '>Back to start page</a></BODY><HTML>");
                }
            });

        });

        //Send request 
        sessionreq.end();

        sessionreq.on('error', function (e) {
            console.error('Error' + e);
        });
    };

    // Uses the session API to logout the current user
    function deletesession(req, res) {
        //Configure parameters for the logout request
        var options = {
            host: url.parse(RESTURI).hostname,
            port: url.parse(RESTURI).port,
            path: url.parse(RESTURI).path+'/session/'+req.cookies['X-Qlik-Session']+'?xrfkey=aaaaaaaaaaaaaaaa',
            method: 'DELETE',
            pfx: fs.readFileSync('Client.pfx'),
            passphrase: 'vivi',
            headers: { 'x-qlik-xrfkey': 'aaaaaaaaaaaaaaaa', 'Content-Type': 'application/json' },
            rejectUnauthorized: false,
            agent: false
        };

        console.log("Path:", options.path.toString());
        //Send request to get logged out
        var sessionreq = https.request(options, function (sessionres) {
            console.log("statusCode: ", sessionres.statusCode);
        
            sessionres.on('data', function (d) {
                var session = JSON.parse(d.toString());

                console.log(session.Session.UserId + " is logged out from session " + session.Session.SessionId);
                res.clearCookie('X-Qlik-Session');
                res.send("<HTML><HEAD></HEAD><BODY>" + session.Session.UserId + " is logged out " + session.Session.SessionId + "<BR><a href=' / '>Back to start page</a></BODY><HTML>");
            });
            
        });

        //Send request to logout
        sessionreq.end();

        sessionreq.on('error', function (e) {
            console.error('Error' + e);
        });
    };

    // Uses the session API to create a session for the user.
    function createsession(req, res, selecteduser, userdirectory) {
        
        //Configure parameters for the ticket request
        var options = {
            host: url.parse(RESTURI).hostname,
            port: url.parse(RESTURI).port,
            path: url.parse(RESTURI).path + '/ticket?xrfkey=aaaaaaaaaaaaaaaa',
            method: 'POST',
            headers: { 'X-qlik-xrfkey': 'aaaaaaaaaaaaaaaa', 'Content-Type': 'application/json' },
            pfx: fs.readFileSync('client.pfx'),
            passphrase: 'vivi',
            rejectUnauthorized: false,
            agent: false
        };

        //Send request to create session
        var sessionreq = https.request(options, function (sessionres) {
            console.log("statusCode: ", sessionres.statusCode);

            sessionres.on('data', function (d) {
                //Parse response
                var ticket = JSON.parse(d.toString());
                
                // res.set('Content-Type', 'text/html');
                // res.cookie('X-Qlik-Session', session.SessionId, { expires: 0, httpOnly: true });
                // var restext = "<HTML><HEAD></HEAD><BODY>" + session.UserId + " is using session " + session.SessionId + "<BR>"+
                //         "<a href=' / '>Back to start page</a>"+
                //         "<br/><br/><a href='https://104.197.164.100/hub/?targetId="+session.SessionId+"'>To Qlik!!!</a></BODY><HTML>";

                // res.send(restext);

                console.log(ticket);
                res.redirect(req.query['targetUri']+'?QlikTicket='+ticket.Ticket);
                
            });
        });

        //Send JSON request for session
        
	    var jsonrequest = JSON.stringify({ 'UserDirectory': userdirectory.toString() , 'UserId': selecteduser.toString(), "SessionId": generateUUID() });
        
        sessionreq.write(jsonrequest);
        sessionreq.end();

        sessionreq.on('error', function (e) {
            console.error('Error' + e);
        });
    };

    // //Server options to run an HTTPS server
    // var httpsoptions = {
    //     pfx: fs.readFileSync('./server.pfx'),
    //     passphrase: 'vivi'
    // };

    // //Start listener
    // var server = https.createServer(httpsoptions, app);
    // server.listen(app.get('port'), function()
    //     {
    //         console.log('Express server listening on port ' + app.get('port'));
    //     });
};
