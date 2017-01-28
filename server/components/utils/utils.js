/**
 * Timing utils
 */

'use strict';


/**
 * Check is a user event is already done
 */
export function isOldEvent(season, userEvent) {
  var actualEvent = userEvent.pickupEventOverride || userEvent.pickupEvent;
  let now = new Date().getTime();
  let eventDate = getStartDateForPickupEvent(season, actualEvent.pickupOption, actualEvent);
  return now >= eventDate.geTime();
}

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
export function getStartDateForPickupEvent(season, pickupOption, pickupEvent) {
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
