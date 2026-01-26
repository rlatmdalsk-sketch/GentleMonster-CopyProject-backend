import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../config/openApi";

extendZodWithOpenApi(z);

const productImageSchema = z.object({
    id: z.number().openapi({ example: 101 }),
    url: z.string().openapi({ example: "https://gentlemonster.com/img/1.jpg" }),
    productId: z.number().openapi({ example: 1 }),
});

const simpleCategorySchema = z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Sunglasses" }),
    path: z.string().openapi({ example: "sunglasses" }),
});

const productDetailSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Lilit 01" }),
    price: z.number().openapi({ example: 269000 }),
    material: z.string().openapi({ example: "아세테이트" }),
    summary: z.string().openapi({ example: "사각 형태의 블랙 플랫바 선글라스" }),
    collection: z.string().openapi({ example: "2024 Collection" }),
    lens: z.string().openapi({ example: "블랙 렌즈" }),
    originCountry: z.string().openapi({ example: "China" }),
    Shape: z.string().openapi({ example: "Square" }),
    sizeInfo: z.string().openapi({ example: "프레임 정면: 145mm, 템플 길이: 149.1mm" }),
    createdAt: z.coerce.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),
    updatedAt: z.coerce.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),

    images: z.array(productImageSchema),
    category: simpleCategorySchema,
});

export const productParamSchema = z.object({
    id: z.coerce
        .number()
        .min(1)
        .openapi({
            param: {
                name: "id",
                in: "path",
                description: "상품 ID (숫자)",
            },
            example: 1,
        }),
});

registry.registerPath({
    method: "get",
    path: "/products/{id}",
    tags: ["Product"],
    summary: "상품 상세 조회",
    description: "상품 ID로 상세 정보를 조회합니다. (이미지, 카테고리 정보 포함)",
    request: {
        params: productParamSchema,
    },
    responses: {
        200: {
            description: "성공",
            content: {
                "application/json": {
                    schema: z.object({
                        data: productDetailSchema,
                    }),
                },
            },
        },
        400: { description: "잘못된 요청 (ID 형식 오류)" },
        404: { description: "존재하지 않는 상품" },
    },
});
