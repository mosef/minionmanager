const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {Campaign} = require('../models/campaign')
const {app, runServer, closeServer} = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const should = chai.should();
chai.use(chaiHttp);

function seedCampaignData() {
    console.info('seeding campaign data');
    const seedData = [];
    for (let i=1; i<=4; i++) {
		seedData.push({
			title: faker.company.companyName(),
			players: [{
					playerName: faker.name.firstName(),
					statSheet: faker.internet.url(),
					email: faker.internet.email(),
					session: 2,
					expGained: 300,
					currentLoot: faker.commerce.product(),
					campaignName: faker.company.companyName()
			}]
			
		});
    }
    return Campaign.insertMany(seedData);
}
function teardownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting Database');
        mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err))
    });
}

describe('Campaign Manager API resource', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
      });
    beforeEach(function() {
        return seedCampaignData();
    });
    afterEach(function() {
        return teardownDb();
    })
    after(function() {
        return closeServer();
    });
     
    describe('GET endpoint', function() {
        it('should list campaign details on GET', function() {
            let res;
            return chai.request(app)
            .get('/api/campaigns')
            .then(_res => {
                res = _res;
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.length.of.at.least(1);
                return Campaign.count();
            })
            .then(count => {
                res.body.should.have.lengthOf(count);
            })
		  })
		  it('should check for correct fields', function() {
            let resCamp;
            return chai.request(app)
            .get('/api/campaigns')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length.of.at.least(1);
                res.body.forEach(function(campaign) {
                campaign.should.be.a('object');
                campaign.should.include.keys('__v','_id', 'title', 'players');
                });
                resCamp = res.body[0];
                console.log('.......................')
                console.log('.......................')
                console.log('.......................')
                console.log(resCamp);
                return Campaign.findById(resCamp._id);
            })
           .then(campaign => {
              resCamp.title.should.equal(campaign.title);
              resCamp.players[0].playerName.should.equal(campaign.players[0].playerName);
              //use prev method to test remaining keys
            });

          })
    });

    describe('POST endpoint', function() {
        it('should save a new Campaign', function() {
            const newCamp = {
                title: faker.company.companyName(),
                players: [{
                playerName: faker.name.firstName(),
                statSheet: faker.internet.url(),
                email: faker.internet.email(),
                session: 4,
                expGained: 600,
                currentLoot: faker.commerce.product(),
                campaignName: faker.company.companyName()
			    }]
            };
    //should check for correct params
            return chai.request(app)
            .post('/api/campaigns')
            .send(newCamp)
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys(
                '__v','_id', 'title', 'players');
                res.body.title.should.equal(newCamp.title);
                res.body._id.should.not.be.null;
                return Campaign.findById(res.body._id);
            })
            .then(function(save) {
                save.title.should.equal(newCamp.title);
               // save.players.should.equal(newCamp.players);
            });
        });
    });

    describe('PUT endpoint', function() {
        it('should update campaign data on send', function() {
            const updateData = {
                title: 'better group',
                players: [
                    {
                        playerName: "Bruxa",
                        statSheet: "somelink.com",
                        email: "steve@email1.com",
                        session: 4,
                        expGained: 500,
                        currentLoot: "spear, axe, potion"
                    }
                ],
            };
            return Campaign
            .findOne()
            .then(overWrite => {
                console.log('=======================')
                console.log('=======================')
                console.log('=======================')
                console.log(overWrite);
                updateData._id = overWrite._id;
                return chai.request(app)
                .put(`/api/campaigns/${overWrite._id}`)
                .send(updateData);
            })
            .then(res => {
                res.should.have.status(204);
                return Campaign.findById(updateData._id);
            })
            .then(overWrite => {
                console.log('=======================')
                console.log('=======================')
                console.log('........................')
                console.log(overWrite);
                console.log('........................')
                overWrite.title.should.equal(updateData.title);
                //overWrite.players.should.equal(updateData.players);
            });
        });
    });

    describe('DELETE endpoint', function() {
        it('should delete campaign by id', function() {
            let camp;
            return Campaign
            .findOne()
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

})

