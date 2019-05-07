/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
const mocha = require('mocha');
const fs = require('fs');

// Get all test specification files from directory /api
console.log('Detecting unit tests \n');
const testFiles = fs.readdirSync(__dirname + '/api');

// Require all the tests
testFiles.forEach(function (file) {
  let filePath = './api/' + file;
  console.log( filePath );
  require( filePath )();
});

mocha.before('Starting unit tests with mocha', async function(){
  console.log("..........:eVA-Unit Tests:....................................................\n");

  //start eva-server
  console.log("Starting eVA-Server \n");
  await require('../../server');
  console.log("\neVA-Server Started\n");

});

mocha.after('deactivate http server after all unit tests', function (){
  console.log("\n..........:Unit tests finished, now shutting down eVA-Server:.................");
  process.exit(0);
});

//TODO
//Mock do DAO usando sinon