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
      res
        .status(200)
        .json({ success: false, message: "No relevant search results!", data: [] });
    }
  } catch (err) {
    res.status(409).json({ success: false, message: err });
  }
};

module.exports = {
  getCourses,
  getCourseDetails,
  getSearchedCourses,
};
