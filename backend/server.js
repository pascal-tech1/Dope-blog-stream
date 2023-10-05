const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const userRoutes = require("./route/users/usersRoute");
const postsRoutes = require("./route/posts/postsRoutes");
const connectDB = require("./config/db/dbConnect");
const commentRoutes = require("./route/comments/commentsRoutes");
const emailRoutes = require("./route/emails/emailRoutes");
const categoryRoutes = require("./route/category/categoryRoutes");
const cors = require("cors");
const {
	generalErrorHandle,
	NotFoundErrorhandler,
} = require("./middlewares/error/errorhandler");

// dotenv init

const app = express();
// mongodb config init

// defaut middleware
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/categorys", categoryRoutes);
app.use(NotFoundErrorhandler);
app.use(generalErrorHandle);
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`App listening on port ${PORT}`));
