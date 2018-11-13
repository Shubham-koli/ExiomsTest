"use strict";
// importing dotenv file
require("dotenv").config();

// importing 3rd party libraries
const express = require("express");
const bodyParser = require("body-parser");

//importing modules to create new patient and enter record into blockchain
const {
    createNewPatient,
    addTreatmentDetails
} = require("./routes/postPatient");

const {
    createPatientData // it creates new Asset of PatientData (Patient's Treatment's history)
} = require("./routes/createAsset");

var app = express();
app.use(bodyParser.json());

app.post("/newpatient", (req, response) => {
    console.log(req.body.PatientId);
    createPatientData(req.body.PatientId)
    .then(
      res => {
        console.log("PatientData Asset Created");
      },
      err => {
        console.log("Error while Creating PatientData");
      }
    )
    .catch(err => {
      console.log("Error while Creating PatientData");
    });
    createNewPatient(req.body).then(res => {
        console.log(res);
        response.sendStatus(res);
    });
})


app.listen(4000, () => {
    console.log("Started on port 4000");
  });