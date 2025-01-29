const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const studentSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    class:{
        type:Schema.Types.ObjectId
    },
    rollNo:{
        type:Number
    },
    avatar:{
        type:String
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
    
    
},
{
    timestamps:true
});

studentSchema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password,10);
        next();
    }else
    {
        next();
    }
  
   
})

studentSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(this.password, password);
}
studentSchema.methods.generateAccessToken=function(){
    return jwt.sign({ 
       _id:this._id,
       username:this.username
     },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: ACCESS_TOKEN_EXPIRY
    }
    );
}
studentSchema.methods.generateRefreshToken=function(){

    return jwt.sign({ 
        _id:this._id
      },
     process.env.REFRESH_TOKEN_SECRET,
     {
         expiresIn: REFRESH_TOKEN_EXPIRY
     }
     );
}

//studentSchema.plugin(aggregatePaginate);
module.exports=mongoose.model("student",studentSchema)