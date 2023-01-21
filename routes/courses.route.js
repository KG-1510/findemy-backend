const express = require("express");
const {
  getCourses,
  getCourseDetails,
  getSearchedCourses,
  getCourseVideo,
  postMailSuccessPurchase,
  postGiftingSuccessPurchase
} = require("../controllers/courses.controller");
const { protect } = require("../middlewares/authMiddleware");

router = express.Router();

router.get("/", getCourses);
router.get("/search", getSearchedCourses);
router.get("/stream/coursevideo/:courseSlug", getCourseVideo);
router.post("/sendmail/purchasesuccess", protect, postMailSuccessPurchase)
router.post("/sendmail/giftingsuccess", protect, postGiftingSuccessPurchase)
router.get("/:courseSlug", getCourseDetails);

module.exports = router;
