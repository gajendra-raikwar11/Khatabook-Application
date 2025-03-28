const mongoose=require("mongoose");

const userSchema= mongoose.Schema({
    username:{
    type:String,
    trim:true,   //remove the blank space around the text
    minLength:3,
    maxLength:20,
    required:true,
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    profilepicture:{
        type:String,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
     hisaab:[{type: mongoose.Schema.Types.ObjectId, ref:"hisaab"}],
});

module.exports=mongoose.model("user",userSchema);