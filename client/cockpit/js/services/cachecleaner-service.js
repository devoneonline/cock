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
    .factory('cacheCleanerService', cacheCleanerService);

  function cacheCleanerService($http) {
    var service = {
      clean: function() {
        var url = '/cockpit/v1/cachecleaner';
        $http({ method:'GET', url:url}).then(
          (res) => { //SUCCESS
            console.log('cacheCleanerService: SUCCESS!');
          }, (err) => { //ERROR
            console.log('cacheCleanerService: ERROR.');
            console.log(err);
        });
      },
      cleanProjects: function() {
        var url = '/cockpit/v1/cachecleanerprojects';
        $http({ method:'GET', url:url}).then(
          (res) => { //SUCCESS
            console.log('cacheCleanerServiceProject: SUCCESS!');
          }, (err) => { //ERROR
            console.log('cacheCleanerServiceProject: ERROR.');
            console.log(err);
        });
      }
    }
    return service;
  }
}());
