import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../config/openApi";
import { Gender, Role } from "@prisma/client";

extendZodWithOpenApi(z);

const userResponseSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    email: z.email().openapi({ example: "user@example.com" }),
    name: z.string().openapi({ example: "홍길동" }),
    phone: z.string().openapi({ example: "010-1234-5678" }),
    birthdate: z.string().openapi({ example: "1990-01-01" }),
    gender: z.enum(Gender).openapi({ example: "MALE" }),
    role: z.enum(Role).openapi({ example: "USER" }),
    createdAt: z.iso.datetime().openapi({ example: "2024-01-01T00:00:00.000Z" }),
    updatedAt: z.iso.datetime().openapi({ example: "2024-01-01T00:00:00.000Z" }),
});

const paginationMetaSchema = z.object({
    totalUsers: z.number().openapi({ example: 100 }),
    totalPages: z.number().openapi({ example: 10 }),
    currentPage: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 10 }),
});

export const createUserSchema = z.object({
    name: z.string().min(1).openapi({ example: "관리자생성유저" }),
    email: z.email().openapi({ example: "newuser@example.com" }),
    password: z.string().min(8).openapi({ example: "password123!" }),
    phone: z.string().openapi({ example: "010-9999-8888" }),
    birthdate: z.string().openapi({ example: "2000-01-01" }),
    gender: z.enum(Gender).openapi({ example: "FEMALE" }),
    role: z.enum(Role).optional().default(Role.USER).openapi({ example: "USER" }),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const userIdParamSchema = z.object({
    id: z.coerce
        .number()
        .min(1)
        .openapi({
            param: {
                name: "id",
                in: "path",
                description: "유저 ID (숫자)",
            },
            example: 1,
        }),
});

export const userQuerySchema = z.object({
    page: z.coerce
        .number()
        .min(1)
        .default(1)
        .openapi({
            param: {
                name: "page",
                in: "query",
                description: "페이지 번호",
            },
            example: 1,
        }),
    limit: z.coerce
        .number()
        .min(1)
        .default(10)
        .openapi({
            param: {
                name: "limit",
                in: "query",
                description: "페이지당 항목 수",
            },
            example: 10,
        }),
});

registry.registerPath({
    method: "get",
    path: "/admin/users",
    tags: ["Admin/Users"],
    summary: "전체 회원 목록 조회 (관리자)",
    request: {
        query: userQuerySchema,
    },
    responses: {
        200: {
            description: "조회 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        data: z.array(userResponseSchema),
                        pagination: paginationMetaSchema,
                    }),
                },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/admin/users/{id}",
    tags: ["Admin/Users"],
    summary: "회원 상세 조회 (관리자)",
    request: {
        params: userIdParamSchema,
    },
    responses: {
        200: {
            description: "성공",
            content: {
                "application/json": {
                    schema: z.object({ data: userResponseSchema }),
                },
            },
        },
        404: { description: "회원 없음" },
    },
});

registry.registerPath({
    method: "post",
    path: "/admin/users",
    tags: ["Admin/Users"],
    summary: "회원 직접 생성 (관리자)",
    request: {
        body: {
            content: {
                "application/json": { schema: createUserSchema },
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
                        data: userResponseSchema,
                    }),
                },
            },
        },
        409: { description: "이메일 중복" },
    },
});

registry.registerPath({
    method: "put",
    path: "/admin/users/{id}",
    tags: ["Admin/Users"],
    summary: "회원 정보 수정 (관리자)",
    request: {
        params: userIdParamSchema,
        body: {
            content: {
                "application/json": { schema: updateUserSchema },
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
                        data: userResponseSchema,
                    }),
                },
            },
        },
        404: { description: "회원 없음" },
    },
});

registry.registerPath({
    method: "delete",
    path: "/admin/users/{id}",
    tags: ["Admin/Users"],
    summary: "회원 삭제 (관리자)",
    request: {
        params: userIdParamSchema,
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
        404: { description: "회원 없음" },
    },
});
