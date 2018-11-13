require("dotenv").config();

const {
    encryptObject
} = require("./encryption-promise");

// Fabric key is the symetric key (AES-256 bit)
const FABRIC_KEY = "exioms";

// let data = {
//     "$class": "org.exioms.empty.Patient",
//     "PatientId": "111",
//     "Pname": "Shubham",
//     "Email": "shubham.koli@outlook.in",
//     "Contact": "8421999884",
//     "Number": "string",
//     "Address": "Solapur"
// };

let encryptUsingFABRIC_KEY = data => {
    return new Promise((resolve, reject) => {
        encryptObject(data, FABRIC_KEY).then(res => {
            //   console.log(res);
            resolve(res);
        });
    });
};

let encrypt_TreatmentDetails_UsingFABRIC_KEY = data => {
    return new Promise((resolve, reject) => {
        encryptObject(data, FABRIC_KEY).then(res => {
            // console.log(res);
            resolve(res);
        });
    });
};

// encryptUsingFABRIC_KEY(data).then(res => {
//     console.log(res);
// })

module.exports = {
    encryptUsingFABRIC_KEY, //it encrypts the given data by AES 256 bit algo. Fabric Key 
    encrypt_TreatmentDetails_UsingFABRIC_KEY
}