import { Router } from "express";
import fileupload from "../services/imgupload";
const router = Router();

// Controller
import { AuthController, ProductController } from "../controllers";
//Middleware
import { Auth, Admin } from "../middleware/";

// Routes
//Auth
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", Auth, AuthController.logout);
router.post("/me", Auth, AuthController.me);
router.post("/refresh", Auth, AuthController.refresh);
//Products
router.get("/products/:limit", Auth, ProductController.get);
router.post("/products", [Auth, Admin], fileupload, ProductController.add);
router.put(
  "/products/:id",
  [Auth, Admin],
  fileupload,
  ProductController.update
);
router.delete("/products/:id", [Auth, Admin], ProductController.delete);

export default router;
