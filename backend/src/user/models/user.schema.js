import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  agency_name: {
    type: String,
    required: [true, "agency_name is requires"],
    maxLength: [30, "agency_name can't exceed 30 characters"],
    minLength: [2, "agency_name should have atleast 2 charcters"],
  },
  contact_person: {
    type: String,
    required: [true, "contact_person name is required"],
    maxLength: [30, "contact_person can't exceed 30 characters"],
    minLength: [2, "contact_person should have atleast 2 charcters"],
  },
  email: {
    type: String,
    required: [true, "email is requires"],
    unique: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  contact_number: {
    type: String,
    required: [true, "contact_number is requires"],
    unique: true,
  },
  gst_number: String,
  pan_numner: String,
  address: String,
  ref_by: String,
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
  },
  profileImg: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  document: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "agent", "customer", "super-admin"],
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_Expire,
  });
};
// user password compare
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generatePasswordResetToken
userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and updating user resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
