const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First name is required"],
      type: String,
    },
    lastName: {
      required: [true, "Last name is required"],
      type: String,
    },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Hei buddy Password is required"],
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Blogger"],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isUnFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    passwordChangeAt: Date,
    passwordRessetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// virtual method on the user object to populate user posts
userSchema.virtual("Posts",{
  ref: "Post",
  foreignField: "user",
  localField: "_id"
})


// creating a mongoose middleware that handles the hashing before storing the data
userSchema.pre("save", async function (next) {
  // ensuring the password is hash only one the password field changes
  if (!this.isModified("password")) {
    next();
  }
  // '''''''''''''  hashing password with bcyrpt    ''''''''''
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// creating a mongoose middleware that handles the unhashing before storing the data
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.accountVerificationHandler = async function () {
  // generating a random digits with crypto node js library
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;
  return verificationToken;
};

userSchema.methods.passwordResetHandler = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordRessetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

// compile schema into model
const User = mongoose.model("User", userSchema);
module.exports = User;
