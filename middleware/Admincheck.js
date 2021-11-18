import CustomError from "../services/CustomError";

const admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(CustomError.unauthorized("user must be an Admin"));
  }
  next();
};

export default admin;
