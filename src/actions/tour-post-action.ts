"use server"

import { revalidatePath } from "next/cache";
import { prisma } from "../../prisma/prisma"
import { getUserId } from "./user-actions";

export async function getFilterTourPost(id: string) {
    try {
        const tour = await prisma.tourPost.findMany({
            where: {
                id: id
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
        });

        return tour;
    } catch (error) {
        console.log(error);
        throw new Error("Не удалось загрузить отфильтрованные туры");
    }
};

export async function GetAllTourPosts() {
    try {
        const tour = await prisma.tourPost.findMany({
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
        });

        return tour;
    } catch (error) {
        console.log(error);
        throw new Error("Не удалось загрузить отфильтрованные тур-посты");
    }
}

export async function toggleLike(tourPostId: string) {
    try {
        const userId = await getUserId()
        if (!userId) return;

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_tourPostId: {
                    userId,
                    tourPostId
                }
            }
        })

        const tour = await prisma.tourPost.findUnique({
            where: { id: tourPostId },
            select: { tourFirmId: true }
        })

        if (!tour) throw new Error("Тур не найден");

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_tourPostId: {
                        userId,
                        tourPostId
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        userId,
                        tourPostId
                    }
                }),
            ])
        }

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Не получилось поставить лайк", error)
        return { success: false, error: "Не получилось поставить лайк" }
    }
}

export const addReview = async (content: string, tourPostId: string) => {

    try {
        const userId = await getUserId()
        if (!userId) return

        const tour = await prisma.tourPost.findUnique({
            where: { id: tourPostId },
            select: { tourFirmId: true }
        })

        if (!tour) throw new Error("Тур не найден")

        const [review] = await prisma.$transaction(async (tx) => {
            const newReview = await tx.review.create({
                data: {
                    content,
                    authorId: userId,
                    tourPostId
                }
            })
            return [newReview];
        })
        revalidatePath("/")
        return { success: true, review }

    } catch (error) {
        console.error("Не получилось создать отзыв", error);
        return { success: false, error: "Не получилось создать отзыв" };
    }
}

export async function toggleSave(tourPostId: string) {
    try {
        const userId = await getUserId()
        if (!userId) return

        const existingSave = await prisma.saved.findUnique({
            where: {
                userId_tourPostId: {
                    userId,
                    tourPostId
                }
            }
        })

        const tour = await prisma.tourPost.findUnique({
            where: { id: tourPostId },
            select: {
                tourFirmId: true,
                title: true,
                content: true,
                description: true,
                tourFirm: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if (!tour) throw new Error("Тур не найден")

        if (existingSave) {
            await prisma.saved.delete({
                where: {
                    userId_tourPostId: {
                        userId,
                        tourPostId
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.saved.create({
                    data: {
                        userId,
                        tourPostId
                    }
                })
            ])
        }

        revalidatePath("/")
        return { success: true }

    } catch (error) {
        console.error("Не получилось сохранить пост", error)
        return { success: false, error: "Не получилось сохранить пост" }
    }
}

export async function getAllSaved(userId: string | undefined) {
    try {
        const saved = await prisma.tourPost.findMany({
            where: {
                savedBy: {
                    some: {
                        userId
                    }
                }
            },
            select: {
                title: true,
                content: true,
                description: true,
                id: true,
                photo: true,
                createdAt: true,
                endDate: true,
                _count: {
                    select: {
                        likes: true,
                    }
                },
                tourFirm: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                savedBy: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return saved

    } catch (error) {
        console.log(error);
        throw new Error("Не удалось загрузить Сохранённые туры");
    }
}

export async function getAllLiked(userId: string | undefined) {
    try {
        const liked = await prisma.tourPost.findMany({
            where: {
                likes: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                tourFirm: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                likes: {
                    select: {
                        userId: true
                    }
                },
                _count: {
                    select: {
                        likes: true,
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return liked

    } catch (error) {
        console.error("Не удалось загрузить понравившиеся туры", error)
        throw new Error("Не удалось загрузить понравившиеся туры")
    }
}

export async function createTour(tourFirm: string, title: string, content: string, description: string, startDate: Date | undefined, endDate: Date | undefined, image?: string) {
    try {
        if (!image) return false;
        const tour = await prisma.tourPost.create({
            data: {
                title,
                description,
                content,
                photo: image,
                createdAt: startDate,
                endDate,
                tourFirmId: tourFirm

            }
        })

        revalidatePath("/admin")
        return { success: true, tour }
    } catch (error) {
        console.error("Не получилось создать тур", error)
        return { success: false, error: "Не получилось создать тур" }
    }
}

export async function deleteTour(tourId: string) {
    try {
        const tour = await prisma.tourPost.findUnique({
            where: { id: tourId },
            select: { tourFirmId: true }
        })

        if (!tour) throw new Error("Тур не найден")

        await prisma.tourPost.delete({
            where: { id: tourId }
        })

        revalidatePath("/admin")
        return { success: true }

    } catch (error) {
        console.error("Не удалось удалить тур", error)
        return { success: false, error: "Не удалось удалить тур" }
    }
}