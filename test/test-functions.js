const faker = require("faker");
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const User = require('../models/user-model');
const { Campaign } = require("../models/campaign");

function teardownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting Database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedMinionManagerDatabase() {
  console.info("seeding user data & campaign data");
  const seedUserData = [];
  const seedCampaignData = [];
  let i=0;
  while (i<10) {
    seedUserData.push(createNewUser());
    seedCampaignData.push(createNewCampaign());
    i++;
  };
  const insertUserData = User.insertMany(seedUserData);
  const insertCampaignData = Campaign.insertMany(seedCampaignData);
  return Promise.all([insertUserData, insertCampaignData])
}

function createNewUser() {
  const newUser = {
    username: faker.name.title(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  }
  return newUser;
};

let username = createNewUser.username;
let password = createNewUser.password;

function createNewCampaign() {
  const newCampaign = {
    title: faker.company.companyName(),
    players: [
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
  }
  return newCampaign;
}

module.exports = {
seedMinionManagerDatabase,
createNewCampaign,
createNewUser,
teardownDb,
username,
password}
                