"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../../prisma/prisma"
import { getUserId } from "./user-actions"

export async function createPost(content: string, image?: string) {
    try {
        const userId = await getUserId()

        if (!userId) return

        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: userId
            }
        })

        revalidatePath("/")
        return { success: true, post }
    } catch (error) {
        console.error("Не получилось создать пост:", error)
        return { success: false, error: "Не получилось создать пост" }
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                likes: {
                    select: {
                        userId: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            }
        })

        return posts

    } catch (error) {
        console.log("Ошибка в получении постов", error)
        throw new Error("Ошибка в получении постов")
    }
}

export async function getFilteredPosts(id: string | undefined) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                id: id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                likes: {
                    select: {
                        userId: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            }
        })

        return posts

    } catch (error) {
        console.log("Ошибка в получении постов", error)
        throw new Error("Ошибка в получении постов")
    }
}

export async function togglePostLike(postId: string) {
    try {
        const userId = await getUserId()
        if (!userId) return;

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        })

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true }
        })

        if (!post) throw new Error("Пост не найден");

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }
            })
        } else {
            await prisma.like.create({
                data: {
                    userId,
                    postId
                }
            })
        }

        revalidatePath("/")
        return { success: true }

    } catch (error) {
        console.error("Не получилось поставить лайк", error)
        return { success: false, error: "Не получилось поставить лайк" }
    }
}

export async function createComment(postId: string, content: string) {
    try {
        const userId = await getUserId()

        if (!userId) return;
        if (!content) throw new Error("Нужно что-то написать");

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true }
        })

        if (!post) throw new Error("Пост не найден");

        const [comment] = await prisma.$transaction(async (tx) => {
            const newComment = await tx.comment.create({
                data: {
                    content,
                    authorId: userId,
                    postId
                }
            })
            return [newComment]
        })

        revalidatePath("/")
        return { success: true, comment }

    } catch (error) {
        console.error("Не получилось создать комментарий:", error)
        return { success: false, error: "Не получилось создать комментарий" }
    }
}

export async function deletePost(postId: string) {
    try {
        const userId = await getUserId()

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true }
        })

        if (!post) throw new Error("Пост не найден");
        if (post.authorId !== userId) throw new Error("Не авторизован - нет возможности удалить");

        await prisma.post.delete({
            where: { id: postId }
        })

        revalidatePath("/")
        return { success: true }

    } catch (error) {
        console.error("Не удалось удалить пост:", error)
        return { success: false, error: "Не удалось удалить пост" }
    }
}