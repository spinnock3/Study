/*****************************/
/********** Imports **********/
/*****************************/

/**
 * Third-party Modules
 */
const express = require("express");
const router = express.Router();

/**
 * Built-in Modules
 */


/**
 * Database Models
 */
const User = require("../database-models/user");


/**
 * Data Validation Schemas
 */
//const user_schema = require("../validation-schemas/user_schema");

/**
 * Middleware Imports
 */
//Backend Validation middleware
const validate = require("../middleware/validate");
//middleware- Block endpoints for unauthorized users
const authorized = require("../middleware/authorization");
//Block endpoints for unauthenticated users
const checkAuth = require("../middleware/check-auth");

/**
 * Sub route Imports
 */
const course_route = require("./courses");
const exam_route = require('./exams');
const set_route = require('./study-sets');
const event_route = require('./events');


/**
 * Global Functions
 */


/**
 * Global constants
 */

/***
 * Environment Variables
 */



/********************************/
/******* Route Middleware *******/
/********************************/

//Check that user is authenticated before each endpoint
router.use(checkAuth);

/***********************************/
/********** API Endpoints **********/
/***********************************/

/**
 * GET 
 * Users
 */
router.get("", (req, res, next) => {
    User.find({}, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Users Fetched Successfully",
            "users": result
        })
    })
})

/**
 * GET 
 * User
 */
router.get("/:_id", (req, res, next) => {

    User.findOne({ _id: req.params._id }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "User Fetched Successfully",
            "user": result
        })
    })
})



/**
 * PUT
 */
router.put("/:id", validate(schema), (req, res, next) => {

    let _id = req.params.id;
    let user = req.body;

    User.findOneAndUpdate({
        _id: _id
    }, {
        $set: user
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "User update successful.",
            "user": result
        });
    });
})

/**
 * DELETE
 */
router.delete("/:id", (req, res, next) => {
    let _id = req.params.id;

    User.deleteOne({
        _id: _id
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(204).json({
            "message": "User deletion successful."
        })
    })
})





/**
 * Sub routes
 */
router.use("/:user_id/courses", course_route);
router.use('/:user_id/exams', exam_route);
router.use('/:user_id/study-sets', set_route);
router.use('/:user_id/events', event_route);

/*********************************/
/********** Functions  ***********/
/*********************************/


module.exports = router;
