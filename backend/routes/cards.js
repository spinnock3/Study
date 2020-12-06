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

/**
 * Data Validation Schemas
 */
const schema = require('../validation-schemas/card-schema');


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
 * PUT
 * Edit card in study set
 */
router.put("/:id", authorized('owner'), validate(schema), (req, res, next) => {

    let set_id = req.params.set_id;
    let _id = req.params.id;
    let card = req.body;
    let date = Date.now();

    StudySet.findOneAndUpdate({
        _id: set_id,
        "cards._id": _id,
    }, {
        last_update: date,
        $set: { "cards.$": card, last_update: date }
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Card update successful.",
            "study_set": result
        });
    });
})

/**
 * PUT
 * Update card/set retention
 */
router.put("/:id/retention", authorized('owner'), (req, res, next) => {

    let set_id = req.params.set_id;
    let answer_correct = req.body.answer_correct;
    let date = Date.now();
    let _id = req.params.id;

    StudySet.findOne({ _id: set_id }, function (err, set) {
        if (err) {
            return next(err);
        }


        let card = set.cards.find(card => card._id.toString() === req.params.id);
        card.answer_history.push(answer_correct);
        correct_answers = card.answer_history.filter(answer => answer === true);
        card.retention = Math.round((correct_answers.length / card.answer_history.length) * 100);
        card.last_update = date;
        set.cards[set.cards.indexOf(set.cards.find(c => c._id === card._id))] = card;

        if (set.cards.length) {
            num_cards = set.cards.length;
            var retention_sum = 0;
            set.cards.forEach(card => {
                retention_sum += card.retention;
            })
            set.retention = Math.round(retention_sum/num_cards);
        }


        StudySet.findOneAndUpdate({
            _id: set_id,
            "cards._id": _id,
        }, {
            last_update: date,
            $set: set
        }, {
            new: true,
            runValidators: true
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).json({
                "message": "Card update successful.",
                "study_set": result
            });
        });
    })
})


/**
 * PUT
 * Add card(s) to study set
 */
router.put("", authorized('owner'), validate(schema), (req, res, next) => {

    let set_id = req.params.set_id;
    let addCards = req.body;
    let date = Date.now();

    addCards.forEach(card => {
        card.last_update = date;
        return card;
    })

    StudySet.findOneAndUpdate({
        _id: set_id
    }, {
        last_update: date,
        $addToSet: { cards: { $each: addCards } }
    }, {
        new: true,
        runValidators: true
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            "message": "Card added successfully.",
            "study_set": result
        });
    });
})



/**
 * DELETE
 */
router.delete("/:id", authorized('owner'), (req, res, next) => {
    let set_id = req.params.set_id;
    let _id = req.params.id;
    let date = Date.now();

    StudySet.findOneAndUpdate({
        _id: set_id
    },
        {
            last_update: date,
            $pull: { cards: { _id: _id } }
        },
        {
            new: true,
            runValidators: true
        },
        function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                "message": "Card deletion successful.",
                study_set: result
            })
        })
})


module.exports = router;