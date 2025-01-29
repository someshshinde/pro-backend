const express = require('express');
const studentRouter = express.Router();
const {testAPI,registerStudent,loginStudent, logoutStudent}=require('../controllers/student.controller.js');
const {upload}=require('../middlewares/multer.middleware.js');
const { verifyJWT } = require('../middlewares/auth.middleware.js');


studentRouter.get('/testing',testAPI)

studentRouter.post(
    '/register',
    upload.fields([{ name: "avatar", maxCount: 1 }]), // Fix: Wrap the object inside an array
    registerStudent
  );

// studentRouter.post('/register', upload.fields([{ name: "avatar", maxCount: 1 }]), (req, res) => {
//   console.log(req.files); // Debugging step

//   if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
//       return res.status(400).json({ error: "No file uploaded" });
//   }

//   res.json({
//       message: "File uploaded successfully",
//       file: req.files.avatar[0] // Accessing the first uploaded file
//   });
// },registerStudent);

  
studentRouter.post('/login',loginStudent)

studentRouter.post("/logout",verifyJWT,logoutStudent)

module.exports = studentRouter;

