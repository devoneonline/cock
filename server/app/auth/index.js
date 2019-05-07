/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var userDAO = require('../DAO/userDAO');
const LocalStrategy   = require('passport-local').Strategy;


module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
	    // done(null, user.email);
      delete user.password;
      done(null, user);
	});

	passport.deserializeUser(function(user, done) {
      // userDAO.selectUserByEmail(email, function (err, user){
      //   if(!err) done(null, user);
      //   else done(err, null)  
      // });
      done(null, user);
	});

    passport.use('local-login', new LocalStrategy({
        // por padrão a Estratégia utiliza username e password. Já nós utilizados email e senha.
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // Nos permitepassar toda a entidade do request para o callback
    },
    function(req, email, senha, done) { 

      

      userDAO.selectUserByEmail(email, function (err, user){
        if (err)
        {
          done(err, user);
        }
        if (!user || !user.validatePassword(senha)){
          return done({ statusCode: 401, message: 'LOGIN-INVALID-CREDENTIALS' } , null );
        }

        return done(null, user);
      });


    }));

};
