const validator = require('joi')

module.exports = schema = validator.object().keys({
    __v:validator.optional().strip(),
    _id: validator.string().optional().strip(),
    user_id: validator.string().optional().strip(),
    name: validator.string().max(200).required(),
    date_created: validator.strip(),
    last_update: validator.strip(),
    term: validator.object().keys({
        semester: validator.string().allow('Fall', 'Spring', 'Summer').required(),
        year: validator.number().required()
    }),
    study_sets:  validator.array().optional().strip(),
    exams:  validator.array().optional().strip(),
    color:  validator.string().optional(),
})