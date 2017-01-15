/**
* Populate DB with sample data on server start
* to disable, edit config/environment/index.js, and set `seedDB: false`
*/

'use strict';
import Season from '../api/season/season.model';
import Membership from '../api/membership/membership.model';
import PickupOption from '../api/pickupOption/pickupOption.model';
import PickupEvent from '../api/pickupEvent/pickupEvent.model';
import PickupUserEvent from '../api/pickupUserEvent/pickupUserEvent.model';
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
//var seededUsers = [];
//var seededBaskets = [];

removePickupEvents();

function removePickupEvents() {
  PickupEvent.find({})
    .remove()
    .then(() => {
      removePickupUserEvents();
    });
}

function removePickupUserEvents() {
  PickupUserEvent.find({})
    .remove()
    .then(() => {
      createPickupOptions();
    });
}

function createPickupOptions() {
  PickupOption.find({}).remove()
  .then(() => {
    PickupOption.create(devPickupOptions)
    .then(pickupOptions => {
      seededPickupOptions = pickupOptions;
      createSeasons();
    });
  });
}


function createSeasons() {
  Season.find({}).remove()
  .then(() => {
    _.each(devSeasons, season => {
      season.activePickupOptions = [];
      _.each(seededPickupOptions, pickupOption => {
        let active = _.random(0, 1, true);
        if (active<0.1) {
          season.activePickupOptions.push(pickupOption);
        }
      });
    });

    Season.create(devSeasons)
    .then(seasons => {
      seededSeasons = seasons;
      createMembers();
    });
  });
}

function createMembers() {
  Membership.find({}).remove()
  .then(() => {
    Membership.create(devMemberships)
    .then(memberships => {
      seededMemberships = memberships;
      createUsers();
    });
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
    .then(/*users*/() => {
      //seededUsers = users;
      createBaskets();
    });
  });
}

function createBaskets() {
  var newBaskets = [];
  _.each(seededMemberships, membership => {
    let seasons = _.random(1, 4);
    for(let i = 0; i < seasons; ++i) {
      newBaskets.push({
        membership: membership,
        season: _.sample(seededSeasons),
        defaultPickupOption: _.sample(seededPickupOptions)
      });
    }
  });

  Basket.create(newBaskets)
  .then(/*baskets*/() => {
    //seededBaskets = baskets;
    console.log('Data seeded.');
  });
}
