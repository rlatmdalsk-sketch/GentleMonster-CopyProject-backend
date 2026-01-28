import { Request, Response, NextFunction } from "express";
import { AdminProductService } from "../services/admin.product.service";
import { CreateProductInput, UpdateProductInput } from "../schemas/admin.product.schema";

const adminProductService = new AdminProductService();

export class AdminProductController {
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productData = req.body as CreateProductInput;
            const result = await adminProductService.createProduct(productData);

            res.status(201).json({ message: "상품이 등록되었습니다.", data: result });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id as unknown as number;
            const productData = req.body as UpdateProductInput;

            const result = await adminProductService.updateProduct(productId, productData);

            res.status(200).json({ message: "상품 정보가 수정되었습니다.", data: result });
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id as unknown as number;

            const result = await adminProductService.deleteProduct(productId);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}