'use strict';
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connection to mongoose
mongoose.connect(process.env['MONGO_URI']);

const issueSchema = new mongoose.Schema({
  issue_title: String,
  issue_text: String,
  created_on: Date,
  updated_on: Date,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String
})

const Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {
const api = "/api/issues/"

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
