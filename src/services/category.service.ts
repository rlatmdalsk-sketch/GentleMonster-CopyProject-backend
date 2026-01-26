import { HttpException } from "../utils/exception.utils";
import { prisma } from "../config/prisma";

export class CategoryService {
    async getAllCategories() {
        return await prisma.category.findMany({
            orderBy: { id: "asc" },
            select: {
                id: true,
                name: true,
                path: true,
            },
        });
    }

    async getCategoryByPath(path: string, page: number, limit: number) {
        const category = await prisma.category.findUnique({
            where: { path },
        });

        if (!category) {
            throw new HttpException(404, "존재하지 않는 카테고리입니다.");
        }

        const skip = (page - 1) * limit;

        const [totalProducts, products] = await prisma.$transaction([
            prisma.product.count({
                where: { categoryId: category.id },
            }),
            prisma.product.findMany({
                where: { categoryId: category.id },
                skip: skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    images: {
                        take: 1,
                        orderBy: { id: "asc" },
                    },
                },
            }),
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        return {
            categoryInfo: category,
            products: products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                limit,
            },
        };
    }
}
