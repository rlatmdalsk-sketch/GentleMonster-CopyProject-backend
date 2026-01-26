import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../config/openApi";

extendZodWithOpenApi(z);

const productImageSchema = z.object({
    id: z.number().openapi({ example: 101 }),
    url: z.string().openapi({ example: "https://example.com/image.jpg" }),
    productId: z.number().openapi({ example: 1 }),
});

const productSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Lilit 01" }),
    price: z.number().openapi({ example: 269000 }),
    summary: z.string().openapi({ example: "사각 형태의 블랙 플랫바 선글라스" }),
    images: z.array(productImageSchema),
});

const paginationSchema = z.object({
    totalProducts: z.number().openapi({ example: 100 }),
    totalPages: z.number().openapi({ example: 5 }),
    currentPage: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 20 }),
});

const categorySchema = z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Sunglasses" }),
    path: z.string().openapi({ example: "sunglasses" }),
});

export const categoryParamSchema = z.object({
    path: z.string().min(1).openapi({
        param: {
            name: "path",
            in: "path",
            description: "카테고리 경로 (예: sunglasses)",
        },
        example: "sunglasses",
    }),
});

export const categoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1).openapi({
        param: {
            name: "page",
            in: "query",
            description: "페이지 번호 (기본값: 1)",
        },
        example: 1,
    }),
    limit: z.coerce.number().min(1).default(20).openapi({
        param: {
            name: "limit",
            in: "query",
            description: "페이지당 항목 수 (기본값: 20)",
        },
        example: 20,
    }),
});

registry.registerPath({
    method: "get",
    path: "/categories",
    tags: ["Category"],
    summary: "전체 카테고리 목록 조회",
    responses: {
        200: {
            description: "성공",
            content: {
                "application/json": {
                    schema: z.object({
                        data: z.array(categorySchema),
                    }),
                },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/categories/{path}",
    tags: ["Category"],
    summary: "카테고리 상세 및 상품 목록 조회",
    request: {
        params: categoryParamSchema,
        query: categoryQuerySchema,
    },
    responses: {
        200: {
            description: "성공",
            content: {
                "application/json": {
                    schema: z.object({
                        data: z.object({
                            categoryInfo: categorySchema,
                            products: z.array(productSchema),
                            pagination: paginationSchema,
                        }),
                    }),
                },
            },
        },
        404: {
            description: "존재하지 않는 카테고리",
        },
    },
});