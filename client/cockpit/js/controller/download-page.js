/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module('cockpitApp');

app.controller('download-pageCtrl', function($scope, $http, project, messages, leftBar, loading, confirmModal){
    
    leftBar.show();
    loading.hide();

    $scope.files = [];

    $scope.getFilesList = function(){
      $http.get('/cockpit/v1/projects/' + project.get().id +  '/session/downloads/').then(function(res){
        console.log(res);
        console.log(res.data);
        for(i in res.data){
          var usedFilters = res.data[i].usedFilters;
          if(usedFilters){
            usedFilters = usedFilters.replace(/_/g, ' ')
            usedFilters = usedFilters.replace(/#/g, '\n\n');
            usedFilters = usedFilters.replace(/,/g, ', ');
            var fileName = res.data[i].fileName.replace(/.xlsx/g, '');
            $scope.files[i] = {
              "fileName": fileName,
              "fileDirectory": res.data[i].fileDirectory,
              "fileSize": res.data[i].fileSize,
              "downloadDate": res.data[i].downloadDate,
              "usedFilters": usedFilters,
              "deleted": 0
            }
            console.log($scope.files);
          } 
        }
        $scope.files = $scope.files.filter(function(n){ return n != undefined });
        console.log($scope.files)
      });
    }

    $scope.deleteFile = function(fileName, file){
      confirmModal.show('DELETE-XLSX-LABEL','DELETE-XLSX-DESCRIPTION','confirm', function(){
        $http.delete('/cockpit/v1/projects/' + project.get().id +  '/session/deleteFile?fileName=' + fileName).then(
          function(res){
            messages.success('Arquivo deletado com sucesso', 3000);
            file.deleted = 1;
          },
          function(err){
            messages.error('Erro ao deletar arquivo', 3000);
          }
        )
      });
    }

    $scope.downloadExcel = function(fileName){
      // $http.get('/cockpit/v1/projects/' + project.get().id +  '/session/downloadExcel?fileName=' + fileName).then(
      //   function(res){
      //     messages.success('Baixando', 3000);
      //   },
      //   function(err){
      //     messages.error('Erro', 3000);
      //   }
      // )
      window.open('/cockpit/v1/projects/' + project.get().id +  '/session/downloadExcel?fileName=' + fileName);
    }

    $scope.getFilesList();
});