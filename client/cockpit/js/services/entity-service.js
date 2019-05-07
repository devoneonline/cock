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
      .service('EntityService', EntityService);
    function EntityService($http) {
      let url_prefix = '/cockpit/v1';
      let url_sulfix_n = '/nlp/';
      let url_sulfix_e = '/entities/';
      let url_sulfix_s = '/simple/';
      let url_sulfix_y = '/synonym/';
  
      var service = {
        list: function(nlp, page) {
          var url = url_prefix + url_sulfix_n + nlp + url_sulfix_e + (page ? '?page=' + page : '');
          return $http({ method: 'GET', url: url});
        },
        countEntities: function(nlp){
          var url = url_prefix + url_sulfix_n + nlp;
          return $http({ method: 'GET', url: url});
        },
        listSystemEntities: function() {
          var url = url_prefix + url_sulfix_e;
          return $http({ method: 'GET', url:url});
        },
        create: function(entity, nlp) {
          var url = url_prefix + url_sulfix_n + nlp + url_sulfix_e;
          return $http({ method: 'POST', data:entity, url: url});
        },
        delete: function(id) {
          var url = url_prefix + url_sulfix_e + id;
          return $http({ method: 'DELETE', url:url});
        },
        getByName: function(name, nlp) {
          var url = url_prefix + url_sulfix_n + nlp + url_sulfix_e + name;
          return $http({method: 'GET', url:url});
        },
        createSimple: function(entitySimple, nlp, entityId) {
          var url = url_prefix + url_sulfix_n + nlp + url_sulfix_s;
          var data = entitySimple;
          data['entityId'] = entityId;
          return $http({method: 'POST', data:data, url:url});
        },
        getSimpleByName: function(name) {
          var url = url_prefix + url_sulfix_s + name;
          console.log("en service");
          return $http({method: 'GET', url: url});
        },
        createSynonym: function(entitySynonym, simpleId) {
          var url = url_prefix + url_sulfix_s + simpleId + url_sulfix_y;
          var data = entitySynonym;
          data['entity_simpleId'] = simpleId;
          return $http({ method: 'POST', data:data, url:url});
        },
        listSimples: function(id) {
          var url = url_prefix + url_sulfix_e + id + url_sulfix_s;
          return $http({ method: 'GET', url:url });
        },
        listSynonyms: function(id, nlp) {
          var url = url_prefix + url_sulfix_n + nlp + url_sulfix_s + id;
          return $http({ method: 'GET', url: url });
        },
        deleteSynonym: function(entitySynonym, simpleId) {
          var url = url_prefix + url_sulfix_s + simpleId + url_sulfix_y + entitySynonym;
          return $http({ method: 'DELETE', url:url });
        },
        updateSimpleName: function(simpleId, entitySimple) {
          var url = url_prefix + url_sulfix_s + simpleId;
          var data = entitySimple;
          return $http({ method: 'PUT', data: data, url:url });
        },
        updateEntityName: function(entityId, entity) {
          var url = url_prefix + url_sulfix_e + entityId;
          var data = entity;
          return $http({ method: 'PUT', data:data, url: url});
        },
        deleteSimple: function(simpleId) {
          var url = url_prefix + url_sulfix_s + simpleId;
          return $http({ method: 'DELETE', url:url });
        },
        updateSystemEntity: function(sentity) {
          var url = url_prefix + url_sulfix_e;
          return $http({ method: 'PUT', data:sentity, url: url});
        }
      };
      return service;
    }
  }());