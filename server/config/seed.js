/**
* Populate DB with sample data on server start
* to disable, edit config/environment/index.js, and set `seedDB: false`
*/

'use strict';
import Season from '../api/season/season.model';
import Membership from '../api/membership/membership.model';
import PickupOption from '../api/pickupOption/pickupOption.model';
import User from '../api/user/user.model';
import Basket from '../api/basket/basket.model';
import _ from 'lodash';

var devSeasons = require('./dev.season.seed.json');
var devPickupOptions = require('./dev.pickupoption.seed.json');
var devMemberships = require('./dev.membership.seed.json');
var devUsers = require('./dev.user.seed.json');

var seededSeasons = [];
var seededPickupOptions = [];
var seededMemberships = [];
var seededUsers = [];
var seededBaskets = [];

function createSeasons() {
  Season.find({}).remove()
  .then(() => {
    Season.create(devSeasons).
      then(seasons => {
        seededSeasons = seasons;
        createPickupOptions();
      });
  });
}


function createPickupOptions() {
  PickupOption.find({}).remove()
  .then(() => {
    PickupOption.create(devPickupOptions)
      .then((pickupOptions) => {
        seededPickupOptions = pickupOptions;
        createMembers();
      })
  });
}

function createMembers() {
  Membership.find({}).remove()
  .then(() => {
    Membership.create(devMemberships)
      .then((memberships) => {
        seededMemberships = memberships;
        createUsers();
      })
  });
}

function createUsers() {
  User.find({}).remove()
  .then(() => {
    _.each(seededMemberships, (member, index) => {
        devUsers[index].membership = member;
    });

    _.each(devUsers, user => {
      user.provider = 'local';
    });

    User.create(devUsers)
    .then((users) => {
      seededUsers = users;
      createBaskets();
    });
  });
}

function createBaskets() {
  var baskets = [];
  _.each(seededMemberships, (membership) => {
    let seasons = _.random(1,4);
    for(let i = 0; i < seasons; ++i) {
      baskets.push({
        membership: membership,
        season: _.sample(seededSeasons),
        defaultPickupOption: _.sample(seededPickupOptions)
      });
    }
  });

  Basket.create(baskets)
  .then(function(baskets) {
    seededBaskets = baskets;
    console.log("Data seeded.");
  });
};

createSeasons();
