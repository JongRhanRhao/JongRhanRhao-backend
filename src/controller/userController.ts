// controllers/userController.ts

import { Request, Response } from "express";
import { User } from "../models/users";

// Example in-memory data store
let users: User[] = [];

// Get all users
export const getAllUsers = (req: Request, res: Response) => {
  res.json(users);
};

// Get a user by ID
export const getUserById = (req: Request, res: Response) => {
  const user = users.find(u => u.userId === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
};

// Create a new user
export const createUser = (req: Request, res: Response) => {
  const newUser: User = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
};

// Update a user
export const updateUser = (req: Request, res: Response) => {
  const userIndex = users.findIndex(u => u.userId === parseInt(req.params.id));
  if (userIndex !== -1) {
    users[userIndex] = req.body;
    res.json(users[userIndex]);
  } else {
    res.status(404).send("User not found");
  }
};

// Delete a user
export const deleteUser = (req: Request, res: Response) => {
  users = users.filter(u => u.userId !== parseInt(req.params.id));
  res.status(204).send();
};