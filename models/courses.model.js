const mongoose = require("mongoose");
const { Schema } = mongoose;

const coursesSchema = new Schema({
  imageurl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  courseSlug: {
    type: String,
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  votes: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: false,
  },
  level: {
    type: String,
    required: true,
  },
});

coursesSchema.index({ "$**": "text" });

const courseDetailsSchema = new Schema(
  {
    imageurl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    courseSlug: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    votes: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: false,
    },
    level: {
      type: String,
      required: true,
    },
    learningOutcomes: {
      type: [String],
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructorProfession: {
      type: String,
      required: true,
    },
    instructorImg: {
      type: String,
      required: true,
    },
    instructorDescription: {
      type: String,
      required: true,
    },
    isGiftedCourse: {
      type: Boolean,
      required: false,
    }
  }
);

const Course = mongoose.model("Course", coursesSchema);
const CourseDetails = mongoose.model("CourseDetails", courseDetailsSchema);

module.exports = {
  Course,
  CourseDetails,
};
