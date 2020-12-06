const mongoose = require('mongoose');

const colorSchema = mongoose.Schema({
    primary: {type: String, required: true},
    secondary: {type: String, required: true}
})

const metaSchema = mongoose.Schema({
    location: {type: String, required: false},
    notes: {type: String, required: false}
})

const examSchema = mongoose.Schema({
    preparedness: {type: Number, requird: [true, "Exam prepareness score is required"], defualt: 0, max: [100, "Exam prepareness score must be 100 or less."]},
    study_sets: [mongoose.Schema.Types.ObjectId],
});

const eventSchema = mongoose.Schema({
    user_id: ({type: mongoose.Schema.Types.ObjectId, required: [true, 'User ID is required']}),
    exam : ({type: Boolean}),
    exam_data: examSchema,
    start: ({type: Date, required: [true, 'Start date is required']}),
    end: {type: Date, required: [true, "End date is required."]},
    title: {type: String, maxLength: [150, "Event title must be 150 characters or less."], required: [true, "Title is required."]},
    color: colorSchema,
    cssClass: {type: String},
    resizable: { 
        beforeStart: Boolean,
        afterEnd: Boolean
    },
    draggable: {type: Boolean},
    meta: metaSchema
});

module.exports = mongoose.model('Event', eventSchema);
