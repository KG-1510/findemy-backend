const express = require("express");
const { postOrder, postVerify } = require("../controllers/payment.controller");
const { protect } = require("../middlewares/authMiddleware");

router = express.Router();

router.post("/order", protect, postOrder);
router.post("/verify", protect, postVerify);

module.exports = router;
