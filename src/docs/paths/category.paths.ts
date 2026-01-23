export const categoryPaths = {
    "/categories": {
        get: {
            summary: "전체 카테고리 목록 조회",
            description: "GNB(메뉴) 구성을 위한 카테고리 목록을 반환합니다.",
            tags: ["Category"],
            responses: {
                "200": {
                    description: "성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Category" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    "/categories/{path}": {
        get: {
            summary: "카테고리 상세 조회 (상품 목록 포함)",
            description:
                "특정 카테고리(path)의 정보와 해당 카테고리에 속한 상품 리스트를 반환합니다.",
            tags: ["Category"],
            parameters: [
                {
                    in: "path",
                    name: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "카테고리 경로 (예: sunglasses, glasses)",
                    example: "sunglasses",
                },
                {
                    in: "query",
                    name: "page",
                    schema: { type: "integer", default: 1 },
                    description: "페이지 번호",
                },
                {
                    in: "query",
                    name: "limit",
                    schema: { type: "integer", default: 20 },
                    description: "페이지당 노출 개수",
                },
            ],
            responses: {
                "200": {
                    description: "성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "object",
                                        properties: {
                                            categoryInfo: { $ref: "#/components/schemas/Category" },
                                            products: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Product" },
                                            },
                                            pagination: {
                                                type: "object",
                                                properties: {
                                                    totalProducts: {
                                                        type: "integer",
                                                        example: 100,
                                                    },
                                                    totalPages: { type: "integer", example: 5 },
                                                    currentPage: { type: "integer", example: 1 },
                                                    limit: { type: "integer", example: 20 },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                "404": {
                    description: "존재하지 않는 카테고리",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "존재하지 않는 카테고리입니다.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
