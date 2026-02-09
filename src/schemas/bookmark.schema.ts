import { z } from "zod";
import { registry } from "../config/openApi";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { PaginationQuerySchema, createPaginatedResponseSchema } from "./common.schema";

extendZodWithOpenApi(z);

const OPEN_API_TAG = "Bookmarks";

// --- 응답 모델 ---
const productSimpleSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    summary: z.string(),
    images: z.array(z.object({ url: z.string() })),
});

const bookmarkResponseSchema = z.object({
    id: z.number(),
    createdAt: z.date(),
    product: productSimpleSchema,
});

// --- 요청 파라미터 ---
export const bookmarkProductIdParamSchema = z.object({
    productId: z.coerce.number().openapi({ example: 101, description: "상품 ID" }),
});

export const createBookmarkSchema = z.object({
    productId: z.number().openapi({ example: 101, description: "찜할 상품 ID" }),
});

// --- 목록 조회 (필터) ---
export const getBookmarkListQuerySchema = PaginationQuerySchema.extend({
    // 필요하다면 카테고리 필터 등을 추가할 수 있습니다.
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type GetBookmarkListQuery = z.infer<typeof getBookmarkListQuerySchema>;

// --- OpenAPI 등록 ---

// 1. 찜 하기
registry.registerPath({
    method: "post",
    path: "/bookmarks",
    summary: "관심 상품 등록",
    tags: [OPEN_API_TAG],
    security: [{ bearerAuth: [] }],
    request: { body: { content: { "application/json": { schema: createBookmarkSchema } } } },
    responses: {
        201: { description: "등록 성공" },
        409: { description: "이미 찜한 상품" },
        404: { description: "존재하지 않는 상품" },
    },
});

// 2. 찜 취소
registry.registerPath({
    method: "delete",
    path: "/bookmarks/{productId}",
    summary: "관심 상품 해제",
    description: "상품 ID를 기준으로 찜을 해제합니다.",
    tags: [OPEN_API_TAG],
    security: [{ bearerAuth: [] }],
    request: { params: bookmarkProductIdParamSchema },
    responses: {
        200: { description: "해제 성공" },
        404: { description: "찜 내역 없음" },
    },
});

// 3. 내 찜 목록 조회
registry.registerPath({
    method: "get",
    path: "/bookmarks",
    summary: "내 관심 상품 목록 조회",
    tags: [OPEN_API_TAG],
    security: [{ bearerAuth: [] }],
    request: { query: getBookmarkListQuerySchema },
    responses: {
        200: {
            description: "조회 성공",
            content: {
                "application/json": {
                    schema: createPaginatedResponseSchema(bookmarkResponseSchema),
                },
            },
        },
    },
});
