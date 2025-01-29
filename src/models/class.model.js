const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const classSchema=new Schema({
    name:{
        type:String,
    },
    description:{
        type:String,
    },
    no_student:{
        type:Number,
        default:0
    }

},{
    timestamps:true
})
classSchema.plugin(aggregatePaginate);

module.exports=mongoose.model("class",classSchema)