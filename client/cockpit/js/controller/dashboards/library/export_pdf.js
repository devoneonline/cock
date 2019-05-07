/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

$(function () {

    $('#BUTTON_EXPORT_PDF').click(function () {
        var doc = new jsPDF('l', 'pt', 'a4');
        doc.addHTML($('#content'), 30,30, {
        pagesplit:true,
        background: '#e6eeef',
        image:{ type: 'jpeg', quality: 1},
        html2canvas:{ dpi: 400 } 
    }, function() {
        doc.save('export.pdf');
        });
    });

});