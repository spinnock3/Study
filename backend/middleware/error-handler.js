/**
 * Global constants/variables
 */
const config = require('../../config.js');
const error_codes = config.get('http_err_status_codes');
const log4js = require('log4js');
var logger = log4js.getLogger();
const error_email = require('../functions/email-templates').error_email;
const sendMail = require('../functions/send-mail');



module.exports = function (err, req, res, next) {
    logger.error(
        "Error Message: " + err.message
        + "\nError: " + err
        + "\nError Stack: " + err.stack
        + "\nUser: " + 
        + "\nRequest Body: " + JSON.stringify(req.body)
        + "\nRequest Referer: " + req.headers.referer
        + "\nRequest Path: " + req.path
        + "\nRequest Method: " + req.method);
/*

    error_email(err, req).then(async function (error_html) {
        try {
            await sendMail(config.get("EMAIL_TO"), "Study Application Error", error_html, undefined, undefined)
        }
        catch (err) {
            logger.error(
                "Error Message: " + err.message
                + "\nError: " + err
                + "\nError Stack: " + err.stack);

        }
    }).catch(async function (email_error) {
        var text =
            "An error has occurred and the original html error email has failed to send. \nEmail Error: " + email_error + "\n Email Error Stack: " + email_error.stack
            + "\n\n Original Error: \n"
            + err +
            "\nUser: " + 
            + " \nRequest Body: " + JSON.stringify(req.body)
            + " \nRequest Referer: " + req.headers.referer
            + " \nRequest Path: " + req.path
            + " \nRequest Method: " + req.method;
        try {
            await sendMail(config.get("EMAIL_TO"), "Study Application Error", undefined, text, undefined)
        }
        catch (err) {
            logger.error(
                "Error Message: " + err.message
                + "\nError: " + err
                + "\nError Stack: " + err.stack);
        }
       
    })

 */

    /**
     * Response
     */

    //If error doesn't have message, set default message
    !err.message ? err.message = "Something went wrong. Please contact the site administrator." : '';
    /**
     * Errors with numeric error code
     */
    // If error doesn't have error code, set default error code
    !err.code || isNaN(err.code) ? err.code = 500 : '';

    /**
     * Errors without numeric error code or special errors
     */

    //Multer file size errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
            message: err.message + ". File must be under 25mb in size."
        });
    }

    //MongoDB validation errors
    else if (err.name && (err.name === 'ValidationError' || err.name === "fileTypeError")) {
        res.status(400).json({
            message: err.message
        })
    }



    //Unique index error from mongodb
    else if (err.code == 11000) {
        res.status(400).json({
            message: "Duplicate value insertion. " + JSON.stringify(err.keyValue)
        })
    }

    //401 error
    else if (err.code == 401) {
        if (err.err_type = "no_app_access") {
            res.status(err.code).json({
                message: err.message
            })
        }
        else {
            res.status(err.code).json({
                message: "Authentication Failed"
            })
        }

    }

    // 400 error
    else if (err.code == 400) {
        res.status(err.code).json({
            message: err.message
        })
    }

    //...Any other error code
    else if (error_codes.find(code => code == err.code)) {
        res.status(err.code).json({
            message: err.message
        })
    }

    //Unknown errors
    else {
        res.status(500).json({
            message: 'Something went wrong. Please contact the site administrator.'
        });
    }
}