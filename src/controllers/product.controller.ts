import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export class ProductController {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const category = req.query.category as string | undefined;
            const sort = req.query.sort as "latest" | "lowPrice" | "highPrice";
            const keyword = req.query.keyword as string | undefined;

            const result = await productService.getAllProducts({
                page,
                limit,
                category,
                sort,
                keyword,
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
