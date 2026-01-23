export const productPaths = {
    "/products/{id}": {
        get: {
            summary: "상품 상세 조회",
            description: "상품 ID로 상세 정보를 조회합니다. (이미지, 카테고리 정보 포함)",
            tags: ["Product"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "integer" },
                    description: "상품 ID (숫자)",
                    example: 1,
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
                                    data: { $ref: "#/components/schemas/ProductDetail" },
                                },
                            },
                        },
                    },
                },
                "400": { // [추가됨] ID가 숫자가 아닐 경우
                    description: "잘못된 요청 (ID 형식 오류)",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "유효하지 않은 상품 ID입니다. 숫자로 입력해주세요." },
                                },
                            },
                        },
                    },
                },
                "404": {
                    description: "존재하지 않는 상품",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "존재하지 않는 상품입니다." },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};