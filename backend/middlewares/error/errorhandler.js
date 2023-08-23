const express = require("express");

// '''''''''''''''''''''''''''''''''''''''''
//         Not Found Error Handing
// '''''''''''''''''''''''''''''''''''''''''''''
const NotFoundErrorhandler = (req, res, next) => {
 console.log(req)
  const error = new Error(`${req.originalUrl} NOT FOUND`);
  console.log(error)
  res.status(404);
  next(error);
};

// '''''''''''''''''''''''''''''''''''''''''
//         General Error Handling
// '''''''''''''''''''''''''''''''''''''''''''''
const generalErrorHandle = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { NotFoundErrorhandler, generalErrorHandle };
