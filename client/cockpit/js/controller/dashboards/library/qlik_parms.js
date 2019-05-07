/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 


// ------------------------- GERAL -------------------------- //


//QLIK SERVER PARMS
var parmsQlikServer = {
    host : "qlik-everis.everisva.com",
    prefix :  "/",
    port : "443",
    isSecure : true
};

//QLIK APP IN QLIK SERVER
var parmsQlikApp = {
    appId: 'b2135191-d10a-4484-ad68-04f7f0470109' // "da35834f-f9bf-43e3-a51a-a67a2648cd42"
};


//USER DATA
var userData = {
    type : window.parent.qlikIsAdminUser,
    qlikName : window.parent.userDataQlik.userQlik
};


//ID RULES TO ADMIN
var ruleAdmin = [1];


//LANGUAGE ACTUAL DASHBOARDS
var dashboardsLanguageName = window.parent.qlikLanguageActual;




// --------------------------- SESSION ---------------------------- //

//FIELD AND VALUE LIMIT TO PUT OPACITY SCREEN
var parmsFieldControlScreenLoadSession = [
    {nameField:'Data Sessão', valueLimit: 31}
];


//FIELD SELECTED IN LOAD OF SESSION
var parmsFieldSelectedLoadSession = [
    {nameField:'Projeto', value:window.parent.qlikProjectActual}
];

// -------------------------- QUESTION ---------------------------- //


//FIELD AND VALUE LIMIT TO PUT OPACITY SCREEN
var parmsFieldControlScreenLoadQuestion = [
    {nameField:'Data User', valueLimit: 31}
];

//FIELD SELECTED IN LOAD OF SESSION
var parmsFieldSelectedLoadQuestion = [
    {nameField:'Projeto', value:window.parent.qlikProjectActual}
];



// ------------------------- SATISFACTION -------------------------- //

//FIELD AND VALUE LIMIT TO PUT OPACITY SCREEN SATISFACTION
var parmsFieldControlScreenLoadSatisfaction = [
    {nameField:'Data Satisfação', valueLimit: 31}
];

//FIELD SELECTED IN LOAD OF SESSION
var parmsFieldSelectedLoadSatisfaction = [
    {nameField:'Projeto', value:window.parent.qlikProjectActual}
];












