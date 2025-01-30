const { asyncHandler } = require('../utils/asyncHandler.js')
const { ApiError } = require('../utils/ApiError.js')
const { Student } = require('../models/student.model.js')
const { uploadOnCloudinary } = require('../utils/cloudinary.js')
const { ApiResponse } = require('../utils/ApiResponse.js')
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose')


const testAPI = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok! API Test Successfull",
    })

})

const generateAccessAndRefreshTockens = async (studentId) => {
    try {

        const student = await Student.findById(studentId)


        const accessToken = await student.generateAccessToken()
        const refreshToken = await student.generateRefreshToken()

        student.refreshToken = refreshToken
        await student.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Error in generate and refresh token")
    }
}

const registerStudent = asyncHandler(async (req, res) => {
    //get the student data from the request body
    const { name, email, rollNo, username, password } = req.body
    //validation -all empty
    if (
        [name, email, rollNo, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "Please fill all the fields")

    }
    //check user allredy exits
    const existingUser = await Student.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) {
        throw new ApiError(409, "User already exists")
    }
    //check image for avtar
    const avatarLocalPath = req.files?.avatar[0]?.path
    if (!avatarLocalPath) { throw new ApiError(400, "Please upload a valid image") }
    //upload cloudinary
    const avatarCloudinary = await uploadOnCloudinary(avatarLocalPath)
    if (!avatarCloudinary) {
        throw new ApiError(500, "Failed to upload image on cloudinary")
    }
    //create student object and entry in DB
    const student = await Student.create({
        name, email, rollNo, username, password, avatar: avatarCloudinary.secure_url
    })
    //remove password and refresh token field from responce
    const createdStudent = await Student.findById(student._id).select(
        "-password -refreshToken")

    //check for student creation
    if (!createdStudent) {
        throw new ApiError(500, "Failed to create student")
    }
    //return res
    return res.status(200).json(
        new ApiResponse(200, createdStudent, "Student Create Sucessfully")
    )

})

const loginStudent = asyncHandler(async (req, res) => {
    //req body->data
    const { email, username, password } = req.body
    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    const student = await Student.findOne({ $or: [{ username }, { email }] })
    if (!student) {
        throw new ApiError(404, "Student does not exits")
    }
    //password validation
    const isPasswordValid = await student.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }



    //access refresh tocken
    const { accessToken, refreshToken } = await generateAccessAndRefreshTockens(student._id)

    //send cookies
    const loginStudent = await Student.findById(student._id).select("-password,-refreshToken")
    //set cookies
    const options = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
    }

    //return res
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                { student: loginStudent, accessToken, refreshToken },
                "Login Sucessfully")

        )

})
const logoutStudent = asyncHandler(async (req, res) => {
    //remove cookies
    // res.clearCookie("accessToken")
    // res.clearCookie("refreshToken")
    await Student.findByIdAndUpdate(req.student._id
        , {
            $set: {
                refreshToken: "",
            }

        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "Logout Sucessfully")
        )


})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorise Request")

    }
    try {
        const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const student = await Student.findById(decodeToken?._id)
        if (!student) {
            throw new ApiError(401, "Invalid Refresh Token")
        }
        if (incomingRefreshToken !== student?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or used")
        }
        const options = {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: true,
        }
        const { accessToken, newrefreshToken } = await generateAccessAndRefreshTockens(student._id)
        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newrefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newrefreshToken }, "Access Token Refresh Sucessfully"))

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }



})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confPassword } = req.body

    if (!(newPassword === confPassword)) {
        throw new ApiError(400, "Password and Confirm Password does not match")

    }

    const student = await Student.findById(req.student?._id)

    const isPasswordValid = await student.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Old Password")
    }
    student.password = newPassword
    await student.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"))

})

const getCurrentStudent = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, { student: req.student }, "Student Details Retrieved Successfully"))
})
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name } = req.body
    if (!name) {
        throw new ApiError(400, "Name is required")
    }
    const student = await Student.findByIdAndUpdate(req.student?._id,
        {
            $set: {
                name: name
            }
        }, {
        new: true
    }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, student, "Account Details Updated Successfully"))

})

const updatStudentAvatar = asyncHandler(async (req, res) => {



    const avatarLocalPath = req.files?.avatar[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Avatar Upload Failed")
    }
    const student = await Student.findByIdAndUpdate(req.student?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, {
        new: true
    }
    ).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(200, student, "Avatar Updated Successfully")
        )
})
const getStudentExamDetails = asyncHandler(async (req, res) => {
    
    const student = await Student.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.student?._id)
            }
        },
        {
            $lookup: {
                from: "exam",
                localField: "_id",
                foreignField: "examStudentId",
                as: "exam_details"
            }
        },
        {
            $addFields:{
                examCount:{ $size:"$exam_details" },
                averageMarks: { $avg: "$exam_details.examTotalMarks" }
            },
           
        },
        {
            $project: {
                name:1,
                email:1,
                exam_details:1,
                examCount:1,
                averageMarks:1,

            }
        }
    ])
    if(!student?.length)
    {
        throw new ApiError(404,"Exam Does not Exits")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,student[0],"Student Exam Details Retrieved Successfully")
    )



})

module.exports = {
    testAPI, registerStudent, loginStudent, logoutStudent, refreshAccessToken,
    changeCurrentPassword, getCurrentStudent, updateAccountDetails,
    updatStudentAvatar, getStudentExamDetails
}