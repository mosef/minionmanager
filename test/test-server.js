const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const should = chai.should();
chai.use(chaiHttp);

describe('Campaign Management testing', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
      });
      after(function() {
        return closeServer();
      });
      
    it('should list campaign details on GET', function() {
    return chai.request(app)
        .get('/load')
        .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        })
    })
})