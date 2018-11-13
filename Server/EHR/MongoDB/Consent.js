const {
  mongoose
} = require("./mongoose");
const {
  Access
} = require("../model/Access");


let accessReq = data => {
  return new Promise((resolve, reject) => {
    let PatientId = data.PatientId;
    let request = new Access({
      _id: PatientId,
      Hospital_ID: data.Hospital_ID,
      Staff_ID: data.Staff_ID,
      Status: "OPEN"
    });
    request
      .save()
      .then(
        doc => {
          console.log(`Access to PatientID:- ${PatientId} successfully Requested.`);
          resolve(200);
        },
        err => {
          console.log("uploading access request to MongoDB", err);
          reject(204);
        }
      )
      .catch(errorMessage => {
        reject(204);
      });
  });
};

let accessGRANT = data => {
  return new Promise((resolve, reject) => {
    let PatientId = data.PatientId;
    Access.findOneAndUpdate({
        _id: PatientId
      }, {
        $set: {
          Status: "GRANT"
        }
      }, {
        new: true
      })
      .then(
        doc => {
          console.log(`Access For PatientID:- ${PatientId} successfully Granted.`);
          resolve(200);
        },
        err => {
          console.log("Error while updating access request to MongoDB", err);
          if (err.code == 11000) {
            reject(409);
          } else {
            reject(err);
          }
        }
      )
      .catch(errorMessage => {
        reject(404);
      });
  });
};

let accessDENY = data => {
  return new Promise((resolve, reject) => {
    let PatientId = data.PatientId;
    Access.findOneAndUpdate({
        _id: PatientId
      }, {
        $set: {
          Status: "DENY"
        }
      }, {
        new: true
      })
      .then(
        doc => {
          resolve(doc);
        },
        err => {
          console.log("Error while updating access request to MongoDB", err);
          if (err.code == 11000) {
            reject(409);
          } else {
            reject(err);
          }
        }
      )
      .catch(errorMessage => {
        reject(404);
      });
  });
};

let checkAccess = (PatientId, Hospital_ID) => {
  return new Promise((resolve, reject) => {
    Access.findById({
        _id: PatientId
      })
      .then(doc => {
        //console.log(doc);
        if (doc.Status == "GRANT" && doc.Hospital_ID == Hospital_ID) {
          resolve(200);
        } else {
          reject(401);
        }
      })
      .catch(err => {
        reject(404);
      });
  });
};

let data = {
  PatientId: "123",
  Hospital_ID: 'HSPL123',
  Staff_ID: 'DR Koli',
  Status: "OPEN"
}
// accessGRANT(data).then(doc => {
//   console.log(doc);
// })


// =======
// >>>>>>> parent of 29e5a91... Route to check if the patient has any open requests for granting access
module.exports = {
  checkAccess,
  accessReq,
  accessGRANT,
  accessDENY
};