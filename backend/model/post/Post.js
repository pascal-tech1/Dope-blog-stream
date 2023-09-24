const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        // required: [true, "Post title is required"],
        trim: true,
      },
      //Created by only category
      category: {
        type: String,
        // required: [true, "Post category is required"],
        default: "All",
      },
      description: {
        type: String,
        required:[true, "Description is Required"]
      },
      isLiked: {
        type: Boolean,
        default: false,
      },
      isDisLiked: {
        type: Boolean,
        default: false,
      },
      numViews: {
        type: Number,
        default: 0,
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      disLikes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please user is required"],
      },
    
      content: {
        type: String,
        // required: [true, "Post content is required"],
      },
      image: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2020/10/25/09/23/seagull-5683637_960_720.jpg",
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

  //compile
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
