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


//QUESTION CONTROLLER
app.controller('questionQlikCtrl',function($scope, $interval, $translate, dialogs) {

    //Add event to wait export excel
    qlik_addEventClickButtonExport();


    // ------------------- CHANGE VALUE FOR EACH DASHBOARD ---------------------- //

    //ADD TIME DELAY TO APPEAR OPACITY VIEW IN QLIK_FUNCTIONS.js
    qlik_timeLimitAppearScreen = 3000;
    
    //LOAD LOCAL VARIABLE IN QLIK_FUNCTIONS.js
    qlik_parmsFieldControlScreenLoad = parmsFieldControlScreenLoadQuestion;
    qlik_parmsFieldSelectedLoad = parmsFieldSelectedLoadQuestion;




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


        //SHEET (QUESTION COCKPIT - PART 1)
        app.getObject('CHART_QUESTION_EVOLUTION','phpML');
        app.getObject('KPI_QUESTION_BULK','fysV');
        //app.getObject('KPI_QUESTION_DAILY_AVEREAGE','pJDXXQq');


        //SHEET (QUESTION COCKPIT - PART 2)
        app.getObject('KPI_QUESTION_STATUS_TOTAL','SWDtJy');
        app.getObject('BAR_QUESTION_STATUS_TOTAL_PERCENTAGE','HQpm');
        app.getObject('KPI_QUESTION_FOUND_STATUS','JmbJR');
        app.getObject('KPI_QUESTION_FOUND_NOT_STATUS','btajWSG');
        app.getObject('KPI_QUESTION_CHIT_CHAT_STATUS','VCykdUx');
        app.getObject('KPI_QUESTION_TRANSACIONAL_STATUS','RYMrmzT');
        app.getObject('BAR_QUESTION_ALL_STATUS','rhszpm');
        app.getObject('KPI_QUESTION_USER_BY_DAILY_AVERAGE','mkcpV');
        app.getObject('FILTER_QUESTION_DATE','nDpAJB');
        app.getObject('FILTER_QUESTION_USER','nXpYmNF');
        app.getObject('FILTER_QUESTION_ANSWER_STATUS','mmEJd');

        app.getObject('FILTER_QUESTION_DATE_2','xeQaS');
        app.getObject('FILTER_QUESTION_DATE_3','HnDZn');

        //SHEET (QUESTION COCKPIT - PART 3)
        app.getObject('TABLE_QUESTIONS_TOP5','zckXU');
        app.getObject('TABLE_QUESTION_SATISFACTION_COMMENT_TOP5','Abnsnr');


        //SHEET (QUESTION COCKPIT - PART 4)
        app.getObject('FILTER_QUESTION_FAQ','JYEkZa');
        app.getObject('CHARTDONUT_QUESTION_SATISFACTION_SURVEY','MBFeC');
        app.getObject('CHARTDONUT_QUESTION_COUNT','kXbrgc');
        //app.getObject('FILTRO_PALAVRA_USER_INPUT','fjyQPX');
        

        //SHEET (QUESTION COCKPIT - PART 5)
        app.getObject('GRAPH_QUESTION_FAQ_FLOW','mmg');
        

        //SHEET (SESSION COCKPIT - PART 1)
        app.getObject('FILTER_QUESTION_CHANNEL_CLASSIFICATION','sVUWytq');


        //SHEET (SESSIONS COCKPIT - PART 2)
        app.getObject('FILTER_QUESTION_PROJECT','LDeNhJ');
        app.getObject('FILTER_QUESTION_CHANNEL','ZxvAFC');
        
        
        //BUTTON EXPORTS
        app.getObject('EXPORT_QUESTION_EVOLUTION','PpRTrg');
        app.getObject('EXPORT_QUESTION_STATUS_TOTAL','RmYHYQF');
        app.getObject('EXPORT_QUESTIONS_TOP5','ELgPj');
        app.getObject('EXPORT_QUESTION_SATISFACTION_COMMENT_TOP5','PGYsnd');
        app.getObject('EXPORT_QUESTION_COUNT','AMBAh');
        app.getObject('EXPORT_QUESTION_SATISFACTION_SURVEY','rEYqvq');
        app.getObject('EXPORT_QUESTION_GRAPH_FLOW_FAQ','GGaasCX');
        //app.getObject('EXPORT_QUESTION_QT_BY_FAQ','gVVdn');

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
    ];
    $scope.opacityInactiveButton(listInactive);

});







