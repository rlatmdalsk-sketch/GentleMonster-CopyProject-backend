import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { UpdateProfileInput, UpdatePasswordInput } from "../schemas/user.schema";

const userService = new UserService();

export class UserController {
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req.user as any).id;

            const updatedUser = await userService.updateProfile(
                userId,
                req.body as UpdateProfileInput,
            );

            res.status(200).json({
                message: "프로필 정보가 수정되었습니다.",
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req.user as any).id;

            const result = await userService.updatePassword(
                userId,
                req.body as UpdatePasswordInput,
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
