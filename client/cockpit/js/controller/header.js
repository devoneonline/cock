/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");

app.controller('headerCtrl', function($scope, ProjectService, project, headerProjectList) {

    $scope.showProjects = false;

    $scope.toggleProject = function (value) {
        if ($scope.projects.length>1) {
            if(value) {
                $scope.showProjects = value;
            } else {
                $scope.showProjects = false;
            }
        }
        headerProjectList.set($scope.showProjects);
    }

	$scope.projectName = function () {
		return project.get() ? project.get().name : '';
    }
    
    $scope.projectsPage = function() {
    	project.clear();
    	$scope.go("home");
    }

    $scope.$on('$locationChangeStart', function(event) {
        ProjectService.load().then(
            function(res){ //SUCCESS
                $scope.projects = res.data;
            }, function (err) {
                messages.error(err.data.message?err.data.message:JSON.stringify(err.data));
            }
        );
    });

});
