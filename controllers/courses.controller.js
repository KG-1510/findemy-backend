const fs = require("fs");
const sgMail = require("@sendgrid/mail");
const path = require("path");
var axios = require("axios");
const dotenv = require("dotenv").config();
const { CourseDetails } = require("../models/courses.model");

const SENDGRID_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_KEY);

const getCourses = async (req, res, next) => {
  try {
    const coursesData = await CourseDetails.find();
    res.status(200).json({
      success: true,
      message: "Fetched courses successfully!",
      data: coursesData,
    });
  } catch (err) {
    res.status(409).json({ success: false, message: err });
  }
};

const getCourseDetails = async (req, res, next) => {
  const reqSlug = req.params.courseSlug;
  try {
    const courseDetailsData = await CourseDetails.findOne({
      courseSlug: reqSlug,
    }).exec();
    if (courseDetailsData) {
      res.status(200).json({
        success: true,
        message: "Fetched course details successfully!",
        data: courseDetailsData,
      });
    } else {
      res.status(404).json({ success: false, message: "Course not found!" });
    }
  } catch (err) {
    res.status(409).json({ success: false, message: err });
  }
};

const getSearchedCourses = async (req, res, next) => {
  const queryString = req.query.query.toLowerCase();
  try {
    const searchedCoursesData = await CourseDetails.find({
      $text: { $search: queryString },
    }).exec();
    if (searchedCoursesData.length !== 0) {
      res.status(200).json({
        success: true,
        message: "Fetched courses for queryString successfully!",
        data: searchedCoursesData,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No relevant search results!",
        data: [],
      });
    }
  } catch (err) {
    res.status(409).json({ success: false, message: err });
  }
};

const getCourseVideo = async (req, res, next) => {
  try {
    const range = req.headers.range;
    const reqSlug = req.params.courseSlug;
    if (!range) {
      res.status(400).send("Requires Range header");
    }
    const videoPath = path.join(__dirname, "..", `${reqSlug}.mp4`);
    const videoSize = fs.statSync(videoPath).size;
    console.log("size of video is:", videoSize);
    const CHUNK_SIZE = 10 ** 6; //1 MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } catch (err) {
    console.log(err);
    res.status(409).json({ success: false, message: err });
  }
};

const postMailSuccessPurchase = async (req, res, next) => {
  const { fullName, email, coursesEnrolled } = req.body;
  var data = JSON.stringify({
    from: {
      email: "guptakushagra15.10@gmail.com",
    },
    personalizations: [
      {
        to: [
          {
            email: email,
          },
        ],
        dynamic_template_data: {
          fullName: fullName,
          email: email,
          coursesEnrolled: coursesEnrolled,
        },
      },
    ],
    template_id: "d-4400bd099da54925977f6a4984e1a4ae",
  });

  console.log(data);

  var config = {
    method: "post",
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      Authorization: `Bearer ${SENDGRID_KEY}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.status(200).json({
        success: true,
        message: "Sent course purchase confirmation mail successfully!",
      });
    })
    .catch(function (error) {
      console.log(error);
      res.status(409).json({ success: false, message: error });
    });
};

const postGiftingSuccessPurchase = async (req, res, next) => {
  const {
    senderName,
    senderEmail,
    recipientFullName,
    recipientEmail,
    message,
    coursesEnrolled,
  } = req.body;
  var data = JSON.stringify({
    from: {
      email: "guptakushagra15.10@gmail.com",
    },
    personalizations: [
      {
        to: [
          {
            email: recipientEmail,
          },
        ],
        dynamic_template_data: {
          senderName: senderName,
          senderEmail: senderEmail,
          recipientFullName: recipientFullName,
          recipientEmail: recipientEmail,
          message: message,
          coursesEnrolled: coursesEnrolled,
        },
      },
    ],
    template_id: "d-db9eb50a2ef54df4a8aee018bad078ae",
  });

  console.log(data);

  var config = {
    method: "post",
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      Authorization: `Bearer ${SENDGRID_KEY}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.status(200).json({
        success: true,
        message: "Sent course purchase confirmation mail successfully!",
      });
    })
    .catch(function (error) {
      console.log(error);
      res.status(409).json({ success: false, message: error });
    });
};

const postCourse = async (req, res, next) => {
  const data = req.body;
  try {
    const courseExist = await CourseDetails.findOne({
      courseSlug: data.courseSlug,
    });
    if (courseExist) {
      return res.status(409).json({
        success: false,
        message: "Course with given course name / course slug already exists!",
      });
    }
    const course = await CourseDetails.create(data);
    if (course) {
      res.status(201).json({
        success: true,
        message: "New course added successfully!",
      });
    }
  } catch (err) {
    res.status(409).json({ success: false, message: err });
  }
};

module.exports = {
  getCourses,
  getCourseDetails,
  getSearchedCourses,
  getCourseVideo,
  postMailSuccessPurchase,
  postGiftingSuccessPurchase,
  postCourse,
};
