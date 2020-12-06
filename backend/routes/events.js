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
const Event = require('../database-models/event.js');
const Course = require('../database-models/course.js');

/**
 * Data Validation Schemas
 */
//const schema = require('../validation-schemas/exam-schema');


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
 * Events
 */
router.get("", authorized('owner'), (req, res, next) => {
    let query = { user_id: req.params.user_id };
    req.query.exams_only ? query.exam = true : '';
    Event.find(query, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Events Fetched Successfully",
            "events": result
        })
    })
})

/**
 * GET 
 * Event
 */
router.get("/:_id", authorized('owner'), (req, res, next) => {

    Event.findOne({ _id: _id }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Event Fetched Successfully",
            "event": result
        })
    })
})


/**
 * POST
 */
router.post("", authorized('owner'), (req, res, next) => {
    let curr_date = Date.now();

    const event = new Event(req.body);
    event.user_id = req.params.user_id;

    event.save(function (err, new_event) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            "message": "Event post successful.",
            "event": new_event
        });
    })
});


/**
 * PUT
 */
router.put("/:id", authorized('owner'), (req, res, next) => {

    let _id = req.params.id;
    let event = req.body;

    Event.findOneAndUpdate({
        _id: _id
    }, {
        $set: event
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Event update successful.",
            "event": result
        });
    });
})

/**
 * PUT
 * Add Study Set to Exam
 */
router.put("/:id/study-sets", authorized('owner'), (req, res, next) => {

    let _id = req.params.id;
    let set_id = req.body.study_set_id;

    Event.findOneAndUpdate({
        _id: _id,
        exam: true
    }, {
        $push: { "exam_data.study_sets": set_id }
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Study set added to exam event successfully.",
            "event": result
        });
    });
})

/**
 * PUT
 * Remove Study Set from Exam
 */
router.delete("/:id/study-sets/:set_id", authorized('owner'), (req, res, next) => {

    let _id = req.params.id;
    let set_id = req.params.set_id;


    Event.findOneAndUpdate({
        _id: _id,
        exam: true
    }, {
        $pull: { "exam_data.study_sets": set_id }
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Study set removed from exam event successfully.",
            "event": result
        });
    });
})

/**
 * DELETE
 */
router.delete("/:id", authorized('owner'), (req, res, next) => {
    let _id = req.params.id;

    Event.deleteOne({
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
                "message": "Event deletion successful."
            })
        })
    })
})


module.exports = router;