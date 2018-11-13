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
    encryptUsingFABRIC_KEY,
    encrypt_TreatmentDetails_UsingFABRIC_KEY
} = require("./EHR/encryption/Fabric-Encrypt");

// module to decrypt data
const {
    decryptUsingFABRIC_KEY,
    decrypt_TreatmentDetails_UsingFabricKey
} = require("./EHR/decryption/Fabric-Decrypt");

const {
    processData,
    getPatient,
    getPatientData,
    getPatientHistory
} = require("./routes/getPatient");

// Modules for Consent Mechanism
const {
    accessGRANT,
    accessReq,
    accessDENY,
    checkAccess
} = require("./EHR/MongoDB/Consent");

const {
    getGrantPatients
} = require("./EHR/MongoDB/getPatient");


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
    checkAccess(PatientId, Hospital_ID).then(code => {
        if (code == '200') {
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
        } else {
            res.sendStatus(401);
        }
    }).catch(err => {
        console.log(err);
        res.sendStatus(401);
    })
});

app.post("/patienthistory", (req, response) => {
    console.log("request to view patient treatment history recieved");
    console.log(req.body);
    let PatientId = req.body.PatientId;
    getPatientHistory(PatientId)
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

app.post("/newtreatment", (req, response) => {
    req.body.$class = "org.eximos.empty.TreatmentDetails";
    console.log(req.body);
    let PatientId = req.body.patientData.substr(38);
    console.log(PatientId);
    let Hospital_ID = req.body.HospitalName;
    checkAccess(PatientId, Hospital_ID).then(code => {
        if (code == '200') {
            encrypt_TreatmentDetails_UsingFABRIC_KEY(req.body).then(result => {
                    console.log("encrypting using Fabric key");
                    result.$class = "org.exioms.empty.TreatmentDetails";
                    addTreatmentDetails(result)
                        .then(
                            res => {
                                console.log(res);
                                console.log(result);
                                response.send({
                                    status: "200"
                                });
                            },
                            errorMessage => {
                                console.log(errorMessage);
                                response.sendStatus(500);
                            }
                        )
                        .catch(errorMessage => {
                            console.log(errorMessage);
                        });
                    console.log(result);
                })
                .catch(err => {
                    response.sendStatus({
                        status: "401"
                    });
                });
        } else {
            response.sendStatus(401);
        }
    }).catch(err => {
        console.log('Un-authorized');
        response.sendStatus(401);
    })
});

app.post("/treatment", (req, response) => {
    console.log(req.body);
    let PatientId = req.body.PatientId;
    let Hospital_ID = req.body.Hospital_ID;
    checkAccess(PatientId, Hospital_ID).then(code => {
        if (code == '200') {
            getPatientData(PatientId)
                .then(
                    result => {
                        console.log("Fetching Data from Blockchain");
                        decrypt_TreatmentDetails_UsingFabricKey(result).then(result1 => {
                            console.log("decrypted using Fabric Key");
                            async function getData(result1) {
                                let data = [];
                                result1.TreatmentDetails.forEach(record => {
                                    processData(record, req.body.Hospital_ID)
                                        .then(details => {
                                            data.push(details);
                                            if (result1.TreatmentDetails.length == data.length) {
                                                response.send(data);
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            response.send(err);
                                        });
                                });
                            }
                            getData(result1);
                        });
                    },
                    errorMessage => {
                        console.log(errorMessage);
                        response.sendStatus(404);
                    }
                )
                .catch(errorMessage => {
                    console.log(errorMessage);
                    response.sendStatus(404);
                });
        } else {
            console.log('Un-authorized');
        }
    }).catch(err => {
        console.log(err);
        response.sendStatus(401);
    })
});

app.post("/grant", (req, response) => {
    accessGRANT(req.body).then(res => {
        if (res == '200') {
            console.log('Access Granted.');
            response.sendStatus(200);
        }
    }).catch(err => {
        console.log('Error granting the request');

    })
})

app.post("/deny", (req, response) => {
    accessDENY(req.body).then(res => {
        if (doc == '200') {
            console.log('Access Denied.');
            req.sendStatus(200);
        }
    }).catch(err => {
        console.log('Error Denying the request');
        req.sendStatus(500);
    })
})


app.post("/request", (req, response) => {
    console.log(req.body);
    accessReq(req.body)
        .then(
            res1 => {
                console.log("Access Request Created");
                response.send({
                    CODE: "200"
                });
            },
            errorMessage => {
                console.log(errorMessage);
                response.send({
                    CODE: "400"
                });
            }
        )
        .catch(errorMessage => {
            console.log(errorMessage);
            response.send({
                CODE: `${errorMessage}`
            });
        });
});

app.post("/patientlist", (req, response) => {
    // console.log(req.body);
    console.log(`Getting Patient's List for Hospital ${req.body.Hospital_ID}`);
    console.log(req.body); - [];
    async function getPatientDetails(data, response) {
        let patientDetails = [];
        let PatientId = await getGrantPatients(data);
        PatientId.forEach(id => {
            let person = {};
            person.pid = id.id;
            patientDetails.push(person);
            console.log(patientDetails);
            if (patientDetails.length === PatientId.length) {
                response.send(patientDetails);
            }

        });
    }
    getPatientDetails(req.body, response);
});

app.listen(4000, () => {
    console.log("Started on port 4000");
});