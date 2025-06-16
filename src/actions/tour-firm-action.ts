"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../../prisma/prisma"

export async function getTourFirmByName(name: string) {
    return prisma.tourFirm.findMany({
        where: {
            name: {
                contains: name
            }
        },
        select: {
            name: true,
            id: true,
            description: true,
        }
    })
}

export async function getTourFirmById(id: string) {
    try {
        const tourFirm = await prisma.tourFirm.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                description: true,
                tourPosts: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        content: true,
                        title: true,
                        description: true,
                        photo: true,
                        createdAt: true,
                        endDate: true,
                        photoGallery: {
                            select: {
                                images: true
                            }
                        },
                        likes: {
                            select: {
                                userId: true,
                            }
                        },
                        tourFirm: {
                            select: {
                                name: true,
                                id: true,
                            }
                        },
                        _count: {
                            select: {
                                likes: true,
                            }
                        },
                        savedBy: {
                            select: {
                                id: true,
                                user: true,
                                tourPost: true,
                            }
                        },
                        reviews: {
                            orderBy: {
                                createdAt: "desc"
                            },
                            select: {
                                content: true,
                                id: true,
                                authorId: true,
                                author: {
                                    select: {
                                        name: true,
                                        image: true,
                                    }
                                }
                            }
                        },
                    }
                }
            }
        })

        return tourFirm
    } catch (error) {
        console.log(error)
        throw new Error("Не удалось загрузить турфирму")
    }
}

export async function getAllTourFirm() {
    try {
        return await prisma.tourFirm.findMany()


    } catch (error) {
        console.error("Не получилось получить турфирмы", error)
    }
}

export async function createTourFirm(name: string, description: string) {
    try {
        if (!name) return;

        const tourFirm = await prisma.tourFirm.create({
            data: {
                name,
                description
            }
        })

        revalidatePath("/admin")
        return { success: true, tourFirm }

    } catch (error) {
        console.error("Не получилось создать тур-фирму", error)
        return { success: false, error: "Не получилось создать турфирму" }
    }
}

export async function updateTourFirm(id: string, name?: string, description?: string) {
    try {
        const tourFirm = await prisma.tourFirm.update({
            where: { id: id },
            data: {
                name,
                description
            }
        })

        revalidatePath("/admin")
        return { success: true, tourFirm }

    } catch (error) {
        console.error("Не удалось обновить тур-фирму", error)
        return { success: false, error: "Не удалось обновить турфирму" }
    }
}

export async function deleteTourFirm(tourFirmId: string) {
    try {
        const tourFirm = await prisma.tourFirm.findUnique({
            where: { id: tourFirmId },
            select: { id: true }
        })

        if (!tourFirm) throw new Error("Турфирма не найдена");

        await prisma.tourFirm.delete({
            where: { id: tourFirmId }
        })

        revalidatePath("/admin")

        return { success: true }
    } catch (error) {
        console.error("Не удалось удалить тур-фирму", error)
        return { success: false, error: "Не удалось удалить турфирму" }
    }
}