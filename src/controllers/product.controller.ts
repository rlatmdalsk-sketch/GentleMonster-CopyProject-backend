import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export class ProductController {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const page = req.query.page as unknown as number;
            const limit = req.query.limit as unknown as number;
            const category = req.query.category as string | undefined;
            const sort = req.query.sort as "latest" | "lowPrice" | "highPrice";

            const result = await productService.getAllProducts({
                page,
                limit,
                category,
                sort,
            });

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as unknown as number;

            const result = await productService.getProductById(id);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}