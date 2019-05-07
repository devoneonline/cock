/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

const request = require('request').defaults({jar: true});
const projectDAO = require('../../../server/app/DAO/projectDAO');
const assert = require('chai').assert;
const sinon = require('sinon');

module.exports = function () {
  
  describe('Project API Test Suite', function() {

    describe('#selectUserProjects()', function() {

      before('mock dao for test', function(){
        
        try{
          
          projects = [
            { 'aaa':'' },
            { 'bbb':'' }
          ];

          sinon.stub(projectDAO, 'select').yields( null,  projects );
      
        }catch(e){
          console.log( "Erro na hora de setar o mock" + e );     
        }
      
      });

      it('shoud return all projects', function(done) {

        data = {
          form:{
             "email":"admin@everis.com",
             "password":"Admin123"
          }
        }
          
        request.post('http://localhost:3000/login', data, function( err,httpResponse, body ){
          
          console.log('status login ->' + body );

          request.get('http://localhost:3000/cockpit/v1/projects/', function( err,httpResponse, body ){

            console.log( body );

            let res = JSON.parse( body );

            assert(Array.isArray( res ), 'returned value is not an Array');
            assert.isAbove( body.length, 0, 'projects array is not empty' );

            done();

          });
          
        });
              
      });

    });

  });

}