const express = require("express");

const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");
const {
	createMsgCtrl,
	fetchMsgCtrl,
} = require("../../controllers/message/messageCtrl");

const messageRoutes = express.Router();

messageRoutes.post("/", authMiddleWare, createMsgCtrl);
messageRoutes.get("/", authMiddleWare, fetchMsgCtrl);
module.exports = messageRoutes;
