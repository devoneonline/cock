/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
const nodemailer = require('nodemailer');

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

  const mailOptions = {
    from: 'no-reply@eva.bot',
   // to: 'variavel vinda do front',
    subject: 'Reset de Senha',
  //text: 'mensagem que a Iara vai colocar'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });

  