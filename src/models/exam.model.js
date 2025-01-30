const mongoose =require('mongoose')
const {Schema}=mongoose;
const examSchema = new Schema({
    examName: {
        type:String,
        required:true
    },
    examSubject: {
        type:String,
        required:true
    },
    examTotalMarks: {
        type:Number,
        required:true,
        default:0
    },
    examStudentId: {
        type:Schema.Types.ObjectId,
        ref:'Student',
        require:true
    },
    examResult: {
        type:String,
        required:true
    },
  

},{
    timestamps:true
})
const Exam= mongoose.model('Exam',examSchema);
module.exports ={Exam}