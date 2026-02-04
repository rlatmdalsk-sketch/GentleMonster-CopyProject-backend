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

registry.registerPath({
    method: "put",
    path: "/cart/{itemId}",
    summary: "장바구니 아이템 수량 수정",
    tags: [OPEN_API_TAG],
    security: [{ bearerAuth: [] }],
    request: {
        params: cartItemIdParamSchema,
        body: { content: { "application/json": { schema: updateCartItemSchema } } },
    },
    responses: {
        200: { description: "수량 수정 성공" },
        404: { description: "장바구니 항목 없음" },
    },
});

registry.registerPath({
    method: "delete",
    path: "/cart/{itemId}",
    summary: "장바구니 아이템 삭제",
    tags: [OPEN_API_TAG],
    security: [{ bearerAuth: [] }],
    request: {
        params: cartItemIdParamSchema,
    },
    responses: {
        200: { description: "삭제 성공" },
        404: { description: "장바구니 항목 없음" },
    },
});