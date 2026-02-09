import { Request, Response, NextFunction } from "express";
import { AdminOrderService } from "../services/admin.order.service";
import { GetAdminOrderListQuery } from "../schemas/admin.order.schema";

const adminOrderService = new AdminOrderService();

export class AdminOrderController {
    // 전체 주문 조회
    async getAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;

            const query = {
                ...req.query,
                page,
                limit,
            } as unknown as GetAdminOrderListQuery;

            const result = await adminOrderService.getAllOrders(query);
            res.status(200).json({ message: "조회 성공", data: result });
        } catch (error) {
            next(error);
        }
    }

    // 주문 상세 조회
    async getOrderDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const result = await adminOrderService.getOrderDetail(id);
            res.status(200).json({ message: "상세 조회 성공", data: result });
        } catch (error) {
            next(error);
        }
    }

    // 주문 상태 변경
    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const result = await adminOrderService.updateOrderStatus(id, req.body);
            res.status(200).json({ message: "상태 변경 성공", data: result });
        } catch (error) {
            next(error);
        }
    }
}
