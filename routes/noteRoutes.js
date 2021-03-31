import express from 'express';
import {notesController} from "../controllers/notesController.js";
const router = express.Router();

router.get("/", notesController.showIndex.bind(notesController));
export const noteRoutes = router;