/*****************************/
/********** Imports **********/
/*****************************/

/**
 * Core Modules
 */
const path = require("path");

/**
 * Third-party Modules
 */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const log4js = require("log4js");
const config = require("../config.js");
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const cookieParser = require('cookie-parser');
const jwt_validate = require('express-jwt')
const bcrypt = require('bcrypt');
/**
 * Database Models
 */
const User = require("./database-models/user");

/**
 * Function Imports
 */


/**
 * Scheduled Task Imports
 */

/**
 * API Routes
 */
const userRoute = require("./routes/users");

/**
 * Middleware
 */
//logging middleware
const log = require("./middleware/logger");

//Error Handler
const error_handler = require("./middleware/error-handler");


//Check auth middleware
const check_auth = require('./middleware/check-auth');

const app = express();



/**
 * Global variables
 */
//Session expiration time in seconds (1 hour)
const expireTime = 60 * 60;

const RSA_PRIVATE_KEY = fs.readFileSync('./backend/files/private.key');


/*****************************************/
/********** Database Connection **********/
/*****************************************/
mongoose
    .connect(config.get("DB_CONN"), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((err) => {
        console.log("Connection to database failed!");
        console.log(err);
    });


/************************************************/
/********** Debug/Error Logging Config **********/
/************************************************/

log4js.configure({
    appenders: {
        debug: {
            type: "file",
            filename: "logs/debug.log",
            maxLogSize: 10485760,
            backups: 3,
            compress: true,
        },
        errors: {
            type: "file",
            filename: "logs/error.log",
            maxLogSize: 10485760,
            backups: 3,
            compress: true,
        },
        error: {
            type: "logLevelFilter",
            appender: "errors",
            level: "error",
        },
    },
    categories: {
        default: {
            appenders: ["debug", "error"],
            level: "debug",
        },
    },
});


//Load environment file if the environment is not PROD
if (process.env.NODE_ENV === "production") {
    console.log("Running in Production Mode");
}
if (process.env.NODE_ENV === "development") {
    console.log("Running in Development Mode");
}
if (process.env.NODE_ENV === "test") {
    console.log("Running in Test Mode");
}

/***************************************/
/********** Global Middleware **********/
/***************************************/

//bodyParser-
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use("/icons", express.static(path.join(__dirname, "icons")));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/", express.static(path.join(__dirname, "angular")));



/**
 * Access Controls & session expiration
 */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );

    next();
});

/** logging middleware **/
app.use(log);







/***********************************/
/********** API Endpoints **********/
/***********************************/

app.post('/api/register', (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let profile_color = config.get('profile_colors')[Math.floor(Math.random() * config.get('profile_colors').length)];
    let current_date = Date.now();
    const saltRounds = 10;



    User.findOne({ email: email }, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result) {
            let error = new Error("User already exists.");
            error.code = 401;
            return next(err);
        }
        else {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                    return next(err);
                }
                bcrypt.hash(password, salt, function (err, hash) {


                    if (err) {
                        return next(err);
                    }

                    let user = new User({
                        email: email,
                        password: hash,
                        last_login: current_date,
                        name: req.body.name,
                        user_roles: ['student'],
                        profile_color: profile_color,
                    })

                    user.save(user, function (err, newUser) {
                        if (err) {
                            return next(err)
                        }

                        else {
                            res.status(201).json({
                                message: "User registration successful.",
                                user: newUser
                            })
                        }
                    })
                })
            })
        }
    })

})

app.post('/api/login', (req, res, next) => {
    email = req.body.email;
    password = req.body.password;
    let current_date = Date.now();

    User.findOne({ email: email }, function (err, result) {
        if (err) {
            return next(err);
        }

        else {
            if (!result) {
                let error = new Error("The login information entered was incorrect.");
                error.code = 401;
                return next(error)
            }
            else {
                bcrypt.compare(password, result.password, function (err, resp) {

                    if (err) {
                        return next(err);
                    }
                    if (resp == false) {
                        let error = new Error("The login information entered was incorrect.");
                        error.code = 401;
                        return next(error)
                    }
                    else {
                        User.findOneAndUpdate({ email: email }, { last_login: current_date }, { new: true }, function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                                algorithm: 'RS256',
                                expiresIn: '1h',
                                subject: result._id.toString(),
                            })
                            return res.status(200).json({
                                message: "User login successful",
                                user: {
                                    name: result.name,
                                    user_id: result._id,
                                    email: result.email,
                                    user_roles: result.user_roles,
                                    profile_color: result.profile_color,
                                    profile_pic: result.profile_pic,
                                    points: 0
                                },
                                idToken: jwtBearerToken,
                                expiresIn: expireTime
                            })
                        })
                    }
                })


            }
        }
    })
})

app.get('/api/refreshAuth', check_auth, (req, res, next) => {
    try {
        var refresh = function (token) {
            var publicKey = fs.readFileSync('./backend/files/public.key');
            var privateKey = fs.readFileSync('./backend/files/private.key');
            const payload = jwt.verify(token, publicKey);
            delete payload.iat;
            delete payload.exp;
            delete payload.nbf;
            delete payload.jti;
            let options =
            {
                algorithm: 'RS256',
                expiresIn: '1hr'
            }
            // The first signing converted all needed options into claims, they are already in the payload
            return jwt.sign(payload, privateKey, options);
        }
        const token = req.headers.authorization.split(" ")[1];
        let ref_token = refresh(token);
        User.findOne({ email: email }, function (err, result) {
            if (err) {
                return next(err);
            }

            const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: '1h',
                subject: result._id.toString(),
            })
            
            return res.status(200).json({
                message: "Token Refresh Successful",
                user: {
                    name: result.name,
                    user_id: result._id,
                    email: result.email,
                    user_roles: result.user_roles,
                    profile_color: result.profile_color,
                    profile_pic: result.profile_pic,
                    points: 0
                },
                idToken: ref_token,
                expiresIn: expireTime
            })
        })
    }
    catch (err) {
        return next(err);
    }
})



/****************************/
/********** Routes **********/
/****************************/
app.use("/api/users", userRoute);

/** Serve Angular App **/
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "angular", "index.html"));
});

/** Error handling middleware **/
app.use(error_handler);




/*************************************/
/********** Scheduled Tasks **********/
/*************************************/



/********************************/
/*********** Functions **********/
/********************************/


/** Export **/
module.exports = app;

