const validator = require('joi')

module.exports = schema = validator.object().keys({
    __v:validator.optional().strip(),
    _id: validator.string().optional().strip(),
    user_id: validator.string().optional().strip(),
    name: validator.string().max(200).required(),
    retention: validator.number().strip(),
    date_created: validator.strip(),
    last_update: validator.strip(),
    level: validator.string().optional().strip(),
    cards:  validator.array().optional().items(
        validator.object().keys({
        __v:validator.optional().strip(),
        _id: validator.string().optional().strip(),
        retention: validator.number().strip(),
        last_update: validator.strip(),
        front: validator.string().max(3000).required(),
        back: validator.string().max(10000).required(),
        answer_history: validator.strip()
    })),
    color:  validator.string().optional(),
})