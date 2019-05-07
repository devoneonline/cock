/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");

app.controller('sample-registerCtrl',function($scope, $http, $location, leftBar, confirmModal, messages, project, loading) {
    
    leftBar.show('sample-register');

    $scope.channels = [];
    $scope.samples = [];
    $scope.sample = {};
    $scope.sampleError = {};

    var baseUri = function () {
        return "/cockpit/v1/samples";
    }
    
    //Validate all masks
    $scope.valideMask = function(){

        $('.dateMask').mask('00-00-0000', {reverse: true});
        $(".dateMask").change(function(){
            $("#value").html($(this).val().replace(/\D/g,''))
        })

        $('.porcentMask').mask('000.00', {reverse: true});
        $(".porcentMask").change(function(){
            $("#value").html($(this).val().replace(/\D/g,''))
        })

        $('.sampleMask').mask('0000000000', {reverse: true});
        $(".sampleMask").change(function(){
            $("#value").html($(this).val().replace(/\D/g,''))
        })
    }

    //Sample Alter Confirm Dialog
    $scope.showDialogAlterSample = function(c) {
        confirmModal.show('SAMPLE-LABEL-ALTER','SAMPLE-LABEL-DESCRIPTION-ALTER','confirm', function() {
            $scope.alterSample(c); 
        });
    }


    //Sample Insert service
    $scope.saveSample = function() {

        $scope.sampleError = {};
        var c = $scope.sample;
        var se = $scope.sampleError;
        var error = false;
        var yearActual = parseInt(new Date().getFullYear());
        var yearLimit = yearActual - 2;
        var validateDate;

        console.log(yearLimit);

        //MASK Validation
        if (c.createDate) {
            validateDate = c.createDate.split('-');
            console.log("tam",validateDate.length);

            if (parseInt(validateDate.length) != 3){
                error = true; 
                se.createDate = 'campo não tem formato de data valido';
            } 
            if (parseInt(validateDate.length) == 3){
                if (parseInt(validateDate[0])>31 || parseInt(validateDate[0])<=0) {
                    error = true;
                    se.createDate = 'campo com valor superior ou inferior 31 dias';
                }
                if (parseInt(validateDate[1])>12 || parseInt(validateDate[1])<=0) {
                    error = true;
                    se.createDate = 'campo com valor superior ou inferior 12 mêses';
                }
                if (parseInt(validateDate[2])>yearActual) {
                    error = true;
                    se.createDate = 'campo com valor superior ao ano atual';
                }
                if (parseInt(validateDate[2])<yearLimit) {
                    error = true;
                    se.createDate = 'campo com valor inferior ao ano '+yearLimit;
                }
            }

        }
        if (isNaN(c.sampleBulk)){
            error = true;
            se.sampleBulk = 'campo deve ser um numero';
        }
        if (isNaN(c.sampleAssertivenessPercentage)){
            error = true;
            se.sampleAssertivenessPercentage = 'campo deve ser um numero';
        }
        if (c.sampleAssertivenessPercentage > 100){
            error = true;
            se.sampleAssertivenessPercentage = 'campo com valor superior a 100';
        }
        if (!c.channelId) {
            error = true;
            se.channelId = 'campo obrigatório';
        }
        if (!c.createDate) {
            error = true;
            se.createDate = 'campo obrigatório';
        }
        if (!c.sampleBulk) {
            error = true;
            se.sampleBulk = 'campo obrigatório';
        }
        if (!c.sampleAssertivenessPercentage) {
            error = true;
            se.sampleAssertivenessPercentage = 'campo obrigatório';
        }
        if ($scope.user.groupId == '3'){
			error = true;
			messages.error("NO-PERMISSION");
		}

        if (error) return;

        $scope.savingSample = true;
        var method = 'POST';
        var uri = baseUri();

        $http({
            "method":method,
            "url":uri,
            "headers":{
                "Content-type":"application/json"
            },
            "data":c
        }).then(
            //SUCCESS
            function(res) {
                messages.success("SAMPLE-ALERT-INSERT-SUCCESS",3000);
                $scope.savingSample = false;
            },
            //ERROR
            function (res) {
                //Show confirm dialog to Alter data.
                $scope.showDialogAlterSample(c);
                $scope.savingSample = false;
            }
        );
    };


    //Sample Alter service
    $scope.alterSample = function(c){

        $scope.savingSample = true;
        var uri = baseUri()+'/channelId/'+c.channelId+'/date/'+c.createDate;
        
        $http({
            "method":'PUT',
            "url":uri,
            "headers":{
                "Content-type":"application/json"
            },
            "data":c
        }).then(
            //SUCCESS
            function(res) {
                messages.success("SAMPLE-ALERT-ALTER-SUCCESS",3000);
                $scope.savingSample = false;
            },
            //ERROR
            function (res) {   
                messages.error(res.data.message ? res.data.message : JSON.stringify(res.data));
                $scope.savingSample = false;
            }
        );

    };


     //Channel Load service to filter
    $scope.loadChannel = function() {
        $http.get('/cockpit/v1/projects/' + project.get().id + '/channels/').then(function(res){
            $scope.channels = res.data;
            loading.hide();
        });
    };


    //Load channels in filter
    $scope.loadChannel();
    $scope.valideMask();


});

