import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const pool = new Pool({
  host: process.env.POSTGRES_HOST,         // Should be 'localhost'
  port: parseInt(process.env.POSTGRES_PORT || "5432"),  // Ensure the port is correct
  user: process.env.POSTGRES_USER,         // Should be 'postgres'
  password: process.env.POSTGRES_PASSWORD, // Password for 'postgres' user
  database: process.env.POSTGRES_DB,       // Should be 'jongrhanrhaodb'
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;