// controllers/favoriteController.ts

import { Request, Response } from "express";
import { Favorite } from "../models/favorite";

let favorites: Favorite[] = [];

// Get all favorites
export const getAllFavorites = (req: Request, res: Response) => {
  res.json(favorites);
};

// Get a favorite by ID
export const getFavoriteById = (req: Request, res: Response) => {
  const favorite = favorites.find(f => f.favoriteId === parseInt(req.params.id));
  if (favorite) {
    res.json(favorite);
  } else {
    res.status(404).send("Favorite not found");
  }
};

// Create a new favorite
export const createFavorite = (req: Request, res: Response) => {
  const newFavorite: Favorite = req.body;
  favorites.push(newFavorite);
  res.status(201).json(newFavorite);
};

// Update a favorite
export const updateFavorite = (req: Request, res: Response) => {
  const favoriteIndex = favorites.findIndex(f => f.favoriteId === parseInt(req.params.id));
  if (favoriteIndex !== -1) {
    favorites[favoriteIndex] = req.body;
    res.json(favorites[favoriteIndex]);
  } else {
    res.status(404).send("Favorite not found");
  }
};

// Delete a favorite
export const deleteFavorite = (req: Request, res: Response) => {
  favorites = favorites.filter(f => f.favoriteId !== parseInt(req.params.id));
  res.status(204).send();
};