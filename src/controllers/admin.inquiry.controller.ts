import { Request, Response, NextFunction } from "express";
import { AdminInquiryService } from "../services/admin.inquiry.service";
import { GetAdminInquiryListQuery } from "../schemas/admin.inquiry.schema";

const inquiryService = new AdminInquiryService();

export class AdminInquiryController {
    // 전체 조회
    async getAllInquiries(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20; // 관리자는 20개 기본

            const query = {
                ...req.query,
                page,
                limit,
            } as unknown as GetAdminInquiryListQuery;
            const result = await inquiryService.getAllInquiries(query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // 상세 조회
    async getInquiryDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const result = await inquiryService.getInquiryDetail(id);
            res.status(200).json({ message: "상세 조회 성공", data: result });
        } catch (error) {
            next(error);
        }
    }

    // 답변 등록
    async answerInquiry(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const result = await inquiryService.answerInquiry(id, req.body);
            res.status(200).json({ message: "답변이 등록되었습니다.", data: result });
        } catch (error) {
            next(error);
        }
    }

    // 삭제
    async deleteInquiry(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const result = await inquiryService.deleteInquiry(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
