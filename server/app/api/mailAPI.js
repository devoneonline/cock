/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var error = require('../error/error');
var api = {}
var nodemailer = require('nodemailer');
var userDAO = require('../DAO/userDAO');
var configurationDAO = require('../DAO/configurationDAO');
const TokenGenerator = require('uuid-token-generator');
var request = require('request');

// api.getSitekey = function(req, res) { 
//     var configKey = "cockpit.recaptcha.sitekey";
//     configurationDAO.selectConfigurationByConfigKey(configKey, function(err, config){
//         if (err || !config) {
//             return res.status(200).end({"sitekey":config["configValue"]});
//         }else{
//             return res.status(200).end({"sitekey": null});
//         }
//     });
// };

api.getSitekey = function(req, res) { 
    var configKey = "cockpit.recaptcha.sitekey";
    configurationDAO.selectConfigurationByConfigKey(configKey, function(err, config){
        if (err || !config) {
            return error.responseReturnXHR(res, null, {"sitekey": null});
        } else {
            return error.responseReturnXHR(res, null, {"sitekey":config["configValue"]});
        }
    });
}; 

    api.sendEmail = function(req, res) {

    var email = req.body['email'];
    var configKey = "cockpit.recaptcha.secretkey";
    
    configurationDAO.selectConfigurationByConfigKey(configKey, function(err, config){
    if (config) {
    //SE EXISTE SECRET KEY NO BANCO
    console.log("tem config");
    var secretKey = config["configValue"];
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
    }
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'];
    
    request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
    // return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    return res.status(400).end('{"message":"Failed captcha verification"}');
    }
    //res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
    });
                 
    }else if(err){
        console.log(err);
        return res.status(400).end('{"message":"Tente novamente mais tarde!"}');
    }
    
    ////////////////////////////////////////////////////////////////////////////////
    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
        var tokenRess = tokgen.generate();
        var date = new Date().toLocaleString();   

    userDAO.selectUserByEmail(email, function(err, userFound){
		if (err) {
            return error.responseReturnXHR(res, err);  
        }
        if (userFound == null) {
            return res.status(404).end('{"message":"E-mail não está cadastrado"}');
        } 
         
        userFound["resetToken"] = tokenRess;
        userFound["createTokenDate"] = new Date();
		userDAO.updateTokenById(userFound, function (err) {
		if (err) {
			return error.responseReturnXHR(res, err);
		} 
		});
	
        

    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "no-reply@eva.bot",
            pass: "eva@2018"
        },
        tls: { rejectUnauthorized: false }
    });

    var configKey = "cockpit.baseuri";
    configurationDAO.selectConfigurationByConfigKey(configKey, function(err, config){
        if (err || !config) {
            return res.status(500).end("Configuration issue: missing config key cockpit.baseuri");
        }

        var emailText = '<!doctype html> <html> <head> <meta name="viewport" content="width=device-width" /> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <title>Simple Transactional Email</title> <style> img { border: none; -ms-interpolation-mode: bicubic; max-width: 100%; } body { background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } table { border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; } table td { font-family: sans-serif; font-size: 14px; vertical-align: top; } .body { background-color: #f6f6f6; width: 100%; } .container { display: block; Margin: 0 auto !important; /* makes it centered */ max-width: 580px; padding: 10px; width: 580px; } .content { box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; } .main { background: #ffffff; border-radius: 3px; width: 100%; } .wrapper { box-sizing: border-box; padding: 20px; } .content-block { padding-top: 10px; } .footer { clear: both; Margin-top: 10px; text-align: center; width: 100%; } .footer td, .footer p, .footer span, .footer a { color: #999999; font-size: 12px; text-align: center; } h1, h2, h3, h4 { color: #000000; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; Margin-bottom: 30px; } h1 { font-size: 35px; font-weight: 300; text-align: center; text-transform: capitalize; } p, ul, ol { font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px; } p li, ul li, ol li { list-style-position: inside; margin-left: 5px; } a { color: #3498db; text-decoration: underline; } .btn { box-sizing: border-box; width: 100%; } .btn > tbody > tr > td { padding-bottom: 15px; } .btn table { width: auto; } .btn table td { background-color: #ffffff; border-radius: 5px; text-align: center; } .btn a { background-color: #ffffff; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; color: #3498db; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; } .btn-primary table td { background-color: #3498db; } .btn-primary a { background-color: #3498db; border-color: #3498db; color: #ffffff; } .last { margin-bottom: 0; } .first { margin-top: 0; } .align-center { text-align: center; } .align-right { text-align: right; } .align-left { text-align: left; } .clear { clear: both; } .mt0 { margin-top: 0; } .mb0 { margin-bottom: 0; } .preheader { color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0; } hr { border: 0; border-bottom: 1px solid #f6f6f6; Margin: 20px 0; } @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; }} @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } .btn-primary table td:hover { background-color: #34495e !important; } .btn-primary a:hover { background-color: #34495e !important; border-color: #34495e !important; } } </style> </head> <body class=""> <table border="0" cellpadding="0" cellspacing="0" class="body"> <tr> <td> </td> <td class="container"> <div class="content"> <span class="preheader">Solicitao de troca de senha.</span> <table class="main"> <tr> <td class="wrapper"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td> <p>Prezado(a),</p> <p>Você solicitou a troca de senha. Para avanar e definir uma nova senha de acesso, clique no boto abaixo.</p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary"> <tbody> <tr> <td align="center"> <table border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <a href="[URL]" target="_blank">Redefinir Senha</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p>Caso no consiga clicar no link acesse a url: [URL]</p> <p>A redefinio de senha expira aps um curto perodo de tempo. Caso isso acontea com voc, entre novamente no site e solicite a troca de senha para esse e-mail novamente.</p> </td> </tr> </table> </td> </tr> </table> <div class="footer"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td class="content-block"> <span class="apple-link">@copyright 2018 - everis group - NTT DATA Company</span> </td> </tr> <tr> <td class="content-block"> <a href="https://www.everis.com/" target="_blank">Powered by Eveis</a>. </td> </tr> </table> </div> </div> </td> <td> </td> </tr> </table> </body> </html>';
        emailText = emailText.replace("[URL]", config["configValue"] + "/reset-password.html?token=" + tokenRess);
        emailText = emailText.replace("[URL]", config["configValue"] + "/reset-password.html?token=" + tokenRess);


        const mailOptions = {
            from: 'no-reply@eva.bot',
            to: email,
            subject: 'Reset de Senha',
            text: "",
            html: emailText
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log('Erro.');
                console.log(error);
                return res.status(400).end('{"message":"Erro ao enviar o e-mail. Por favor, tente novamente em instantes."}');
            } else {
                console.log('Message enviada: ' + info.response);
                return res.status(200).end('{"message":"Email enviado com sucesso!"}');
            }
        });
    });
});
});
}

api.validateToken = function(req, res) {
    var token = req.params['token'];
    var date = new Date();
    var configKey = "forgot.password.expiration.in.minutes";
    var configValue;
    var time;

    configurationDAO.selectConfigurationByConfigKey( configKey, function(err, config){
        
        if(err){
            configValue = 300;
        }
        if(config == null){
            configValue = 300
        }else {
            configValue =parseInt(config["configValue"]);
        }

        time = configValue*60*1000;
        date = new Date(date.getTime() - time);     

        userDAO.validateToken(token ,date, function(err, userFound){
            // return res.status(200).end(userFound&&!err);
            if(err) {
                return res.status(200).end("false");
            }
            if(userFound == null) {
                return res.status(200).end("false");
                
            } else {
                return res.status(200).end("true");
                
            }
        });
    });
};

api.changePassword = function (req, res) {
	
	var newPassword = req.body.pass;
	var token = req.body.token;
	var validateNewPassword = req.body.passConfirm;

	if(token == null || newPassword == null || validateNewPassword == null
		|| token == "" || newPassword == "" || validateNewPassword == ""
		|| token == undefined || newPassword == undefined || validateNewPassword == undefined){
		return res.status(400).end('{"message":"Todos os campos devem ser preenchidos."}');
	}
	if(newPassword != validateNewPassword) {
		// to do preciso resolver
		return res.status(400).end('{"message":"As novas senhas não são iguais."}');
	}
	
	var numbers = /[0-9]/;
	var letters = /[a-zA-Z]/;
    var characters = /[-!&_+@]/;

	if(!(newPassword.length >= 6)) {
		return res.status(400).end('{"message":"Tamanho mínimo é 6."}');
	}
	
	if(letters.test(newPassword) && numbers.test(newPassword)
            || letters.test(newPassword) && characters.test(newPassword)
            || numbers.test(newPassword) && characters.test(newPassword)) {
		
	} else {
		return res.status(400).end('{"message":"erro"}');
	}
    
    var body = {
        "token":token,
        "password":newPassword,
        "resetToken": "",
        "createTokenDate":""
    }
	userDAO.updateUserByToken(body, function(err){
		if (err) {
            console.log("DEU ERRO!!!!!!!");
			return error.responseReturnXHR(res, err);
        }
        error.responseReturnXHR(res, err);
		// if (userFound && userFound.id != user.id) {
		// 	return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um usuário com o email fornecido"}}); //TODO: internacionalizar erros
		// }
        // userFound["password"] = newPassword;
        // userFound["resetToken"] = "";
        // userFound["createTokenDate"] = "";
		// userDAO.updatePass(userFound, function (err) {
		// 	error.responseReturnXHR(res, err);
		// });
	});

}



module.exports = api;