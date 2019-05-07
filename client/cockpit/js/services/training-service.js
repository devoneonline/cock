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
        .service('TrainingService', TrainingService);
    
    function TrainingService($http) {

        var prefix = '/cockpit/v1/train-pub/'

        var service = {
            load: function(nlpId, page, isEnable) {
                var url = prefix + nlpId + '/trainings/' + isEnable + (page ? '?page=' + page : '');
                return $http({ method:'GET', url:url });
            },
            getLastTraining: function(nlpId) {
                var url = prefix + nlpId + '/get-last-training';
                return $http({ method:'GET', url:url });
            },
            count: function(nlpId, isEnable) {
                var url = prefix + nlpId + '/count/' + isEnable;
                return $http({ method:'GET', url:url });
            },
            searchTraining: function(nlpId) {
                var url = prefix + nlpId + '/search-trainings';
                return $http({method: 'GET', url: url});
            },
            onTraining: function(nlpId) {
                var url = prefix + nlpId + '/on-Training';
                return $http({method: 'GET', url: url});
            },
            startTraining: function(nlpId, projectName, locale, version) {
                var url = prefix + nlpId + '/' + projectName + '/' + locale + '/' + version + '/start-training';
                return $http({method: 'POST', url: url});
            },
            publishTraining: function(nlpId, version, uuid, projectName, locale,firstTrain) {
                var url = prefix + nlpId + '/' + version + '/' + uuid + '/' + projectName + '/' + locale +'/'+ firstTrain+ '/publish-training';
                return $http({method: 'POST', url: url});
            },
            finishTraining: function(nlpId, uuid, status, accuracy, user) {
                var url = prefix + nlpId + '/' + uuid + '/' + status + '/' + accuracy + '/' + user + '/finish-training';
                return $http({method: 'PUT', url: url});
            },
            searchPublishedTraining: function(nlpId) {
                var url = prefix + nlpId + '/published-training';
                return $http({method: 'GET', url: url});
            }
        };

        return service;
    }
})();