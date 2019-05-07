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


//SATISFACTION CONTROLLER
app.controller('satisfactionQlikCtrl',function($scope, $interval, $translate, dialogs) {
    
    //Add event to wait export excel
    qlik_addEventClickButtonExport();


    
    // ------------------- CHANGE VALUE FOR EACH DASHBOARD ---------------------- //

    //ADD TIME DELAY TO APPEAR OPACITY VIEW IN QLIK_FUNCTIONS.js
    qlik_timeLimitAppearScreen = 3000;
    
    //LOAD LOCAL VARIABLE IN QLIK_FUNCTIONS.js
    qlik_parmsFieldControlScreenLoad = parmsFieldControlScreenLoadSatisfaction;
    qlik_parmsFieldSelectedLoad = parmsFieldSelectedLoadSatisfaction;




    // ----------------------------- NOT CHANGE -------------------------------- //

    //CONTROL DISAPPEAR E APPEAR OF OBJECTS 
    $scope.isNotSelectMinFields = true;
    
    //LOAD FUCNTIONS TO ADMIN
    $scope.isNotAdmin = false;

    //LOAD ANGULAR VARIABLE IN QLIK_FUNCTIONS.js
    qlik_scope = $scope;
    qlik_translate = $translate;
    qlik_interval = $interval;
    qlik_dialog = dialogs;

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
    $scope.getQlikObject = function(app){
        // OBS: THE FOLLOWING EXTENSIONS IN QLIK SERVER ARE REQUIRED: 
        // 1 - qsSimpleKPI
        // 2 - DateRangePicker
        // 3 - tableCustomAssistentVivi
    

        //SHEET (SATISFACTION COCKPIT - PART 1)
        app.getObject('FILTER_SATISFACTION_DATE','wdrpPyA');
        app.getObject('CHART_SATISFACTION_ANSWER_EVOLUTION','MPTBqVd');
        //app.getObject('KPI_SATISFACTION_DAILY_ANSWER_AVEREGE','cRbgBRE');
        app.getObject('KPI_SATISFACTION_ANSWER_BULK','fTtjpw');

        app.getObject('FILTER_SATISFACTION_DATE_2','NEdycw');
        app.getObject('FILTER_SATISFACTION_DATE_3','YWhRJ');

        //SHEET (SATISFACTION COCKPIT - PART 2)
        app.getObject('TABLE_SATISFACTION_COMMENT_TOP10','JcCmbUR');
        app.getObject('KPI_SATISFACTION_RESOLVED_DOUBT','pTwUYE');
        app.getObject('FILTER_SATISFACTION_RESOLVED_DOUBT_STATUS','ePnmpt');
        //app.getObject('CHARTDONUT_SATISFACTION_SURVEY','jbjKxWF');
        app.getObject('CHARTDONUT_SATISFACTION_SURVEY','MBFeC');
        app.getObject('CHARTDONUT_RECOMMENDATION_SURVEY','KseS');
        
        //SHEET (SESSIONS COCKPIT - PART 2)
        app.getObject('FILTER_SATISFACTION_PROJETO','LDeNhJ');
        
        
        //EXPORTS BUTTON
        app.getObject('EXPORT_SATISFACTION_ANSWER_EVOLUTION','RmfyfTc');
        app.getObject('EXPORT_SATISFACTION_COMMENT_TOP10','HQGjPWJ');
        app.getObject('EXPORT_SATISFACTION_SURVEY','aFpTq');
        app.getObject('EXPORT_RECOMMENDATION_SURVEY','qkNvhN');
        app.getObject('EXPORT_KPI_SATISFACTION_RESOLVED_DOUBT','xVKmRYt');
        app.getObject('EXPORT_FULL_DATA','aaJJfuf');
        

    }



    //CALL QLIK REQUIRE TO GET ALL OBJECTS
    $scope.callQlikEngineRequire = function() {
        
        require( ["js/qlik","../../js/controller/dashboards/library/external/qBlob.js"], 
        function ( qlik, qBlob ){
            
            
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
        "EXPORT_KPI_SATISFACTION_RESOLVED_DOUBT"
    ];
    $scope.opacityInactiveButton(listInactive);

});


var app = angular.module('satisfactionQlikCtrl');