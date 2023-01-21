const { User } = require("../models/users.model");
const { CourseDetails } = require("../models/courses.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const postUser = async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "User with given Email ID already exists!",
      });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      ...req.body,
      password: hashPassword,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: "New user created successfully!",
        token: generateAuthToken(user?._id.toString()),
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({ success: false, message: err });
  }
};

const postLoginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        data: user,
        token: generateAuthToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid credentials!" });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({ success: false, message: err });
  }
};

const getUser = async (req, res, next) => {
  const _id = req.params.id;

  try {
    const user = await User.findById({ _id });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist!" });
    }
    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(409).json({ success: false, message: err });
  }
};

const postAddCart = async (req, res, next) => {
  const {
    userId,
    courseSlug,
    isGiftedCourse = false,
    recipientEmail,
  } = req.body;
  console.log("isGiftedCourse", isGiftedCourse, recipientEmail);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist!" });
    } else {
      const course = await CourseDetails.findOne({ courseSlug });
      const giftUser = await User.findOne({ email: recipientEmail });
      if (user.cart.some((item) => item.courseSlug === courseSlug)) {
        return res
          .status(400)
          .json({ success: false, message: "Course already exists in cart!" });
      } else {
        if (isGiftedCourse && !giftUser) {
          return res
            .status(400)
            .json({ success: false, message: "User is not registered!" });
        } else if (isGiftedCourse && 
          giftUser.coursesEnrolled.some(
            (item) => item.courseSlug === courseSlug
          )
        ) {
          return res.status(400).json({
            success: false,
            message: "User has already bought this course!",
          });
        }
        if (isGiftedCourse && giftUser) {
          user.cart = [];
          await user.save();
          course["isGiftedCourse"] = isGiftedCourse;
          user.cart.push(course);
          await user.save();
        } else {
          user.cart.push(course);
          await user.save();
        }
        res.status(200).json({
          success: true,
          message: "Course added to cart successfully!",
          data: user,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({ success: false, message: err });
  }
};

const getUserCart = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist!" });
    }
    let oldPriceTotal = 0;
    let newPriceTotal = 0;
    for (var i = 0; i < user.cart.length; i++) {
      oldPriceTotal = user.cart[i].oldPrice;
      newPriceTotal = user.cart[i].price;
    }

    res.status(200).json({
      success: true,
      message: "User cart items fetched successfully!",
      data: {
        cart: user.cart,
        oldPriceTotal,
        newPriceTotal,
      },
    });
  } catch (err) {
    res.status(409).json({ success: false, message: err });
  }
};

const patchUserCart = async (req, res, next) => {
  const { userId, courseSlug } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist!" });
    } else {
      user.cart = user.cart.filter((item) => {
        return item.courseSlug !== courseSlug;
      });
      await user.save();
      res.status(200).json({
        success: true,
        message: "Course removed from cart successfully!",
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({ success: false, message: err });
  }
};

const postCourseEnroll = async (req, res, next) => {
  const { userId, coursesPurchased } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist!" });
    } else {
      user.coursesEnrolled = [...user.coursesEnrolled, ...coursesPurchased];
      user.cart = [];
      await user.save();
      res.status(200).json({
        success: true,
        message: "Purchased courses successfully!",
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({ success: false, message: err });
  }
};

const postGiftedCourseEnroll = async (req, res, next) => {
  const { userId, recipientEmail, coursesPurchased } = req.body;
  try {
    const recipientUser = await User.findOne({ email: recipientEmail });
    const user = await User.findById(userId);

    if (!recipientUser) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist!" });
    } else {
      recipientUser.coursesEnrolled = [
        ...recipientUser.coursesEnrolled,
        ...coursesPurchased,
      ];
      await recipientUser.save();
      console.log(recipientUser.coursesEnrolled);
      user.cart = [];
      await user.save();
      res.status(200).json({
        success: true,
        message: "Purchased and gifted course successfully!",
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({ success: false, message: err });
  }
};

const generateAuthToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "7d",
  });
  console.log(token);
  return token;
};

const validate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required().label("Full Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    imageurl: Joi.string().label("ImageURL"),
  });
  return schema.validate(data);
};

module.exports = {
  postUser,
  postLoginUser,
  getUser,
  postAddCart,
  getUserCart,
  patchUserCart,
  postCourseEnroll,
  postGiftedCourseEnroll,
};
