import { DEBUG_MODE } from "../config";
import { ValidationError } from "joi";
import CustomError from "../services/CustomError";

const errorhandler = (err, req, res, next) => {
  let statuscode = 500;
  let data = {
    message: "Internal server error",
    ...(DEBUG_MODE == "true" && { originalerror: err.message }),
  };

  if (err instanceof ValidationError) {
    statuscode = 422;
    data = {
      message: err.message,
    };
  }

  if (err instanceof CustomError) {
    statuscode = err.status;
    data = {
      message: err.message,
    };
  }

  return res.status(statuscode).json(data);
};

export default errorhandler;
