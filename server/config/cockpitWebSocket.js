/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

var trainPubAPI = require('../app/api/trainPubAPI');

var cockpitWS = {}

var cleverWebSocketConnection;

//---------------------Configuracao de protocolos Web Socket do Cockpit---------------

cockpitWS.handleWSConnection = ( req, res )=>{

    //Aceitando conexoes websocker para o protocolo clever
    cleverWebSocketConnection = req.accept('clever-protocol', req.origin);
    cleverWebSocketConnection.on( 'message', onCleverMessage );
    cleverWebSocketConnection.on( 'onClose', onCleverClose );

    //Adicionar futuros protocolos...

}


function onCleverMessage(message){

    if (message.type === 'utf8') { 
        console.log('Received Message: ' + message.utf8Data);

        function pingClever() {
            trainPubAPI.getTrainingResult(message.utf8Data) //Gets training result from Clever
                .then(
                    response => {
                        console.log('res: ', response.data);
                        cleverWebSocketConnection.sendUTF((JSON.stringify(response.data))); //Stringify data to send it to AngularJS
                        if(response.data.status != 'received' && response.data.status != 'processing') { //Stops pinging Clever when status is not ptocessing
                            clearInterval(pingCleverInterval);
                        }
                    }
                ).catch(
                    err => {
                        console.log(err);
                    }
                ); 
        }
        pingClever();
        let pingCleverInterval = setInterval(pingClever, 3000 );
    }

}

function onCleverClose(reasonCode, description){
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
}
   
module.exports = cockpitWS;
