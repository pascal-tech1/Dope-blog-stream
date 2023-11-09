const expressAsyncHandler = require("express-async-handler");

// '''''''''''''''''''''''''''''''''''''''''
//     creating a midddle ware that will hadnle admin user authorization
// '''''''''''''''''''''''''''''''''''''''''''''

const adminMiddleWare = expressAsyncHandler(async (req, res, next) => {
	if (!req.user.admin) {
		throw new Error("only admin allow");
		console.log("im here true");
	} else {
		console.log("not and admin");
	}
	next();
});

module.exports = adminMiddleWare;
