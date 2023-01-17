const Razorpay = require("razorpay");
const crypto = require("crypto");

const postOrder = async (req, res, next) => {
  const { amount, paymentMethod } = req.body;

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
      method: paymentMethod,
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Something Went Wrong!" });
      }
      res.status(200).json({
        success: true,
        message: "Razorpay Order ID generated successfully",
        data: order,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(409).json({ success: false, message: err });
  }
};

const postVerify = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
    if (razorpay_signature === expectedSign) {
      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully!" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({ success: false, message: err });
  }
};

module.exports = {
  postOrder,
  postVerify,
};
