export const components = {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
        },
    },
    schemas: {
        // 회원가입 입력 스키마
        RegisterFormInput: {
            type: "object",
            required: [
                "name",
                "email",
                "password",
                "password_confirm",
                "phone",
                "birthdate",
                "gender",
            ],
            properties: {
                name: { type: "string", example: "홍길동" },
                email: { type: "string", format: "email", example: "user@example.com" },
                password: { type: "string", format: "password", example: "password123!" },
                password_confirm: {
                    type: "string",
                    format: "password",
                    description: "비밀번호 확인",
                    example: "password123!",
                },
                phone: { type: "string", example: "010-1234-5678" },
                birthdate: {
                    type: "string",
                    description: "생년월일 (String)",
                    example: "1990-01-01",
                },
                gender: { type: "string", enum: ["MALE", "FEMALE"], example: "MALE" },
            },
        },
        // 로그인 입력 스키마
        LoginFormInput: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string", format: "email", example: "user@example.com" },
                password: { type: "string", format: "password", example: "password123!" },
            },
        },
        UserResponse: {
            type: "object",
            properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string", example: "홍길동" },
                email: { type: "string", example: "user@example.com" },
                phone: { type: "string", example: "010-1234-5678" },
                birthdate: { type: "string", example: "1990-01-01" },
                gender: { type: "string", enum: ["MALE", "FEMALE"], example: "MALE" },
                role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
            },
        },
        Category: {
            type: "object",
            properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string", example: "Sunglasses" },
                path: { type: "string", example: "sunglasses" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
            },
        },
        ProductImage: {
            type: "object",
            properties: {
                id: { type: "integer", example: 101 },
                url: { type: "string", example: "https://gentlemonster.com/image.jpg" },
                productId: { type: "integer", example: 1 },
            },
        },
        Product: {
            type: "object",
            properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string", example: "Lilit 01" },
                price: { type: "integer", example: 269000 },
                summary: { type: "string", example: "사각 형태의 블랙 플랫바 선글라스" },
                material: { type: "string", example: "아세테이트" },
                collection: { type: "string", example: "2024 Collection" },
                lens: { type: "string", example: "블랙 렌즈" },
                originCountry: { type: "string", example: "China" },
                Shape: {
                    type: "string",
                    description: "대소문자 주의 (DB 컬럼명)",
                    example: "Square",
                },
                sizeInfo: { type: "string", example: "프레임 정면: 145mm, 템플 길이: 149.1mm" },
                categoryId: { type: "integer", example: 1 },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
                images: {
                    type: "array",
                    items: { $ref: "#/components/schemas/ProductImage" },
                },
            },
        },
        ProductDetail: {
            type: "object",
            properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string", example: "Lilit 01" },
                price: { type: "integer", example: 269000 },
                summary: { type: "string", example: "사각 형태의 블랙 플랫바 선글라스" },
                material: { type: "string", example: "아세테이트" },
                collection: { type: "string", example: "2024 Collection" },
                lens: { type: "string", example: "블랙 렌즈" },
                originCountry: { type: "string", example: "China" },
                Shape: { type: "string", example: "Square" },
                sizeInfo: { type: "string", example: "프레임 정면: 145mm..." },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
                images: {
                    type: "array",
                    items: { $ref: "#/components/schemas/ProductImage" },
                },
                category: {
                    $ref: "#/components/schemas/Category",
                },
            },
        },
    },
};
