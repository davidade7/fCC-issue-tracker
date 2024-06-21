const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

// import the issue model
const Issue = require('../models/issueSchema');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Test 1-1: Create an issue with every field: POST request', (done) => {
    // Setup
    const issue = {
      issue_title: "Test 1",
      issue_text: "abcdef",
      created_by: "Joe",
      assigned_to: "Joe",
      status_text: "In QA"
    };

    // Execute
    chai
      .request(server)
      .post("/api/issues/test")
      .send({ issue })
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        done();
      });
  }),

  test('Test 1-2: Create an issue with only required fields: POST request', (done) => {
    // Setup
    const issue = {
      issue_title: "Test 2",
      issue_text: "abcdef",
      created_by: "Joe"
    };

    // Execute
    chai
      .request(server)
      .post("/api/issues/test")
      .send({ issue })
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        done();
      });
  }),

  test('Test 1-3: Create an issue with missing required fields: POST request', (done) => {
    // Setup
    const issue = {
      issue_title: "Test 3",
      issue_text: "abcdef"
    };

    // Execute
    chai
      .request(server)
      .post("/api/issues/test")
      .send({ issue })
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.equal(res.text,'{"error":"required field(s) missing"}');
        done();
      });
  }),

  test('Test 1-4: View issues on a project: GET request', (done) => {
    // Execute
    chai
      .request(server)
      .get("/api/issues/test")
      .query({})
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title')
        assert.property(res.body[0], 'issue_text')
        assert.property(res.body[0], 'created_on')
        assert.property(res.body[0], 'updated_on')
        assert.property(res.body[0], 'created_by')
        assert.property(res.body[0], 'assigned_to')
        assert.property(res.body[0], 'open')
        assert.property(res.body[0], 'status_text')
        assert.property(res.body[0], '_id')
        done();
      });
  }),

  test('Test 1-5: View issues on a project with one filter: GET request', (done) => {
    // Execute
    chai
      .request(server)
      .get("/api/issues/test")
      .query({created_by: "Joe"})
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title')
        assert.property(res.body[0], 'issue_text')
        assert.property(res.body[0], 'created_on')
        assert.property(res.body[0], 'updated_on')
        assert.property(res.body[0], 'created_by')
        assert.property(res.body[0], 'assigned_to')
        assert.property(res.body[0], 'open')
        assert.property(res.body[0], 'status_text')
        assert.property(res.body[0], '_id')
        done();
      });
  }),

  test('Test 1-6: View issues on a project with multiple filters: GET request', (done) => {
    // Execute
    chai
      .request(server)
      .get("/api/issues/test")
      .query({created_by: "Joe", open: true})
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title')
        assert.property(res.body[0], 'issue_text')
        assert.property(res.body[0], 'created_on')
        assert.property(res.body[0], 'updated_on')
        assert.property(res.body[0], 'created_by')
        assert.property(res.body[0], 'assigned_to')
        assert.property(res.body[0], 'open')
        assert.property(res.body[0], 'status_text')
        assert.property(res.body[0], '_id')
        done();
      });
  }),

  test('Test 1-7: Update one field on an issue: PUT request', (done) => {
    // Setup
    const update = {
      issue_title: "Test 3"
    };

    // Execute
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: "667457f4e72337816e3303d2", ...update })
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"result":"successfully updated","_id":"667457f4e72337816e3303d2"}');
        done();
      });
  }),

  test('Test 1-8: Update multiple fields on an issue: PUT request', (done) => {
    // Setup
    const update = {
      issue_title: "Test 3",
      issue_text: "functionnal test 1-8"
    };

    // Execute
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: "667457f4e72337816e3303d2", ...update })
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"result":"successfully updated","_id":"667457f4e72337816e3303d2"}');
        done();
      });
  }),

  test('Test 1-9: Update an issue with missing _id: PUT request', (done) => {
    // Execute
    chai
      .request(server)
      .put("/api/issues/test")
      .send({})
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"error":"missing _id"}');
        done();
      });
  }),

  test('Test 1-10: Update an issue with no fields to update: PUT request', (done) => {
    // Execute
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: "667457f4e72337816e3303d2" })
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"error":"no update field(s) sent","_id":"667457f4e72337816e3303d2"}');
        done();
      });
  }),

  test('Test 1-11: Update an issue with an invalid _id: PUT request', (done) => {
    const update = {
      assigned_to: "David"
    };
    // Execute
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: "667457f4e72337816e3303d2xxxxx", ...update })
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.equal(res.text, '{"error":"could not update","_id":"667457f4e72337816e3303d2xxxxx"}');
        done();
      });
  }),

  test('Test 1-12: Delete an issue: DELETE request', async () => {
    // We need to find an issue to delete
    // fCC tests are going to create some issues with projet_name: "fcc-project"
    let project = await Issue.findOne({project_name: "fcc-project"}).exec();
    // console.log('project: ' + project);

    // Execute
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({ _id: project._id })
      .end(function(err, res) {
        // Assert
        assert.equal(res.status, 200);
        assert.equal(res.text, `{"result":"successfully deleted","_id":"${project._id}"}`);
        done();
      });
  })
});
