import { eq } from "drizzle-orm";
import { dbClient, dbConn } from "@db/client";
import { users, stores, tables, favorites, reservations } from "@db/schema";

// Insert data into tables
async function insertData() {
  // Insert into users
  const insertedUsers = await dbClient
    .insert(users)
    .values([
      {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "securepassword",
        role: "owner",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "securepassword",
        role: "staff",
      },
    ])
    .returning();

  // Get user IDs
  const ownerId = insertedUsers[0].userId;
  const staffId = insertedUsers[1].userId;

  // Insert into stores
  const insertedStores = await dbClient
    .insert(stores)
    .values({
      ownerId,
      staffId,
      name: "Store 1",
      openTimeBooking: "09:00-18:00",
      cancelReserve: "24 hours",
    })
    .returning();

  // Get store ID
  const storeId = insertedStores[0].storeId;

  // Insert into tables
  const insertedTables = await dbClient
    .insert(tables)
    .values({
      storeId,
      tableNumber: 1,
      status: "available",
    })
    .returning();

  // Get table ID
  const tableId = insertedTables[0].tableId;

  // Insert into favorites
  await dbClient.insert(favorites).values({
    customerId: ownerId,
    storeId,
  });

  // Insert into reservations
  await dbClient.insert(reservations).values({
    tableId,
    numberOfTable: 1,
    customerId: ownerId,
    reservationTime: new Date(),
    numberOfPeople: 2,
    customerName: "John Doe",
    customerPhone: "1234567890",
  });

  dbConn.end();
}

// Query data from tables
async function queryData() {
  // Query users
  const userResults = await dbClient.query.users.findMany();
  console.log(userResults);

  // Query stores
  const storeResults = await dbClient.query.stores.findMany();
  console.log(storeResults);

  // Query tables
  const tableResults = await dbClient.query.tables.findMany();
  console.log(tableResults);

  // Query favorites
  const favoriteResults = await dbClient.query.favorites.findMany();
  console.log(favoriteResults);

  // Query reservations
  const reservationResults = await dbClient.query.reservations.findMany();
  console.log(reservationResults);

  dbConn.end();
}

// Update data in tables
async function updateData() {
  // Update a user
  const userResults = await dbClient.query.users.findMany();
  if (userResults.length > 0) {
    const userId = userResults[0].userId;
    await dbClient
      .update(users)
      .set({
        name: "Jane Doe",
      })
      .where(eq(users.userId, userId));
  }

  // Update a store
  const storeResults = await dbClient.query.stores.findMany();
  if (storeResults.length > 0) {
    const storeId = storeResults[0].storeId;
    await dbClient
      .update(stores)
      .set({
        name: "Updated Store",
      })
      .where(eq(stores.storeId, storeId));
  }

  // Update a table
  const tableResults = await dbClient.query.tables.findMany();
  if (tableResults.length > 0) {
    const tableId = tableResults[0].tableId;
    await dbClient
      .update(tables)
      .set({
        status: "occupied",
      })
      .where(eq(tables.tableId, tableId));
  }

  // Update a favorite
  const favoriteResults = await dbClient.query.favorites.findMany();
  if (favoriteResults.length > 0) {
    const favoriteId = favoriteResults[0].favoriteId;
    await dbClient
      .update(favorites)
      .set({
        customerId: 2,
      })
      .where(eq(favorites.favoriteId, favoriteId));
  }

  // Update a reservation
  const reservationResults = await dbClient.query.reservations.findMany();
  if (reservationResults.length > 0) {
    const reservationId = reservationResults[0].reservationId;
    await dbClient
      .update(reservations)
      .set({
        numberOfPeople: 4,
      })
      .where(eq(reservations.reservationId, reservationId));
  }

  dbConn.end();
}

// Delete data from tables
async function deleteData() {
  // Delete a user
  const userResults = await dbClient.query.users.findMany();
  if (userResults.length > 0) {
    const userId = userResults[0].userId;
    await dbClient.delete(users).where(eq(users.userId, userId));
  }

  // Delete a store
  const storeResults = await dbClient.query.stores.findMany();
  if (storeResults.length > 0) {
    const storeId = storeResults[0].storeId;
    await dbClient.delete(stores).where(eq(stores.storeId, storeId));
  }

  // Delete a table
  const tableResults = await dbClient.query.tables.findMany();
  if (tableResults.length > 0) {
    const tableId = tableResults[0].tableId;
    await dbClient.delete(tables).where(eq(tables.tableId, tableId));
  }

  // Delete a favorite
  const favoriteResults = await dbClient.query.favorites.findMany();
  if (favoriteResults.length > 0) {
    const favoriteId = favoriteResults[0].favoriteId;
    await dbClient
      .delete(favorites)
      .where(eq(favorites.favoriteId, favoriteId));
  }

  // Delete a reservation
  const reservationResults = await dbClient.query.reservations.findMany();
  if (reservationResults.length > 0) {
    const reservationId = reservationResults[0].reservationId;
    await dbClient
      .delete(reservations)
      .where(eq(reservations.reservationId, reservationId));
  }

  dbConn.end();
}

// Uncomment the function you want to run
insertData();
// queryData();
// updateData();
// deleteData();
