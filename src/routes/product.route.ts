import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validateParams, validateQuery } from "../middlewares/validation.middleware";
import { productQuerySchema, productIdParamSchema } from "../schemas/product.schema";

const productRouter = Router();
const productController = new ProductController();

productRouter.get("/", validateQuery(productQuerySchema), productController.getProducts);
productRouter.get("/:id", validateParams(productIdParamSchema), productController.getProduct);

export default productRouter;
