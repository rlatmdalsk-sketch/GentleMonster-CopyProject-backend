import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validateParams, validateQuery } from "../middlewares/validation.middleware";
import { categoryParamSchema, categoryQuerySchema } from "../schemas/category.schema";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get(
    "/:path",
    validateParams(categoryParamSchema),
    validateQuery(categoryQuerySchema),
    categoryController.getCategory,
);

export default categoryRouter;
