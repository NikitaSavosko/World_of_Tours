"use client"
import { deletePost, getPosts } from '@/actions/post-action'
import { Image } from '@imagekit/next'
import React, { useState } from 'react'
import PostLike from './PostLike'
import CommentButton from './CommentButton'
import DeleteButton from './DeleteButton'
import toast from 'react-hot-toast'
import UserProfile from './UserProfile'

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number]



const Post = ({ post, userId, image, user, id, name }: { post: Post; userId: string | null; image: string | null; user?: boolean; id: string | undefined, name: string }) => {

    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeletePost = async () => {
        if (isDeleting) return;

        try {
            setIsDeleting(true)
            const result = await deletePost(post.id)
        } catch (error) {
            toast.error("Не получилось удалить пост")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className='flex flex-col gap-2 border-b border-dashed w-full max-w-xl rounded-md md:border md:border-solid dark:md:bg-accent/30'>
            {user && (
                <div className='flex flex-row items-center gap-2 px-4 pt-3'>
                    <UserProfile id={`${id}`} image={image} />
                    <p className='text-sm text-foreground/40'>{name}</p>
                </div>
            )}
            {post.image && (
                <div>
                    <Image alt={'image'} src={`${post.image}`} loading='lazy' width={500} height={500} className='object-cover aspect-square size-full' />
                </div>
            )}
            <div className='flex flex-col p-4 gap-2'>
                <p className='whitespace-pre-wrap'>{post.content}</p>
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row items-center gap-4'>
                        <PostLike userId={userId} post={post} />
                        <CommentButton id={post.id} count={post._count.comments} />
                    </div>
                    {userId === post.authorId && (
                        <DeleteButton isDeleting={isDeleting} onDelete={handleDeletePost} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Post