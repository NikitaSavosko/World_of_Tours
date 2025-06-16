'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '../../auth';
import { prisma } from '../../prisma/prisma';

export async function getUser(id: string | undefined) {

    return prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true,
                    saved: true,
                }
            }
        }
    })
}

export async function getUserByName(name: string) {
    return prisma.user.findMany({
        where: {
            name: {
                contains: name
            }
        },
        select: {
            name: true,
            id: true,
            email: true,
            password: true,
            image: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            role: true,
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 5
    })
}

export async function getUserId() {
    const session = await auth()
    if (!session) return null;

    const user = await getUser(session.user.id)

    if (!user) throw new Error("Пользователя нет")

    return user.id
}

export async function getAllUsers() {
    try {

        return await prisma.user.findMany()

    } catch (error) {
        console.error("Не удалось получить пользователей", error)
    }
}

export async function getAllUser() {

    const session = await auth()
    if (!session) return null

    const user = await getUser(session.user.id)

    if (!user) throw new Error("Пользователя нет")

    return prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            description: true,
            createdAt: true,
        }
    })
}

export async function getUserPosts(userId: string) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: userId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return posts;
    } catch (error) {
        console.error("Не удалось получить посты пользователя", error);
        throw new Error("Не удалось получить посты пользователя");
    }
}

export async function toggleFollow(targetUserId: string) {
    try {
        const userId = await getUserId()

        if (!userId) return;

        if (userId === targetUserId) throw new Error("Вы не можете подписаться на свой аккаунт");

        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetUserId
                }
            }
        })

        if (existingFollow) {
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: targetUserId
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.follows.create({
                    data: {
                        followerId: userId,
                        followingId: targetUserId
                    }
                })
            ])
        }

        revalidatePath("/")
        return { success: true }

    } catch (error) {
        console.log("Не возможно подписаться:", error)
        return { success: false, error: "Не возможно подписаться" }
    }
}

export async function isFollowing(userId: string) {
    try {
        const currentUserId = await getUserId()
        if (!currentUserId) return false;

        const follow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: userId
                }
            }
        })

        return !!follow

    } catch (error) {
        console.error("Не получилось узнать статус подписки:", error)
        return false;
    }
}

export async function getFollowed(id: string) {

    if (!id) return;

    try {

        return await prisma.user.findMany({
            where: {
                id
            },
            select: {
                following: {
                    select: {
                        following: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                posts: {
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
                                }
                            }
                        }
                    }
                }
            }
        })

    } catch (error) {
        console.error("Не получилось найти друзей", error)
    }
}

export async function updateProfile(image: string, userId: string) {
    try {
        if (!userId) throw new Error("Не авторизован");

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                image
            }
        })

        revalidatePath("/user")
        return { success: true, user }

    } catch (error) {
        console.error("Не получилось обновить профиль:", error)
        return { success: false, error: "Не получилось обновить профиль" }
    }
}

export async function deleteUser(id: string) {
    if (!id) return;

    try {

        const user = await prisma.user.findUnique({
            where: { id },
            select: { name: true }
        })

        if (!user) throw new Error("Пользователь не найден")

        await prisma.user.delete({
            where: { id }
        })

        revalidatePath("/admin")

        return { success: true }

    } catch (error) {
        console.error("Не получилось удалить пользователя", error)
        return { success: false, error: "Не получилось удалить пользователя" }
    }
}