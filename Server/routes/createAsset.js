require("dotenv").config();
// const REST_URL = process.env.REST_URL;
const REST_URL = 'http://localhost:3000/api';
const axios = require("axios");

let createPatientData = (PatientId) => {

    return new Promise((resolve, reject) => {
        axios.post(`${REST_URL}/org.exioms.empty.PatientData`, {
                $class: "org.exioms.empty.PatientData",
                EHR_ID: PatientId
            })
            .then(function (response) {
                if (response.status == 200)
                    resolve(200);
                else
                    reject(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    })
}

// let PatientId = '123';

// createPatientData(PatientId).then((res) => {
//     console.log(res);
// });

module.exports = {
    createPatientData // it creates new Asset of PatientData (Patient's Treatment's history) 
}