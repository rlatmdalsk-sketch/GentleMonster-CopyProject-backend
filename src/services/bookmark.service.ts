import { prisma } from "../config/prisma";
import { HttpException } from "../utils/exception.utils";
import { GetBookmarkListQuery } from "../schemas/bookmark.schema";

export class BookmarkService {
    // --- 1. 관심 상품 등록 ---
    async addBookmark(userId: number, productId: number) {
        // 상품 존재 여부 확인
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new HttpException(404, "존재하지 않는 상품입니다.");

        // 이미 찜했는지 확인
        const existing = await prisma.bookmark.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });

        if (existing) {
            throw new HttpException(409, "이미 관심 상품으로 등록되어 있습니다.");
        }

        return await prisma.bookmark.create({
            data: { userId, productId },
        });
    }

    // --- 2. 관심 상품 해제 ---
    async removeBookmark(userId: number, productId: number) {
        // 찜 내역 확인
        const existing = await prisma.bookmark.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });

        if (!existing) {
            throw new HttpException(404, "관심 상품 등록 내역이 없습니다.");
        }

        await prisma.bookmark.delete({
            where: {
                userId_productId: { userId, productId },
            },
        });

        return { message: "관심 상품에서 삭제되었습니다.", productId };
    }

    // --- 3. 내 관심 상품 목록 조회 ---
    async getMyBookmarks(userId: number, query: GetBookmarkListQuery) {
        const { page, limit } = query;
        const skip = (page - 1) * limit;

        const [total, bookmarks] = await Promise.all([
            prisma.bookmark.count({ where: { userId } }),
            prisma.bookmark.findMany({
                where: { userId },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            summary: true,
                            images: { take: 1, orderBy: { id: "asc" } }, // 대표 이미지
                        },
                    },
                },
                orderBy: { createdAt: "desc" }, // 최신 찜한 순서
                skip,
                take: limit,
            }),
        ]);

        return {
            data: bookmarks,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            },
        };
    }
}
