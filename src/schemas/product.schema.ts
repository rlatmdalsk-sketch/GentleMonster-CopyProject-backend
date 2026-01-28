import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../config/openApi";
import { breadcrumbSchema } from "./category.schema";

extendZodWithOpenApi(z);

const productImageSchema = z.object({
    id: z.number().openapi({ example: 101 }),
    url: z.string().openapi({ example: "https://storage.googleapis.com/..." }),
});

const simpleCategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    path: z.string(),
});

const productBaseSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Lilit 01" }),
    price: z.number().openapi({ example: 269000 }),
    summary: z.string().openapi({ example: "Square black sunglasses" }),
    images: z.array(productImageSchema),
});

const productDetailSchema = productBaseSchema.extend({
    material: z.string().openapi({ example: "Acetate" }),
    collection: z.string().openapi({ example: "2024 Collection" }),
    lens: z.string().openapi({ example: "Black Lens" }),
    originCountry: z.string().openapi({ example: "China" }),
    Shape: z.string().openapi({ example: "Square" }),
    sizeInfo: z.string().openapi({ example: "Frame Front: 145mm..." }),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    category: simpleCategorySchema,
});

export const productQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1).openapi({ example: 1 }),
    limit: z.coerce.number().min(1).default(20).openapi({ example: 20 }),
    category: z.string().optional().openapi({
        example: "sunglasses",
        description: "카테고리 Path (필터링)"
    }),
    sort: z.enum(["latest", "lowPrice", "highPrice"]).default("latest").openapi({
        example: "latest",
        description: "정렬 기준 (latest | lowPrice | highPrice)"
    }),
});

export const productIdParamSchema = z.object({
    id: z.coerce.number().min(1).openapi({
        param: { name: "id", in: "path" },
        example: 1,
    }),
});

registry.registerPath({
    method: "get",
    path: "/products",
    tags: ["Product"],
    summary: "상품 목록 조회",
    description: "카테고리 필터링, 정렬, 페이지네이션을 지원합니다.",
    request: {
        query: productQuerySchema,
    },
    responses: {
        200: {
            description: "조회 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        data: z.array(productBaseSchema),
                        pagination: z.object({
                            total: z.number(),
                            totalPages: z.number(),
                            page: z.number(),
                            limit: z.number(),
                        }),
                    }),
                },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/products/{id}",
    tags: ["Product"],
    summary: "상품 상세 조회",
    description: "상품 상세 정보와 카테고리 경로(Breadcrumbs)를 반환합니다.",
    request: {
        params: productIdParamSchema,
    },
    responses: {
        200: {
            description: "조회 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        product: productDetailSchema,
                        breadcrumbs: z.array(breadcrumbSchema),
                    }),
                },
            },
        },
        404: { description: "존재하지 않는 상품" },
    },
});