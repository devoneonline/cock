/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

(function() {
  'use strict';

  angular.module('projectsList',[])
    .directive('projectsList', projectsListDirective);

  projectsListDirective.$inject = [];

  function projectsListDirectiveCtrl($scope, project, $state, userInfo) {

    var nlps = [
      {'id':'1',	'name':'Clever',	'img':'clever_mini.png',	'selected':0},
      {'id':'2',	'name':'Luis',		'img':'luis_mini.png',		'selected':0},
      {'id':'3',	'name':'Watson', 	'img':'watson_mini.png',	'selected':0},
      {'id':'4',	'name':'DialogFlow', 	'img':'dialogflow_mini.png',	'selected':0},
      {'id':'5',	'name':'Microsoft - QnA', 	 'img':'qnamaker.png',	'selected':0}
    ];

    $scope.getNlpName = function (nlp, param) { // 1(clever), 2(luis), 3(watson), 4(DialogFlow) ou 5(QnA)
      for (var nlpItem of nlps) {
        if (nlpItem.id === nlp) {
          return nlpItem[param];
        }
      }
    }

    $scope.select = function (proj) {
      project.set(proj);
      var userGroup = userInfo.get().groupId;
      var userAdmin = userInfo.get().statusAdmin;

      switch(userGroup) {
        case 2:
          $state.go('answer');
          break;
        case 3:
          $state.go('session-table');
          break;
        case 4:
          $state.go('type-of-channels');
          break;
        default:
          if(userAdmin) {
            $state.go('answer');
          }
      }
    }

    function resizeProjects(n) {
      var prSize = 272;
      var pl = $('#project-wrap');
      // var sw = window.innerWidth-23;
      var sw = 1343;
      var num = typeof(n)=='number'?n:pl.children().length;
      var wid = num * prSize;
      if (wid > sw)
        wid = parseInt(sw / prSize) * prSize;
      pl.css('width', wid+'px');
    }

    $scope.itemsPerPage = 8;
    $scope.currentPage = 1;

    $scope.pageChanged = function () {
      recalculteVisible($scope.projects, $scope.currentPage);
    }

    function recalculteVisible(allProjects, currentPage) {
      if ($scope.pagination && allProjects && (allProjects.length >= $scope.itemsPerPage)) {
        var into = currentPage*$scope.itemsPerPage;
        var from = into - $scope.itemsPerPage;
        $scope.visibleProj = allProjects.filter( function(elem, i, array) {
          return array.indexOf(elem)>=from && array.indexOf(elem)<into;
        });
      } else {
        $scope.visibleProj = allProjects;
      }
      if($scope.pagination && $scope.visibleProj) {
        var add = $scope.createnew? 1:0;
        resizeProjects($scope.visibleProj['length']+add);
      }
    }
    recalculteVisible($scope.projects, $scope.currentPage);

    $scope.$watch('projects', function(newValue, oldValue) {
      recalculteVisible(newValue, $scope.currentPage);
    });

  }

  function projectsListDirectiveLink(scope) {
  }

	function projectsListDirective() {
    return {
      restrict: 'E',
      link: projectsListDirectiveLink,
      controller: projectsListDirectiveCtrl,
			scope: {
        projects:'=',
        editable:'=',
        createnew:'=',
        pagination:"=",
        onCreate:'=',
        onOpen:'=',
        onEdit:'=',
        onRemove:'='
      },
      templateUrl: '/cockpit/html/directives/projects-list.html',
      replace: true,
    }
  }

})();