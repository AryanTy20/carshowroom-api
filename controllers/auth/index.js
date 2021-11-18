import joi from "joi";
import CustomError from "../../services/CustomError";
import JWTService from "../../services/JWT";
import { PASS_SECRET } from "../../config";
import { register, login } from "../../validator/AuthValidator";
import bcrypt from "bcrypt";
import { User, RefreshToken } from "../../models";

export const AuthController = {
  ////////////
  async login(req, res, next) {
    const { error } = login.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username }).select(
        "-__v -email -username -gender -age -createdAt -updatedAt"
      );
      if (!user) {
        return next(CustomError.wrongcredential());
      }
      let pass = password + PASS_SECRET;
      const test = await bcrypt.compare(pass, user.password);
      let accesstoken, refreshtoken;
      if (!test) {
        return next(CustomError.wrongcredential());
      }
      accesstoken = JWTService.sign({ _id: user._id, isAdmin: user.isAdmin });
      refreshtoken = JWTService.refresh(
        { _id: user._id, isAdmin: user.isAdmin },
        "1y"
      );
      await RefreshToken.create({ token: refreshtoken });
      res.json({ accesstoken, refreshtoken });
    } catch (err) {
      console.log(err);
    }
  },

  /////////////////////////////

  async register(req, res, next) {
    //validator
    const { error } = register.validate(req.body);
    if (error) {
      return next(error);
    }

    // hashedpassword
    const { username, email, password, gender, age } = req.body;
    try {
      const err = await User.exists({ username });
      const error = await User.exists({ email });
      if (err) {
        return next(CustomError.alreayExist("username already exits"));
      }
      if (error) {
        return next(CustomError.alreayExist("email already exits"));
      }
    } catch (error) {
      return next(error);
    }
    let pass = password + PASS_SECRET;
    pass = await bcrypt.hash(pass, 10);
    const user = new User({
      username,
      email,
      password: pass,
      gender,
      age,
    });
    let result, accesstoken, refreshtoken;
    try {
      result = await user.save();
      accesstoken = JWTService.sign({
        _id: result._id,
        isAdmin: result.isAdmin,
      });
      refreshtoken = JWTService.refresh(
        { _id: result._id, isAdmin: result.isAdmin },
        "1y"
      );
      await RefreshToken.create({ token: refreshtoken });
    } catch (error) {
      console.log(error);
    }

    res.json({ result, accesstoken, refreshtoken });
  },

  ////////////////////////

  async me(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-_id -password -updatedAt -createdAt -__v"
      );
      if (!user) {
        return next(CustomError.unauthorized());
      }
      res.json({ user });
    } catch (err) {
      console.log(err);
    }
  },

  /////////////////////////////
  async logout(req, res, next) {
    const refreshSchema = joi.object({
      refresh_token: joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const { deletedCount } = await RefreshToken.deleteOne({
        token: req.body.refresh_token,
      });
      if (deletedCount == 0) {
        return next(CustomError.wrongcredential("Invalid Refreshtoken"));
      }
      res.json({ message: "successfully logout" });
    } catch (err) {
      return next(new Error("something went wrong in database"));
    }
  },

  /////////////////////////////
  async refresh(req, res, next) {
    const refreshSchema = joi.object({
      refresh_token: joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const exits = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!exits)
        return next(CustomError.wrongcredential("Invalid RefreshToken"));
      const accesstoken = JWTService.sign(req.user);
      res.json({ accesstoken });
    } catch (err) {
      return next(new Error("something went wrong in database"));
    }
  },
};

export default AuthController;
