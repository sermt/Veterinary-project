import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./config/db.js";
import VeterinaryRoutes from "./routes/veterinaryRoutes.js";
import patientsRoutes from "./routes/patientsRouter.js";
import bodyParser from "body-parser";
dotenv.config()
const app = express();
const domainsAllowed = [process.env.FRONTEND_URL.toString(),"https://62303d06c335ef00088ae53c--confident-hawking-834487.netlify.app/"];
const corsOptions = {
  origin: function (origin, callback) {
    if (domainsAllowed.indexOf(origin) !== -1) {
      //domain is allowed
      callback(null,true)
    }else{
      callback(new Error("Not allowed by Cors policy"))
    }
  },
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connection();
app.use("/api/veterinaries", VeterinaryRoutes);
app.use("/api/patients", patientsRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server stars");
});
