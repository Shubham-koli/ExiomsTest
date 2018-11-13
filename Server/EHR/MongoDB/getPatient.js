const {
  Access
} = require("../model/Access");
const {
  mongoose
} = require("./mongoose");

let data = {
  Hospital_ID: "Apollo"
};

let getGrantPatients = data => {
  return new Promise((resolve, reject) => {
    patients = [];
    Access.find({
      Hospital_ID: `${data.Hospital_ID}`,
      Status: "GRANT"
    }, {
      _id: 1
    }).then(doc => {
      // console.log(doc);
      doc.forEach(id => {
        let person = {};
        person.id = id._id;
        patients.push(person);
      });
      resolve(patients);
    });
  });
};

// getGrantPatients(data).then(doc => {
//   console.log(doc);
// })


module.exports = {
  getGrantPatients
};