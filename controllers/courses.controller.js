const fs = require("fs");
const path = require("path");
const { Course, CourseDetails } = require("../models/courses.model");

const getCourses = async (req, res, next) => {
  try {
    const coursesData = await Course.find();
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
    const searchedCoursesData = await Course.find({
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

module.exports = {
  getCourses,
  getCourseDetails,
  getSearchedCourses,
  getCourseVideo,
};
