import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
  addPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientsController.js";
const router = express.Router();
router.route("/").get(checkAuth, getPatients).post(checkAuth, addPatient);
router
  .route("/:id")
  .get(checkAuth, getPatient)
  .put(checkAuth, updatePatient)
  .delete(checkAuth, deletePatient);
export default router;