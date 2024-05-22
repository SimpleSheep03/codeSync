import { Schema , models , model } from "mongoose";

const ContestSchema = new Schema({
    users : [
        {
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    problemList : [
        {
            type : Object,
        }
    ],
    contestants : [
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
    timeStart : {
        type : Date,
        required : true,
    },
    timeEnding : {
        type : Date,
        required : true
    }
} , {
    timestamps : true
})

const Contest = models.Contest || model('Contest' , ContestSchema)

export default Contest