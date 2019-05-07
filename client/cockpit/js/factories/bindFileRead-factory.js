/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

(function() {
    'use strict'
    
    angular
      .module('cockpitApp')
      .factory('bindFileRead', bindFileRead);
    
    function bindFileRead() {
      var file = "";
      var methods = {
        get: function() {
          return file
        },
        set: function(value) {
            file = value;
        }
      }
      return methods;
    }
  
  })();