'use strict';

require('dotenv').config()
const mongoose = require('mongoose')

// Connection to mongoose
mongoose.connect(process.env['MONGO_URI'])
  .then(() => console.log("Connected to DB"))
  .catch(console.error);;

// Schema for the issues
const issueSchema = new mongoose.Schema({
  issue_title: { type: String, default: "" },
  issue_text: { type: String, default: "" },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: String, default: "" },
  assigned_to: { type: String, default: "" },
  open: { type: Boolean, default: true },
  status_text: { type: String, default: "" },
  project_name: { type: String, default: "" }
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
        const { issue_title, issue_text, created_by, assigned_to = "", status_text = "" } = req.body
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
        let issueObject = issueToAdd.toObject();
        delete issueObject.project_name;
        res.json(issueObject);
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
