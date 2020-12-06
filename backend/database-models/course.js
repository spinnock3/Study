const mongoose = require('mongoose');
const moment = require('moment');
const semesters = ['Fall', 'Spring', 'Summer'];

const semester_enum = {
    values: semesters, 
    message: 'Unaccepted course semester. Accepted semester are: ' + semesters.toString()
  }

const courseSchema = mongoose.Schema({
    user_id: ({ type: mongoose.Schema.Types.ObjectId, required: [true, 'User ID is required'] }),
    name: { type: String, required: [true, "Course name is required."], maxLength: [200, "Course name must be 200 characters or less."], unique: true },
    date_created: { type: Date, required: [true, "Course created date is required"] },
    last_update: { type: Date, default: Date.now(), required: [true, "Course last update is required."] },
    term: {
        semester: {type: String, default: 'Fall', enum: semester_enum, required: [true, "Course semester is required."]},
        year: {type: Number, default: moment().year(), required: [true, "Course year is required"]}
    },
    exams: [{ type: mongoose.Schema.Types.ObjectId }],
    study_sets: [mongoose.Schema.Types.ObjectId],
    color: { type: String, required: false },
});

module.exports = mongoose.model('Course', courseSchema);