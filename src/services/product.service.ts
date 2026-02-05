import { prisma } from "../config/prisma";
import { HttpException } from "../utils/exception.utils";

interface GetProductsQuery {
    page: number;
    limit: number;
    category?: string;
    sort: "latest" | "lowPrice" | "highPrice";
    keyword?: string;
}

export class ProductService {
    async getAllProducts({ page, limit, category, sort, keyword }: GetProductsQuery) {
        const skip = (page - 1) * limit;

        const whereCondition: any = {};

        if (category) {
            const categoryData = await prisma.category.findUnique({
                where: { path: category },
            });

            if (categoryData) {
                whereCondition.categoryId = categoryData.id;
            } else {
                return {
                    data: [],
                    pagination: { total: 0, totalPages: 0, page, limit },
                };
            }
        }

        if (keyword) {
            whereCondition.OR = [
                { name: { contains: keyword, mode: "insensitive" } },
                { summary: { contains: keyword, mode: "insensitive" } },
                { material: { contains: keyword, mode: "insensitive" } },
            ];
        }

        let orderByCondition: any = { createdAt: "desc" };
        if (sort === "lowPrice") orderByCondition = { price: "asc" };
        if (sort === "highPrice") orderByCondition = { price: "desc" };

        const [total, products] = await prisma.$transaction([
            prisma.product.count({ where: whereCondition }),
            prisma.product.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: orderByCondition,
                include: {
                    images: {
                        take: 1,
                        orderBy: { id: "asc" },
                    },
                },
            }),
        ]);

        return {
            data: products,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                page,
                limit,
            },
        };
    }

    async getProductById(id: number) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: { orderBy: { id: "asc" } },
                category: {
                    include: {
                        parent: {
                            include: { parent: true },
                        },
                    },
                },
            },
        });

        if (!product) {
            throw new HttpException(404, "존재하지 않는 상품입니다.");
        }

        const breadcrumbs = [];
        let currentCategory: any = product.category;

        while (currentCategory) {
            breadcrumbs.unshift({
                id: currentCategory.id,
                name: currentCategory.name,
                path: currentCategory.path,
            });
            currentCategory = currentCategory.parent;
        }

        const { category, ...productData } = product;
        const simpleCategory = {
            id: category.id,
            name: category.name,
            path: category.path,
        };

        return {
            product: { ...productData, category: simpleCategory },
            breadcrumbs,
        };
    }
}