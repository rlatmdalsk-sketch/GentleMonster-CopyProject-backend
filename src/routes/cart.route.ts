import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";
import { validateBody, validateParams } from "../middlewares/validation.middleware";
import {
    addToCartSchema,
    updateCartItemSchema,
    cartItemIdParamSchema,
} from "../schemas/cart.schema";

const router = Router();
const cartController = new CartController();

router.use(authenticateJwt);

router.get("/", cartController.getMyCart);
router.post("/", validateBody(addToCartSchema), cartController.addToCart);
router.put(
    "/:itemId",
    validateParams(cartItemIdParamSchema),
    validateBody(updateCartItemSchema),
    cartController.updateCartItem,
);
router.delete("/:itemId", validateParams(cartItemIdParamSchema), cartController.deleteCartItem);

export default router;
