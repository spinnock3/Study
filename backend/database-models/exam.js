const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
    user_id: ({type: mongoose.Schema.Types.ObjectId, required: [true, 'User ID is required']}),
    name: {type: String, required: [true, "Exam name is required."], maxLength: [200, "Exam name must be 200 characters or less."], unique: true},
    date: {type: Date, required: [true, "Exam date is required."]},
    preparedness: {type: Number, requird: [true, "Exam prepareness score is required"], defualt: 0, max: [100, "Exam prepareness score must be 100 or less."]},
    date_created: {type: Date, required: [true, "Exam created date is required"]},
    last_update: {type: Date, required:[true, "Exam last update is required."]},
    study_sets: [mongoose.Schema.Types.ObjectId],
    color: {type: String, required: false},
});

module.exports = mongoose.model('Exam', examSchema);