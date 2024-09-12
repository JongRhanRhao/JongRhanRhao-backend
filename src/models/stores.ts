export interface Stores {
  storeId: string;
  ownerId: string;
  staffId: string[];
  name: string;
  openTimeBooking: string;
  cancelReserve: string;
  isFavorite: boolean;
  isPopular: boolean;
  type: string[];
  description?: string;
  rating?: number;
  imageUrl?: string[];
  maxSeats?: number;
  currSeats?: number;
}