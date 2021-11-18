import dotenv from "dotenv";
dotenv.config();

export const {
  HOST,
  APP_PORT,
  DB_URL,
  DEBUG_MODE,
  PASS_SECRET,
  TOKEN_SECRET,
  REFRESH_TOKEN,
} = process.env;
