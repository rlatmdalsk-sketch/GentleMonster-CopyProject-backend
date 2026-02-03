import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../config/openApi";

extendZodWithOpenApi(z);

const productResponseSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Lilit 01" }),
    price: z.number().openapi({ example: 269000 }),
    material: z.string().openapi({ example: "Acetate" }),
    summary: z.string().openapi({ example: "Square black sunglasses" }),
    collection: z.string().openapi({ example: "2024 Collection" }),
    lens: z.string().openapi({ example: "Black Lens" }),
    originCountry: z.string().openapi({ example: "China" }),
    Shape: z.string().openapi({ example: "Square" }),
    sizeInfo: z.string().openapi({ example: "Frame Front: 145mm..." }),
    categoryId: z.number().openapi({ example: 2 }),
    images: z.array(z.object({
        id: z.number(),
        url: z.url(),
    })).openapi({ example: [{ id: 10, url: "https://storage.googleapis.com/..." }] }),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createProductSchema = z.object({
    name: z.string().min(1).openapi({ example: "Lilit 01" }),
    price: z.number().min(0).openapi({ example: 269000 }),
    material: z.string().min(1).openapi({ example: "Acetate" }),
    summary: z.string().min(1).openapi({ example: "Square black sunglasses" }),
    collection: z.string().min(1).openapi({ example: "2024 Collection" }),
    lens: z.string().min(1).openapi({ example: "Black Lens" }),
    originCountry: z.string().min(1).openapi({ example: "China" }),
    Shape: z.string().min(1).openapi({ example: "Square" }),
    sizeInfo: z.string().min(1).openapi({ example: "Frame Front: 145mm..." }),
    categoryId: z.number().int().positive().openapi({ example: 2 }),
    imageUrls: z.array(z.url()).min(1).openapi({
        example: [
            "https://storage.googleapis.com/bucket/products/img1.jpg",
            "https://storage.googleapis.com/bucket/products/img2.jpg"
        ],
        description: "/uploads API를 통해 업로드된 이미지 URL 리스트"
    }),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productIdParamSchema = z.object({
    id: z.coerce.number().min(1).openapi({
        param: {
            name: "id",
            in: "path",
            description: "상품 ID",
        },
        example: 1,
    }),
});

registry.registerPath({
    method: "post",
    path: "/admin/products",
    tags: ["Admin/Products"],
    summary: "상품 등록 (관리자)",
    description: "이미지 URL 리스트를 포함하여 상품을 등록합니다. (이미지는 /uploads API 선행 필요)",
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: { "application/json": { schema: createProductSchema } },
        },
    },
    responses: {
        201: {
            description: "등록 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        data: productResponseSchema,
                    }),
                },
            },
        },
        404: { description: "존재하지 않는 카테고리" },
    },
});

registry.registerPath({
    method: "put",
    path: "/admin/products/{id}",
    tags: ["Admin/Products"],
    summary: "상품 수정 (관리자)",
    description: "상품 정보를 수정합니다. imageUrls 전달 시 기존 이미지는 삭제되고 새로 연결됩니다.",
    security: [{ bearerAuth: [] }],
    request: {
        params: productIdParamSchema,
        body: {
            content: { "application/json": { schema: updateProductSchema } },
        },
    },
    responses: {
        200: {
            description: "수정 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        data: productResponseSchema,
                    }),
                },
            },
        },
        404: { description: "존재하지 않는 상품 또는 카테고리" },
    },
});

registry.registerPath({
    method: "delete",
    path: "/admin/products/{id}",
    tags: ["Admin/Products"],
    summary: "상품 삭제 (관리자)",
    security: [{ bearerAuth: [] }],
    request: {
        params: productIdParamSchema,
    },
    responses: {
        200: {
            description: "삭제 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        deletedId: z.number(),
                    }),
                },
            },
        },
        404: { description: "존재하지 않는 상품" },
    },
});