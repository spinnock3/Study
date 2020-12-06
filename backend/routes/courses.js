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
const Course = require('../database-models/course.js');

/**
 * Data Validation Schemas
 */
const schema = require('../validation-schemas/course-schema');
const exam_schema = require('../validation-schemas/exam-schema');


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
 * Courses
 */
router.get("", authorized('owner'), (req, res, next) => {
    Course.find({ user_id: req.params.user_id }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Courses Fetched Successfully",
            "courses": result
        })
    })
})

/**
 * GET 
 * Course
 */
router.get("/:_id", authorized('owner'), (req, res, next) => {

    Course.findOne({ _id: _id }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Course Fetched Successfully",
            "course": result
        })
    })
})


/**
 * POST
 */
router.post("", authorized('owner'), validate(schema), (req, res, next) => {
    let curr_date = Date.now();

    const course = new Course(req.body);
    course.user_id = req.params.user_id;
    course.date_created = curr_date;
    course.last_update = curr_date;

    course.save(function (err, new_course) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            "message": "Course post successful.",
            "course": new_course
        });
    })
});


/**
 * PUT
 */
router.put("/:id", authorized('owner'), validate(schema), (req, res, next) => {

    let _id = req.params.id;
    let course = req.body;

    Course.findOneAndUpdate({
        _id: _id
    }, {
        $set: course
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Course update successful.",
            "course": result
        });
    });
})

/**
 * PUT
 * Add Exam
 */
router.put("/:id/exams", authorized('owner'), (req, res, next) => {

    let _id = req.params.id;
    let exam_id = req.body.exam_id;

    Course.findOneAndUpdate({
        _id: _id
    }, {
        $push: { exams: exam_id }
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Exam added to course successfully.",
            "course": result
        });
    });
})

/**
 * PUT
 * Add Study Set
 */
router.put("/:id/study-sets", authorized('owner'), (req, res, next) => {

    let _id = req.params.id;
    let set_id = req.body.study_set_id;

    Course.findOneAndUpdate({
        _id: _id
    }, {
        $push: { study_sets: set_id }
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Study set added to course successfully.",
            "course": result
        });
    });
})


/**
 * PUT
 * Remove Exam from Course
 */
router.delete("/:id/study-sets/:set_id", authorized('owner'), (req, res, next) => {

    let _id = req.params.id;
    let set_id = req.params.set_id;

    Course.findOneAndUpdate({
        _id: _id,
    }, {
        $pull: { study_sets: set_id }
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Study set removed from course successfully.",
            "course": result
        });
    });
})


/**
 * PUT
 * Remove Exam from Course
 */
router.delete("/:id/exams/:exam_id", authorized('owner'), (req, res, next) => {

    let _id = req.params.id;
    let exam_id = req.params.exam_id;

    Course.findOneAndUpdate({
        _id: _id,
    }, {
        $pull: { exams: exam_id }
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Exam removed from course successfully.",
            "course": result
        });
    });
})


/**
 * DELETE
 */
router.delete("/:id", authorized('owner'), (req, res, next) => {
    let _id = req.params.id;

    Course.deleteOne({
        _id: _id
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(204).json({
            "message": "Course deletion successful."
        })
    })
})


module.exports = router;