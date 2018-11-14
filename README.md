# ExiomsTest

#Key Features

1. Blockchain:- Hyperledger Fabric
2. AES-256 Bit encryption to securely store the patient data
3. consent Mechanism

# Steps to run the Assignment.

# 1) Start the Hyperledger Fabric Ecosystem

    if you don't have hyperledger fabric developer environment please install it from [here](https://hyperledger.github.io/composer/v0.19/installing/installing-prereqs)
    if you have the Fabric ecosystem you are good to go.

    `composer network install -a exioms.bna -c PeerAdmin@hlfv1`

    `composer network start --networkName exioms --networkVersion 0.0.2-deploy.3 --card PeerAdmin@hlfv1 -A admin -S adminpw`

    `composer card import --file admin@exioms.card`

    `composer network ping --card admin@exioms`

    `composer-rest-server -c admin@exioms -n always`

# 2) Setup the Backend.

     a) you will need MongoDB, NodeJs.
     b) Make sure that you have mongodb running this url `mongodb://localhost:27017` .
     c) type `npm install`
     d) to start the Backend server type `npm start`

     Now you have the Backend server running you can check the APIs with postman

# 3) Walkthrough

    I have included screenshots of the assignment in case something fails and you can't see the results.

    A)Postman :-Please navigate to the Tutorial -> postman to test the API.
                You will find file named `Exioms.postman_collection.json` import it into your postman and start testing the API's.
                suggested approch to test API's is as follows.
            1)Adding New Patient to the Blockchain. (Refer to 3.png)
            2)Requesting Access to patient's EHR. (Refer to 5.png)
            3)Granting Access to patient's EHR. (Refer to 7.png)
            4)Inserting new treatment details into Blockchain. (Refer to 10.png)
            5)Retriving the patient Details  from blockchain. (Refer to 12.png)
            6)Retriving the Previous Medical History  of Patient. (Refer to 13.png)
            7)This API route gives the list of patient for given Hospital id. (Refer to 14.png)

    B) Website :-  navigate to front end folder and open index.html file in chrome.
            IT is advised that you download [Allow-Control-Allow-Origin] (https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) extension before proceeding any further.

            1) Open `index.html`
            2) Press `Get In`
            3)Use email = `Apollo` and pass = `pass123`
            4) Then `Click on ADD NEW PATIENT` after the new page opens insert the excel file `Add Patient.xlsx`.
            After successfully adding patient you will get an anlert message. IF YOU DON"T then please restart `Allow control allow origin` extension. (Refer to 1_1.png)
            5)now goto home and click on `REQUEST PATIENT`. here you will need to input the values
             Patient ID = `1337`
             Hospital Name = `Apollo`
             staff name = `Dr Koli` (Refer to 5_1.png)
            6) due to time constraints the Patient part has not been created.
                kindly use postman to generate the grant request. refer to `7.png` in `tutorial/postman` folder.
            7) after successfully completing the step 6, you can now see the patient under the `YOUR PATIENTS` page. (Refer to 8_1.png)
            8) to Add the patient treatment details, go to `ADD PATIENT'S TREATMENT DETAILS` and upload the `Treatment.xlsx` file.
                After successfully adding patient you will get an anlert message. IF YOU DON"T then please restart `Allow control allow origin` extension. (Refer to 10_1.png)
            9) now to view the patient details staff needs to go to the `Your Patient` tab and click on patient ID.
                then you will be redirected to the patient's details. (Refer to 13_1.png)
