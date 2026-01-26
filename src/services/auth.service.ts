import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";
import { HttpException } from "../utils/exception.utils";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export class AuthService {
    async register(data: RegisterInput) {
        const { email, password, name, phone, birthdate, gender } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new HttpException(409, "이미 존재하는 이메일입니다.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                phone,
                birthdate,
                gender,
                role: Role.USER,
                password: hashedPassword,
            },
        });

        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async login(data: LoginInput) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HttpException(405, "아이디나 비밀번호가 일치하지 않습니다.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new HttpException(405, "아이디나 비밀번호가 일치하지 않습니다.");
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
        const { password: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }
}
