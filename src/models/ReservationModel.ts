export interface Reservation {
  reservedId: number;
  userId: number;
  placeId: number;
  createdAt: string;
  modifiedAt: string;
  people: number;
  reservedDate: string;
  visitTime: string;
  status: string;
}
