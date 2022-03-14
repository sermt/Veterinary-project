import mongoose from "mongoose";
import tokenGenerator from "../helpers/generateToken.js";
import bcrypt from "bcrypt";
const patientsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
      trim: true,
    },
    telephone: {
      type: String,
      default: null,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default:Date.now(),
    },
    symptoms: {
      type: String,
      default: null,
      trim: true,
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Veterinary",
    },
  },
  { timestamps: true }
);

const Patients = mongoose.model("Patients", patientsSchema);
export default Patients;
