import mongoose from "mongoose";
import tokenGenerator from "../helpers/generateToken.js";
import bcrypt from "bcrypt";
const veterinarySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    default: null,
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: tokenGenerator(),
  },
  confirm: {
    type: Boolean,
    default: false,
  },
});
veterinarySchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
veterinarySchema.methods.confirmPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
};
const Veterinary = mongoose.model("Veterinary", veterinarySchema);
export default Veterinary;