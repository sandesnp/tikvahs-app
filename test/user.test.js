// test/user.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app'); // Import your app.js
const USER = require('../models/user');

// Assertion style
const should = chai.should();
chai.use(chaiHttp);

describe('User API', () => {
  beforeEach((done) => {
    // Before each test we empty the database
    USER.deleteMany({}, (err) => {
      done();
    });
  });

  // Test the /GET route
  describe('/GET user', () => {
    it('it should GET all the users', (done) => {
      chai
        .request(server)
        .get('/api/user')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0); // since we empty the database before
          done();
        });
    });
  });

  // Test the /POST login route
  describe('/POST login', () => {
    it('it should not POST a login for non-existing user', (done) => {
      let user = {
        email: 'nonexistent@example.com',
        password: 'password',
      };
      chai
        .request(server)
        .post('/api/user/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });
  });
});
