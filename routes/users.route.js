const express = require("express");
const {
  postUser,
  postLoginUser,
  getUser,
  postAddCart,
  getUserCart,
  patchUserCart,
  postCourseEnroll,
  postGiftedCourseEnroll,
} = require("../controllers/users.controller");
const { protect } = require("../middlewares/authMiddleware");

router = express.Router();

router.post("/signup", postUser);
router.post("/login", postLoginUser);
router.post("/addcart", protect, postAddCart);
router.get("/getcart/:userId", protect, getUserCart);
router.patch("/patchcart", protect, patchUserCart);
router.post("/courseenroll", protect, postCourseEnroll);
router.post("/giftedcourseenroll", protect, postGiftedCourseEnroll);
router.get("/:id", protect, getUser);

module.exports = router;
