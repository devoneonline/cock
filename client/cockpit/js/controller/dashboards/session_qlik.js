/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/  

var app = angular.module('qlikCockpitApp',['pascalprecht.translate','720kb.tooltips','ui.bootstrap','dialogs.main']);

///////////////////////////////////////////////
// MODULES OF APP ARE LOAD IN qlik_modules.js//
///////////////////////////////////////////////



//SESSION CONTROlLER
app.controller('sessionQlikCtrl',function($scope, $interval, $translate, dialogs) {

    //Add event to wait export excels
    qlik_addEventClickButtonExport();
    

  

    // $scope.clickToOpen = function () {
    //     dialogs.error('Error','An unknown error occurred preventing the completion of the requested action.')
    //     .result
    //     .then( function(){ 
    //         location.reload();
    //     } );
    // };

    // ------------------- CHANGE VALUE FOR EACH DASHBOARD ---------------------- //

    //ADD TIME DELAY TO APPEAR OPACITY VIEW IN QLIK_FUNCTIONS.js
    qlik_timeLimitAppearScreen = 3000;
    
    //LOAD LOCAL VARIABLE IN QLIK_FUNCTIONS.js
    qlik_parmsFieldControlScreenLoad = parmsFieldControlScreenLoadSession;
    qlik_parmsFieldSelectedLoad = parmsFieldSelectedLoadSession;



    // ----------------------------- NOT CHANGE -------------------------------- //
    
    //LOAD ANGULAR VARIABLE IN QLIK_FUNCTIONS.js
    qlik_scope = $scope;
    qlik_translate = $translate;
    qlik_interval = $interval;
    qlik_dialog = dialogs;

    //CONTROL DISAPPEAR E APPEAR OF OBJECTS 
    $scope.isNotSelectMinFields = true;

    //LOAD FUCNTIONS TO ADMIN
    $scope.isNotAdmin = false;

    //METHODS TO HIDDEN INACTIVE EXPORT BUTTON 
    $scope.opacityInactiveButton = qlik_opacityInactiveButton;
    
    //METHOD EXPORT
    $scope.exportPNG = qlik_exportPNG;
    
    //METHOD OPEN TAB
    $scope.openUserManual = qlik_openUserManual;
    
    //METHODS TOOLTIP
    $scope.htmlTooltipDescription = qlik_htmlTooltipDescription;





    // ------------------------ QLIK EXCLUSIVE METHODS --------------------------- //
    

    //CONECT WITH QLIK SERVER
    $scope.conectQlikServer = qlik_conectQlikServer;


    //GET QLIK VISUALIZATIONS
    $scope.getQlikObject = function(app_qlik){
        // OBS: THE FOLLOWING EXTENSIONS IN QLIK SERVER ARE REQUIRED: 
        // 1 - qsSimpleKPI
        // 2 - DateRangePicker
        // 3 - tableCustomAssistentVivi
    

        //SHEET (SESSION COCKPIT - PART 1)
        app_qlik.getObject('CHART_SESSION_CHANNEL_EVOLUTION','KRvamE');
        app_qlik.getObject('KPI_SESSION_MONTH_PROJECTION','AJXqA');
        app_qlik.getObject('KPI_SESSION_DAILY_AVERAGE','QjTAKE');
        app_qlik.getObject('KPI_SESSION_QUESTION_AVEREGE','QyzQHW');
        app_qlik.getObject('FILTER_SESSION_DATE','AMyus');
        app_qlik.getObject('FILTER_SESSION_CHANNEL_CLASSIFICATION','sVUWytq');

        
        //SHEET (SESSION COCKPIT - PART 2)
        app_qlik.getObject('KPI_SESSION_GERERAL_DATA','JCnPzX');
        app_qlik.getObject('BAR_SESSION_GENERAL_PERCENTAGE','gREmeeP');
        app_qlik.getObject('KPI_SESSION_INFORMATION_GERERAL_DATA','apLpr');
        app_qlik.getObject('BAR_SESSION_INFORMATION_PERCENTAGE','YujXJ');
        app_qlik.getObject('KPI_SESSION_FOUND_GENERAL_DATA','QjApJpx');
        app_qlik.getObject('KPI_SESSION_FOUND_NOT_GENERAL_DATA','HbWCbZX');
        app_qlik.getObject('BAR_SESSION_FOUND_PERCENTAGE','mACHfP');
        app_qlik.getObject('FILTER_SESSION_PROJECT','LDeNhJ');
        app_qlik.getObject('FILTER_SESSION_CHANNEL','ZxvAFC');

        //app_qlik.getObject('FILTER_SESSION_DATE_2','vpdFZV');
        app_qlik.getObject('FILTER_SESSION_DATE_3','ZsrnA');

        //SHEET (SESSION COCKPIT - PART 3)
        app_qlik.getObject('TABLE_SESSION_FAQ_TOP10','TwQYbh');
        app_qlik.getObject('CHART_SESSION_FAQ_RANKING_TOP10','XcPSbu');
        app_qlik.getObject('TABLE_SESSION_USER_WORD_TOP10','RCh');

        
        //SHEET (BUTTON EXPORTS)
        app_qlik.getObject('EXPORT_SESSION_CHANNEL_EVOLUTION','JxPZPY');
        app_qlik.getObject('EXPORT_SESSION_KPI','pdZx');
        app_qlik.getObject('EXPORT_SESSION_FAQ_RANKING_TOP10','nsF');
        app_qlik.getObject('EXPORT_SESSION_USER_WORD_TOP10','vVPxPA');
        app_qlik.getObject('EXPORT_SESSION_FAQ_TOP10','APxGy');
        app_qlik.getObject('EXPORT_SESSION_FULL','EDPhAC');

    }


    //CALL QLIK REQUIRE TO GET ALL OBJECTS
    $scope.callQlikEngineRequire = function() {
        
        require( ["js/qlik","../../js/controller/dashboards/library/external/qBlob.js"], 
        function ( qlik, qBlob ){
            
            qlik.setLanguage(window.parent.qlikLanguageActual);


            //SET OBJECT BLOB TO EXPORT .PNG IN QLIK_FUNCTIONS.js
            qlik_qBlobQlik = qBlob;
            
            
            //CONFIGURE QLIK IF ERROR
            qlik_setErrorConfiguration(qlik);


            //CONECT WITH THE APP INTO QLIK SERVER
            var app_qlik = qlik_conectQVFApp(qlik);
            

            //SET VALUES OUTSITE QLIK
            qlik_environmentVariable(app_qlik);
        

            //GET QLIK VISUALIZATIONS 
            $scope.getQlikObject(app_qlik);
                

            //GET CURRENT BAR OF QLIK FILTERS
            qlik_getCurrentBar(app_qlik, qlik);    


            //CONTROL BUTTONS OF FILTER BAR
            qlik_controlButtonCurrentBar(app_qlik);
            

            //CONTROL LOAD SCREEN
            qlik_controlScreenLoad(app_qlik);


        });

    };
    

    // ------------  BLOCK TO CALL METHODS OF CONTROLLER -------------- //


    //CONECT QLIK AND REQUIRE RESOURCES
    $scope.conectQlikServer();
    $scope.callQlikEngineRequire();


    //FORCE HARDCODE INACTIVE BUTTON CASE NOT EXITS EXPORT IN QLIK
    var listInactive = [
        
    ];
    $scope.opacityInactiveButton(listInactive);


});







