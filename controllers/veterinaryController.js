import jwtGenerator from "../helpers/generateJWT.js";
import tokenGenerator from "../helpers/generateToken.js";
import Veterinary from "../models/Veterinary.js";
import emailRegistry from "../helpers/sendEmails.js";
import recoveryPassword from "../helpers/recoveryPassword.js";

const authentication = async (req, res) => {
  const { email, password } = req.body;
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // validate email
  if (!validateEmail(email)) {
    const error = new Error(" Invalid password or user!");
    return res.status(404).json({ msg: error.message });
  }
  //check if user exist
  const user = await Veterinary.findOne({ email });
  if (!user) {
    const error = new Error(" Invalid password or user!");
    return res.status(403).json({ msg: error.message });
  }
  //check if account is confirmed
  if (!user.confirm) {
    const error = new Error(" need to confirm the account!");
    return res.status(403).json({ msg: error.message });
  }
  //check password
  if (await user.confirmPassword(password)) {
  } else {
    const error = new Error(" Invalid password!");
    return res.status(403).json({ msg: error.message });
  }
  try {
    jwtGenerator(user.id);
    res.json({
      name: user.name,
      email: user.email,
      token: jwtGenerator(user.id),
      _id: user._id,
    });
  } catch (error) {
    return res.status(403).json({ msg: error.message });
  }
};
const checkToken = async (req, res) => {
  try {
    const { token } = req.params;
    const validToken = await Veterinary.findOne({ token });
    if (!validToken) {
      const error = new Error(" invalid token!");
      return res.status(400).json({ msg: error.message });
    }
    res.json({ url: "Valid token!" });
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
const confirm = async (req, res) => {
  const { token } = req.params;
  //confirm user by token
  const userConfirm = await Veterinary.findOne({ token });
  if (!userConfirm) {
    const error = new Error(" invalid token!");
    return res.status(400).json({ msg: error.message });
  }
  try {
    userConfirm.token = null;
    userConfirm.confirm = true;
    await userConfirm.save();
    res.json({ url: "User has been confirmed!" });
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await Veterinary.findOne({ email });
  if (!user) {
    const error = new Error(" User doesn't exist!");
    return res.status(400).json({ msg: error.message });
  }
  try {
    //generate new token and update user
    user.token = tokenGenerator();

    await user.save();
    //send email to recovery password
    recoveryPassword({ email, name: user.name, token: user.token });
    res.json({ message: "An email with instructions has been sent!" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};
const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  //confirm user by token
  const vet = await Veterinary.findOne({ token });
  if (!vet) {
    const error = new Error(" invalid token!");
    return res.status(400).json({ msg: error.message });
  }
  try {
    vet.token = null;
    vet.password = password;
    await vet.save();
    res.json({ msg: "Password has been changed!" });
  } catch (error) {
    return res.status(403).json({ msg: error.message });
  }
};
const profile = (req, res) => {
  const { vet } = req;
  res.json({ vet });
  return;
};
const register = async (req, res) => {
  const { email, name } = req.body;
  //prevent duplicate user
  const userExist = await Veterinary.findOne({ email });
  if (userExist) {
    const error = new Error(" user already exists!");
    return res.status(400).json({ msg: error.message });
  }
  try {
    //Create new Veterinary
    const veterinary = new Veterinary(req.body);
    const newVerinary = await veterinary.save();
    //send email verification
    emailRegistry({ name, email, token: newVerinary.token });
    res.json(newVerinary);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

const updateProfile = async (req, res) => {
  const vet = await Veterinary.findById(req.params.id);
  if (!vet) {
    const error = new Error("Error, vet not found.");
    return res.status(404).json({ msg: error.message });
  }
  if (req.body.email !== vet.email) {
    //check if new email already exists in the DB
    const email = req.body.emailM;
    const existsEmail = await Veterinary.findOne({ email });
    if (existsEmail) {
      const error = new Error("New email already exists in the DB");
      res.status(400).json({ msg: error.message });
      return;
    }
  }
  try {
    vet.name = req.body.name || vet.name;
    vet.email = req.body.email || vet.email;
    vet.web = req.body.web || vet.web;
    vet.telephone = req.body.telephone || vet.telephone;

    const updatedVet = await vet.save();
    res.json(updatedVet);
    return;
  } catch (error) {
    res.json(error.response);
    return;
  }
};
const updatePassword = async (req, res) => {
  const { id } = req.vet;
  const vet = await Veterinary.findById(id);
  const { oldPwd, newPwd } = req.body;
  //check if vet exists
  if (!vet) {
    const error = new Error("Error, vet not found.");
    return res.status(404).json({ msg: error.message });
  }
  try {
    //check old password
    if (await vet.confirmPassword(oldPwd)) {
      vet.password = newPwd;
      await vet.save();
    } else {
      return res.status(400).json({ msg: "Password is incorrect." });
    }

    res.json({ msg: "Password changed successfully" });
    return;
  } catch (error) {
    res.json(error.response);
    return;
  }
};
export {
  register,
  profile,
  confirm,
  authentication,
  forgetPassword,
  checkToken,
  newPassword,
  updateProfile,
  updatePassword,
};
