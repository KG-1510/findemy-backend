const express = require("express");
const {
  getCourses,
  getCourseDetails,
  getSearchedCourses,
  getCourseVideo,
} = require("../controllers/courses.controller");

router = express.Router();

router.get("/", getCourses);
router.get("/search", getSearchedCourses);
router.get("/stream/coursevideo/:courseSlug", getCourseVideo);
router.get("/:courseSlug", getCourseDetails);

module.exports = router;
