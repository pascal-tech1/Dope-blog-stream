const express = require("express");
const { createEmailMsgCtrl } = require("../../controllers/emails/emailCtrl");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");

const emailRoutes = express.Router();

emailRoutes.get("/",authMiddleWare, createEmailMsgCtrl);

module.exports = emailRoutes;
