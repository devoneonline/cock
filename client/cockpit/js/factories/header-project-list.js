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
    .factory('headerProjectList', headerProjectList);
  
  function headerProjectList() {
    var open = false;
    var methods = {
      get: function() {
        return open
      },
      set: function(value) {
        open = value;
      }
    }
    return methods;
  }

})();