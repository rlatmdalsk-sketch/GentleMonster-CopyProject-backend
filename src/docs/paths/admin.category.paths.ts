export const adminCategoryPaths = {
    "/api/admin/categories": {
        post: {
            summary: "카테고리 생성 (관리자)",
            tags: ["Admin Categories"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name", "path"],
                            properties: {
                                name: { type: "string", example: "Optical" },
                                path: { type: "string", example: "optical" },
                            },
                        },
                    },
                },
            },
            responses: {
                "201": {
                    description: "생성 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "카테고리 생성 성공" },
                                    data: { $ref: "#/components/schemas/Category" },
                                },
                            },
                        },
                    },
                },
                "409": {
                    description: "이미 존재하는 Path",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "이미 존재하는 경로(path)입니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    "/api/admin/categories/{id}": {
        put: {
            summary: "카테고리 수정 (관리자)",
            tags: ["Admin Categories"],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "integer" },
                },
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "New Optical" },
                                path: { type: "string", example: "new-optical" },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "수정 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "카테고리 수정 성공" },
                                    data: { $ref: "#/components/schemas/Category" },
                                },
                            },
                        },
                    },
                },
                "404": {
                    description: "존재하지 않는 카테고리 ID",
                },
                "409": {
                    description: "이미 존재하는 Path로 변경 시도",
                },
            },
        },
        delete: {
            summary: "카테고리 삭제 (관리자)",
            description: "해당 카테고리에 속한 상품이 없을 경우에만 삭제 가능합니다.",
            tags: ["Admin Categories"],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "integer" },
                },
            ],
            responses: {
                "200": {
                    description: "삭제 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "카테고리가 삭제되었습니다." },
                                    deletedId: { type: "integer", example: 1 },
                                },
                            },
                        },
                    },
                },
                "400": {
                    description: "삭제 불가 (해당 카테고리에 상품이 존재함)",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "해당 카테고리에 속한 상품이 있어 삭제할 수 없습니다." },
                                },
                            },
                        },
                    },
                },
                "404": {
                    description: "존재하지 않는 카테고리 ID",
                },
            },
        },
    },
};