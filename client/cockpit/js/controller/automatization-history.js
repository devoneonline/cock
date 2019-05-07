/*
* eVA
* Version: 2.0
* copyright (c) 2018 everis Spain S.A
* Date: 06 February 2019
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Oscar Carantón, Aric Gutierrez.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");

app.controller('automatizationHistoryCtrl', 
[ '$scope', 'AutomatizationHistoryFactory' , '$state',function($scope , AutomatizationHistoryFactory , $state){
    $scope.listHistory = [];
    $scope.loading;
    $scope.pagination = {
        view :false,
        pageactual : 0,
        pageBack : 0,
        pageNext : 0,
        labelSelect : 0,
        labelNext : 0,
        total : 0
    }
    $scope.initPage = ()=>{
        $scope.sendPagination(0);
    }

    $scope.newTest = ()=>{
        $state.go('automatization-execute', { 'id':'' , 'start' : false});
    }

    $scope.runDetail = (id)=>{
        $state.go('automatization-execute', { 'id':id , 'start' : false});
    }

    $scope.runBack = (id , confidence)=>{
        let existTest = !(confidence == undefined);
        $state.go('automatization-execute', { 'id':id , 'start' : true , 'exist' : existTest});
    }

    $scope.sendPagination = (page)=>{
        console.log("page" , page);
        $scope.loading = true;
        AutomatizationHistoryFactory.sendPagination(page).then(
            (result) => {
                $scope.processData(result.data);
            },(error) => {
                console.error(error);
            }
        );
    }

    $scope.processData = (success)=>{
        $scope.loading= false;
        $scope.executeTest = false;
        $scope.listHistory  = success.result;
        //Pagination
        let pageactual = success.pageSelect -1;
        let pageTotals = success.pageTotal;

        $scope.pagination.pageactual = pageactual;
        $scope.pagination.view = (1 < success.pageTotal);
        $scope.pagination.pageBack = (pageactual > 0)? (pageactual-1) : 0;
        $scope.pagination.pageNext = ((pageactual +1) < pageTotals)? (pageactual+1) : (pageTotals - 1);
        $scope.pagination.total = pageTotals;
        $scope.pagination.labelSelect = pageactual + 1 ;
        // $scope.pagination.labelNext = ((pageactual+1) < pageTotals)? (pageactual+2) : pageTotals ;

        if((pageactual+1) < pageTotals){
            $scope.pagination.labelNext = (pageactual+2);
        }else{
            $scope.pagination.labelNext = pageTotals;
            $scope.pagination.labelSelect = pageactual;
        }
    }

    $scope.setChangeAutomatization = (idTest , value)=>{
        console.log(idTest , value);
        var newValue = (value == 0)?1:0;
        AutomatizationHistoryFactory.setUpdateFlag(idTest , newValue).then(
            (result) => {
                console.log(result);
            },(error) => {
                console.error(error);
            }
        );
    }
    //AutoRun
    $scope.initPage();
}]);
