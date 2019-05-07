/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

var sqlUtil = require('./sql-util');
var bcrypt = require('bcrypt-nodejs');


 app.post('/usuario/usuario', function(req,res) {

    var sqlMapInsert = {
                table:'user_sys',
        fields:{
            'name':'Ivan',
            'password':'123',
            'active':false,
            'statusAdmin':''
        },
        type:'insert'
    };

    var  sqlMap	 = createSQL(sqlMapInsert);	

	sqlUtil.executeQuery(sqlMap, function(err, rows) {
		if (err)
			return callback(err);
		
		if (rows.length == 0)
			return callback(null, null);
		
		var user = {
			'username': username,
			'password': rows[0].password,
			'validatePassword': function(pwd) {
				return bcrypt.compareSync(pwd, this.password);
			}
		};
		callback(null, user);
	});
		
    });


module.exports.findUser = findUser;