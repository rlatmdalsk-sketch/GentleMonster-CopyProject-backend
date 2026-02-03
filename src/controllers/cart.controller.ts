import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';

const cartService = new CartService();

export class CartController {
    async getMyCart(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id; // Auth 미들웨어에서 주입된 정보
            const result = await cartService.getMyCart(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async addToCart(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await cartService.addItem(req.user!.id, req.body);
            res.status(201).json({ message: '장바구니 추가 성공', data: result });
        } catch (error) {
            next(error);
        }
    }

    async updateCartItem(req: Request, res: Response, next: NextFunction) {
        try {
            const itemId = Number(req.params.itemId);
            const result = await cartService.updateItem(req.user!.id, itemId, req.body);
            res.status(200).json({ message: '수량 수정 성공', data: result });
        } catch (error) {
            next(error);
        }
    }

    async deleteCartItem(req: Request, res: Response, next: NextFunction) {
        try {
            const itemId = Number(req.params.itemId);
            const result = await cartService.deleteItem(req.user!.id, itemId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}