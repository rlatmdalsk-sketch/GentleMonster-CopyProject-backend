import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validation.middleware";
import { updateProfileSchema, updatePasswordSchema } from "../schemas/user.schema";

const userRouter = Router();
const userController = new UserController();

userRouter.use(authenticateJwt);

userRouter.put("/profile", validateBody(updateProfileSchema), userController.updateProfile);
userRouter.put("/password", validateBody(updatePasswordSchema), userController.updatePassword);

export default userRouter;
