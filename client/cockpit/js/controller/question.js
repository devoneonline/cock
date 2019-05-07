/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");


app.controller('questionCtrl',function($scope, $interval, loading, leftBar, qlikIframe) {
    
    leftBar.show();
    loading.hide();


    //LOAD IFRAME WHEN QLIK IS FINISH, (HTML,TIME OF DELAY TO LOAD) 
    qlikIframe.loadScreenFrame(document,'iframeReportQuestion', 8000);


});








