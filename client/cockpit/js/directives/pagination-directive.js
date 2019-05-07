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
        .directive('ctPaging', [function () {
            return {
                restrict: 'E',
                templateUrl: '/cockpit/html/directives/pagination.html',
                scope:{
                    count:'=',
                    onChangePage:'=',
                    radius:'=',
                    itemsPerPage:'=',
                    isBlocked:'=',
                    currentPage:'='
                },
                link: function($scope, element, attr) {
                    // Number of items per pages
                    $scope.ITEMS_PER_PAGE = $scope.itemsPerPage ? $scope.itemsPerPage : 10;
                    $scope.RADIUS = $scope.radius ? $scope.radius : 2;
                    
                    // page array to show
                    $scope.pages = [];
                    // If there are pages forward
                    $scope.isLast = false;
                    // If there are pages before
                    $scope.isFirst = false;
                
                    $scope.$watch('count', function(newValue) {
                        $scope.calculatePageVector();
                    })

                    $scope.numPages;

                    $scope.calculatePageVector = function() {
                        $scope.numPages = Math.ceil($scope.count/$scope.ITEMS_PER_PAGE);
                        $scope.pages = [];
                
                        var min,max;
                        
                        min = $scope.currentPage - $scope.RADIUS;
                        max = $scope.currentPage + $scope.RADIUS;
                        if (max > $scope.numPages) max = $scope.numPages;
                        if (min < 1) min = 1;
                        
                        $scope.isFirst = $scope.currentPage == 1;
                        $scope.isLast = $scope.currentPage == $scope.numPages;
                
                        for (var i = min; i <= max; i++)
                        $scope.pages.push(i);
                    };
                    
                    $scope.setPage = function(page) {
                        $scope.currentPage = page;
                        $scope.onChangePage(page);
                        $scope.calculatePageVector();
                    };
                    $scope.addPage = function(n) {
                        $scope.setPage($scope.currentPage + n);
                    };
                    
                    $scope.calculatePageVector();
                }
            }
        }]);
})();