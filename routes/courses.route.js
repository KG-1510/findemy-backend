const express = require("express");
const {
  getCourses,
  getCourseDetails,
  getSearchedCourses,
} = require("../controllers/courses.controller");

router = express.Router();

router.get("/", getCourses);
router.get("/search", getSearchedCourses);
router.get("/:courseSlug", getCourseDetails);

module.exports = router;
