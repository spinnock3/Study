//Mail transporter middleware
const nodemailer = require("nodemailer");
//The simplified HTTP request client 'request' with Promise support.

var transporter = nodemailer.createTransport({
    maxConnections: 3,
    pool: true,
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "spinnock3@gatech.edu", // Redbook service account shared mailbox
        pass: global.env.EMAIL_PW, // password
    },
    tls: {
        ciphers: "SSLv3",
    },
    logger: true
})
module.exports = transporter;

