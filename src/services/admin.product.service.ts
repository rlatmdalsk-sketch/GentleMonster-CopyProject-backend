import { prisma } from "../config/prisma";
import { HttpException } from "../utils/exception.utils";
import { CreateProductInput, UpdateProductInput } from "../schemas/admin.product.schema";

export class AdminProductService {
    async createProduct(data: CreateProductInput) {
        const category = await prisma.category.findUnique({
            where: { id: data.categoryId },
        });

        if (!category) {
            throw new HttpException(404, "존재하지 않는 카테고리 ID입니다.");
        }

        return await prisma.product.create({
            data: {
                name: data.name,
                price: data.price,
                material: data.material,
                summary: data.summary,
                collection: data.collection,
                lens: data.lens,
                originCountry: data.originCountry,
                Shape: data.Shape,
                sizeInfo: data.sizeInfo,
                categoryId: data.categoryId,
                images: {
                    create: data.imageUrls.map(url => ({ url })),
                },
            },
            include: {
                images: true,
            },
        });
    }

    async updateProduct(productId: number, data: UpdateProductInput) {
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!existingProduct) {
            throw new HttpException(404, "수정할 상품을 찾을 수 없습니다.");
        }

        if (data.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId },
            });
            if (!category) {
                throw new HttpException(404, "변경하려는 카테고리가 존재하지 않습니다.");
            }
        }

        const { imageUrls, ...productData } = data;

        const imageUpdateQuery = imageUrls
            ? {
                  images: {
                      deleteMany: {},
                      create: imageUrls.map(url => ({ url })),
                  },
              }
            : {};

        return await prisma.product.update({
            where: { id: productId },
            data: {
                ...productData,
                ...imageUpdateQuery,
            },
            include: {
                images: { orderBy: { id: "asc" } },
            },
        });
    }

    async deleteProduct(productId: number) {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new HttpException(404, "삭제할 상품을 찾을 수 없습니다.");
        }

        await prisma.product.delete({
            where: { id: productId },
        });

        return { message: "상품이 성공적으로 삭제되었습니다.", deletedId: productId };
    }
}