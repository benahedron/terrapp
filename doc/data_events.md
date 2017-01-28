# Data events

The creation of entities in the database triggers updates on other data. These updates are handled
through events.


# Influences
## Season
### Save
- **PickupEvent**

  *Required actions:*
  - [x]Make sure all associated PickupEvents in the season do exist, but not more, based on the number of events.

### Delete
- **PickupEvent**

  *Required actions:*
  - [x]Delete all associated PickupEvents (and implicitly delete the PickupUserEvents).

## Basket
### Save
- **PickupEvent**

  *Required actions:*  
  - [x]Make sure the associated PickupEvents related to the basket do exist.

### Delete
- **PickupEvent**

  *Required actions:*
  - [x]Delete all associated PickupEvents (this will implicitly delete the PickupUserEvents).

## PickupEvent
### Save
- **PickupUserEvent**

  *Required actions:*
  - [ ]Create PickupUserEvent
  - [ ]Validate PickupUserEvent for override conflicts.
### Delete
- **PickupUserEvent**

  *Required actions:*
  - [x]Delete all associated pickup user events.
  - [ ]What about associated pickup user events that have  override to "still existing event"?

## PickupOption
### Save
- **PickupUserEvent**

  *Required actions:*
  - [ ]Validate for conflicts (hoursBeforeLocking).

- **PickupEvent**

  *Required actions:*
  - [x]Assert that for each season that has this option as an "activeOption", there are the right amount of pickup events.
  - [ ]Validate for conflicts (hoursBeforeLocking).
- **Basket**

  *Required actions:*  
  - [ ]If indicated set all that have default pickup set to null, to this value.

### Delete
- **Basket**

  *Required actions:*
  - [ ]Reset default pickup option to null. A big warning is required for this case.

- **PickupEvent**

  *Required actions:*
  - [x]Delete PickupEvents with this "PickupOption". A big warning is required for this (e.g. ).

## Membership
### Save
- None

### Delete
- **Basket**

  *Required actions:*
  - [ ]Delete all associated baskets.
