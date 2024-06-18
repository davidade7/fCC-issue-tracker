'use strict';

const mongoose = require('mongoose')


module.exports = function (app) {
const api = "https://issue-tracker.freecodecamp.rocks/api/issues/apitest/"

  app.route(api)
  


    .get(function (req, res){
      let project = req.params.project;
      console.log('get',req.body)
    })
    
    .post(function (req, res){
      let project = req.params.project;
      console.log('post',req.body)
    })
    
    .put(function (req, res){
      let project = req.params.project;
      console.log('put',req.body)
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      console.log('delete',req.body)
    });
    
};
