'use strict';

require('dotenv').config()
const mongoose = require('mongoose')

// Connection to mongoose
mongoose.connect(process.env['MONGO_URI'])
  .then(() => console.log("Connected to DB"))
  .catch(console.error);;

// import the issue model
const Issue = require('../models/issueSchema');

// Routes
module.exports = function (app) {

  app.route("/api/issues/:project")
    // get route
    .get(async (req, res) => {
      let project = req.params.project;
      // creation of query variable to be added in the find method
      let query = { project_name: project }
      // cycle through the query parameters and add them to the query object
      for (let key in req.query) {
        query[key] = req.query[key]
      }
    
      let result = await Issue.find(query).exec()
      
      res.json(result)
    })
    
    // post route
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
    
    // Put route
    .put(async (req, res) => {
      try {
        // Check if the _id is not present
        if (!req.body._id) {
          return res.json({ error: 'missing _id' });
        }
        
        // Creating the update object
        let update = {}
        for (let key in req.body) {
          if (req.body[key] && key !== '_id') {
            update[key] = req.body[key]
          }
        }

        // Check if there are no fields to update
        if (Object.keys(update).length === 0) { 
          return res.json({ error: 'no update field(s) sent', '_id': req.body._id });
        }

        try {
          // Update the issue
          const updatedIssue = await Issue.findByIdAndUpdate(
            {_id: req.body._id}, 
            { ...update, updated_on: new Date()}
          );
          
          // Check if the issue wasn't updated
          if (!updatedIssue) {
            return res.json({ error: 'could not update', '_id': req.body._id });
          }
        
          // Return the response
          res.json({ result: 'successfully updated', '_id': req.body._id });
        } 
        // Catch the error
        catch (err) {
          res.json({ error: 'could not update', '_id': req.body._id });
        }
      }
      catch (error) {
        return res.json({ error: 'could not update', '_id': req.body._id });
      }
    })
  
    //  Delete route
    .delete(async (req, res) => {
      // Check if the _id is not present
      if (!req.body._id) {
        return res.json({ error: 'missing _id' });
      }

      // Try to delete the issue
      try {
        // Check if issue is in DB
        let findIssue = await Issue.findOne({_id: req.body._id}).exec()
        if (!findIssue) {
          return res.json({ error: 'could not delete', '_id': req.body._id });
        }
        // Then delete the issue
        await Issue.findOneAndDelete({_id: req.body._id}).exec()
        return res.json({ result: 'successfully deleted', '_id': req.body._id });
      }
      catch (error) {
        return res.json({ error: 'could not delete', '_id': req.body._id });
      }
    });
};