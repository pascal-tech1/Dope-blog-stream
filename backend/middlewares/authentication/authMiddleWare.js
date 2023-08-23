const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const jwt = require("jsonwebtoken");



// '''''''''''''''''''''''''''''''''''''''''
//     creating a midddle ware that will hadnle user authorization
// '''''''''''''''''''''''''''''''''''''''''''''

const authMiddleWare = expressAsyncHandler(async (req, res, next) => {
  // checking if the user entered header for authorization
  const enteredHeader = req?.headers.authorization;
  if (!enteredHeader?.startsWith("Bearer"))
    throw new Error("Request header must start with Bearer");
  const enteredToken = enteredHeader?.split(" ")[1];
  if (!enteredToken) throw new Error("Request must contain a valid token");

  try {
    //   verify the user entered token with jwt
    const decodedToken = jwt.verify(enteredToken, process.env.JWT_KEY);
    const userId = decodedToken?.id;
    // found the user with the enterd token and return it without the password
    const foundUser = await User.findById(userId).select("-password");
    req.user = foundUser;
   
    next();
  } catch (error) {
    throw new Error('token invalid or expired, login again')
  }
});

module.exports = authMiddleWare;
