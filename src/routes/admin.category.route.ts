import { Router } from "express";
import passport from "passport";
import { AdminCategoryController } from "../controllers/admin.category.controller";
import { isAdmin } from "../middlewares/admin.middleware";

const adminCategoryRouter = Router();
const adminCategoryController = new AdminCategoryController();

adminCategoryRouter.use(passport.authenticate("jwt", { session: false }), isAdmin);

adminCategoryRouter.post("/", adminCategoryController.createCategory);
adminCategoryRouter.put("/:id", adminCategoryController.updateCategory);
adminCategoryRouter.delete("/:id", adminCategoryController.deleteCategory);

export default adminCategoryRouter;