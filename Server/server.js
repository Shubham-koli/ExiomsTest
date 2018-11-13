"use strict";
// importing dotenv file
require("dotenv").config();

/*********************************************************************** */
// importing 3rd party libraries
const express = require("express");
const bodyParser = require("body-parser");

/*********************************************************************** */
// importing self-created modules

//importing modules to create new patient and enter record into blockchain
const {
    createNewPatient,
    addTreatmentDetails
} = require("./routes/postPatient");

// it creates new Asset of PatientData (Patient's Treatment's history)
const {
    createPatientData
} = require("./routes/createAsset");

// module to Encrypt data
const {
    encryptUsingFABRIC_KEY
} = require("./EHR/encryption/Fabric-Encrypt");

// module to decrypt data
const {
    decryptUsingFABRIC_KEY,
    decrypt_TreatmentDetails_UsingFabricKe
} = require("./EHR/decryption/Fabric-Decrypt");

const {
    processData,
    getPatient,
    getPatientData,
    getPatientHistory
} = require("./routes/getPatient");


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

    encryptUsingFABRIC_KEY(req.body).then(encryptedObj => {
        createNewPatient(encryptedObj).then(res => {
            console.log(res);
            response.sendStatus(res);
        });
    })
});

app.post("/getpatient", (req, res) => {
    let PatientId = req.body.PatientId;
    let Hospital_ID = req.body.Hospital_ID;
    console.log(PatientId);
    getPatient(PatientId)
        .then(result => {
            console.log("decrypt using Fabric Key");
            decryptUsingFABRIC_KEY(result).then(decryptedObj => {
                decryptedObj.status = "200";
                res.send(decryptedObj);
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/patienthistory", (req, response) => {
    console.log("request to view patient treatment history recieved");
    console.log(req.body);
    let AdharNo = req.body.PatientId;
    getPatientHistory(AdharNo)
        .then(
            doc => {
                doc.status = "200";
                response.send(doc);
            },
            err => {
                response.send({
                    status: "402"
                });
            }
        )
        .catch(error => {
            response.send({
                status: "500"
            });
        });
});


app.listen(4000, () => {
    console.log("Started on port 4000");
});