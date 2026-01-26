import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";

const categoryService = new CategoryService();

export class CategoryController {
    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json({ data: categories });
        } catch (error) {
            next(error);
        }
    }

    async getCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { path } = req.params as { path: string };

            const page = req.query.page as unknown as number;
            const limit = req.query.limit as unknown as number;

            const result = await categoryService.getCategoryByPath(path, page, limit);

            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }
}
