import express from "express";
import { updateUserProfile } from "../controller/userController.js";

const router = express.Router();

router.put("/update/:id", updateUserProfile);

export default router;
