export interface Reservation {
    reservationId: number;
    customerId: number;
    storeId: number;
    tableId: number;
    reservationTime: string;
    reservationDate: string;
    status: string;
    numberOfPeople: number;
    message: string;
    createdAt: string;
    updatedAt: string;
}