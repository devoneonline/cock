/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var api = {};

api.any = function(permissions) {
    if(typeof permissions === 'string') {
        permissions = [permissions];
    }
    return function(req, res, next) {
        if (api.anyPresent(req, permissions))
            return next();
        
        res.status(403).jsonp({message:"Usuário não possui permissão"});
    };
};

api.all = function(permissions) {
    if(typeof permissions === 'string') {
        permissions = [permissions];
    }
    return function(req, res, next) {
        if (api.allPresent(req, permissions))
            return next();
        
        res.status(403).jsonp({message:"Usuário não possui permissão"});
    };
};

api.none = function(permissions) {
    if(typeof permissions === 'string') {
        permissions = [permissions];
    }
    return function(req, res, next) {
        if (api.nonePresent(req, permissions))
            return next();
        
        res.status(403).jsonp({message:"Usuário não possui permissão"});
    };
};

api.anyPresent = function(req, permissions) {
    var pms = req.user.permissions;
    var count = 0;

    for(var i=0; i<permissions.length; i++){
        for(var j=0; j<pms.length; j++){
            if (permissions[i] == pms[j].code){
                return true;
            }                   
        }
    }
    return false;
};

api.allPresent = function(req, permissions) {

    for (i in permissions)
        if (!api.anyPresent(req, [permissions[i]]))
            return false;
    return true;
};

api.nonePresent = function(req, permissions) {
    
    for (i in permissions)
        if (api.anyPresent(req, [permissions[i]]))
            return false;
    return true;
};

api.projectParam = function(paramName) {
    if (!paramName)
        paramName = 'projectId';

    return function(req, res, next) {
        if (api.hasProject(req, req.params[paramName])) {
            return next();   
        }
        
        res.status(403).jsonp({message:"Usuário não possui acesso ao projeto selecionado"});
    };
};

api.hasProject = function(req, pid) {
    var pjs = req.user.projects;

    for (proj of pjs){
        if(proj.id == pid){
            return true;
        }
    }
    return false;
};

module.exports = api;