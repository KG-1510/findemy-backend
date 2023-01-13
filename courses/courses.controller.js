const getCourses = (req, res, next) => {
  try {
    res.json({
      success: "true",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getCourses;
