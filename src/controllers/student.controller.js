const { asyncHandler } = require('../utils/asyncHandler.js')
const { ApiError } = require('../utils/ApiError.js')
const { Student } = require('../models/student.model.js')
const { uploadOnCloudinary } = require('../utils/cloudinary.js')
const { ApiResponse } = require('../utils/ApiResponse.js')

const testAPI = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok! API Test Successfull",
    })

})

const generateAccessAndRefreshTockens = async (studentId) => {
    try {

        const student = await student.findById(studentId)

        const accessToken = await generateAccessToken(student)
        const refreshToken = await generateRefreshToken(student)

        student.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

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
    if (!username || !email) {
        throw new ApiError(400, "Please fill all the fields")
    }
    const student = await Student.findOne({ $or: [{ username }, { email }] })
    if (!student) {
        throw new ApiError(404, "Invalid username or email")
    }
    //password validation
    const isPasswordValid = await student.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }



    //access refresh tocken
    const { accessToken, refreshToken } = await generateAccessAndRefreshTockens(student._id)

    //send cookies
    const loginStudent = await Student.findById(user._id).select("-password,-refreshToken")
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
                refreshToken: undefined,
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
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200, {}, "Logout Sucessfully")
    )


})

module.exports = { testAPI, registerStudent, loginStudent, logoutStudent }