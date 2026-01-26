import { Router } from "express";
import passport from "passport";
import { AdminCategoryController } from "../controllers/admin.category.controller";
import { isAdmin } from "../middlewares/admin.middleware";
import { validateBody, validateParams } from "../middlewares/validation.middleware";
import {
    createCategorySchema,
    updateCategorySchema,
    categoryIdParamSchema,
} from "../schemas/admin.category.schema";

const adminCategoryRouter = Router();
const adminCategoryController = new AdminCategoryController();

adminCategoryRouter.use(passport.authenticate("jwt", { session: false }), isAdmin);

adminCategoryRouter.post(
    "/",
    validateBody(createCategorySchema),
    adminCategoryController.createCategory,
);
adminCategoryRouter.put(
    "/:id",
    validateParams(categoryIdParamSchema),
    validateBody(updateCategorySchema),
    adminCategoryController.updateCategory,
);
adminCategoryRouter.delete(
    "/:id",
    validateParams(categoryIdParamSchema),
    adminCategoryController.deleteCategory,
);

export default adminCategoryRouter;
