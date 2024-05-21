import { Schema , models , model } from "mongoose";

const ContestSchema = new Schema({
    users : [
        {
            type : Schema.type.ObjectId,
            ref : 'User'
        }
    ],
    problemList : [
        {
            type : String,
        }
    ],
    numberOfQuestions : {
        type : Number,
        required : true
    },
    lowerLimit : {
        type : Number,
        required : true,
    },
    upperLimit : {
        type : Number,
        required : true
    },
    timeLimit : {
        type : Number,
        required : true
    },
    timeEnding : {
        type : Date,
        required : true
    }
} , {
    timestamps : true
})

export const Contest = model.Contest || model('Contest' , ContestSchema)