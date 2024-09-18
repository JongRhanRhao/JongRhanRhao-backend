import express from "express";
import { updateUserProfile } from "../controller/userController";

const router = express.Router();

router.put("/update/:id", updateUserProfile);

export default router;
