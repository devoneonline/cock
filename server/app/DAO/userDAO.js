/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var sqlUtil = require('../sql-util');
var bcrypt = require('bcrypt-nodejs');

var api = {};

api.mapUser = function(row, mapPassword) {
    var user = {
        'id': row.id,
        'email': row.email,
        'name': row.name,
        'groupId': row.groupId,
        'active': row.active,
        'statusAdmin': row.statusAdmin,
        'removed': row.removed,
        'company': row.company,
        'position': row.position,
        'ivr': row.ivr
    };

    if (mapPassword) {
        user.password = row.password;
        user.validatePassword = function(pwd) {
            var pass = false;
            try {
                pass = bcrypt.compareSync(pwd, this.password);
            }  catch (e){
                // @TODO Logger
                console.log("bcryptError[Não Encriptado]:", e)
            }

            return pass;
        };
    }

    return user;
}

api.selectProjectsByUser = function(userId, callback) {
    var sqlMap = {
        "table": "project_user pu, project p",
        "fields":["p.id, p.name"],
        "where":[
            {"pu.userId":userId},
            "pu.projectId = p.id"
        ]
    };
    sqlUtil.executeQuery(sqlMap, function(err, rows) {
        callback(err, rows);
    });
};

api.mapUsers = function(rows, mapPassword) {
    var arr = [];
    for (i in rows) {
        var row = rows[i];
        arr.push(api.mapUser(row, mapPassword));
    }
    return arr;
}

api.selectUserByEmail = function(email, callback) {
    var sqlMap = {
        table:'cockpit_user',
        where:[
            {'email':email},
            'removed <> 1'
        ]
    };
    sqlUtil.executeQuery(sqlMap, function(err, rows) {
        if (err)
            return callback(err);
        
        if (rows.length == 0)
            return callback(null, null);
        
        var user = api.mapUser(rows[0], true);
        callback(null, user);
    });
};

api.select = function(callback) {
    var sqlMap = {
        "table":"cockpit_user",
        "where":"removed <> 1",
        "order":"name"
    }
    sqlUtil.executeQuery(sqlMap, function(err, rows) {
        if (err)
            return callback(err);
        callback(null, api.mapUsers(rows, false) );
    });
}

api.insert = function(user, callback) {
    var sqlMap = {
        "table": "cockpit_user",
        "fields": {
            "name": user.name,
            "email": user.email,
            "statusAdmin" : user.statusAdmin,
            "groupId": user.groupId,
            "company": user.company,
            "position": user.position,
            'ivr': user.ivr,
            "active": 1,
            "removed": 0,
            "password": bcrypt.hashSync(user.password)
        },
        "type": "insert"
    }
    sqlUtil.executeQuery(sqlMap, function(err) {
        if (err)
            return callback(err);
        
        if (user.projects && user.projects.length) {
            api.selectUserByEmail(user.email, function(err, userInserted) {
                var sql = 'INSERT INTO project_user (projectId, userId) VALUES ';
                var params = [];
                var comma = false;
                for(var i = 0; i < user.projects.length; i++) {
                    sql += (comma?',':'') + '(?,?)';
                    params.push(user.projects[i].id);
                    params.push(userInserted.id);
                    comma = true;
                }
                sqlUtil.executeSQL(sql, params, function(err) {
                    return callback(err);
                });
            });
        } else {
            return callback(err);
        }
    });
}

api.selectUserById = function(id, callback) {
    var sqlMap = {
        "table": "cockpit_user",
        "where": [
            {"id": id},
            "removed <> 1"
        ]
    };
    sqlUtil.executeQuery(sqlMap, function (err, rows) {
        if (err)
            return callback(err);
        
        var user = api.mapUser(rows[0], false);
        api.selectProjectsByUser(user.id, function(err, rows) {
            if (err)
                return callback(err);
            user.projects = rows;
            callback(err, user);
        });
        
    });
}

api.update = function(user, callback) {
    var sqlMapUpdate = {
        'table':'cockpit_user',
        'fields':{
            "name": user.name,
            "email": user.email,
            "statusAdmin" : user.statusAdmin,
            "company": user.company,
            "position": user.position,
            "ivr" : user.ivr,
            "groupId": user.groupId
        },
        'where': {
            'id':user.id
        },
        'type':'update'
    };
    if (user.password)
        sqlMapUpdate.fields.password = bcrypt.hashSync(user.password);

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err)
			return callback(err);
        
        var sqlDelete = {
            "table":"project_user",
            "where":{"userId":user.id},
            "type":"delete"
        };
        sqlUtil.executeQuery(sqlDelete, function (err) {

            if (user.projects && user.projects.length) {
                var sql = 'INSERT INTO project_user (projectId, userId) VALUES ';
                var params = [];
                var comma = false;
                for(var i = 0; i < user.projects.length; i++) {
                    sql += (comma?',':'') + '(?,?)';
                    params.push(user.projects[i].id);
                    params.push(user.id);
                    comma = true;
                }

                sqlUtil.executeSQL(sql, params, function(err) {
                    return callback(err);
                });
            } else {
                return callback(err);
            }

        });
    });
}

api.delete = function(id, callback) {
    var sqlMapDelete = {
        table: "cockpit_user",
        fields:{"removed":1},
        where: {
            'id':id
        },
        type:"update"
    };
    sqlUtil.executeQuery(sqlMapDelete, callback);
}




api.selectUserByPassword = function(user, callback) {
    
    var sqlMap = {
        table:'cockpit_user',
        fields:{
            "password": user.password
        },
        where:{
            'email':user.email
        }
    };

    
    sqlUtil.executeQuery(sqlMap, function (err, rows) {
        
        if (err)
            return callback(err);

        callback(null, user);

    });


};

api.validateToken = function(token,data, callback) {
    console.log(token);
    console.log(data);
    var sqlMap = {
        table:'cockpit_user',
        where:[
            {'resetToken':token},
            'removed <> 1',
            {'createTokenDate >=':data }
        ]
    };
    sqlUtil.executeQuery(sqlMap, function(err, rows) {
        if (err)
            return callback(err);
        
        if (rows.length == 0)
            return callback(null, null);
        
        var user = api.mapUser(rows[0], true);
        callback(null, user);
    });
};  

api.updatePass = function(user, callback) {
    var sqlMapUpdate = {
        'table':'cockpit_user',
        'fields':{
            "password": bcrypt.hashSync(user.password),
        },
        'where': {
            'id':user.id
        },
        'type':'update'
    };

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

api.updateUserByToken = function(body, callback) {
    var sqlMapUpdate = {
        'table':'cockpit_user',
        'fields':{
            "password": bcrypt.hashSync(body.password),
            "resetToken": body.resetToken,
        },
        'where': {
            'resetToken':body.token
        },
        'type':'update'
    };

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

api.updateTokenById = function(user, callback) {
    var sqlMapUpdate = {
        'table':'cockpit_user',
        'fields':{
            "resetToken": user.resetToken,
            "createTokenDate": user.createTokenDate
        },
        'where': {
            'id':user.id
        },
        'type':'update'
    };

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err) {
            return callback(err);
        }
        callback(err, rows);
    });
}

module.exports = api;
