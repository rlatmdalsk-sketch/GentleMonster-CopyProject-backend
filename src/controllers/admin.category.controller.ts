import { Request, Response, NextFunction } from "express";
import { AdminCategoryService } from "../services/admin.category.service";
import { CreateCategoryInput, UpdateCategoryInput } from "../schemas/admin.category.schema";

const adminCategoryService = new AdminCategoryService();

export class AdminCategoryController {
    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await adminCategoryService.createCategory(
                req.body as CreateCategoryInput,
            );
            res.status(201).json({ message: "카테고리 생성 성공", data: category });
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryId = req.params.id as unknown as number;
            const category = await adminCategoryService.updateCategory(
                categoryId,
                req.body as UpdateCategoryInput,
            );
            res.status(200).json({ message: "카테고리 수정 성공", data: category });
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryId = req.params.id as unknown as number;
            const result = await adminCategoryService.deleteCategory(categoryId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
