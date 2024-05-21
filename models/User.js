import { Schema , models , model } from "mongoose";

const UserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    codeforcesId : {
        type : String,
    },
})

const User = model.User || model('User' , UserSchema)