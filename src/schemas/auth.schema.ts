import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../config/openApi";
import { Gender, Role } from "@prisma/client";

extendZodWithOpenApi(z);

export const userResponseSchema = z.object({
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

export const registerSchema = z
    .object({
        email: z.email().openapi({ example: "user@example.com" }),
        password: z.string().min(8).openapi({ example: "password123!" }),
        password_confirm: z.string().min(8).openapi({ example: "password123!" }),
        name: z.string().min(1).openapi({ example: "홍길동" }),
        phone: z.string().openapi({ example: "010-1234-5678" }),
        birthdate: z.string().openapi({ example: "1990-01-01" }),
        gender: z.enum(Gender).openapi({ example: "MALE" }),
    })
    .refine(data => data.password === data.password_confirm, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["password_confirm"],
    });

export const loginSchema = z.object({
    email: z.email().openapi({ example: "user@example.com" }),
    password: z.string().min(1).openapi({ example: "password123!" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

registry.registerPath({
    method: "post",
    path: "/auth/register",
    tags: ["Auth"],
    summary: "회원가입",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: registerSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "회원가입 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        data: userResponseSchema,
                    }),
                },
            },
        },
        400: { description: "유효성 검사 실패 (비밀번호 불일치 등)" },
        409: { description: "이미 존재하는 이메일" },
    },
});

registry.registerPath({
    method: "post",
    path: "/auth/login",
    tags: ["Auth"],
    summary: "로그인",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: loginSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "로그인 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        data: z.object({
                            token: z.string(),
                            user: userResponseSchema,
                        }),
                    }),
                },
            },
        },
        405: { description: "아이디 또는 비밀번호 불일치" },
    },
});
