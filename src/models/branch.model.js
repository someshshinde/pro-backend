const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const branchSchema=new Schema({
    name: {type:String,required:true},
    class:{
        type:Schema.Types.ObjectId
    }
},{
    timestamps:true
})
branchSchema.plugin(aggregatePaginate);
module.exports=mongoose.model("branch",branchSchema)