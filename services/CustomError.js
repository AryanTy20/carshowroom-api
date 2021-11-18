class CustomError extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreayExist(message) {
    return new CustomError(409, message);
  }

  static wrongcredential(message = "username or password is wrong") {
    return new CustomError(401, message);
  }

  static unauthorized(message = "unauthorized") {
    return new CustomError(401, message);
  }

  static notfound(message = "User not Found") {
    return new CustomError(404, message);
  }
  static serverError(message = " Internal Server Error") {
    return new CustomError(500, message);
  }
  static arrayError(message = "invalid array ") {
    return new CustomError(442, message);
  }
  static ProductNotFound(message = "Product for this ID is not found ") {
    return new CustomError(404, message);
  }
}

export default CustomError;
