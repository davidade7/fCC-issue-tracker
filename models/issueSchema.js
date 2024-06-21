const mongoose = require('mongoose')

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

module.exports = Issue;
