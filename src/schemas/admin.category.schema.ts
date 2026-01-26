import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../config/openApi";

extendZodWithOpenApi(z);

const categoryResponseSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Sunglasses" }),
    path: z.string().openapi({ example: "sunglasses" }),
    createdAt: z.iso.datetime().openapi({ example: "2024-01-01T00:00:00.000Z" }),
    updatedAt: z.iso.datetime().openapi({ example: "2024-01-01T00:00:00.000Z" }),
});

export const createCategorySchema = z.object({
    name: z.string().min(1).openapi({ example: "Optical" }),
    path: z.string().min(1).openapi({
        example: "optical",
        description: "URL 경로에 사용될 영문 식별자"
    }),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryIdParamSchema = z.object({
    id: z.coerce.number().min(1).openapi({
        param: {
            name: "id",
            in: "path",
            description: "카테고리 ID (숫자)",
        },
        example: 1,
    }),
});

registry.registerPath({
    method: "post",
    path: "/admin/categories",
    tags: ["Admin Categories"],
    summary: "카테고리 생성 (관리자)",
    request: {
        body: {
            content: {
                "application/json": { schema: createCategorySchema },
            },
        },
    },
    responses: {
        201: {
            description: "생성 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        data: categoryResponseSchema,
                    }),
                },
            },
        },
        409: { description: "이미 존재하는 Path" },
    },
});

registry.registerPath({
    method: "put",
    path: "/admin/categories/{id}",
    tags: ["Admin Categories"],
    summary: "카테고리 수정 (관리자)",
    request: {
        params: categoryIdParamSchema,
        body: {
            content: {
                "application/json": { schema: updateCategorySchema },
            },
        },
    },
    responses: {
        200: {
            description: "수정 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        data: categoryResponseSchema,
                    }),
                },
            },
        },
        404: { description: "존재하지 않는 카테고리 ID" },
        409: { description: "이미 존재하는 Path로 변경 시도" },
    },
});

registry.registerPath({
    method: "delete",
    path: "/admin/categories/{id}",
    tags: ["Admin Categories"],
    summary: "카테고리 삭제 (관리자)",
    description: "해당 카테고리에 속한 상품이 없을 경우에만 삭제 가능합니다.",
    request: {
        params: categoryIdParamSchema,
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
        400: { description: "삭제 불가 (해당 카테고리에 상품 존재)" },
        404: { description: "존재하지 않는 카테고리 ID" },
    },
});