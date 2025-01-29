const {asyncHandler}= require('../utils/asyncHandler.js')
const {ApiError}=require('../utils/ApiError.js')
const {Student}=require('../models/student.model.js')
const {uploadOnCloudinary}=require('../utils/cloudinary.js')
const {ApiResponse}=require('../utils/ApiResponse.js')

const testAPI=asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:"ok! API Test Successfull",
    })

})
const registerStudent=asyncHandler(async(req,res)=>{
//get the student data from the request body
const {name,email,rollNo,username,password}=req.body
//validation -all empty
if(
    [name,email,rollNo,username,password].some((field)=>
    field?.trim()==="")
){
    throw new ApiError(400,"Please fill all the fields")

}
//check user allredy exits
const existingUser=await Student.findOne({
    $or:[{username},{email}]   
})
if(existingUser)
{
    throw new ApiError(409,"User already exists")
}
//check image for avtar
const avatarLocalPath=req.files?.avatar[0]?.path
if(!avatarLocalPath){throw new ApiError(400,"Please upload a valid image")}
//upload cloudinary
const avatarCloudinary=await uploadOnCloudinary(avatarLocalPath)
if(!avatarCloudinary){
    throw new ApiError(500,"Failed to upload image on cloudinary")
}
//create student object and entry in DB
const student=await Student.create({
    name,email,rollNo,username,password,avatar:avatarCloudinary.secure_url
    })
    //remove password and refresh token field from responce
    const createdStudent=await Student.findById(student._id).select(
    "-password -refreshToken")
    
      //check for student creation
      if(!createdStudent){
        throw new ApiError(500,"Failed to create student")
      }   
//return res
return  res.status(200).json(
   new ApiResponse(200,createdStudent,"Student Create Sucessfully")
)

})

module.exports={testAPI,registerStudent}