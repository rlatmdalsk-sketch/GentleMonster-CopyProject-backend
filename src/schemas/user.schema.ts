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
    createdAt: z.coerce.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),
    updatedAt: z.coerce.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),
});

export const updateProfileSchema = z.object({
    name: z.string().min(1).optional().openapi({ example: "홍길동(수정)" }),
    phone: z.string().optional().openapi({ example: "010-5678-1234" }),
    birthdate: z.string().optional().openapi({ example: "1995-05-05" }),
    gender: z.enum(Gender).optional().openapi({ example: "FEMALE" }),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z
    .object({
        currentPassword: z.string().min(1).openapi({ example: "oldPassword123!" }),
        newPassword: z.string().min(8).openapi({ example: "newPassword123!" }),
        newPassword_confirm: z.string().min(8).openapi({ example: "newPassword123!" }),
    })
    .refine(data => data.newPassword === data.newPassword_confirm, {
        message: "새 비밀번호가 일치하지 않습니다.",
        path: ["newPassword_confirm"],
    });
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

registry.registerPath({
    method: "put",
    path: "/users/profile",
    tags: ["Users"],
    summary: "내 정보 수정",
    description: "로그인한 사용자의 프로필 정보를 수정합니다. (이메일, 비밀번호 제외)",
    request: {
        body: {
            content: {
                "application/json": { schema: updateProfileSchema },
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
    },
});

registry.registerPath({
    method: "put",
    path: "/users/password",
    tags: ["Users"],
    summary: "비밀번호 변경",
    description: "현재 비밀번호를 확인 후, 새로운 비밀번호로 변경합니다.",
    request: {
        body: {
            content: {
                "application/json": { schema: updatePasswordSchema },
            },
        },
    },
    responses: {
        200: {
            description: "비밀번호 변경 성공",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        403: { description: "현재 비밀번호 불일치" },
    },
});
