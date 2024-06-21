const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

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
  })

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
  })

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
  })
});
