const faker = require("faker");
const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const should = chai.should();
chai.use(chaiHttp);
const expect = chai.expect;

const { app, runServer, closeServer } = require("../server");
const { seedMinionManagerDatabase, createNewUser, createNewCampaign, teardownDb, username, password} = require('../test/test-functions')
const { TEST_DATABASE_URL, JWT_SECRET } = require("../config/main");
const { BasicStrategy } = require("passport-http");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user-model");

describe("Campaign Manager Login Auth Tests", function() {
let testUser;
function addUser(){
  const username = "random";
  const password = "password2";
  return User.create({
    username,
    password
  });
}
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function(done) {
    addUser()
    .then( user => {
      testUser = user;
      seedMinionManagerDatabase();
      done();
    });
});
  afterEach(function() {
    return teardownDb();

  });
  
  after(function() {
    return closeServer();
  });

  describe("User Registration POST endpoint", function() {
    it("Should reject empty requests", function() {
      const user = {}
      return chai
        .request(app)
        .post("/register/sign-up")
        .send(user)
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it("Should reject incorrect usernames", function() {
      return chai
        .request(app)
        .post("/register/sign-up")
        .auth("wrongUsername", password)
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it("Should reject incorrect passwords", function() {
      return chai
        .request(app)
        .post("/register/sign-up")
        .auth(testUser.username, "wrongPassword")
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it("Should return a valid auth token", function() {
      const newUser = {
        username: "Frieda",
        password: "pass123",
        firstName: "Ryan",
        lastName: "Walters"
      }
      const token = jwt.sign({userId: testUser._id}, JWT_SECRET, { expiresIn: 10000 });
        return chai
        .request(app)
        .post("/register/authenticate")
        .set('Authorization', 'Bearer', + token)
        .send(newUser)
        .auth(newUser.username, newUser.password)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(token).to.be.a("string");
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ["HS256"]
          });
          const id = payload.userId;
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(200);
        });
    });
  });
});