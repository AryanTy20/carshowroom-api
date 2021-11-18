import CustomError from "../services/CustomError";
import JWTService from "../services/JWT";

const auth = (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(CustomError.unauthorized());
  }

  const token = authHeader.split(" ")[1];

  try {
    const { _id, isAdmin } = JWTService.verify(token);
    const user = {
      _id,
      isAdmin,
    };
    req.user = user;
    next();
  } catch (error) {
    return next(CustomError.unauthorized());
  }
};

export default auth;
