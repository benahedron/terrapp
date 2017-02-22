/**
 * Timing utils
 */

'use strict';
import _ from 'lodash';


/**
 * @return the start date for a given season interval
 */
export function getDateForSeasonInterval(season, number) {
  let start = new Date(season.firstEventDate);
  return new Date(start.getTime() + 24*60*60*1000*number*season.eventIntervalInDays);
}

/**
 * @return the start date (incl. time) for a given pickup event. Respecting eventual overrides.
 */
export function getStartDateFor(season, pickupOption, pickupEvent) {
  if (!pickupEvent.startDateOverride) {
    let day = getDateForSeasonInterval(season, pickupEvent.eventNumber);
    let startMinute = pickupOption.startMinute;
    let offsetInMinutes = (pickupOption.weekDay) * 24 * 60 + startMinute;
    return new Date(day.getTime() + offsetInMinutes * 60000);
  } else {
    return new Date(pickupEvent.startDateOverride);
  }
}

/**
 * @return the end date (incl. time) for a given pickup event. Respecting eventual overrides.
 */
export function getEndDateFor(season, pickupOption, pickupEvent) {
  let durationMinutes = pickupEvent.durationMinutesOverride || pickupOption.durationMinutes;
  let date = null;
  if (!pickupEvent.startDateOverride) {
    let day = getDateForSeasonInterval(season, pickupEvent.eventNumber);
    let startMinute = pickupOption.startMinute;
    let offsetInMinutes = (pickupOption.weekDay) * 24 * 60 + startMinute + durationMinutes;
    return new Date(day.getTime() + offsetInMinutes * 60000);
  } else {
    return new Date(new Date(pickupEvent.startDateOverride).getTime() + 60000 * durationMinutes);
  }
}

/**
 * Compute a user event start date with all possible debug output.
 */
export function getUserEventStartDate(userEvent)  {
  let actualBasket = userEvent.basket;
  if (!actualBasket || !_.isObject(actualBasket)){
    throw new Error("Basket missing/not developed in user event");
  }

  let actualSeason = actualBasket.season;
  if (!actualSeason || !_.isObject(actualBasket)){
    throw new Error("Season missing in basket of user event");
  }

  let actualPickupEvent = userEvent.pickupEventOverride || userEvent.pickupEvent;
  if (!actualPickupEvent || !_.isObject(actualPickupEvent)){
    throw new Error("Actual PickupEvent missing or not populated in user event");
  }

  let actualPickupOption = actualPickupEvent.pickupOption;
  if (!actualPickupOption || !_.isObject(actualPickupOption)){
    throw new Error("Actual PickupOption missing or not populated in actual pickup event of user event");
  }

  return getStartDateFor(actualSeason, actualPickupOption, actualPickupEvent);
}

/**
 * Check is a user event is already done
 */
export function isOldUserEvent(userEvent) {
  let now = new Date().getTime();
  let eventDate = getUserEventStartDate(userEvent);
  return now >= eventDate.getTime();
}


/**
 * @return true if the event is still editable
 */
export function isEditableUserEvent(userEvent) {
  let now = new Date().getTime();
  let hoursToMs = 60*60*1000;
  let startDate = getUserEventStartDate(userEvent);
  console.log(startDate);
  // Can we still change the pickup event?
  let actualPickupEvent = userEvent.pickupEventOverride || userEvent.pickupEvent;
  let actualPickupOption = actualPickupEvent.pickupOption;
  if (now < (startDate.getTime()-(actualPickupOption.hoursBeforeLocking*hoursToMs))) {
    return true;
  } else {
    return false;
  }
}
