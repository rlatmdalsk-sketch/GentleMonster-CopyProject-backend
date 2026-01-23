import { Router } from "express";
import { AdminUserController } from "../controllers/admin.user.controller";
import { isAdmin } from "../middlewares/admin.middleware";
import { authenticateJwt } from "../middlewares/auth.middleware"; // 이전에 만든 미들웨어 사용

const router = Router();
const adminUserController = new AdminUserController();

router.use(authenticateJwt, isAdmin);

router.get("/", adminUserController.getUsers);
router.get("/:id", adminUserController.getUser);
router.post("/", adminUserController.createUser);
router.put("/:id", adminUserController.updateUser);
router.delete("/:id", adminUserController.deleteUser);

export default router;
