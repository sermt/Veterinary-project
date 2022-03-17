import Patients from "../models/Patients.js";

const addPatient = async (req, res) => {
  try {
    const patient = new Patients(req.body);
    patient.vet = req.vet;
    const storedPatient = await patient.save();
    res.json(storedPatient);
  } catch (error) {}
};
const getPatients = async (req, res) => {
  try {
    const patients = await Patients.find().where("vet").equals(req.vet);
    return res.json(patients);
  } catch (error) {
    console.log(error);
  }
 
};
const getPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patients.findById(id);

    if (!patient) {
      const error = new Error("Patient does not exist!");
      return res.status(404).json({ msg: error });
    }
    if (patient.vet._id.toString() !== req.vet._id.toString()) {
      const error = new Error("Don't allowed!");
      return res.status(403).json({ msg: error });
    }

    return res.json(patient);
  } catch (error) {
    console.log(error);
  }
};
const updatePatient = async (req, res) => {

  try {
    const { id } = req.params;
    const patient = await Patients.findById(id);

    if (!patient) {
      const error = new Error("Patient does not exist!");
      return res.status(404).json({ msg: error });
    }
    
    if (patient.vet._id.toString() !== req.vet._id.toString()) {
      const error = new Error("Don't allowed!");
      return res.status(403).json({ msg: error });
    }

    const { name, symptoms, email, owner, date,telephone } = req.body;
    patient.name = name || patient.name;
    patient.symptoms = symptoms || patient.symptoms;
    patient.email = email || patient.email;
    patient.owner = owner || patient.owner;
    patient.date = date || patient.date;
    patient.telephone = telephone || patient.telephone;
    const updatedPatient = await patient.save();

    return res.json(updatedPatient);
  } catch (error) {
    console.log(error);
  }
};
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patients.findById(id);

    if (!patient) {
      const error = new Error("Patient does not exist!");
      return res.status(404).json({ msg: error });
    }
    if (patient.vet._id.toString() !== req.vet._id.toString()) {
      const error = new Error("Don't allowed!");
      return res.status(403).json({ msg: error });
    }
    await patient.deleteOne();
    return res.json({ msg: "Patient deleted successfully!" });
  } catch (error) {
    console.log(error);
  }
};
export { addPatient, getPatients, getPatient, updatePatient, deletePatient };