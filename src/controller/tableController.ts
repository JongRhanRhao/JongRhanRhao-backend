// controllers/tableController.ts

import { Request, Response } from "express";
import { Tables } from "../models/tables";

let tables: Tables[] = [];

// Get all tables
export const getAllTables = (req: Request, res: Response) => {
  res.json(tables);
};

// Get a table by ID
export const getTableById = (req: Request, res: Response) => {
  const table = tables.find(t => t.tableId === parseInt(req.params.id));
  if (table) {
    res.json(table);
  } else {
    res.status(404).send("Table not found");
  }
};

// Create a new table
export const createTable = (req: Request, res: Response) => {
  const newTable: Tables = req.body;
  tables.push(newTable);
  res.status(201).json(newTable);
};

// Update a table
export const updateTable = (req: Request, res: Response) => {
  const tableIndex = tables.findIndex(t => t.tableId === parseInt(req.params.id));
  if (tableIndex !== -1) {
    tables[tableIndex] = req.body;
    res.json(tables[tableIndex]);
  } else {
    res.status(404).send("Table not found");
  }
};

// Delete a table
export const deleteTable = (req: Request, res: Response) => {
  tables = tables.filter(t => t.tableId !== parseInt(req.params.id));
  res.status(204).send();
};