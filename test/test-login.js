const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const should = chai.should();
chai.use(chaiHttp);
const expect = chai.expect;

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const { BasicStrategy } = require("passport-http");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models/user-model");
const { JWT_SECRET } = require("../config");

describe("Campaign Manager Login Auth Tests", function() {
  const username = "exampleUser";
  const password = "examplePass";
  const firstName = "Example";
  const lastName = "User";

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName
      })
    );
  });

  afterEach(function() {
    return User.remove({});
  });

  describe("User Registration POST endpoint", function() {
    it("Should reject empty requests", function() {
      return chai
        .request(app)
        .post("/authenticate/login")
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
        .post("/authenticate/login")
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
        .post("/authenticate/login")
        .auth(username, "wrongPassword")
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
      return chai
        .request(app)
        .post("/authenticate/login")
        .auth(username, password)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          const token = res.body.authToken;
          expect(token).to.be.a("string");
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ["HS256"]
          });
          const _id = payload.user._id;
          expect(payload.user).to.deep.equal({
            _id,
            username,
            firstName,
            lastName
          });
        });
    });
  });
});