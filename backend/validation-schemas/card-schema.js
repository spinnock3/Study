const validator = require('joi')

module.exports = schema = validator.object().keys({
    __v:validator.optional().strip(),
    _id: validator.string().optional().strip(),
    retention: validator.number().strip(),
    last_update: validator.strip(),
    front: validator.string().max(3000).required(),
    back: validator.string().max(10000).required(),
    answer_history: validator.strip()
})