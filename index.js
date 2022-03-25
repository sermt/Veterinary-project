import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./config/db.js";
import veterinaryRoutes from "./routes/veterinaryRouter";
import patientsRoutes from "./routes/patientsRouter.js";
import bodyParser from "body-parser";
dotenv.config()
const app = express();
app.use(cors());
/* const domainsAllowed = ["https://62303d06c335ef00088ae53c--confident-hawking-834487.netlify.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (domainsAllowed.indexOf(origin) !== -1) {
      //domain is allowed
      callback(null,true)
    }else{
      callback(new Error("Not allowed by Cors policy"))
    }
  },
}; */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connection();
app.use("/api/veterinaries", veterinaryRoutes);
app.use("/api/patients", patientsRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  
});
