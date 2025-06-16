import { getUser, getUserId, getUserPosts, isFollowing } from '@/actions/user-actions';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import React from 'react'
import { getAllLiked, getAllSaved } from '@/actions/tour-post-action';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth } from '../../../../../auth';
import { Button } from '@/components/ui/button';
import Post from '@/components/Post';
import SubscriptionButton from '@/components/SubscriptionButton';
import SignOutButton from '@/components/SignOutButton';
import ChangeAvatar from '@/components/ChangeAvatar';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '../../../../../prisma/prisma';

export async function generateStaticParams() {
    const userIds = await prisma.user.findMany({
        select: {
            id: true,
        }
    })

    return userIds.map((userId) => ({
        id: userId.id.toString()
    }))
}

const page = async ({ params }: { params: { id: string } }) => {

    const session = await auth()
    if (!session) redirect("/sign-in")
    const { id } = await params;
    const user = await getUser(id)
    const userId = getUserId()
    const savedTours = await getAllSaved(id)
    const likedTours = await getAllLiked(id)
    const posts = await getUserPosts(id)
    const isCurrentUserFollowing = await isFollowing(id)

    if (user?.id == session?.user?.id) {
        return (
            <div className='flex flex-col items-center min-h-screen h-full'>
                <div className='container-indent flex flex-col gap-4 border-b border-dashed'>
                    <div className='flex flex-col gap-2 items-center'>
                        <Avatar className='size-28'>
                            <AvatarImage loading='lazy' src={user?.image ?? "/user.png"} className='object-cover aspect-square size-full' />
                        </Avatar>
                        <p className='text-2xl'>{user?.name}</p>
                        <p className='text-sm text-foreground/50'>{user?.email}</p>
                    </div>
                    <div className='flex items-center mx-auto gap-16 border-t py-4'>
                        <div className='flex items-center text-sm gap-2'>
                            <Button variant={'link'} className='text-foreground'>
                                <a href="">{user?._count.followers} подписчиков</a>
                            </Button>
                        </div>
                        <div className='flex items-center text-sm gap-2'>
                            <Button variant={'link'} className='text-foreground'>
                                <a href="">{user?._count.following} подписок</a>
                            </Button>
                        </div>
                    </div>
                    <div className='flex flex-row items-center'>
                        <SignOutButton />
                        <p className='text-sm text-foreground/40'>Выйти</p>
                        <ChangeAvatar id={id} />
                        <p className='text-sm text-foreground/40'>Выбрать новое фото профиля</p>
                    </div>
                </div>
                <div className='container-indent'>
                    <Tabs defaultValue='saved' className='w-full'>
                        <TabsList >
                            <TabsTrigger value={'saved'} >Сохранённое</TabsTrigger>
                            <TabsTrigger value={'liked'}>Понравившиеся</TabsTrigger>
                            <TabsTrigger value={'posts'}>Посты</TabsTrigger>
                        </TabsList>
                        <TabsContent value={'saved'}>
                            <div className='grid grid-cols-3 gap-1 w-full max-lg:grid-cols-2 max-md:flex max-md:flex-col max-md:items-center'>
                                {
                                    savedTours.map((item, index) => (
                                        <div key={index} className='border flex flex-col rounded-2xl gap-4 bg-accent/50 overflow-hidden w-full py-4 px-4'>
                                            <div className='flex items-end justify-between gap-2'>
                                                <a href={`/tour/${item.id}`} className='text-2xl font-bold underline underline-offset-4'>{item.title}</a>
                                            </div>
                                            <a href={`/tour-firm/${item.tourFirm.id}`} className='text-sm underline underline-offset-2'>{item.tourFirm.name}</a>
                                        </div>
                                    ))
                                }
                            </div>
                        </TabsContent>
                        <TabsContent value={'liked'}>
                            <div className='grid grid-cols-3 gap-1 w-full max-lg:grid-cols-2 max-md:flex max-md:flex-col max-md:items-center'>
                                {
                                    likedTours.map((item, index) => (
                                        <div key={index} className='border flex flex-col rounded-2xl gap-4 bg-accent/50 overflow-hidden w-full py-4 px-4'>
                                            <div className='flex items-end justify-between gap-2'>
                                                <a href={`/tour/${item.id}`} className='text-2xl font-bold underline underline-offset-4'>{item.title}</a>
                                            </div>
                                            <a href='/' className='text-sm underline underline-offset-2'>{item.tourFirm.name}</a>
                                        </div>
                                    ))
                                }
                            </div>
                        </TabsContent>
                        <TabsContent value={'posts'}>
                            <div className='flex flex-col items-center w-full gap-4'>
                                {posts.length > 0 ? (
                                    posts.map(item => (
                                        <Post key={item.id} post={item} userId={id} image={item.author.image} id={id} name={item.author.name} />
                                    ))
                                ) : (
                                    <div>Пока постов нет</div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col items-center min-h-screen h-full'>
            <div className='container-indent flex flex-col gap-4 border-b border-dashed items-center'>
                <div className='flex flex-col gap-2 items-center'>
                    <Avatar className='size-28'>
                        <AvatarImage loading='lazy' src={user?.image ?? "/user.png"} className='object-cover aspect-square size-full' />
                    </Avatar>
                    <p className='text-2xl'>{user?.name}</p>
                    {isCurrentUserFollowing && (
                        <p className='text-sm text-foreground/50'>{user?.email}</p>
                    )}
                </div>
                <div className='flex items-center mx-auto gap-16 border-t py-4'>
                    <div className='flex items-center text-sm gap-2'>
                        <Button variant={'link'} className='text-foreground'>
                            <a href="">{user?._count.followers} подписчиков</a>
                        </Button>
                    </div>
                    <div className='flex items-center text-sm gap-2'>
                        <Button variant={'link'} className='text-foreground'>
                            <a href="">{user?._count.following} подписок</a>
                        </Button>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <SubscriptionButton userId={id} isFollowing={isCurrentUserFollowing} />
                    <Link href={`/chat/${id}`}>
                        <Button
                            variant={'outline'}
                        >Написать</Button>
                    </Link>
                </div>
            </div>
            <div className='container-indent'>
                {
                    isCurrentUserFollowing ? (
                        <Tabs defaultValue='saved' className='w-full'>
                            <TabsList >
                                <TabsTrigger value={'saved'} >Сохранённое</TabsTrigger>
                                <TabsTrigger value={'liked'}>Понравившиеся</TabsTrigger>
                                <TabsTrigger value={'posts'}>Посты</TabsTrigger>
                            </TabsList>
                            <TabsContent value={'saved'}>
                                <div className='grid grid-cols-3 gap-1 w-full max-lg:grid-cols-2 max-md:flex max-md:flex-col max-md:items-center'>
                                    {
                                        savedTours.map((item, index) => (
                                            <div key={index} className='border flex flex-col rounded-2xl gap-4 bg-accent/50 overflow-hidden w-full py-4 px-4'>
                                                <div className='flex items-end justify-between gap-2'>
                                                    <a href={`/tour/${item.id}`} className='text-2xl font-bold underline underline-offset-4'>{item.title}</a>
                                                </div>
                                                <a href={`/tour-firm/${item.tourFirm.id}`} className='text-sm underline underline-offset-2'>{item.tourFirm.name}</a>
                                            </div>
                                        ))
                                    }
                                </div>
                            </TabsContent>
                            <TabsContent value={'liked'}>
                                <div className='grid grid-cols-3 gap-1 w-full max-lg:grid-cols-2 max-md:flex max-md:flex-col max-md:items-center'>
                                    {
                                        likedTours.map((item, index) => (
                                            <div key={index} className='border flex flex-col rounded-2xl gap-4 bg-accent/50 overflow-hidden w-full py-4 px-4'>
                                                <div className='flex items-end justify-between gap-2'>
                                                    <a href={`/tour/${item.id}`} className='text-2xl font-bold underline underline-offset-4'>{item.title}</a>
                                                </div>
                                                <a href='/' className='text-sm underline underline-offset-2'>{item.tourFirm.name}</a>
                                            </div>
                                        ))
                                    }
                                </div>
                            </TabsContent>
                            <TabsContent value={'posts'}>
                                <div className='flex flex-col items-center w-full gap-4'>
                                    {posts.length > 0 ? (
                                        posts.map(item => (
                                            <Post key={item.id} post={item} userId={`${session.user.id}`} image={item.author.image} id={id} name={item.author.name} />
                                        ))
                                    ) : (
                                        <div>Пока постов нет</div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <div className='flex flex-col gap-4 pt-4 items-center'>
                            <h1 className='text-2xl font-bold'>Посты</h1>
                            <div className='flex flex-col gap-4'>
                                {posts.length > 0 ? (
                                    posts.map(item => (
                                        <Post key={item.id} post={item} userId={`${session.user.id}`} image={item.author.image} id={id} name={item.author.name} />
                                    ))
                                ) : (
                                    <div>Пока постов нет</div>
                                )}
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    )
}

export default page