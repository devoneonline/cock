/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

var sessionDAO = require('../DAO/sessionDAO');
var error = require('../error/error');
var exec = require('child_process').exec;
var path = require('path');
const fs = require('fs');

//var nodeExcel = require('excel-export');

var api = {};

api.findSession = function(req, res) {
    req.setTimeout(3600e3);

    var actualMonth = (new Date().getMonth() + 1);
    var lastMonth = (new Date().getMonth());
    var actualYear = new Date().getFullYear();
    var actualDay = new Date().getDate();
    var firstDay = new Date().getDate() - 7;
    if (firstDay == 0) firstDay = 1;

    var projectId = req.params['projectId'];
    var filters = req.body;

    var maxDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
    
    filters.projectId = projectId;
    
    if(!filters.maxResults)
        filters.maxResults = 20;
    
    if(!filters.page)
        filters.page = 1;

    if(filters.maxResults > 100)
        filters.maxResults = 100;

    if(!filters.createDateIni)
        if(firstDay < 0){
            var daysRemaining = (new Date().getDate() - 7) * (-1);
            maxDayLastMonth -= daysRemaining;
            firstDay = maxDayLastMonth;
            
            filters.createDateIni = `${actualYear}/${lastMonth}/${firstDay}`;
            console.log('last')
        }else{
            filters.createDateIni = `${actualYear}/${actualMonth}/${firstDay}`;
            console.log('actual')
        }

    if(!filters.createDateEnd)
        filters.createDateEnd = `${actualYear}/${actualMonth}/${actualDay}`;

    filters.firstResult = (filters.page - 1) * filters.maxResults;

    sessionDAO.selectSessionByFilter(filters, function(err, session){
        if(err) 
            return error.responseReturnXHR(res, err);

        // error.responseReturnXHR(res, err, {
        //     sessions:session,
        //     resultsPerPage:filters.maxResults,
        //     page:filters.page
        //});
        sessionDAO.selectSessionCount(filters, function(err, count){
            error.responseReturnXHR(res, err, {
                sessions:session,
                count:count,
                resultsPerPage:filters.maxResults,
                page:filters.page
            });
        });
    });
}

//EXPORT CSV
// api.exportSessionss = function(req, res) {
//     var projectId = req.params['projectId'];
//     var filters = {};
//     filters.projectId = projectId;
    
//     filters.export = true;

//     if (req.query['channelId'])
//         filters.channelId = JSON.parse(req.query['channelId']);

//     if (req.query['createDateIni'])
//         filters.createDateIni = req.query['createDateIni'];

//     if (req.query['createDateEnd'])
//         filters.createDateEnd = req.query['createDateEnd'];

//     if (req.query['status'])
//         filters.status = JSON.parse(req.query['status']);

//     sessionDAO.selectSessionByFilter(filters, function(err, sessions){
//         if(err) 
//             return error.responseReturnXHR(res, err);

//         res.setHeader('Content-type', 'application/octet-stream');
//         res.setHeader('Content-Disposition', 'inline; filename="export.csv"');
//         res.write('Código da sessão;Data de Criação;Projeto;Canal;Info do Usuário;Pergunta;#ID da resposta;'+
//             'Título da Resposta;Status da Resposta;Sistema Operacional;Browser;\n');
//         for (s of sessions) {
//             res.write(s.sessionCode+';');
//             res.write(s.createDate+';');
//             res.write(s.projectName+';');
//             res.write(s.channelName+';');
//             res.write(s.businessKey+';');
//             if (s.text)
//                 res.write('"'+s.text.replace('"','\"')+'";');
//             else 
//                 res.write(';');
//             res.write(s.code+';');
//             if(s.title)
//                 res.write('"'+s.title.replace('"','\"')+'";');
//             else
//                 res.write(';');
//             res.write(s.status+';');
//             res.write(s.operatingSystem+';');
//             res.write('\n');
//         }
//         res.end();
//     });
// }

api.exportSession = function(req, res) {
    var firstDay = (new Date().getDate() - 7);
    var actualMonth = (new Date().getMonth() + 1);
    var lastMonth = (new Date().getMonth());
    var actualYear = new Date().getFullYear();
    var actualDay = new Date().getDate();
    var actuaHour = new Date().getHours();
    var actualMinute = new Date().getMinutes();
    var actualSeconds = new Date().getSeconds();
    var date = `${actualDay}-${actualMonth}-${actualYear}_${actuaHour}-${actualMinute}-${actualSeconds}`

    var projectId = req.params['projectId'];
    var filters = {};
    var usedFilters = '';
    var pathXlsx = `/home/everisvirtualassistant/Cockpit/server/resources/export_excel/xlsx/atendimentos_${date}`;
    var pathTxt = `/home/everisvirtualassistant/Cockpit/server/resources/export_excel/txt/atendimentos_${date}`;

    var maxDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();

    filters.projectId = projectId;
    //filters.userName = req.query['userName'];
    filters.userEmail = req.query['userEmail'];
    filters.userName = filters.userEmail.split('@');
    filters.userName = filters.userName[0];
   
    filters.export = true;

    if (req.query['createDateIni'])
        filters.createDateIni = req.query['createDateIni'];
    else
        if(firstDay < 0){
            var daysRemaining = (new Date().getDate() - 7) * (-1);
            maxDayLastMonth -= daysRemaining;
            firstDay = maxDayLastMonth;
            
            filters.createDateIni = `${actualYear}-${lastMonth}-${firstDay}`;
            console.log('last')
        }else{
            filters.createDateIni = `${actualYear}-${actualMonth}-${firstDay}`;
            console.log('actual')
        }

    if (req.query['createDateEnd'])
        filters.createDateEnd = req.query['createDateEnd'];
    else   
        filters.createDateEnd = `${actualYear}-${actualMonth}-${actualDay}`;

    if (req.query['channelId']){
        filters.channelId = JSON.parse(req.query['channelId']);
        filters.channelName = req.query['channelName'].replace(/\[|\]/g, '');
        filters.channelName = filters.channelName.replace(/ /g, '_');
    }else{
        filters.channelName = 'Todos';
    }

    if (req.query['status']){
        filters.status = JSON.parse(req.query['status']);
        filters.statusName = req.query['statusName'].replace(/\[|\]/g, '');
        filters.statusName = filters.statusName.replace(/ /g, '_');
    }else{
        filters.statusName = 'Todos';
    }

    if (req.query['sessionCode']){
        filters.sessionCode = req.query['sessionCode'];
        usedFilters += `sessionCode:${filters.sessionCode}#Solicitante:${filters.userName}`;
    }else{
        usedFilters += `Datas:${filters.createDateIni}_-_${filters.createDateEnd}#Canal:${filters.channelName}#Status:${filters.statusName}#Solicitante:${filters.userName}`
    }

    console.log(usedFilters);
    console.log("Executando jar...")
    // /home/everisvirtualassistant/Cockpit/server/resources/gerarExcel20170830.jar
    var child = exec(`java -jar /home/everisvirtualassistant/Cockpit/server/resources/gerarExcel20171006.jar ${filters.projectId} ${filters.channelId} ${filters.status} ${filters.sessionCode} ${filters.createDateIni} ${filters.createDateEnd} ${filters.userEmail} ${usedFilters} ${pathXlsx} ${pathTxt}`, function(error, stdout, stderr){
        console.log('Output -> ' + stdout);
        if(error !== null){
        console.log("Error -> "+error);
        }
    });

    res.send("Arquivo Solicitado! Quando estiver pronto, você será notificado por email");
    /*sessionDAO.selectSessionByFilter(filters, function(err, sessions){
        if(err) 
            return error.responseReturnXHR(res, err);
        
        for(i in sessions)
            sessions[i].createDate = `${sessions[i].createDate.getDate()}/${sessions[i].createDate.getMonth() + 1}/${sessions[i].createDate.getFullYear()} ${sessions[i].createDate.getHours()}:${sessions[i].createDate.getMinutes()}`;

        res.xls('data.xlsx', sessions);
        res.end();
    });*/

}


api.getDownloadLinks = function(req, res){
    const folderXlsx = '//home//everisvirtualassistant//Cockpit//server//resources//export_excel//xlsx';
    const folderTxt = '//home//everisvirtualassistant//Cockpit//server//resources//export_excel//txt';
    const folderTag = '//home//everisvirtualassistant//Cockpit//server//resources//export_excel//xlsx';
    var values = [];
    let texto;

    fs.readdirSync(folderXlsx).forEach(function(file, i){
        var stats = fs.statSync(folderXlsx + '/' + file);
        var fileSizeInBytes = stats.size;
        var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;

        values[i] = {
            "fileName": file,
            "fileDirectory": `${folderTag}/${file}`,
            "fileSize": fileSizeInMegabytes,
            "downloadDate": new Date()
        }
    
        fs.readdirSync(folderTxt).forEach(function(file2, i2){
            if(file2.replace(/.txt/g, '') == values[i].fileName.replace(/.xlsx/g, '')){
                values[i].usedFilters = fs.readFileSync(folderTxt + '/' + file2, 'utf8');
            }
        });
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(values);
}

api.deleteFile = function(req, res){
    const folderXlsx = '//home//everisvirtualassistant//Cockpit//server//resources//export_excel//xlsx//';
    const folderTxt = '//home//everisvirtualassistant//Cockpit//server//resources//export_excel//txt//';
    var fileToDelete = req.query['fileName'];
    var message = '';
    try{
        fs.unlink(folderXlsx+fileToDelete+'.xlsx', (err) =>{
            if (err){
                //throw err;
                message = "Erro ao deletar arquivo";
                console.log(err);
            }else{
                console.log('Delete ' + fileToDelete + '.xlsx success');
                message = "Arquivo deletado com sucesso";
            }
        });
        fs.unlink(folderTxt+fileToDelete+'.txt', (err) =>{
            if (err){
                // throw err;
                message = "Erro ao deletar arquivo";
                console.log(err);
            }else{
                console.log('Delete ' + fileToDelete + '.txt success');
            }
        });
    }catch(e){
        console.log(e);
    }
    

    res.send(message);
}

api.downloadExcel = function(req, res){
    // const folderXlsx = 'C:\\Projetos\\SVN\\eVA\\Desenvolvimento\\trunk\\Cockpit\\server\\resources\\export_excel\\xlsx\\';
    const folderXlsx = '/home/everisvirtualassistant/Cockpit/server/resources/export_excel/xlsx/';
    var fileToDownload = req.query['fileName'];
    var file = fileToDownload+'.xlsx';
    res.download(folderXlsx+file, file);
}

module.exports = api;
