import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/cars/"),
  filename: (req, file, cb) => {
    const uniqueName = `${file.originalname.replace(
      ".jpg",
      ""
    )}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const multipartData = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, //1mb max file size
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).array("image", 10);

export default multipartData;
