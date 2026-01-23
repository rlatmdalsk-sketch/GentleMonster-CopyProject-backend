import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const productRouter = Router();
const productController = new ProductController();

productRouter.get("/:id", productController.getProduct);

export default productRouter;