const mongoose = require('mongoose');

const level = {
    values: ['Beginner', 'Intermediate', 'Expert', 'Master'], message: 'Retention level must be one of the following: Beginner, Intermediate, Expert, Master'
}

const cardSchema = mongoose.Schema({
    front: ({ type: String, maxLength: [3000, 'Front of card text must be 3000 characters or less.'], required: [true, 'Front of card text is required.'] }),
    back: ({ type: String, maxLength: [10000, 'Back of card text must be 10000 characters or less.'], required: [true, 'Back of card text is required.'] }),
    retention: ({ type: Number, default: 0, required: [true, 'Retention score is required.'], max: [100, "Retention score must be 100 or less."] }),
    answer_history: ({
        type: [Boolean], required: [true, 'Answer history for current retention level is required'], default: []
    }),
    last_update: { type: Date, default: Date.now(), required: [true, "Card last update is required."] }
})


const studySetSchema = mongoose.Schema({
    user_id: ({ type: mongoose.Schema.Types.ObjectId, required: [true, 'User ID is required'] }),
    name: { type: String, required: [true, "Study set name is required."], maxLength: [200, "Study set name must be 200 characters or less."], unique: true },
    retention: { type: Number, default: 0, requird: [true, "Study set retention score is required"], max: [100, "Retention score must be 100 or less."] },
    level: ({ type: String, default: 'Beginner', enum: level, required: [true, 'Level is required.'] }),
    date_created: { type: Date, default: Date.now(), required: [true, "Study set created date is required"] },
    last_update: { type: Date, default: Date.now(), required: [true, "Study set last update is required."] },
    color: { type: String, required: false },
    cards: [cardSchema]
});

module.exports = mongoose.model('Study_Set', studySetSchema);