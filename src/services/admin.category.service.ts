import { HttpException } from "../utils/exception.utils";
import { prisma } from "../config/prisma";

interface CreateCategoryDto {
    name: string;
    path: string;
}

interface UpdateCategoryDto {
    name?: string;
    path?: string;
}

export class AdminCategoryService {
    async createCategory(data: CreateCategoryDto) {
        const existingCategory = await prisma.category.findUnique({
            where: { path: data.path },
        });

        if (existingCategory) {
            throw new HttpException(409, "이미 존재하는 경로(path)입니다.");
        }

        return await prisma.category.create({
            data: {
                name: data.name,
                path: data.path,
            },
        });
    }

    async updateCategory(categoryId: number, data: UpdateCategoryDto) {
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!category) throw new HttpException(404, "존재하지 않는 카테고리입니다.");

        if (data.path && data.path !== category.path) {
            const existingPath = await prisma.category.findUnique({
                where: { path: data.path },
            });
            if (existingPath) throw new HttpException(409, "이미 존재하는 경로(path)입니다.");
        }

        return await prisma.category.update({
            where: { id: categoryId },
            data: { ...data },
        });
    }

    async deleteCategory(categoryId: number) {
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!category) throw new HttpException(404, "존재하지 않는 카테고리입니다.");

        const productCount = await prisma.product.count({
            where: { categoryId: categoryId },
        });

        if (productCount > 0) {
            throw new HttpException(400, "해당 카테고리에 속한 상품이 있어 삭제할 수 없습니다. 상품을 먼저 이동하거나 삭제해주세요.");
        }

        await prisma.category.delete({
            where: { id: categoryId },
        });

        return { message: "카테고리가 삭제되었습니다.", deletedId: categoryId };
    }
}