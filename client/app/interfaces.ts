

interface IPickupOption {
  _id: string;
  name: string;
  geoUri: string;
  weekDay: number;
  startMinute: number;
  durationMinutes: number;
  hoursBeforeLocking: number;
  active: boolean;
}

interface ISeason {
  _id: string;
  eventIntervalInDays: number;
  firstEventDate: string;
  numberOfEvents: number;
  name: string;
  activePickupOptions: IPickupOption[];
}

interface IMail {
  _id: string;
  date: string;
  sent: boolean;
  subject: string;
  message: string;
}

interface IPickupEvent {
  _id: string;
  season: ISeason;
  pickupOption: IPickupOption;
  eventNumber: number;
  adminNote: string;
  pickupOptionOverride: IPickupOption;
  startDateOverride: string;
  durationMinutesOverride: number;
  canceled: boolean;
  mails: IMail[];
  // TODO: Only used for overriging now. Should be handled differently
  startDate: Date;
}

interface IPickupUserEvent{
  _id: string;
  pickupEvent: IPickupEvent;
  //basket: {type: Schema.Types.ObjectId, ref: 'Basket'},
  pickupEventOverride: IPickupEvent;
  absent: boolean;
  done: boolean;
  delegate: string;
  userNote: string;
  editable: boolean;
}

interface IUser {
  _id: string;
  email: string;
  role: string;
  password: string;
  membership: IMembership
}

interface IMembership {
  _id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  country: string;
}

interface IBasket {
  _id: string;
  membership: IMembership;
  season: ISeason;
  defaultPickupOption: IPickupOption;
}

interface ISeasonUtilsService{
  getDateForInterval(season: ISeason, number: number) ;
}

interface IPickupUtilsService{
  getDateForInterval: Function;
  getStartDateFor(season: ISeason, pickupOption: IPickupOption, pickupEvent: IPickupEvent);
  getEndDateFor(season: ISeason, pickupOption: IPickupOption, pickupEvent: IPickupEvent);
}

interface IPickupOptionsService{
  reload();
  get();
}

interface IOptionsService{
  reload();
  getActiveSeason();
  setActiveSeason(season: ISeason);
}
