const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {Player, Campaign} = require('../models');
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
            .get('/load')
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
    });

})

