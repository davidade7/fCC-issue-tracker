'use strict';

require('dotenv').config()
const mongoose = require('mongoose')

// Connection to mongoose
mongoose.connect(process.env['MONGO_URI'])
  .then(() => console.log("Connected to DB"))
  .catch(console.error);;

// Schema for the issues
const issueSchema = new mongoose.Schema({
  issue_title: String,
  issue_text: String,
  created_on: Date,
  updated_on: Date,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String,
  project_name: String
})

// Models
const Issue = mongoose.model('Issue', issueSchema);

// Routes
module.exports = function (app) {

  app.route("/api/issues/:project")

    // .get(function (req, res){
    //   let project = req.params.project;
    //   console.log('get',req.body)
    // })
    
    .post((req, res) => {
      try {
        let projectName = req.params.project
                
        // Working with issue
        const { issue_title, issue_text, created_by, assigned_to , status_text } = req.body
        if (!issue_title || !issue_text || !created_by) {
          res.json({error: "required field(s) missing"});
          return;
        }

        // Creating the issue
        let issueToAdd = new Issue({
          issue_title, 
          issue_text, 
          created_on: new Date(), 
          updated_on: new Date(), 
          created_by, 
          assigned_to,
          open: true, 
          status_text,
          project_name: projectName
        })
        issueToAdd.save()
        res.json(issueToAdd)
      }
      catch (error) {
        console.log(error)
        res.json({
          error: error.message
        });
      }
    })
    
    // .put(function (req, res){
    //   let project = req.params.project;
    //   console.log('put',req.body)
    // })
    
    // .delete(function (req, res){
    //   let project = req.params.project;
    //   console.log('delete',req.body)
    // });
    
};
