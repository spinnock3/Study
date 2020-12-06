/*****************************/
/********** Imports **********/
/*****************************/

/**
 * Third-party Modules
 */
var express = require('express');
var router = express.Router({
    mergeParams: true
});

/**
 * Built-in Modules
 */


/**
 * Database Models
 */
const Exam = require('../database-models/exam.js');
const Course = require('../database-models/course');

/**
 * Data Validation Schemas
 */
const schema = require('../validation-schemas/exam-schema');


/**
* Middleware Imports
*/
//middleware-Block endpoints for unauthorized users
const authorized = require("../middleware/authorization");
//Backend data validation 
const validate = require('../middleware/validate')

/**
 * Global Functions
 */


/***********************************/
/********** API Endpoints **********/
/***********************************/

/**
 * GET 
 * Exams
 */
router.get("", authorized('owner'), (req, res, next) => {
    Exam.find({ user_id: req.params.user_id }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Exams Fetched Successfully",
            "exams": result
        })
    })
})

/**
 * GET 
 * Exam
 */
router.get("/:_id", authorized('owner'), (req, res, next) => {

    Exam.findOne({ _id: _id }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Exam Fetched Successfully",
            "exam": result
        })
    })
})


/**
 * POST
 */
router.post("", authorized('owner'), validate(schema), (req, res, next) => {
    let curr_date = Date.now();

    const exam = new Exam(req.body);
    exam.user_id = req.params.user_id;
    exam.date_created = curr_date;
    exam.last_update = curr_date;

    exam.save(function (err, new_exam) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            "message": "Exam post successful.",
            "exam": new_exam
        });
    })
});


/**
 * PUT
 */
router.put("/:id", authorized('owner'), validate(schema), (req, res, next) => {

    let _id = req.params.id;
    let exam = req.body;

    Exam.findOneAndUpdate({
        _id: _id
    }, {
        $set: exam
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Exam update successful.",
            "exam": result
        });
    });
})



/**
 * DELETE
 */
router.delete("/:id", authorized('owner'), (req, res, next) => {
    let _id = req.params.id;

    Exam.deleteOne({
        _id: _id
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        Course.updateMany({}, { $pull: { exams: { _id: _id } } }, function (err, resp) {
            if (err) {
                return next(err)
            }
            res.status(204).json({
                "message": "Exam deletion successful."
            })
        })
    })
})


module.exports = router;