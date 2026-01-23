import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { HttpException } from "../utils/exception.utils";

const productService = new ProductService();

export class ProductController {
    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = Number(req.params.id);

            if (isNaN(productId)) {
                throw new HttpException(400, "유효하지 않은 상품 ID입니다. 숫자로 입력해주세요.");
            }

            const product = await productService.getProductById(productId);

            res.status(200).json({ data: product });
        } catch (error) {
            next(error);
        }
    }
}