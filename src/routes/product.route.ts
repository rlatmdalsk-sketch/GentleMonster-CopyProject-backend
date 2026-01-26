import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validateParams } from "../middlewares/validation.middleware";
import { productParamSchema } from "../schemas/product.schema";

const productRouter = Router();
const productController = new ProductController();

productRouter.get("/:id", validateParams(productParamSchema), productController.getProduct);

export default productRouter;
