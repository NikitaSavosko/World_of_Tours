'use server';

import { prisma } from '../../prisma/prisma';
import { revalidatePath } from 'next/cache';

export async function createNews(title: string, content: string, tourFirmId: string) {
    if (!title || !content || !tourFirmId) return;

    try {
        const news = await prisma.news.create({
            data: {
                tourFirmId,
                title,
                content,
            }
        })

        revalidatePath("/admin")
        return { success: true, news }
    } catch (error) {
        console.error("Не получилось создать новость", error)
        return { success: false, error: "Не получилось создать новость" }
    }
}

export async function getNews() {
    try {
        const result = await prisma.news.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                tourFirmId: true,
                createdAt: true,
                tourFirm: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return { success: true, result }
    } catch (e) {
        console.error("Не получилось получить новости", e)
        return { success: false, error: "Не получилось получить новости" }
    }

}

export async function getAllNews() {
    try {
        return await prisma.news.findMany()
    } catch (error) {
        console.error("Не удалось получить новости", error)
    }
}

export async function deleteNews(id: string) {
    if (!id) return;

    try {
        const news = await prisma.news.findUnique({
            where: { id },
            select: { title: true }
        })

        if (!news) throw new Error("Новость не найдена");

        await prisma.news.delete({
            where: { id }
        })

        revalidatePath("/admin")
        return { success: true }

    } catch (error) {
        console.error("Не получилось удалить новость", error)
        return { success: false, error: "Не получилось удалить новость" }
    }
}