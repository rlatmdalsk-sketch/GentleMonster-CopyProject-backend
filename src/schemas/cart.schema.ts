import { z } from "zod";
import { registry } from "../config/openApi";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const OPEN_API_TAG = "Cart";

export const cartItemResponseSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    productId: z.number(),
    product: z.object({
        name: z.string(),
        price: z.number(),
        images: z.array(z.object({ url: z.string() })),
    }),
});

export const addToCartSchema = z.object({
    productId: z.number().openapi({ example: 101, description: "상품 ID" }),
    quantity: z.number().min(1, "최소 1개 이상이어야 합니다.").default(1).openapi({ example: 1 }),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().min(1, "수량은 1개 이상이어야 합니다.").openapi({ example: 3 }),
});

export const cartItemIdParamSchema = z.object({
    itemId: z.coerce.number().openapi({ example: 1, description: "장바구니 항목 ID" }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

registry.registerPath({
    method: "get",
    path: "/cart",
    summary: "내 장바구니 조회",
    tags: [OPEN_API_TAG],
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "조회 성공",
            content: { "application/json": { schema: z.array(cartItemResponseSchema) } },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/cart",
    summary: "장바구니 상품 추가",
    tags: [OPEN_API_TAG],
    security: [{ bearerAuth: [] }],
    request: { body: { content: { "application/json": { schema: addToCartSchema } } } },
    responses: { 201: { description: "추가 성공" } },
});
