const validator = require('joi')

module.exports = schema = validator.object().keys({
    __v:validator.optional().strip(),
    _id: validator.string().optional().strip(),
    user_id: validator.string().optional().strip(),
    name: validator.string().max(200).required(),
    date: validator.date().required(),
    preparedness: validator.number().strip(),
    date_created: validator.strip(),
    last_update: validator.strip(),
    level: validator.string().optional().strip(),
    study_sets:  validator.array().optional().items(validator.string()),
    color:  validator.string().optional(),
})