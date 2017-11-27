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
const { seedMinionManagerDatabase, createNewUser, createNewCampaign, createAuthUser, teardownDb, username, password} = require('../test/test-functions')
const { TEST_DATABASE_URL, JWT_SECRET } = require("../config/main");
const { BasicStrategy } = require("passport-http");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user-model");
const {Campaign} = require("../models/campaign")

describe("Campaign Manager API resource", function() {
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

  describe("GET endpoint", function() {
    it("should list campaign details on GET", function() {
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
      let res;
      return chai
        .request(app)
        .get("/api/campaigns")
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.length.of.at.least(1);
          return Campaign.count();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
    });
    it("should check for correct fields", function() {
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
      let resCamp;
      return chai
        .request(app)
        .get("/api/campaigns")
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(function(campaign) {
            campaign.should.be.a("object");
            campaign.should.include.keys("__v", "_id", "title", "players");
          });
          resCamp = res.body[0];
          return Campaign.findById(resCamp._id);
        })
        .then(campaign => {
          resCamp.title.should.equal(campaign.title);
          resCamp.players[0].playerName.should.equal(
            campaign.players[0].playerName
          );
          resCamp.players[0].statSheet.should.equal(
            campaign.players[0].statSheet
          );
          resCamp.players[0].email.should.equal(campaign.players[0].email);
          resCamp.players[0].session.should.equal(campaign.players[0].session);
          resCamp.players[0].expGained.should.equal(
            campaign.players[0].expGained
          );
          resCamp.players[0].currentLoot.should.equal(
            campaign.players[0].currentLoot
          );
        });
    });
  });

  describe("POST endpoint", function() {
    it("should save a new Campaign", function() {
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
      const newCamp = {
        title: faker.company.companyName(),
        players: [
          {
            playerName: faker.name.firstName(),
            statSheet: faker.internet.url(),
            email: faker.internet.email(),
            session: 4,
            expGained: 600,
            currentLoot: faker.commerce.product(),
            campaignName: faker.company.companyName()
          }
        ]
      };
      return chai
        .request(app)
        .post("/api/campaigns")
        .send(newCamp)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.include.keys("__v", "_id", "title", "players");
          res.body.title.should.equal(newCamp.title);
          res.body._id.should.not.be.null;
          return Campaign.findById(res.body._id);
        })
        .then(function(savedCamp) {
          savedCamp.title.should.equal(newCamp.title);
          savedCamp.players[0].playerName.should.equal(
            newCamp.players[0].playerName
          );
          savedCamp.players[0].statSheet.should.equal(
            newCamp.players[0].statSheet
          );
          savedCamp.players[0].email.should.equal(newCamp.players[0].email);
          savedCamp.players[0].session.should.equal(newCamp.players[0].session);
          savedCamp.players[0].expGained.should.equal(
            newCamp.players[0].expGained
          );
          savedCamp.players[0].currentLoot.should.equal(
            newCamp.players[0].currentLoot
          );
        });
    });
  });

  describe("PUT endpoint", function() {
    it("should update campaign data on send", function() {
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
      const newData = {
        title: "better group",
        players: [
          {
            playerName: "Bruxa",
            statSheet: "somelink.com",
            email: "steve@email1.com",
            session: 4,
            expGained: 500,
            currentLoot: "spear, axe, potion"
          }
        ]
      };
      return Campaign.findOne()
        .then(updatedData => {
          newData._id = updatedData._id;
          return chai
            .request(app)
            .put(`/api/campaigns/${updatedData._id}`)
            .send(newData);
        })
        .then(res => {
          res.should.have.status(204);
          return Campaign.findById(newData._id);
        })
        .then(updatedData => {
          updatedData.title.should.equal(newData.title);
          updatedData.players[0].playerName.should.equal(
            newData.players[0].playerName
          );
          updatedData.players[0].statSheet.should.equal(
            newData.players[0].statSheet
          );
          updatedData.players[0].email.should.equal(newData.players[0].email);
          updatedData.players[0].session.should.equal(
            newData.players[0].session
          );
          updatedData.players[0].expGained.should.equal(
            newData.players[0].expGained
          );
          updatedData.players[0].currentLoot.should.equal(
            newData.players[0].currentLoot
          );
        });
    });
  });

  describe("DELETE endpoint", function() {
    it("should delete campaign by id", function() {
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
      let camp;
      return Campaign.findOne()
        .then(_camp => {
          camp = _camp;
          return chai.request(app).delete(`/api/campaigns/${camp.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Campaign.findById(camp.id);
        })
        .then(_camp => {
          should.not.exist(_camp);
        });
    });
  });
});