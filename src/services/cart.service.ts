import { prisma } from "../config/prisma";
import { HttpException } from "../utils/exception.utils";
import { AddToCartInput, UpdateCartItemInput } from "../schemas/cart.schema";

export class CartService {
    // 장바구니 조회 (없으면 자동 생성)
    private async getOrCreateCart(userId: number) {
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }
        return cart;
    }

    async getMyCart(userId: number) {
        const cart = await this.getOrCreateCart(userId);
        return await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: { product: { include: { images: { take: 1 } } } },
        });
    }

    async addItem(userId: number, data: AddToCartInput) {
        const cart = await this.getOrCreateCart(userId);

        // 이미 장바구니에 해당 상품이 있는지 확인
        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId: data.productId }
        });

        if (existingItem) {
            return await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + data.quantity }
            });
        }

        return await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: data.productId,
                quantity: data.quantity
            }
        });
    }

    async updateItem(userId: number, itemId: number, data: UpdateCartItemInput) {
        const item = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });

        if (!item || item.cart.userId !== userId) {
            throw new HttpException(404, "장바구니 항목을 찾을 수 없습니다.");
        }

        return await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: data.quantity }
        });
    }

    async deleteItem(userId: number, itemId: number) {
        const item = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });

        if (!item || item.cart.userId !== userId) {
            throw new HttpException(404, "장바구니 항목을 찾을 수 없습니다.");
        }

        await prisma.cartItem.delete({ where: { id: itemId } });
        return { message: "항목이 삭제되었습니다.", deletedId: itemId };
    }
}