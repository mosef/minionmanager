const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('Campaign Management', function() {

    before(function() {
        return runServer();
      });
      after(function() {
        return closeServer();
      });
      
    it('should list campaign details on GET', function() {
    return chai.request(app)
        .get('/load-save')
        .then(function(res) {
        res.should.have.status(200);
        })
    })
})