import joi from "joi";

export const register = joi.object({
  username: joi.string().max(20).required(),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "in", "io"] },
    })
    .required()
    .max(30),
  password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*_]{3,30}$"))
    .required(),
  repeat_password: joi.ref("password"),
  gender: joi.string().required().valid("male", "female", "other"),
  age: joi.number().max(100).required(),
});
export const login = joi.object({
  username: joi.string().max(20).required(),
  password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*_]{3,30}$"))
    .required(),
});
