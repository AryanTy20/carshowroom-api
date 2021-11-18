import jwt from "jsonwebtoken";
import { TOKEN_SECRET, REFRESH_TOKEN } from "../config";

class JWTService {
  static sign(payload, expiry = "1d", secret = TOKEN_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  static verify(token, secret = TOKEN_SECRET) {
    return jwt.verify(token, secret);
  }
  static refresh(token, expiry = "2d", secret = REFRESH_TOKEN) {
    return jwt.sign(token, secret, { expiresIn: expiry });
  }
}

export default JWTService;
