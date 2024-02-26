import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import ProductController from "./app/controllers/ProductController";
import authMiddleware from "./app/middleware/auth";
import OrderController from "./app/controllers/OrderController";
import CategoryController from "./app/controllers/CategoryController";

const upload = multer(multerConfig);

const routes = new Router();

routes.post("/users", UserController.store);

routes.post("/sessions", SessionController.store);

routes.use(authMiddleware); // all routes under this route will call the middleware

routes.post("/products", upload.single("file"), ProductController.store);
routes.get("/products", authMiddleware, ProductController.index);
routes.put("/products/:id", upload.single("file"), ProductController.update)

routes.post("/categories",upload.single("file"), CategoryController.store);
routes.get("/categories", CategoryController.index);
routes.put("/categories/:id", upload.single("file"), CategoryController.update)

routes.post("/orders", OrderController.store);
routes.put("/orders/:id", OrderController.update)
routes.get("/orders", OrderController.index);
export default routes;
