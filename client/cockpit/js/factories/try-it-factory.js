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
        .factory('TryFactory',['$q' , 'project' , 'TryItServices' , '$window', tryFactory]);
    
        function tryFactory($q , project , TryItServices , $window) {
            let methods = {};

            methods.searchChannel = ()=>{
                var defer = $q.defer();
                TryItServices.getChannel(project.get().id).then(
                    (success)=>{
                        defer.resolve(success.data);
                    },(error)=>{
                        defer.reject(error);
                    }
                );
                return defer.promise;
            };

            methods.sendTest = (send)=>{
                var OSName="Unknown";
                if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
                if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
                if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
                if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

                var defer = $q.defer();
                send.locale = project.get().locale;
                send.project = project.get().name;
                send.key = project.get().api_key;
                send.agente = $window.navigator.userAgent;
                send.os = OSName;
                TryItServices.sendMessage(send).then(
                    (success)=>{
                        defer.resolve(success.data);
                    },(error)=>{
                        defer.reject(error);
                    }
                );
                return defer.promise;
            };
            return methods;
        }
})();