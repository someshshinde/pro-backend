const { Student } = require("../models/student.model");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
var jwt = require('jsonwebtoken');

const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies.acessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized Request")
        }
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const student = await Student.findById(decodeToken?._id).select("-password,-refreshToken")
        if (!student) {
            throw new ApiError(401, "Invalid Access Token")

        }
        req.student = student
        next()
    } catch (error) {
throw  new ApiError(401, error?.message||"Invalid Access Token")
    }
})

module.exports = { verifyJWT }