const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    // console.log(user);
    if (err) return res.sendStatus(403);
    req.user = await userModel.findById(user.id);
    next();
  });
};

// exports.authCheck = async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }
//   //make sure token exits
//   if (!token) {
//     return next(new ErrorHandler("Not authorized to access this route", 401));
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decoded);
//     req.user = await userModel.findById(decoded.id);
//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Not authorized to access this route", 401));
//   }
// };

// exports.authorize = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     return next(
//       new ErrorHandler(
//         `This user is allowed to perform action , user role : ${req.user.role}`,
//         403
//       )
//     );
//   }
//   //if this is not mentioned then entire application will hang
//   next();
// };

module.exports = {
  authenticateToken,
};
