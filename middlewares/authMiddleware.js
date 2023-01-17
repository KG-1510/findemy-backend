const jwt = require("jsonwebtoken");
const { User }= require("../models/users.model");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decodedUserId = jwt.verify(token, process.env.JWT_PRIVATE_KEY).id;

      // Get user from the token
      req.user = await User.findById(decodedUserId.toString()).select(
        "-password"
      );

      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ success: false, message: "Not authorized" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token found!" });
  }
};

module.exports = { protect };
