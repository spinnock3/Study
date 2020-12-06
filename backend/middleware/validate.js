const validator = require('joi');

function validate(schema) {
    return function (req, res, next) {
        let options = {
            abortEarly: false
        }
        const validation = schema.validate(req.body, options) 
        if(validation.error) {
            var error = new Error('Invalid request: '+ validation.error);
            error.code = 400;
            return next(error);
        }
        next()   
    }
}

module.exports = validate;