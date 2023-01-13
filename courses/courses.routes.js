var express = require("express");
var getCourses = require("./courses.controller");

const router = express.Router();

router.get("/", getCourses);

module.exports = router;
