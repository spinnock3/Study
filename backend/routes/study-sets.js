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
const StudySet = require('../database-models/study-set.js');
const Course = require('../database-models/course.js');
const Event = require('../database-models/event.js');


/**
 * Data Validation Schemas
 */
const schema = require('../validation-schemas/study-set-schema');

/**
 * Sub route Imports
 */
const card_route = require("./cards");

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
 * Study Sets
 */
router.get("", authorized('owner'), async (req, res, next) => {
    let query = { user_id: req.params.user_id };
    let set_ids;
    try {
        if (req.params.exam_id) {
            let exam = await Event.findOne({ _id: req.params.exam_id });
            set_ids = exam.exam_data.study_sets;
        }
        else if (req.params.course_id) {
            let course = await Course.findOne({ _id: req.params.course_id });
            set_ids = course.study_sets;
        }
    }
    catch (err) {
        return next(err);
    }

    if (set_ids && set_ids.length) {
        query.$in = set_ids;
    }

    StudySet.find(query, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Study Sets Fetched Successfully",
            "study_sets": result
        })
    })
})

/**
 * GET 
 * Study Set
 */
router.get("/:_id", authorized('owner'), (req, res, next) => {

    var _id = req.params._id;

    StudySet.findOne({ _id: _id }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Study Set Fetched Successfully",
            "study_set": result
        })
    })
})


/**
 * POST
 */
router.post("", authorized('owner'), validate(schema), (req, res, next) => {
    let curr_date = Date.now();

    var set = new StudySet(req.body);
    set.user_id = req.params.user_id;
    set.date_created = curr_date;
    set.last_update = curr_date;

    if (set.cards) {
        set.cards.forEach(card => {
            card.last_update = curr_date;
            return card;
        })
    }

    set.save(function (err, new_set) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            "message": "Study Set post successful.",
            "study_set": new_set
        });
    })
});


/**
 * PUT
 */
router.put("/:id", authorized('owner'), validate(schema), (req, res, next) => {

    let _id = req.params.id;
    let set = req.body;

    let curr_date = Date.now();

    set.user_id = req.params.user_id;
    set.last_update = curr_date;

    if (set.cards) {
        set.cards.forEach(card => {
            card.last_update = curr_date;
            return card;
        })
    }

    let last_update = Date.now();
    StudySet.findOneAndUpdate({
        _id: _id
    }, {
        $set: set
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Study Set update successful.",
            "study_set": result
        });
    });
})

/**
 * DELETE
 */
router.delete("/:id", authorized('owner'), (req, res, next) => {
    let _id = req.params.id;

    StudySet.deleteOne({
        _id: _id
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        Course.updateMany({}, { $pull: { study_sets: { _id: _id } } }, function (err, resp) {
            if (err) {
                return next(err)
            }
            Event.updateMany({}, { $pull: { "exam_data.study_sets": { _id: _id } } }, function (err, resp) {
                if (err) {
                    return next(err)
                }
                res.status(204).json({
                    "message": "Study Set deletion successful."
                })
            })
        })
    })
})

/**
 * Sub routes
 */
router.use("/:set_id/cards", card_route);


module.exports = router;