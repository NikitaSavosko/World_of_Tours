'use server'

import { revalidatePath } from "next/cache";
import { prisma } from "../../prisma/prisma";
import { getUserId } from "./user-actions";

export async function getAllUserMessages() {
    try {
        const userId = await getUserId();
        if (!userId) return [];

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { authorId: userId },
                    { recipientId: userId },
                ],
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return messages;
    } catch (error) {
        console.error("Ошибка в получении сообщений", error);
        throw new Error("Ошибка в получении сообщений");
    }
}

export async function getUserChats(userId: string) {
    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { authorId: userId },
                    { recipientId: userId }
                ]
            },
            include: {
                author: true,
                recipient: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const uniqueChats = new Map<string, {
            user: { id: string; name: string; image: string | null };
            lastMessage: string;
            lastMessageTime: Date;
        }>();

        messages.forEach(message => {
            const isAuthor = message.authorId === userId;
            const counterpart = isAuthor ? message.recipient : message.author;
            const chatId = counterpart.id;

            if (!uniqueChats.has(chatId)) {
                uniqueChats.set(chatId, {
                    user: counterpart,
                    lastMessage: message.content,
                    lastMessageTime: message.createdAt
                });
            }
        });

        return Array.from(uniqueChats.values()).sort((a, b) =>
            b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
        );
    } catch (error) {
        console.error("Не получилось получить чаты", error);
        return [];
    }
}

export async function createMessage(
    senderId: string,
    recipientId: string,
    content: string,
) {
    try {
        if (!senderId || !recipientId || !content) {
            throw new Error("Не указаны отправитель, получатель или текст сообщения");
        }

        const message = await prisma.message.create({
            data: {
                authorId: senderId,
                recipientId,
                content,
            },
        });

        revalidatePath("/")

        return { success: true, message }
    } catch (error) {
        console.error("Ошибка при создании сообщения", error);
        return { success: false, error: "Ошибка при создании сообщения" }
    }
}

export async function getChatMessages(userId1: string, userId2: string) {
    try {
        if (!userId1 || !userId2) throw new Error("Не указаны пользователи");

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        authorId: userId1,
                        recipientId: userId2,
                    },
                    {
                        authorId: userId2,
                        recipientId: userId1,
                    },
                ],
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                authorId: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return messages;
    } catch (error) {
        console.error("Ошибка при получении переписки", error);
        throw new Error("Не удалось загрузить переписку");
    }
}

export async function deleteMessage(messageId: string, userId: string) {
    try {
        const message = await prisma.message.findUnique({
            where: { id: messageId, authorId: userId },
        });

        if (!message) {
            throw new Error("Сообщение не найдено или у вас нет прав на его удаление");
        }

        await prisma.message.delete({
            where: { id: messageId },
        });

        revalidatePath("/")

        return { success: true };
    } catch (error) {
        console.error("Ошибка при удалении сообщения", error);
        return { success: false, error: "Ошибка при удалении сообщения" }
    }
}