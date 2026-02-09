import { Request, Response, NextFunction } from "express";
import { BookmarkService } from "../services/bookmark.service";
import { GetBookmarkListQuery } from "../schemas/bookmark.schema";

const bookmarkService = new BookmarkService();

export class BookmarkController {
    // 찜 하기
    async createBookmark(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.body;
            const result = await bookmarkService.addBookmark(req.user!.id, productId);
            res.status(201).json({ message: "관심 상품에 등록되었습니다.", data: result });
        } catch (error) {
            next(error);
        }
    }

    // 찜 취소
    async deleteBookmark(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = Number(req.params.productId);
            const result = await bookmarkService.removeBookmark(req.user!.id, productId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // 목록 조회
    async getMyBookmarks(req: Request, res: Response, next: NextFunction) {
        try {
            // ★ String -> Number 변환 (안전하게 처리)
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const query: GetBookmarkListQuery = { page, limit };

            const result = await bookmarkService.getMyBookmarks(req.user!.id, query);
            res.status(200).json({ message: "조회 성공", data: result });
        } catch (error) {
            next(error);
        }
    }
}
