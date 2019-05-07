/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    routes = require('../app/routes'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    error = require('../app/error/error'),
    fs = require('fs');



var passport = require('passport');
var projectDAO = require('../app/DAO/projectDAO');
var permissionGroupDAO = require('../app/DAO/permission_groupDAO');
var permissionDAO = require('../app/DAO/permissionDAO');

var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const LocalStrategy = require('../../server/app/auth/index.js')

const localStrategy = new LocalStrategy(passport);

app.set('view engine', 'ejs');


app.use(session({
    key: 'session_cookie_name',
		secret: 'eVA_cockpit_secret_key',
    saveUninitialized: true,
    resave: false
})); 

app.use(bodyParser.urlencoded({limit: "50mb", extended: false}));
app.use(bodyParser.json({limit: "50mb"}));

app.use(passport.initialize());
app.use(cookieParser());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next) {
    try {
        next();
    } catch (err) {
        error.errorResponse(req, res, err);
    }
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // req.user is available for use here
        return next(); 
        //	res.jsonp("isAuthenticated = true")
    } else {
        res.status(401).jsonp({
            statusCode: 401,
            message: "Necessaria a autenticação"
        })
    }
    // Se for necessario o redirecionamento.
    // res.redirect('/login.html');
}

app.use(function(req, res, next) {
    //Caso necesario testar no postman algum serviço, descomentar a linha abaixo.
    //next();return;

    if (req.path.indexOf("/cockpit") == 0 && !req.isAuthenticated()) {
        if (req.xhr)
            res.status(403).end();
        else
            res.redirect('/');
    } else {
        next();
    }
});

var baseColor;
fs.readFile('./client/cockpit/css/less/default.less', 'utf8', function(err, data){
    if (err)
        throw err;
    
    baseColor = data.replace(/@baseColor:([^;]+?);.*/g, "$1").split('\n')[0];
});

app.use(function(req, res, next) {
    if (!req.url.endsWith('.svg'))
        return next();
    
    fs.readFile('./client/'+req.url, 'utf8', function(err, data) {
        if (err) {
            return res.status(500).end(JSON.stringify(err));
        }

        data = data.replace(/@baseColor/g, baseColor);
        res.setHeader('content-type', 'image/svg+xml');
        res.end(data);
    })
});
app.use(express.static('./client'));
app.use(express.static('./node_modules'));


app.post('/login', function(req, res, next) {
    passport.authenticate('local-login', {session: false}, function(err, user, info) {
        if (err)  {
            return res.status(err.statusCode).end(err.message);
        }
        
        if(user) {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                // @TODO Aqui é o retorno sera necessario verificar os melhores dados e melhor retorno para liberar nesse retorno.
                // Here is mapped the projects and permissions By "user" or "user admin"
                if(!user.statusAdmin) {
                        projectDAO.selectProjectsByUser(user.id, function(err, projects){
                            if (err) { return next(err);}
                            user.projects = projects;
                            permissionGroupDAO.select(user.groupId,function(err, permissions){
                                if (err) { return next(err);}
                                var parr = [];
                                for (i in permissions)
                                    parr[i] = permissions[i].code;
                                user.permissions = parr;
                                res.end(user.ivr ? 'IVR' : 'OK');
                            });
                        });
                } else {
                        projectDAO.selectSimplified(function(err,projects){
                            if (err) { return next(err);}
                            user.projects = projects;

                            permissionDAO.select(function(err,permissions){
                                if (err) { return next(err);}
                                user.permissions= permissions;  
                                res.end(user.ivr ? 'IVR' : 'OK');
                            });
                        });
                    } 
                
            });
        } else res.jsonp(info);
        
    })(req, res, next);
});

function populeteUserPermissions(user) {
    if(!user.statusAdmin) {
        projectDAO.selectProjectsByUser(user.id, function(err, projects){
            if (err) { return next(err);}
            user.projects = projects;
            permissionGroupDAO.select(user.groupId,function(err, permissions){
                if (err) { return next(err);}
                user.permissions = permissions;
                res.end(user.ivr ? 'IVR' : 'OK');
            });
        });
    } else {
        projectDAO.selectSimplified(function(err,projects){
            if (err) { return next(err);}
            user.projects = projects;

            permissionDAO.select(function(err,permissions){
                if (err) { return next(err);}
                user.permissions= permissions;  
                res.end(user.ivr ? 'IVR' : 'OK');
            });
        });
    } 
}


reloadpermissions = function (req, res) {
    let user = req['body'];
    console.log('reloadpermissions');
    populeteUserPermissions(user);
}
app.post('/cockpit/v1/reloadpermissions', reloadpermissions);


app.get('/logout', function (req, res) {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});


app.get('/bemvindo', function (req, res) {
    res.status(200).jsonp({
        message: 'Seja bem vindo ao projeto.'
    });
});


app.get('/protegido', ensureAuthenticated, function(req, res) {
    res.status(200).jsonp({
        message: 'Olá '+req.user.name + ', é aqui dentro que nossa magica acontece.'
    });
});

require('./qlik-ticketing')(app);

routes(app);
module.exports = app;