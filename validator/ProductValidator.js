import joi from "joi";

export const AddValidate = joi.object({
  company: joi.string().required().max(30),
  type: joi.string().required().max(30),
  model: joi.string().required().max(30),
  engine: joi.string().required().max(8),
  seats: joi.number().required().max(10),
  gear: joi.string().required().valid("automatic", "manual"),
  fuel: joi.string().required().valid("petrol", "desile", "electric"),
  price: joi.number().required().max(1000000000),
  colors: joi.array().items(joi.string()).required().min(1).max(10),
});
