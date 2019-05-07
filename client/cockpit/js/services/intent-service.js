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
    .service('IntentService', IntentService);
  function IntentService($http) {
    let url_prefix = '/cockpit/v1';
    let url_sulfix_n = '/nlp/';
    let url_sulfix_i = '/intents/';
    let url_sulfix_e = '/examples/';

    var service = {
      list: function(nlp) {
        var url = url_prefix + url_sulfix_n + nlp + url_sulfix_i;
        return $http({ method: 'GET', url: url});
      },
      listEnable: function(nlp, enable) {
        var url = url_prefix + url_sulfix_n + nlp + '/enable/' + enable + url_sulfix_i;
        console.log('url: ', url);
        return $http({ method: 'GET', url: url});
      },
      getById: function(id) {
        var url = url_prefix + url_sulfix_i + id;
        return $http({ method: 'GET', url: url});
      },
      getByName: function(name, nlp) {
        var url = url_prefix + url_sulfix_n + nlp + url_sulfix_i + name;
        return $http({ method: 'GET', url: url});
      },
      create: function(intent, nlp) {
        var url = url_prefix + url_sulfix_n + nlp + url_sulfix_i;
        return $http({ method: 'POST', data:intent, url: url});
      },
      delete: function(id) {
        var url = url_prefix + url_sulfix_i + id;
        return $http({ method: 'DELETE', url: url});
      },
      update: function(id, intent) {
        var url = url_prefix + url_sulfix_i + id;
        return $http({ method: 'PUT', data:intent, url: url});
      },
      listExamples: function(intentId) {
        var url = url_prefix + url_sulfix_e + intentId;
        return $http({ method: 'GET', url: url});
      },
      createExample: function(intentExample, nlp, intentId) {
        var url = url_prefix + url_sulfix_n + nlp + url_sulfix_e;
        var data = intentExample;
        data['intentId'] = intentId;
        return $http({ method: 'POST', data:data, url: url});
      },
      deleteExample: function(id) {
        console.log(id);
        var url = url_prefix + url_sulfix_e + id;
        return $http({ method: 'DELETE', url: url});
      },
      updateExample: function(id, intentExample) {
        var url = url_prefix + url_sulfix_e + id;
        return $http({ method: 'PUT', data:intentExample, url: url});
      },
      checkExample: function(intentExample, nlp) {
        var url = url_prefix + url_sulfix_n + nlp + '/check-examples';
        var data = intentExample;
        return $http({ method: 'POST', data:data, url:url});
      }
    };
    return service;
  }
}());
