const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const passport = require('passport');
const { Campaign } = require("../models/campaign");
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const {BasicStrategy} = require('passport-http');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {User} = require('../models/user-model');
const {JWT_SECRET} = require('../config');
const should = chai.should();
chai.use(chaiHttp);

function seedCampaignData() {
    console.info("seeding campaign data");
    const seedData = [];
    for (let i = 1; i <= 4; i++) {
      seedData.push({
        name: faker.company.companyName(),
        password: [
          {
            playerName: faker.name.firstName(),
            statSheet: faker.internet.url(),
            email: faker.internet.email(),
            session: 2,
            expGained: 300,
            currentLoot: faker.commerce.product(),
            campaignName: faker.company.companyName()
          }
        ]
      });
    }
    return Campaign.insertMany(seedData);
  }
  function teardownDb() {
    return new Promise((resolve, reject) => {
      console.warn("Deleting Database");
      mongoose.connection
        .dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
  
  describe("Campaign Manager API resource", function() {
    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function() {
      return seedCampaignData();
    });
    afterEach(function() {
      return teardownDb();
    });
    after(function() {
      return closeServer();
    });

    describe("User Registration POST endpoint", function() {
        it("should register a new user on POST", function() {
          const newUser = {
            username: faker.name.firstName(),
            password: faker.internet.password(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
            //think about adding email as registration requirement?
          };
          return chai
            .request(app)
            .post("/users/register")
            .send(newUser)
            .then(function(res) {
              res.should.have.status(201);
              res.should.be.json;
              res.body.should.be.a("object");
              res.body.should.include.keys("_id","username", "firstName", "lastName");
              res.body.username.should.equal(newUser.username);
              return User.findById(res.body._id)
            })
            .then(function(regUser) {
              regUser.username.should.equal(newUser.username);
              regUser.firstName.should.equal(newUser.firstName);
              regUser.lastName.should.equal(newUser.lastName); 
            });
        });
    });

});