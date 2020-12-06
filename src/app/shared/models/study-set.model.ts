export interface StudySet {
    _id?: String
    user_id?: String,
    name?: String,
    retention?: Number,
    level?: String,
    date_created?: Date,
    last_update?: Date,
    color?: String,
    cards?: {
        _id?: String, 
        front?: String, 
        back?: String, 
        retention?: Number, 
        level?: String, 
        answer_history?: [{ num: Number, correct: Boolean }], 
        date_created?: Date, 
        last_update?: Date
    }[]

}
