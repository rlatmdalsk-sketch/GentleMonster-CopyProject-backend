import { HttpException } from "../utils/exception.utils";
import { prisma } from "../config/prisma";

export class ProductService {
    async getProductById(productId: number) {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                images: {
                    orderBy: { id: "asc" },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        path: true,
                    },
                },
            },
        });

        if (!product) {
            throw new HttpException(404, "존재하지 않는 상품입니다.");
        }

        return product;
    }
}