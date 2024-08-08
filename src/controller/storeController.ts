// controllers/storeController.ts

import { Request, Response } from "express";
import { Stores } from "../models/stores";

let stores: Stores[] = [];

// Get all stores
export const getAllStores = (req: Request, res: Response) => {
  res.json(stores);
};

// Get a store by ID
export const getStoreById = (req: Request, res: Response) => {
  const store = stores.find(s => s.storeId === parseInt(req.params.id));
  if (store) {
    res.json(store);
  } else {
    res.status(404).send("Store not found");
  }
};

// Create a new store
export const createStore = (req: Request, res: Response) => {
  const newStore: Stores = req.body;
  stores.push(newStore);
  res.status(201).json(newStore);
};

// Update a store
export const updateStore = (req: Request, res: Response) => {
  const storeIndex = stores.findIndex(s => s.storeId === parseInt(req.params.id));
  if (storeIndex !== -1) {
    stores[storeIndex] = req.body;
    res.json(stores[storeIndex]);
  } else {
    res.status(404).send("Store not found");
  }
};

// Delete a store
export const deleteStore = (req: Request, res: Response) => {
  stores = stores.filter(s => s.storeId !== parseInt(req.params.id));
  res.status(204).send();
};