export interface Concert {
  _id: string;
  organiser: string; // Replace with the actual User type
  venue: string;
  date: Date;
  tickets: string[]; // Replace with the actual Ticket type
}
