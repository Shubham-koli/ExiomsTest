require("dotenv").config();
const {
  decryptObject
} = require("./decryption-promise");

const {
  decrypt_patientData
} = require("./patientData-decrypt");

const FABRIC_KEY = "exioms";

let data = {
  $class: 'org.exioms.empty.Patient',
  PatientId: '111',
  Pname: 'U2FsdGVkX19bk9b5WjMizNIhFmwF0/iw26Ozl6xu0iI=',
  Email: 'U2FsdGVkX1+rS977uny+OicVPwEip3rElQNyEzkHRR1qVtYmv3IzPcgjX/qf7Lru',
  Contact: 'U2FsdGVkX19F6Tyha7w5zKOEQ5tUcEmGH1zmzfYIEf4=',
  Number: 'U2FsdGVkX1+UaJq/P4juYMkQ5Rpbfxwu11tcooUJcws=',
  Address: 'U2FsdGVkX19RmF8nt0iGlQrdtvC3yZk1g7D2EYJnQXY='
}

let decryptUsingFABRIC_KEY = data => {
  return new Promise((resolve, reject) => {
    decryptObject(data, FABRIC_KEY).then(res => {
      // console.log(res);
      resolve(res);
    });
  });
};
//Promise to  decrypt the treatment details
let decrypt_TreatmentDetails_UsingFabricKey = data => {
  return new Promise((resolve, reject) => {
    decrypt_patientData(data, FABRIC_KEY).then(res => {
      // console.log(res);
      resolve(res);
    });
  });
};
// decryptUsingFABRIC_KEY(data).then((res) => {
//   console.log(res);
// })

module.exports = {
  decryptUsingFABRIC_KEY, // it decrypts the data present in the fabric/blockchain with FABRIC_KEY
  decrypt_TreatmentDetails_UsingFabricKey //decryption of treatment details using Fabric Key, I reconstructed it because of different jSON Format.
};

// decrypt_TreatmentDetails_UsingFabricKey(data).then(doc => {
//   console.log(doc);
// });