'use strict';

import PickupUserEvent from '../../api/pickupUserEvent/pickupUserEvent.model';
import Season from '../../api/season/season.model';
import PickupOption from '../../api/pickupOption/pickupOption.model';
import Basket from '../../api/basket/basket.model';
import User from '../../api/user/user.model';
import PickupEvent from '../../api/pickupEvent/pickupEvent.model';
import * as Utils from './utils';
import _ from 'lodash';
import email from 'emailjs';
import config from '../../config/environment';

/**
 * When a pickup event is updated or saved, assert that the correct user events
 * are present afterwards.
 */
export function onUpdatePickupEvent(pickupEvent) {
  // Look for associated pickup user events
  PickupUserEvent.find({'pickupEvent': pickupEvent}).then((userEvents, err) => {
    // Find the associated season baskets
    Basket.find({'season': pickupEvent.season, 'pickupOption': pickupEvent.pickupOption}).then((baskets, err) => {
      // TODO
    });
  });
}

/**
 * Remove user events once pickup event are removed
 */
export function onRemovePickupEvent(pickupEvent) {
  PickupUserEvent.remove({'pickupEvent': pickupEvent}).then((res, err) => {
    PickupUserEvent.remove({'pickupEventOverride': pickupEvent}).exec();
  });
}


/**
 * Given a pickup event, return the legitimate alternatives.
 */
export function getAlternativesFor(pickupEvent, callback) {

  PickupOption.findById(pickupEvent.pickupOption)
  .then((pickupOption, err) => {
    Season.findById(pickupEvent.season)
    .then((season, err) => {
      let candidateQuery = {
        season: pickupEvent.season,
        '$and': [
          {eventNumber: {'$gte': pickupEvent.eventNumber-1}},
          {eventNumber: {'$lte': pickupEvent.eventNumber+1}}
        ]
      };
      PickupEvent.find(candidateQuery)
      .populate('pickupOption')
      .populate('pickupOptionOverride')
      .then((candidates, err) => {
        let now = new Date().getTime();
        let startDate = Utils.getStartDateForPickupEvent(season, pickupOption, pickupEvent).getTime();
        let hoursToMs = 60*60*1000;
        let eventInterval = 24 * hoursToMs * (season.eventIntervalInDays-1);
        let lowerBound = startDate - eventInterval;
        let upperBound = startDate + eventInterval;

        // Can we still change the pickup event?
        if (now < (startDate-(pickupOption.hoursBeforeLocking*hoursToMs))) {
          let results = [];
          _.each(candidates, candidate => {
            let altStartDate = Utils.getStartDateForPickupEvent(season, candidate.pickupOption, candidate).getTime();
            // Can the alternative event still be used?
            if (altStartDate>=lowerBound &&
                altStartDate<=upperBound &&
                (now < (altStartDate-(candidate.pickupOption.hoursBeforeLocking*hoursToMs)))) {
              results.push(candidate);
            }
          });
          callback(results);
        } else {
          callback(null);
        }
      });
    });
  });
}

/**
 * Send an e-mail message to the attendants of a certain event.
 */
export function sendMail(pickupEvent, mail, callback) {

  return PickupUserEvent.find(
    {'$or': [
      {pickupEvent: pickupEvent._id, pickupEventOverride: null},
      {pickupEventOverride: pickupEvent._id}
    ]})
    .populate({path: 'basket', populate: { path: 'membership' }})
    .exec()
    .then(userEvents => {
      if (!userEvents) {
        return callback(false);
      }
      let userIds = _.map(userEvents, 'basket.membership._id');
      User.find({'membership': {'$in': userIds}})
      .then(users => {
        if (!users) {
          return callback(false);
        }
        let emails = _.map(users, 'email');
        return sendMailTo(email, mail.subject, mail.message, callback);
      });
    });
}



function sendMailTo(emails, subject, message, callback) {
  if (config.email) {
    var server  = email.server.connect({
      user:    config.email.username,
      password:config.email.password,
      host:    config.email.smtp,
      ssl:     true
    });

    let receiver = config.source;
    let cc = '';
    _.each(emails, email => {
      cc += ','+email;
    })

    server.send({
     text:    message,
     from:    config.email.sourceMail,
     to:      config.email.sourceMail,
     cc:      cc,
     subject: subject
    }, function(err, message) {
      console.log(err || message);
      callback(err ? false : true);
    });
  }
}
