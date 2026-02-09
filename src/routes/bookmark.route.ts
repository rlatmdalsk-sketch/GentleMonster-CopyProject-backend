import { Router } from "express";
import { BookmarkController } from "../controllers/bookmark.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";
import { validateBody, validateParams, validateQuery } from "../middlewares/validation.middleware";
import {
    createBookmarkSchema,
    bookmarkProductIdParamSchema,
    getBookmarkListQuerySchema,
} from "../schemas/bookmark.schema";

const router = Router();
const bookmarkController = new BookmarkController();

// 모든 기능 로그인 필수
router.use(authenticateJwt);

router.get("/", validateQuery(getBookmarkListQuerySchema), bookmarkController.getMyBookmarks);
router.post("/", validateBody(createBookmarkSchema), bookmarkController.createBookmark);
router.delete(
    "/:productId",
    validateParams(bookmarkProductIdParamSchema),
    bookmarkController.deleteBookmark,
);

export default router;
