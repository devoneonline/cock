/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/  
    
    
    // ----------------------------------- VARS ----------------------------------- //

    //LIBRARY TO TRANSFORM DIV IN .PNG
    var qlikModule;
    var qlik_qBlobQlik;
    var qlik_translate;
    var qlik_interval;
    var qlik_scope;
    var qlik_timeLimitAppearScreen;
    var qlik_dialog;

    //GET FIELD AND YOUR VALUES THAT WAS FILTERED TO CONTROL THE OPACITY VIEW
    var filtersFieldsDict = [];


    //QLIK OBJECT TO GET SELECTION START
    var genericObjectLoadScreen;


    //QLIK OBJECT TO GET FILTER PARMS
    var selectionsBar;
    var mySelectedFields;
    var mySelectedFieldsLength;
    var mySelectedBackCount;
    var mySelectedForwardCount;

    
    //PARMS TO CONTROL DASHBOARDS
    var qlik_parmsFieldControlScreenLoad;
    var qlik_parmsFieldSelectedLoad;



    // ------------------------------ OTHERS METHODS ------------------------------- //


    //EXPORT .PNG USING BLOB, chartNameExport PARM IS OPCIONAL
    function qlik_exportPNG(chartId,chartNameExport) {
        chartNameExport = chartNameExport == undefined ? chartId: chartNameExport;
        qlik_qBlobQlik.saveToFile(chartId,chartNameExport+'.png');

        qlik_opacityScreen();
        qlik_interval(qlik_appearScreen, 3500, 1);
    }


    //LISTEN IF USER CHOOSE OTHER LANGUAGE IN COCKPIT
    window.parent.listenChooseLanguage = function(){
        
        //TRY-CATCH TO TREAT THE ERROR IF window.parent.qlikLanguageActual IS NULL.
        try {
            var languageName = window.parent.qlikLanguageActual;
            qlik_translate.use(languageName);
    
            //refresh to avoid problem with atualization
            qlik_translate.refresh();   
            
            //Change language in Qlik
            qlikModule.setLanguage(languageName);
        }
        catch(err) {}
    }


    //OPEN LINK WITH USER MANUAL
    function qlik_openUserManual(URL){
        window.open(qlik_translate.instant(URL), '_blank');
    }




    function qlik_addEventClickButtonExport(){

        //Get all buttons of export excel
        var classnameExportExcel = document.querySelectorAll(".qlik-export-button, .qlik-export-button-unique");
        
    
        //Add event of Click to buttons of export excel
        for (var i = 0; i < classnameExportExcel.length; i++) {
            let nameId = String(classnameExportExcel[i].id);
            //console.log("element",nameId,classnameExportExcel[i]);
            classnameExportExcel[i].addEventListener('click', function() { callActionExportButton(nameId); }, false);
        }

        var classnameExportPDF = document.getElementsByClassName("qlik-export-pdf-button");
        classnameExportPDF[0].addEventListener('click', function() { qlik_opacityScreen();qlik_interval(qlik_appearScreen, 3500, 1); }, false);

    }
    
    function checkIfExportFinished(){
        console.log("window.teste",window.exportDadosQlik);

        if (window.exportDadosQlik == 1){
            console.log("carregou");
            qlik_appearScreen();
            //$("#generalMessages").remove();
            return;
        }

        console.log("carregando...");
        qlik_interval(checkIfExportFinished, 1000, 1);
    }
    
    function callActionExportButton(nameId) {
        //Set as 0 and wait exeport turn on 1
        window.exportDadosQlik = 0;
        console.log("EXPORT ACIONADO",nameId);
        
        //Check if value is 1, while the screen is opacity
        qlik_interval(checkIfExportFinished, 1000, 1);
        qlik_opacityScreen();
    };

    // ------------------- SCREEN EFECT TRANSACTION METHODS ---------------------- //

    //OPACITY FULL SCRREN
    function qlik_opacityScreen(){
        document.getElementById("content").style.opacity = "0.2";
        document.getElementById("content").style.pointerEvents = "none";
    }

    //REMOVE OPACITY FULL SCRREN
    function qlik_appearScreen(){
        document.getElementById("content").style.opacity = "1";
        document.getElementById("content").style.pointerEvents = "auto";
    }

    // -------------------------------- TOOLTIP ------------------------------------ //

    //REUTILIZABLE HTML FORMAT
    function qlik_htmlTooltipDescription(description,URL){
        var htmlBody = "<b>"+qlik_translate.instant('SESSION-TOOLTIP-LABEL-DESCRIPTION')        //LABEL DESCRIPTION
        +"</b><br/><br/>"+qlik_translate.instant(description)+"<br/><br/><br/>"                 //DESCRIPTION
        +"<b><font color='64a1d7'><a href="+qlik_translate.instant(URL)+" target='_blank'>"     //DOC LINK
        +qlik_translate.instant('SESSION-TOOLTIP-LABEL-ABOUT-MORE')+"</font></b>";              //LABEL ABOUT MORE
        return htmlBody;
    }
        
    // --------------------- OBJECTS CONTROL SHOW/HIDDEN ------------------------ //

    //FORCE HARDCODE INACTIVE BUTTON CASE NOT EXITS EXPORT IN QLIK
    function qlik_opacityInactiveButton(listInactive){
        
        for(let i=0; i<listInactive.length; i++) {
            document.getElementById(listInactive[i]).style.pointerEvents = "none";
            document.getElementById(listInactive[i]).style.opacity = "0.2";
        }

    }

    //CONTROL DISAPPEAR OF ALL OBJECT
    function qlik_dissapearObject(){
        
        //alter directive to hidden visualization
        qlik_scope.isNotSelectMinFields = true;
    }

    //CONTROL APPEAR OF ALL OBJECT
    function qlik_appearObject(){

        //alter directive to show visualization
        qlik_scope.isNotSelectMinFields = false;
    }

    // ----------------------- OBJECTS APPEAR/HIDDEN METHODS --------------------------- //

    //RETURN IF USER SELECT THE EXISTS SPECIFIC FIELD AND YOUR COUNT VALUE
    function qlik_existFieldValue(validateFieldName) {
        for (let key in filtersFieldsDict) {
            if (filtersFieldsDict.hasOwnProperty(key)) {
                var arrayFieldName = filtersFieldsDict[key].field;
                var arrayFieldCount = filtersFieldsDict[key].count;
                if (arrayFieldName == validateFieldName) {return [true,arrayFieldCount];}
            }
        }
        return [false,null];
    }

    //DO CALL TO GET FIELD LIMIT TO APPEAR CHART (ACCORDING PARMS IN qlik_server_parms.js)
    function qlik_defineFilterFieldLimit (){
        for (key in qlik_parmsFieldControlScreenLoad) {
            if (qlik_parmsFieldControlScreenLoad.hasOwnProperty(key)) {
                var arrayFieldName = qlik_parmsFieldControlScreenLoad[key].nameField;
                var arrayFieldCount = qlik_parmsFieldControlScreenLoad[key].valueLimit;
                qlik_controlAppearObjects(arrayFieldName,arrayFieldCount);
            }
        }
    }

    //DO CONTROL IF BUTTON MUST APPEAR OR DISAPPEAR OF ACCORDING WITH THE PARMS
    function qlik_controlAppearObjects (validateFieldName,validateCountField) {
        
        //return if exist field[0] and actualy value[1]
        var existFieldValue = qlik_existFieldValue(validateFieldName);
        
        if (existFieldValue[0]) {
            if (existFieldValue[1] <= validateCountField){
                qlik_appearObject();
            }else {
                qlik_dissapearObject();
            }
        }else {
            qlik_dissapearObject();
        }
    }


    function qlik_ShowFiltersButton(){
        //SHOW FILTERS BUTTONS CASE CONDICION IS TRUE
        $("[data-qcmd='back']").parent().toggleClass( 'enable-btn-filter', mySelectedBackCount > 3 );
        $("[data-qcmd='forward']").parent().toggleClass( 'enable-btn-filter',mySelectedForwardCount >= 1);    
        $("[data-qcmd='clearAll']").parent().toggleClass( 'enable-btn-filter', mySelectedFieldsLength > 1 );  

    }

    // ------------------------ QLIK EXCLUSIVE METHODS --------------------------- //

    //CONECT WITH QLIK SERVER
    var qlik_conectQlikServer = function() {
        config = {
            host: parmsQlikServer.host,
            prefix: parmsQlikServer.prefix,
            port: parmsQlikServer.port,
            isSecure: parmsQlikServer.isSecure
        };

        //to avoid errors in workbench: you can remove this when you have added an app
        require.config({
            baseUrl: (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + config.prefix + "resources"
            
        });

    };

    //CONFIGURE QLIK ERROR
    var qlik_setErrorConfiguration = function(qlik) {
        qlik.setOnError( function ( error ){
               
            //Error MSG qlik
            window.qlik_errorLoadDashboard = true;
            var codeErrorQlik = "QLIK-MSG-"+error.message.toUpperCase();
            var msgError = qlik_translate.instant(codeErrorQlik);
            console.log("msgError: ",codeErrorQlik," - ",msgError);
            //https://extendingqlik.upper88.com/handle-errors-in-your-qlik-sense-mashup/

            //Lock screen
            qlik_opacityScreen();

            //Verify if exists a model-content in HTML
            var elementExists = document.getElementsByClassName("modal-content");
            //console.log("elementExists",elementExists);

            //If not exists, add the modal-content
            if (elementExists.length == 0) {

                if(userData.qlikName){

                    //Create error dialog modal-content
                    qlik_dialog.error('Error',msgError)
                    .result
                    .then( function(){ 
                        location.reload();
                    });

                }else {
                    
                    qlik_dialog.notify('Warning',qlik_translate.instant("MSG-USER-QLIK-NULL"));

                }

            }


        },
        function(warning){
            console.log("Warning",warning);
        });
    };


    //CONECT WITH THE APP INTO QLIK SERVER
    var qlik_conectQVFApp = function(qlik) {
        
        qlikModule = qlik;
        //callbacks -- inserted here --
        //open apps -- inserted here --

        //Set language in Qlik
        var languageName = window.parent.qlikLanguageActual;
        qlikModule.setLanguage(languageName);

        //Version PROD
        var app = qlik.openApp(parmsQlikApp.appId, config);
        
        
        return app;
    }


    //SET VALUES OUTSIDE QLIK
    var qlik_environmentVariable = function(app){

        //Clear values filters
        app.unlockAll();
        app.clearAll();

        
        //set values and field in filter
        for (key in qlik_parmsFieldSelectedLoad) {
            if (qlik_parmsFieldSelectedLoad.hasOwnProperty(key)) {
                var fieldName = qlik_parmsFieldSelectedLoad[key].nameField;
                var fieldValue= qlik_parmsFieldSelectedLoad[key].value;
                
                //Get value current project
                var indiceProjeto = parseInt(fieldValue);
                console.log('indiceProjeto',indiceProjeto);
                console.log('userData.type',userData.type);
                
                //Select project in qlik filter
                app.field(fieldName).select([indiceProjeto], false, false);                
                if (userData.type != ruleAdmin[0] ){ // case diferent admin not lock and show filter
                    app.field(fieldName).lock();
                    qlik_scope.isNotAdmin = true;
                }

            }
        }

    }


    //CONTROL LOAD SCREEN
    var qlik_controlScreenLoad = function(app){
        
        //OBJECT GENERIC TO LISTEN THE FILTER
        genericObjectLoadScreen = app.createGenericObject( {
            version : {
                qStringExpression: "=QlikViewVersion ()"
            }
        }, function ( reply ) {
            var str = "Version:" + reply.version;

            console.log("reply.user",str);

            qlik_opacityScreen();
            
        });

        //SELECTIONS BAR TO LISTEN FINISH LOAD
        selectionsBar = app.getList("CurrentSelections", function(reply) {
            
            //GET ALL VALUES SELECTIONS BARS
            mySelectedFields = reply.qSelectionObject.qSelections;
            mySelectedFieldsLength = mySelectedFields.length;
            mySelectedBackCount = reply.qSelectionObject.qBackCount;
            mySelectedForwardCount = reply.qSelectionObject.qForwardCount;
            filtersFieldsDict = [];


            //GET VALUES TO DICTIONARY
            for (var i = 0; i < mySelectedFieldsLength; i++){
                console.log("mySelectedFields[i].qField",mySelectedFields[i].qField);
                console.log("mySelectedFields[i].qSelectedCount",mySelectedFields[i].qSelectedCount);
                
                //get values
                let fieldName = mySelectedFields[i].qField;
                let fieldValue = mySelectedFields[i].qSelectedCount;
                let fieldLocked = mySelectedFields[i].qLocked;

                //get values to disctionary
                filtersFieldsDict.push({"field":fieldName,"count":fieldValue});
            }

            //DO CALL TO GET FIELD LIMIT TO APPEAR CHART (ACCORDING PARMS IN qlik_server_parms.js)
            qlik_defineFilterFieldLimit();


            //DO DISAPPEAR OPACITY OF DASHBOARDS VIEW WITH THE DELAY
            qlik_interval(function(){qlik_appearScreen();qlik_ShowFiltersButton();}, qlik_timeLimitAppearScreen, 1);

        });
        
    }
    

    //CONTROL BUTTONS OF FILTER BAR
    var qlik_controlButtonCurrentBar = function(app){
        
        //get element tag[data-qcmd] of html 
        $( "[data-qcmd]" ).on( 'click', function () {
            var $element = $( this );
            
            //disable buttons when click
            $("[data-qcmd='clearAll']").parent().removeClass('enable-btn-filter');
            $("[data-qcmd='back']").parent().removeClass('enable-btn-filter');
            $("[data-qcmd='forward']").parent().removeClass('enable-btn-filter');

            switch ( $element.data( 'qcmd' ) ) {
                
                //app level commands, 
                case 'clearAll': 
                    app.clearAll();
                    break;

                case 'back':
                    app.back();
                    break;

                case 'forward':
                    app.forward();
                    break;
            }
        });
    }


    //GET CURRENT BAR OF QLIK FILTERS
    var qlik_getCurrentBar = function(app,qlik){
        
        if (app) {
            app.getObject('CurrentSelections', 'CurrentSelections').then(function() {
                $(".rain").hide();
                $(".tab-content").show();
                qlik.resize();
                //console.log("SELECT",selState.backCount);
            });

            //Loading sucess qlik
            window.qlik_loadDashboard = true;
            console.log("Qlik conect");

        } else {
            $(".rain").hide();
            $(".tab-content").show();

            //Error qlik
            window.qlik_errorLoadDashboard = true;
            console.log("Qlik Error app");
        }
    }

    



