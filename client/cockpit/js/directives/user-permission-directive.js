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
        // .directive('userRole', userRole)
        .directive('userRole', ['userInfo', '$timeout', function(userInfo, $timeout) {
            return {
                restrict: 'A',
                scope: {
                    any: '@',
                    all: '@',
                    none: '@'
                },
                link: function($scope, element, attributes) {
                    var c = userInfo.get();
                    $timeout(function() {
                        if ($scope.any) {
                            var str = $scope.any.replace(/ +/g, "");
                            var arrRoles = str.split(",");
                            if (c.statusAdmin) {
                                console.log('user has statusAdmin');
                                return element.show();
                            } else {
                                for (var i in arrRoles) {
                                    for (var j in c.permissions) {
                                        if (c.permissions[j] == arrRoles[i]) {
                                            return element.show();
                                        }
                                    }
                                }
                            }
                            return element.hide();
                        } else if ($scope.all) {
                            var str = $scope.all.replace(/ +/g, "");
                            var arrRoles = str.split(",");
                            // var c = userInfo.get();
                            if (c.statusAdmin) {
                                console.log('user has statusAdmin');
                                return element.show();
                            } else {
                                for (var i in arrRoles) {
                                    var ok = false;
                                    for (var j in c.permissions) {
                                        if (c.permissions[j] == arrRoles[i]) {
                                            ok = true;
                                        }
                                    }
                                    if (!ok) return element.hide();
                                }
                            }
                            element.show();
                        } else if ($scope.none) {
                            var str = $scope.none.replace(/ +/g, "");
                            var arrRoles = str.split(",");
                            // var c = userInfo.get();
                            if (c.statusAdmin) {
                                console.log('user has statusAdmin');
                                return element.show();
                            } else {
                                for (var i in arrRoles) {
                                    for (var j in c.permissions) {
                                        if (c.permissions[j] == arrRoles[i]) {
                                            return element.hide();
                                        }
                                    }
                                }
                            }
                            return element.show();
                        }
                    }, 1000)
                }
            }
        }])
})()