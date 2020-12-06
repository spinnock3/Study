const config = require('../../config.js');
var queue = [];

//Mail transporter
const transporter = require("./mail-transporter");


function sendMail(to, subject, html, text, attachments) {

    return new Promise(function (resolve, reject) {
        var email = {
            'from': '"Study Application" <spinnock3@gatech.edu>',
            'to': to,
            'subject': config.get('email_env') + subject,
            'html': html,
            'text': text,
            'attachments': attachments
        }

        
        transporter.sendMail(email).then(() => {
         return resolve()   
        }).catch(err => {
            return reject(err)
        });
        
        
    })
}

module.exports = sendMail;


