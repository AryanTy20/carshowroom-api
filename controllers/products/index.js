import joi from "joi";
import fs from "fs";
import { HOST } from "../../config";
import { AddValidate } from "../../validator/ProductValidator";
import Products from "../../models/products";
import CustomError from "../../services/CustomError";

export const ProductController = {
  // add data
  async add(req, res, next) {
    let fname = new Array();
    let imgpath = new Array();
    req.files.map((data, i) => {
      imgpath[i] = `${HOST}:${APP_port}/cars/${data.filename}`;
      fname[i] = data.filename;
    });

    // const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

    const { company, type, model, engine, seats, gear, fuel, price, colors } =
      req.body;

    let color, ccolor;
    try {
      if (colors) {
        if (colors.match("'")) {
          ccolor = colors.replace(RegExp("'", "g"), '"');
        }
        color = JSON.parse(ccolor ? ccolor : colors);
      }
    } catch (error) {
      console.log(error);
    }

    const data = {
      company,
      type,
      model,
      engine,
      seats,
      gear,
      fuel,
      price,
      colors: color,
    };
    // Validation;
    let imagepath = `${APP_ROOT}/public/cars/`;
    const { error } = AddValidate.validate(data);
    if (error) {
      fname.map((i) =>
        fs.unlink(`${imagepath + i}`, (err) => {
          if (err) console.log(err);
          else {
            console.log("\nDeleted file:", i);
          }
        })
      );
      return next(error);
    } else {
      console.log("all good");
    }

    // preaparemodel

    try {
      const exits = await Products.exists({ model });
      if (exits) {
        fname.map((i) =>
          fs.unlink(`${imagepath + i}`, (err) => {
            if (err) console.log(err);
            else {
              console.log("\nDeleted file:", i);
            }
          })
        );
        return next(CustomError.alreayExist("This model already exists"));
      }
    } catch (err) {
      return next(err);
    }
    let product;
    try {
      product = await Products.create({
        company,
        type,
        model,
        engine,
        seats,
        gear,
        price,
        fuel,
        colors: color,
        images: imgpath,
      });
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({ message: "product created", product });
  },

  //############################################################################
  //get data with limit
  async get(req, res, next) {
    Products.find({}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.json({ data });
    }).limit(Number(req.params.limit));
  },

  //###############################################################################
  //update
  async update(req, res, next) {
    const {
      company,
      type,
      model,
      engine,
      seats,
      gear,
      fuel,
      price,
      colors,
      deletedimg,
    } = req.body;

    // console.log(deletedimg);
    let updatedimg = [],
      imgpath = [],
      fname = [],
      color,
      data,
      deleteimg;
    if (req.files) {
      req.files.map((data, i) => {
        imgpath[i] = `${HOST}:${APP_PORT}/cars/${data.filename}`;
        fname[i] = data.filename;
      });
    }

    if (deletedimg) {
      try {
        try {
          deleteimg = JSON.stringify(JSON.parse(deletedimg));
        } catch (error) {
          let imagepath = `${APP_ROOT}/public/cars/`;
          fname.map((i) => {
            fs.unlink(`${imagepath + i}`, (err) => {
              if (err) console.log(err);
              else {
                console.log("\nDeleted file:", i);
              }
            });
          });
          return next(CustomError.arrayError("array error try double quotes"));
        }

        Products.findOne({ _id: req.params.id }, async (err, data) => {
          if (err) {
            return next(CustomError.ProductNotFound());
          }

          const dblength = data.images.length;
          const delimg = JSON.parse(deletedimg);
          delimg.forEach((x) => {
            let i = data.images.indexOf(x);
            if (i > -1) {
              data.images.splice(i, 1);
            }
          });
          updatedimg = data.images;
          console.log(updatedimg);
          if (updatedimg.length !== dblength) {
            try {
              let imagepath = `${APP_ROOT}/public/cars/`;
              const delimg = JSON.parse(deletedimg);
              delimg.map((i) => {
                fs.unlink(`${imagepath + i.split("cars/")[1]}`, (err) => {
                  if (err) console.log(err);
                  else {
                    console.log("\nDeleted file:", i);
                  }
                });
              });
            } catch (error) {
              return next(CustomError.serverError());
            }
          }
          if (imgpath.length !== 0) {
            updatedimg.push(imgpath);
          }

          //
          try {
            color = JSON.parse(colors);
          } catch (error) {
            console.log(error);
          }
          //

          data = {
            company,
            type,
            model,
            engine,
            seats,
            gear,
            fuel,
            price,
            colors: color,
          };
          const { error } = AddValidate.validate(data);
          if (error) {
            return next(error);
          }

          data = {
            company,
            type,
            model,
            engine,
            seats,
            gear,
            fuel,
            price,
            colors: color,
            images: updatedimg,
          };

          let product;
          let id = { _id: req.params.id };
          try {
            product = await Products.findByIdAndUpdate(id, data, { new: true });
            res.json({ product });
          } catch (error) {
            return next(error);
          }
          //
        });
      } catch (error) {
        return next(CustomError.serverError());
      }
    }
  },

  //#######################################################################################
  //delete
  async delete(req, res, next) {
    Products.findOne({ _id: req.params.id }, (err, data) => {
      if (err) {
        return next(CustomError.ProductNotFound());
      }
      let imagepath = `${APP_ROOT}/public/cars/`;

      if (data !== null) {
        data.images.map((i) => {
          fs.unlink(`${imagepath + i.split("cars/")[1]}`, (err) => {
            if (err) console.log(err);
            else {
              console.log("\nDeleted file:", i);
            }
          });
        });
        //

        Products.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
          if (err) {
            return next(err);
          } else {
            res.json({ message: "Product deleted successfully", data });
          }
        });

        //
      } else {
        return next(CustomError.ProductNotFound());
      }
    });
  },
};

export default ProductController;
