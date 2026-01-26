import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export class ProductController {
    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id as unknown as number;

            const product = await productService.getProductById(productId);

            res.status(200).json({ data: product });
        } catch (error) {
            next(error);
        }
    }
}