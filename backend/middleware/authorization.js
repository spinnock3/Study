const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
var publicKey = fs.readFileSync('./backend/files/public.key');
const User = require("../database-models/user");

module.exports = function (acceptedRoles) {
    return function (req, res, next) {
        try {
            let authorized = false;

            //Get user_id from JWT
            const token = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(token, publicKey);
            const user_id = payload.sub;

            //If accepted roles is a string, convert to an array
            acceptedRoles = acceptedRoles.toString();
            acceptedRoles = acceptedRoles.replace(' ', '');
            acceptedRoles = acceptedRoles.split(',');

            //Retrieve user from DB
            User.findOne({ _id: user_id }, function (err, user) {
                if (err) {
                    return next(err)
                }

                if (user) {

                    //User should be admin
                    if (acceptedRoles.indexOf('admin') != -1 && user.user_roles && user.user_roles.indexOf('admin') != -1) {
                        authorized = true;
                    }
                    //User should be owner - check that param user_id matches user_id
                    if(acceptedRoles.indexOf('owner') != -1 && req.params.user_id && user_id === req.params.user_id) {
                        authorized = true;
                    }


                    if (!authorized) {
                        let err = new Error("The current user is not authorized to invoke this method.");
                        return next(err);
                    }
                    else {
                        return next();
                    }
                }

                //User not found in DB
                else {
                    let err = new Error("The current user is not authorized to invoke this method.");
                    return next(err);
                }
            })

        }



        catch (error) {
            return next(error);
        }
    }

}
