require("dotenv").config();
// const REST_URL = process.env.REST_URL;
const REST_URL = "http://localhost:3000/api";
const axios = require("axios");

// It creates new patient entry in blockhain
let createNewPatient = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${REST_URL}/org.exioms.empty.Patient`, data)
        .then(function(response) {
          if (response.status == 200) resolve(200);
          else reject(response.data);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  };


// Treatment details is a transaction it needs PatientId, staff id and pincode to successfully execute
let addTreatmentDetails = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${REST_URL}/org.exioms.empty.TreatmentDetails`, data)
        .then(function(response) {
          if (response.status == 200) resolve(200);
          else reject(response.data);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  };

//   let data = {
//     "$class": "org.exioms.empty.TreatmentDetails",
//     "HospitalName": "lollololol",
//     "StaffId": "Doctor",
//     "PinCode": "string",
//     "ChronicDisease": "string",
//     "Disease": "string",
//     "DiseaseType": "string",
//     "DiseaseCategory": "string",
//     "DiseaseSubCategory": "string",
//     "symptom": "string",
//     "allergies": "string",
//     "Flag": "string",
//     "weight": "string",
//     "AlcoholConsumption": "string",
//     "SmokingHabits": "string",
//     "medicines": "string",
//     "tests": "string",
//     "patientData": "resource:org.exioms.empty.PatientData#shubham"
//   }
//   addTreatmentDetails(data).then( res => {
//       console.log(res);
//   })

  module.exports = {
    createNewPatient, //it creates new patient entry in blockhain
    addTreatmentDetails //Treatment details is a transaction it needs PatientId, staff id and pincode to successfully execute
  };